import React, { useEffect, useRef } from 'react';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * SonicBloomFallback2D — 2D Canvas Six Distinct Song Visualizers
 *
 * Renders 6 genuinely distinct visual compositions matching the 3D visualizer:
 *   0. Unnale: Warm romantic cinema with golden bokeh discs and champagne sparkles.
 *   1. Chella Magale: Soft luminous horizon gradient and upward-floating memory pearls.
 *   2. Magale: Intimate harmonic sound-art resonance sine waves and fine glowing contours.
 *   3. Alakolava: Stylish dramatic helical spiral ribbons in deep violet and warm coral.
 *   4. Engey Andha Vennila: Serene night-sky star field and glowing moonlit corona.
 *   5. Life of Pazham: Joyful energetic radial spectrum equalizer and celebratory particles.
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

    // ── Pre-generated static items for stable rendering ──
    const bokehItems = Array.from({ length: 16 }).map((_, i) => ({
      xRatio: 0.2 + (i * 0.17) % 0.65,
      yRatio: 0.25 + ((i * 0.23) % 0.55),
      rRatio: 0.08 + (i % 4) * 0.035,
      speed: 0.3 + (i % 3) * 0.2,
      phase: i * 0.7,
      color: i % 2 === 0 ? '#fde047' : '#fb923c',
    }));

    const pearlItems = Array.from({ length: 28 }).map((_, i) => ({
      xRatio: 0.15 + (i * 0.13) % 0.7,
      baseY: Math.random(),
      speed: 0.15 + (i % 4) * 0.08,
      size: 2.2 + (i % 3) * 1.5,
      color: i % 2 === 0 ? '#c084fc' : '#2dd4bf',
    }));

    const starItems = Array.from({ length: 50 }).map((_, i) => ({
      xRatio: (i * 37) % 100 / 100,
      yRatio: (i * 59) % 100 / 100,
      size: 1 + (i % 3) * 0.8,
      alpha: 0.3 + (i % 5) * 0.15,
    }));

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseR = Math.min(width, height) * 0.36;

      // ─── 0. UNNALE: Warm Romantic Cinema ─────────────────────────────────
      if (activeTrackIndex === 0) {
        // Warm ambient background
        const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.6);
        bgGrad.addColorStop(0, 'rgba(217, 119, 6, 0.22)');
        bgGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.06)');
        bgGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Floating warm bokeh orbs
        bokehItems.forEach((b) => {
          const dy = reducedMotion ? 0 : Math.sin(elapsed * b.speed + b.phase) * 16;
          const dx = reducedMotion ? 0 : Math.cos(elapsed * b.speed * 0.8 + b.phase) * 12;
          const bx = b.xRatio * width + dx;
          const by = b.yRatio * height + dy;
          const br = b.rRatio * width;

          const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
          grad.addColorStop(0, `${b.color}40`);
          grad.addColorStop(0.7, `${b.color}15`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(bx, by, br, 0, Math.PI * 2);
          ctx.fill();
        });

        // Golden amber record disc in center
        ctx.save();
        ctx.translate(cx, cy);
        if (!reducedMotion) ctx.rotate(elapsed * 0.25);
        ctx.beginPath();
        ctx.arc(0, 0, baseR * 0.82, 0, Math.PI * 2);
        ctx.fillStyle = '#140f09';
        ctx.fill();
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.18)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Center golden label
        ctx.beginPath();
        ctx.arc(0, 0, baseR * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = '#d97706';
        ctx.fill();
        ctx.restore();
      }

      // ─── 1. CHELLA MAGALE: Soft Horizon & Floating Pearls ────────────────
      else if (activeTrackIndex === 1) {
        // Horizon gradient in lower half
        const horizonGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
        horizonGrad.addColorStop(0, 'transparent');
        horizonGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.18)');
        horizonGrad.addColorStop(1, 'rgba(45, 212, 191, 0.12)');
        ctx.fillStyle = horizonGrad;
        ctx.fillRect(0, height * 0.45, width, height * 0.55);

        // Undulating horizon wave ribbon
        ctx.beginPath();
        ctx.moveTo(0, height * 0.65);
        for (let x = 0; x <= width; x += 10) {
          const wave = Math.sin(x * 0.02 + elapsed * 1.5) * 12;
          ctx.lineTo(x, height * 0.65 + wave);
        }
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Upward floating pearls
        pearlItems.forEach((p) => {
          const yProgress = (p.baseY + elapsed * p.speed) % 1;
          const px = p.xRatio * width + Math.sin(yProgress * Math.PI * 4) * 8;
          const py = height * (1 - yProgress * 0.85);

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.sin(yProgress * Math.PI) * 0.75;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      // ─── 2. MAGALE: Intimate Layered Acoustic Sound Art ──────────────────
      else if (activeTrackIndex === 2) {
        const layers = 4;
        for (let l = 0; l < layers; l++) {
          const lr = baseR * (0.4 + l * 0.22);
          const segs = 60;
          ctx.beginPath();
          for (let s = 0; s <= segs; s++) {
            const theta = (s / segs) * Math.PI * 2;
            const harmonic = Math.sin(theta * (4 + l * 2) + elapsed * (1.8 + l * 0.5)) * 0.06;
            const r = lr * (1 + harmonic);
            const x = cx + Math.cos(theta) * r;
            const y = cy + Math.sin(theta) * r;
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = l % 2 === 0 ? '#818cf8' : '#c7d2fe';
          ctx.globalAlpha = 0.55 - l * 0.1;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Concentric acoustic core
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#818cf8';
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ─── 3. ALAKOLAVA: Stylish Dramatic Helical Spiral ───────────────────
      else if (activeTrackIndex === 3) {
        ctx.save();
        ctx.translate(cx, cy);
        const coils = 3;
        const totalPts = 120;

        // Helix 1: Violet
        ctx.beginPath();
        for (let i = 0; i <= totalPts; i++) {
          const t = i / totalPts;
          const angle = t * Math.PI * 2 * coils + elapsed * 0.8;
          const r = baseR * (0.3 + t * 0.65);
          const x = Math.cos(angle) * r;
          const y = (t - 0.5) * height * 0.55;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Helix 2: Warm coral
        ctx.beginPath();
        for (let i = 0; i <= totalPts; i++) {
          const t = i / totalPts;
          const angle = t * Math.PI * 2 * coils + Math.PI + elapsed * 0.8;
          const r = baseR * (0.3 + t * 0.65);
          const x = Math.cos(angle) * r;
          const y = (t - 0.5) * height * 0.55;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();
      }

      // ─── 4. ENGEY ANDHA VENNILA: Moonlit Calm & Starry Night ─────────────
      else if (activeTrackIndex === 4) {
        // Deep midnight sky background
        const nightGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.6);
        nightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
        nightGrad.addColorStop(0.6, 'rgba(129, 140, 248, 0.05)');
        nightGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nightGrad;
        ctx.fillRect(0, 0, width, height);

        // Twinkling stars
        starItems.forEach((st) => {
          const twinkle = Math.sin(elapsed * 2 + st.xRatio * 10) * 0.2;
          ctx.beginPath();
          ctx.arc(st.xRatio * width, st.yRatio * height, st.size, 0, Math.PI * 2);
          ctx.fillStyle = '#bae6fd';
          ctx.globalAlpha = Math.max(0.15, st.alpha + twinkle);
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        // Glowing moon disc with corona
        const moonR = baseR * 0.42;
        // Outer corona
        const coronaGrad = ctx.createRadialGradient(cx, cy, moonR * 0.8, cx, cy, moonR * 1.5);
        coronaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        coronaGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, moonR * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Moon disc
        ctx.beginPath();
        ctx.arc(cx, cy, moonR, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f9ff';
        ctx.fill();
      }

      // ─── 5. LIFE OF PAZHAM: Joyful Celebratory Spectrum Equalizer ─────────
      else if (activeTrackIndex === 5) {
        const barCount = 36;
        ctx.save();
        ctx.translate(cx, cy);
        if (!reducedMotion) ctx.rotate(elapsed * 0.4);

        for (let i = 0; i < barCount; i++) {
          const angle = (i / barCount) * Math.PI * 2;
          const barHeight = 12 + Math.sin(i * 0.6 + elapsed * 4) * 16 + (i % 2 === 0 ? 8 : 0);
          const col = i % 3 === 0 ? '#2dd4bf' : i % 3 === 1 ? '#fb7185' : '#fde047';

          ctx.save();
          ctx.rotate(angle);
          ctx.fillStyle = col;
          ctx.fillRect(-2, baseR * 0.55, 4, barHeight);
          ctx.restore();
        }

        // Central energetic core
        ctx.beginPath();
        ctx.arc(0, 0, baseR * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#2dd4bf';
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
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
      aria-label={`Visualizer for ${activeTrack.title}`}
    />
  );
}
