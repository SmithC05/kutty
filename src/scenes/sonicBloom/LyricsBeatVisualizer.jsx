import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * LyricsBeatVisualizer
 *
 * Dedicated audio-reactive beat visualizer for the lower area of the lyrics panel.
 * High-performance HTML5 Canvas implementation:
 * - 36 slim vertical bars responding continuously to audio frequency & amplitude data
 * - Varied heights across perceptual logarithmic frequency distribution
 * - Smooth fluid movement with subtle spring easing
 * - Settles into calm, low resting bars (~8%) when playback pauses and sleeps when motionless
 * - Resumes smoothly when playback starts or unpauses
 * - Inherits each song's individual theme colors (primary to accent gradient)
 * - Zero React DOM reconciliation overhead: renders in a single 2D hardware-accelerated surface
 * - Respects reduced-motion preferences
 */
function LyricsBeatVisualizerComponent({
  audioReactivity = null,
  audioEngine = null,
  isPlaying = false,
  primaryColor = '#f59e0b',
  accentColor = '#fde047',
  className = '',
}) {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const bandsRef = useRef(audioReactivity?.bands || null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const primaryRef = useRef(primaryColor);
  primaryRef.current = primaryColor;
  const accentRef = useRef(accentColor);
  accentRef.current = accentColor;

  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  // Direct subscription to audio engine for 60fps waveform updates with zero React re-renders
  useEffect(() => {
    if (audioEngine?.subscribeVisualizer) {
      const unsubscribe = audioEngine.subscribeVisualizer((state) => {
        bandsRef.current = state.bands;
      });
      return unsubscribe;
    }
  }, [audioEngine]);

  // Fallback to prop-driven audioReactivity
  useEffect(() => {
    if (audioReactivity?.bands) {
      bandsRef.current = audioReactivity.bands;
    }
  }, [audioReactivity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    const numBars = 36;
    const currentHeights = new Float32Array(numBars).fill(8);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let isSleeping = false;
    let sleepCounter = 0;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      if (w <= 0 || h <= 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const activePlaying = Boolean(isPlayingRef.current);
      const bands = bandsRef.current;
      const isReduced = reducedMotionRef.current;

      const totalGap = (numBars - 1) * 3;
      const barWidth = Math.max(2, Math.min(6, (w - totalGap) / numBars));
      const startX = Math.max(0, (w - (numBars * barWidth + (numBars - 1) * 3)) / 2);

      const primary = primaryRef.current;
      const accent = accentRef.current;

      // Linear gradient from bottom (primary) to top (accent)
      const grad = ctx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0, primary);
      grad.addColorStop(1, accent);
      ctx.fillStyle = grad;

      let maxDiff = 0;

      for (let i = 0; i < numBars; i++) {
        let targetH = 8;
        if (activePlaying && bands && i < bands.length) {
          const val = bands[i];
          const rawHeight = Math.max(12, Math.min(100, Math.round(val * 100)));
          targetH = isReduced ? Math.min(38, Math.round(rawHeight * 0.45)) : rawHeight;
        } else if (!activePlaying) {
          const curve = Math.sin((i / (numBars - 1)) * Math.PI);
          targetH = (0.06 + curve * 0.04) * 100;
        }

        const diff = Math.abs(targetH - currentHeights[i]);
        if (diff > maxDiff) maxDiff = diff;

        // Smooth spring toward target
        currentHeights[i] += (targetH - currentHeights[i]) * (activePlaying ? 0.35 : 0.12);

        const barH = Math.max(3, (currentHeights[i] / 100) * (h - 4));
        const x = startX + i * (barWidth + 3);
        const y = h - barH;

        const val = bands && i < bands.length ? bands[i] : 0.06;
        const opacity = activePlaying ? Math.min(1.0, 0.45 + val * 0.55) : 0.22;
        ctx.globalAlpha = opacity;

        const radius = barWidth / 2;
        if (typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barH, [radius, radius, 0, 0]);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(x, h);
          ctx.lineTo(x, y + radius);
          ctx.arcTo(x, y, x + radius, y, radius);
          ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
          ctx.lineTo(x + barWidth, h);
          ctx.closePath();
          ctx.fill();
        }
      }

      ctx.restore();

      // Power-saving sleep when paused and reached resting position
      if (!activePlaying && maxDiff < 0.2) {
        sleepCounter++;
        if (sleepCounter > 20) {
          isSleeping = true;
          animId = null;
          return;
        }
      } else {
        sleepCounter = 0;
        isSleeping = false;
      }

      animId = requestAnimationFrame(render);
    };

    const wakeUp = () => {
      if (isSleeping || !animId) {
        isSleeping = false;
        sleepCounter = 0;
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    // Watch for playback or band changes to wake up if sleeping
    const checkWake = setInterval(() => {
      if (isPlayingRef.current && isSleeping) {
        wakeUp();
      }
    }, 200);

    return () => {
      clearInterval(checkWake);
      ro.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`relative z-10 flex shrink-0 items-end justify-center px-4 sm:px-6 pb-2.5 pt-1 h-11 w-full max-w-lg mx-auto select-none overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}

export const LyricsBeatVisualizer = React.memo(LyricsBeatVisualizerComponent);
export default LyricsBeatVisualizer;

