import React, { useEffect, useRef } from 'react';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * SonicBloomFallback2D
 * High-performance, lightweight Canvas 2D generative chromatic fallback
 * for devices where WebGL is unavailable or disabled.
 */
export function SonicBloomFallback2D({
  activeTrackIndex = 0,
  reducedMotion = false,
  className = '',
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const activeTrack = sonicBloomSongs[activeTrackIndex] || sonicBloomSongs[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 360);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    let startTime = performance.now();

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.32;

      // Draw background ambient glow
      const radialGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.4);
      radialGrad.addColorStop(0, `${activeTrack.colors.primary}22`);
      radialGrad.addColorStop(0.6, `${activeTrack.colors.secondary}0d`);
      radialGrad.addColorStop(1, 'rgba(3, 5, 12, 0)');
      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Render 6 Petals
      for (let i = 0; i < 6; i++) {
        const song = sonicBloomSongs[i];
        const isActive = i === activeTrackIndex;
        const angle = (i * Math.PI * 2) / 6 - Math.PI / 2 + (reducedMotion ? 0 : elapsed * 0.05);
        const petalLen = baseRadius * (isActive ? 1.18 : 0.95);
        const pulse = reducedMotion ? 1 : 1 + Math.sin(elapsed * 2.5 + i) * 0.04;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Petal contour
        ctx.beginPath();
        ctx.moveTo(0, 0);

        const cp1x = petalLen * 0.45 * pulse;
        const cp1y = -petalLen * 0.32 * pulse;
        const cp2x = petalLen * 0.85 * pulse;
        const cp2y = -petalLen * 0.18 * pulse;
        const tipX = petalLen * pulse;
        const tipY = 0;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);

        const cp3x = petalLen * 0.85 * pulse;
        const cp3y = petalLen * 0.18 * pulse;
        const cp4x = petalLen * 0.45 * pulse;
        const cp4y = petalLen * 0.32 * pulse;

        ctx.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, 0, 0);

        // Fill translucent gradient
        const petalGrad = ctx.createLinearGradient(0, 0, tipX, tipY);
        petalGrad.addColorStop(0, `${song.colors.core || '#ffffff'}40`);
        petalGrad.addColorStop(0.5, `${song.colors.primary}${isActive ? 'aa' : '33'}`);
        petalGrad.addColorStop(1, `${song.colors.secondary}${isActive ? 'ee' : '44'}`);
        ctx.fillStyle = petalGrad;
        ctx.fill();

        // Stroke luminous edge
        ctx.lineWidth = isActive ? 2.5 : 1.2;
        ctx.strokeStyle = isActive ? song.colors.primary : `${song.colors.primary}66`;
        ctx.stroke();

        // Animated particles along spine
        if (!reducedMotion) {
          const pCount = isActive ? 5 : 2;
          for (let p = 0; p < pCount; p++) {
            const u = (elapsed * 0.4 + (p / pCount)) % 1;
            const px = u * petalLen;
            const py = Math.sin(u * Math.PI * 4 + elapsed * 3) * 6;
            ctx.beginPath();
            ctx.arc(px, py, isActive ? 2.5 : 1.5, 0, Math.PI * 2);
            ctx.fillStyle = song.colors.secondary;
            ctx.fill();
          }
        }

        ctx.restore();
      }

      // Central core
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = activeTrack.colors.core || '#ffffff';
      ctx.shadowColor = activeTrack.colors.primary;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (!reducedMotion) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    if (reducedMotion) {
      render(0);
    } else {
      animRef.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [activeTrackIndex, activeTrack, reducedMotion]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full max-w-[420px] max-h-[420px]" />
    </div>
  );
}
