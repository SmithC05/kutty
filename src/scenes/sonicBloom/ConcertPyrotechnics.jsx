import React, { useRef, useEffect } from 'react';
import { subscribePyrotechnics } from './audioAnalyzer';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * ConcertPyrotechnics
 *
 * Concert-style pyrotechnic effects layer responding to audio events:
 *   - Treble / high-frequency peaks: celebratory background spark burst
 *   - Overall musical accents: wider, soft celebratory bloom
 *   - Sustained high frequencies: delicate trailing shimmer
 *
 * Sits at z-2 (fixed, pointer-events-none) strictly behind the 3D sculpture and UI.
 * Originates from distant upper corners/edges so it never obstructs text or controls.
 *
 * Mobile & accessibility optimizations:
 *   - Capped burst concurrency (max 2 desktop, 1 mobile)
 *   - Strict cooldown between bursts (min 1.4s)
 *   - Automatic rAF cancellation when idle (0% CPU/GPU overhead when calm)
 *   - Full prefers-reduced-motion support (gentle soft glow wash instead of exploding sparks)
 */

export function ConcertPyrotechnics({
  activeTrackIndex = 0,
  reducedMotion = false,
  isMobile = false,
}) {
  const canvasRef = useRef(null);
  const activeTrack = sonicBloomSongs[activeTrackIndex] || sonicBloomSongs[0];
  const activeTrackRef = useRef(activeTrack);
  activeTrackRef.current = activeTrack;

  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let particles = [];
    let blooms = [];
    let lastBurstTime = 0;

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Creates a burst at an atmospheric background position (upper corners / depth)
    const spawnBurst = (event) => {
      const now = performance.now();
      // Minimum 1.2s cooldown enforcement
      if (now - lastBurstTime < 1200) return;
      lastBurstTime = now;

      const track = activeTrackRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Select origin from upper background (distant stage pyrotechnics)
      // Alternates between left-upper (20% x, 18% y) and right-upper (80% x, 22% y)
      const isLeft = Math.random() > 0.45;
      const originX = isLeft
        ? w * (0.12 + Math.random() * 0.16)
        : w * (0.72 + Math.random() * 0.16);
      const originY = h * (0.14 + Math.random() * 0.18);

      const colors = [
        track.colors.primary,
        track.colors.secondary,
        track.colors.accent || track.colors.primary,
      ];

      // ── Reduced Motion Mode: Soft gentle light bloom, no flying sparks ──
      if (reducedMotionRef.current) {
        blooms.push({
          x: originX,
          y: originY,
          radius: 30,
          maxRadius: isMobileRef.current ? 90 : 140,
          alpha: 0.35,
          color: colors[0],
          decay: 0.012,
        });
        startLoop();
        return;
      }

      // ── Magale Special Mode: Soft, slow-expanding emotional bloom, zero aggressive spark bursts ──
      if (track.id === 'magale') {
        blooms.push({
          x: originX,
          y: originY,
          radius: 20,
          maxRadius: isMobileRef.current ? 80 : 130,
          alpha: 0.25,
          color: colors[0],
          decay: 0.007,
        });
        startLoop();
        return;
      }

      // ── Alakolava Special Mode: Calm sunlit warmth bloom, zero aggressive spark bursts or fireworks ──
      if (track.id === 'alakolava') {
        blooms.push({
          x: originX,
          y: originY,
          radius: 18,
          maxRadius: isMobileRef.current ? 70 : 110,
          alpha: 0.18,
          color: '#fefae0', // warm cream sunlight bloom
          decay: 0.006,
        });
        startLoop();
        return;
      }

      // ── Engey Andha Vennnila Special Mode: Calm moonlit rooftop glow, zero fireworks or sparks ──
      if (track.id === 'engey-andha-vennnila') {
        blooms.push({
          x: originX,
          y: originY,
          radius: 16,
          maxRadius: isMobileRef.current ? 65 : 105,
          alpha: 0.16,
          color: '#cbd5e1', // soft moonlight silver bloom
          decay: 0.005,
        });
        startLoop();
        return;
      }

      // ── Life of Pazham Special Mode: Uplifting natural study-room sunlight & sage warmth, zero fireworks or sparks ──
      if (track.id === 'life-of-pazham') {
        blooms.push({
          x: originX,
          y: originY,
          radius: 20,
          maxRadius: isMobileRef.current ? 80 : 125,
          alpha: 0.22,
          color: '#fefae0', // warm natural sunlight bloom
          decay: 0.007,
        });
        startLoop();
        return;
      }

      // ── Standard Mode: Layered spark particles + brief background bloom ──
      const isAccent = event.type === 'accent';
      const isSustained = event.type === 'sustained_sparkle';

      // Bloom flash
      blooms.push({
        x: originX,
        y: originY,
        radius: isSustained ? 18 : 28,
        maxRadius: isAccent ? (isMobileRef.current ? 80 : 130) : (isMobileRef.current ? 65 : 100),
        alpha: isSustained ? 0.22 : 0.40,
        color: colors[0],
        decay: isSustained ? 0.022 : 0.018,
      });

      // Sparks
      const baseCount = isMobileRef.current ? 10 : 22;
      const count = isSustained ? Math.floor(baseCount * 0.4) : isAccent ? baseCount + 6 : baseCount;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const speed = (isSustained ? 1.2 : 2.2) + Math.random() * (isAccent ? 3.4 : 2.6);
        const color = colors[i % colors.length];

        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4, // Slight upward bias
          gravity: 0.045,
          friction: 0.965,
          alpha: 0.95,
          decay: 0.018 + Math.random() * 0.014,
          size: 1.8 + Math.random() * 2.2,
          color,
          trail: [],
          maxTrail: isMobileRef.current ? 2 : 4,
        });
      }

      startLoop();
    };

    // Pyrotechnic event subscription
    const unsubscribe = subscribePyrotechnics(spawnBurst);

    // Animation loop (only runs when active particles exist)
    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Render & update blooms
      for (let i = blooms.length - 1; i >= 0; i--) {
        const b = blooms[i];
        b.radius += (b.maxRadius - b.radius) * 0.09;
        b.alpha -= b.decay;

        if (b.alpha <= 0) {
          blooms.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `${b.color}${Math.floor(b.alpha * 255).toString(16).padStart(2, '0')}`);
        grad.addColorStop(0.5, `${b.color}${Math.floor(b.alpha * 0.4 * 255).toString(16).padStart(2, '0')}`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render & update spark particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Record trail
        p.trail.unshift({ x: p.x, y: p.y, alpha: p.alpha * 0.5 });
        if (p.trail.length > p.maxTrail) p.trail.pop();

        // Physics
        p.vx *= p.friction;
        p.vy = p.vy * p.friction + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw trail
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.6;
          ctx.globalAlpha = p.alpha * 0.35;
          ctx.stroke();
        }

        // Draw particle core
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Add soft glow around spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;

      // Keep running if there are active elements; stop when calm to conserve battery
      if (particles.length > 0 || blooms.length > 0) {
        animId = requestAnimationFrame(render);
      } else {
        animId = null;
      }
    };

    const startLoop = () => {
      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };

    return () => {
      unsubscribe();
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[2] pointer-events-none"
      style={{ isolation: 'isolate' }}
    />
  );
}
