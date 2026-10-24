import React, { useEffect, useRef } from 'react';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * SonicBloomFallback2D — 2D Canvas Vinyl & Sound Wave Visualizer
 *
 * High-performance 2D canvas fallback matching the After-Hours Listening Room concept:
 *   - Dark spinning vinyl record with concentric grooves, reflective sheen, and center label
 *   - Outer concentric sound wave rings with wave ripples
 *   - Orbiting sparkles and dust
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

    const startTime = performance.now();

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.36;
      const primary = activeTrack.colors.primary || '#a3e635';
      const secondary = activeTrack.colors.secondary || '#a78bfa';

      // 1. Ambient Background Glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.5);
      bgGrad.addColorStop(0, `${primary}18`);
      bgGrad.addColorStop(0.55, `${secondary}08`);
      bgGrad.addColorStop(1, 'rgba(10, 12, 16, 0)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Concentric Sound Wave Rings
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        const ringRadius = baseRadius * (1.08 + w * 0.12);
        const waveColor = w === 0 ? primary : secondary;
        ctx.save();
        ctx.beginPath();
        const segments = 72;
        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          const ripple = reducedMotion ? 1 : 1 + Math.sin(theta * 6 + elapsed * 2.5 + w) * 0.025;
          const x = cx + Math.cos(theta) * ringRadius * ripple;
          const y = cy + Math.sin(theta) * ringRadius * ripple;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = waveColor;
        ctx.globalAlpha = 0.35 - w * 0.08;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Spinning Vinyl Record Disc
      const spinAngle = reducedMotion ? 0 : elapsed * 0.5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(spinAngle);

      // Record body
      const recordGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius);
      recordGrad.addColorStop(0, '#101319');
      recordGrad.addColorStop(0.4, '#0a0c10');
      recordGrad.addColorStop(0.85, '#121620');
      recordGrad.addColorStop(1, '#080a0e');
      ctx.fillStyle = recordGrad;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Record outer border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Concentric Vinyl Micro-Grooves
      const grooveCount = 10;
      for (let g = 0; g < grooveCount; g++) {
        const gr = baseRadius * (0.42 + (g / grooveCount) * 0.52);
        ctx.beginPath();
        ctx.arc(0, 0, gr, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Subtle Anisotropic Specular Light Sheen (Vinyl reflection)
      const sheenGrad = ctx.createLinearGradient(-baseRadius, -baseRadius, baseRadius, baseRadius);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.07)');
      sheenGrad.addColorStop(0.45, 'transparent');
      sheenGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.05)');
      sheenGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sheenGrad;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius - 2, 0, Math.PI * 2);
      ctx.fill();

      // Center Label
      const labelRadius = baseRadius * 0.36;
      ctx.beginPath();
      ctx.arc(0, 0, labelRadius, 0, Math.PI * 2);
      ctx.fillStyle = primary;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Center Label border ring
      ctx.beginPath();
      ctx.arc(0, 0, labelRadius - 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Spindle Center Hole
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#06070a';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // 4. Orbital Particles around the record
      if (!reducedMotion) {
        const pCount = 16;
        for (let p = 0; p < pCount; p++) {
          const pAngle = elapsed * (0.3 + (p % 3) * 0.1) + (p / pCount) * Math.PI * 2;
          const pRadius = baseRadius * (1.02 + Math.sin(p * 2 + elapsed) * 0.15);
          const px = cx + Math.cos(pAngle) * pRadius;
          const py = cy + Math.sin(pAngle) * pRadius;
          ctx.beginPath();
          ctx.arc(px, py, p % 2 === 0 ? 2 : 1.4, 0, Math.PI * 2);
          ctx.fillStyle = p % 2 === 0 ? primary : secondary;
          ctx.globalAlpha = 0.5 + Math.sin(elapsed * 2 + p) * 0.3;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

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
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      aria-label={`Vinyl record visualizer for ${activeTrack.title}`}
    />
  );
}
