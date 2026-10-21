import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

/**
 * FireworksCanvas — Lightweight, performant 2D Canvas Celebration Engine
 * 
 * Features two distinct celebration modes:
 *  - Mode A (Peak / Grand Entrance): A spectacular opening barrage of multi-colored,
 *    overlapping bursts celebrating Keerthana's arrival.
 *  - Mode B (Continuous Celebration): A sustainable, lively celebration loop that never dies down.
 *    Fires medium/large fireworks every 3–4.5s with smaller starlight sparkles every 1–2s
 *    and occasional dual bursts, keeping the screen alive and celebratory while she reads her letter.
 * 
 * Bounded particle count (max 250), high performance on mobile, full cleanup on unmount.
 * Keerthana's face and central portrait remain clear and unobstructed at all times.
 */

const PALETTES = {
  gold: ['#FDE047', '#F59E0B', '#D97706', '#FEF08A', '#FFFFFF'],
  rose: ['#FDA4AF', '#F43F5E', '#FB7185', '#F472B6', '#FFF1F2'],
  champagne: ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FFFFFF', '#E0E7FF'],
  coral: ['#FDBA74', '#FB923C', '#F97316', '#FDA4AF', '#FFFFFF'],
  willow: ['#FDE047', '#EAB308', '#CA8A04', '#FEF9C3', '#FAF5EA'],
};

const MAX_PARTICLES = 250;

export const FireworksCanvas = forwardRef(function FireworksCanvas(
  {
    mode = 'continuous', // 'peak' | 'continuous' | 'reduced'
    className = '',
    reducedMotion = false,
  },
  ref
) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    ambientDust: [],
    rockets: [],
    width: 0,
    height: 0,
    dpr: 1,
    mode: mode,
    nextMajorBurstTime: 0,
    nextMinorBurstTime: 0,
  });

  // Keep stateRef mode synced
  useEffect(() => {
    stateRef.current.mode = mode;
  }, [mode]);

  // Create single burst explosion
  const spawnBurst = useCallback((originX, originY, type = 'gold', intensity = 1.0, isMinor = false) => {
    const s = stateRef.current;
    if (!s.width || !s.height) return;

    const palette = PALETTES[type] || PALETTES.gold;
    const isWillow = type === 'willow';
    const count = isMinor
      ? Math.floor(16 * intensity)
      : Math.floor((isWillow ? 42 : 32) * intensity);

    // Enforce upper ceiling on total active particles
    if (s.particles.length + count > MAX_PARTICLES) {
      s.particles.splice(0, count);
    }

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const speed = isMinor
        ? Math.random() * 2.8 + 1.0
        : (isWillow ? Math.random() * 3.4 + 1.2 : Math.random() * 5.2 + 1.6) * intensity;
      const color = palette[Math.floor(Math.random() * palette.length)];

      s.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1.0,
        decay: isMinor
          ? Math.random() * 0.024 + 0.016
          : (isWillow ? Math.random() * 0.009 + 0.006 : Math.random() * 0.016 + 0.011),
        gravity: isWillow ? 0.052 : (isMinor ? 0.035 : 0.045),
        friction: isWillow ? 0.985 : 0.965,
        radius: isMinor ? Math.random() * 1.3 + 0.9 : Math.random() * 1.8 + 1.2,
        twinkle: Math.random() > 0.35,
        twinkleSpeed: Math.random() * 0.35 + 0.15,
        life: 0,
        trail: [],
        maxTrail: isWillow ? 4 : (isMinor ? 1 : 2),
      });
    }

    // Add bright central twinkle sparks for major bursts
    if (!isMinor) {
      for (let j = 0; j < 6; j++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 1.8 + 0.4;
        s.particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          color: '#FFFFFF',
          alpha: 1.0,
          decay: 0.032,
          gravity: 0.02,
          friction: 0.95,
          radius: Math.random() * 1.4 + 0.8,
          twinkle: true,
          twinkleSpeed: 0.45,
          life: 0,
          trail: [],
          maxTrail: 1,
        });
      }
    }
  }, []);

  // Launch rocket ascending from bottom
  const launchRocket = useCallback((targetX, targetY, type = 'gold') => {
    const s = stateRef.current;
    if (!s.width || !s.height) return;

    const startX = targetX + (Math.random() - 0.5) * 50;
    const startY = s.height + 20;
    const duration = 30 + Math.floor(Math.random() * 14);
    const vx = (targetX - startX) / duration;
    const vy = (targetY - startY) / duration;

    s.rockets.push({
      x: startX,
      y: startY,
      vx,
      vy,
      targetY,
      type,
      color: PALETTES[type][0],
      trail: [],
    });
  }, []);

  // Mode A: Trigger Grand Entrance Volley
  const triggerPeakVolley = useCallback(() => {
    const s = stateRef.current;
    if (!s.width || !s.height) return;

    const w = s.width;
    const h = s.height;

    // Choreographed barrage placed in outer and upper sectors
    const volleyPlan = [
      { delay: 0, x: w * 0.22, y: h * 0.20, type: 'gold', intensity: 1.2 },
      { delay: 180, x: w * 0.78, y: h * 0.22, type: 'rose', intensity: 1.1 },
      { delay: 420, x: w * 0.32, y: h * 0.15, type: 'champagne', intensity: 1.3 },
      { delay: 680, x: w * 0.70, y: h * 0.17, type: 'willow', intensity: 1.2 },
      { delay: 950, x: w * 0.18, y: h * 0.30, type: 'coral', intensity: 1.0 },
      { delay: 1200, x: w * 0.82, y: h * 0.28, type: 'gold', intensity: 1.2 },
      { delay: 1500, x: w * 0.50, y: h * 0.12, type: 'champagne', intensity: 1.3 },
      { delay: 1850, x: w * 0.26, y: h * 0.22, type: 'willow', intensity: 1.2 },
      { delay: 2200, x: w * 0.75, y: h * 0.18, type: 'rose', intensity: 1.1 },
      { delay: 2600, x: w * 0.35, y: h * 0.26, type: 'gold', intensity: 1.1 },
    ];

    volleyPlan.forEach(({ delay, x, y, type, intensity }) => {
      setTimeout(() => {
        if (Math.random() > 0.4) {
          launchRocket(x, y, type);
        } else {
          spawnBurst(x, y, type, intensity);
        }
      }, delay);
    });
  }, [launchRocket, spawnBurst]);

  // Imperative handle for parent component
  useImperativeHandle(ref, () => ({
    triggerPeakVolley,
    triggerSingleBurst: (x, y, type, isMinor = false) => spawnBurst(x, y, type, 1.0, isMinor),
    clear: () => {
      stateRef.current.particles = [];
      stateRef.current.rockets = [];
    },
  }));

  // Initial ambient floating dust motes
  useEffect(() => {
    const s = stateRef.current;
    s.ambientDust = Array.from({ length: 32 }, () => ({
      x: Math.random() * (window.innerWidth || 1000),
      y: Math.random() * (window.innerHeight || 800),
      radius: Math.random() * 1.5 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.3 + 0.12),
      alpha: Math.random() * 0.45 + 0.15,
      pulse: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? '#FDE047' : '#FDA4AF',
    }));
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      stateRef.current.width = rect.width;
      stateRef.current.height = rect.height;
      stateRef.current.dpr = dpr;

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // If reduced motion is requested: serene starry night backdrop
    if (reducedMotion) {
      ctx.clearRect(0, 0, stateRef.current.width, stateRef.current.height);
      const w = stateRef.current.width;
      const h = stateRef.current.height;
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 1.5 + 0.5;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(253, 224, 71, 0.4)' : 'rgba(253, 164, 175, 0.35)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    let lastTime = performance.now();

    const loop = (now) => {
      if (!isRunning) return;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const s = stateRef.current;
      const w = s.width;
      const h = s.height;

      // Soft clear with trail fade for cinematic motion blur
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';

      // ── Update & Render Rockets ─────────────────────────────
      for (let i = s.rockets.length - 1; i >= 0; i--) {
        const r = s.rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 5) r.trail.shift();

        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        r.trail.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        if (r.y <= r.targetY || r.vy >= 0) {
          spawnBurst(r.x, r.y, r.type, 1.2);
          s.rockets.splice(i, 1);
        }
      }

      // ── Update & Render Firework Particles ──────────────────
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];

        p.life += dt;
        p.vx *= p.friction;
        p.vy = p.vy * p.friction + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > h + 20) {
          s.particles.splice(i, 1);
          continue;
        }

        if (p.maxTrail > 0) {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > p.maxTrail) p.trail.shift();

          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = p.alpha * 0.6;
            ctx.lineWidth = p.radius * 0.8;
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let t = 1; t < p.trail.length; t++) {
              ctx.lineTo(p.trail[t].x, p.trail[t].y);
            }
            ctx.stroke();
          }
        }

        let currentAlpha = p.alpha;
        if (p.twinkle) {
          currentAlpha *= 0.7 + 0.3 * Math.sin(p.life * 25 * p.twinkleSpeed);
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Update & Render Ambient Floating Dust ────────────────
      for (let i = 0; i < s.ambientDust.length; i++) {
        const d = s.ambientDust[i];
        d.pulse += dt * 1.5;
        d.x += d.vx + Math.sin(d.pulse) * 0.15;
        d.y += d.vy;

        if (d.y < -10) d.y = h + 10;
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;

        const pulseAlpha = d.alpha * (0.65 + 0.35 * Math.sin(d.pulse));
        ctx.globalAlpha = Math.max(0, pulseAlpha);
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Mode B: Sustainable Continuous Celebration Loop ───────
      // Keeps fireworks lively and celebratory while Keerthana is on the scene
      if (s.mode === 'continuous') {
        // 1. Minor sparkle bursts between major explosions (every 1.2–2.2s)
        if (now > s.nextMinorBurstTime) {
          const minorX = Math.random() > 0.5
            ? w * (0.16 + Math.random() * 0.22)
            : w * (0.62 + Math.random() * 0.22);
          const minorY = h * (0.12 + Math.random() * 0.24);
          const types = ['gold', 'rose', 'champagne', 'coral'];
          const chosenType = types[Math.floor(Math.random() * types.length)];
          spawnBurst(minorX, minorY, chosenType, 0.85, true);
          s.nextMinorBurstTime = now + 1200 + Math.random() * 1000;
        }

        // 2. Medium or Large firework bursts (every 3.0–4.5s)
        if (now > s.nextMajorBurstTime) {
          const isDual = Math.random() < 0.35; // 35% chance for simultaneous left/right burst
          const types = ['gold', 'willow', 'rose', 'champagne', 'coral'];

          if (isDual) {
            // Simultaneous dual burst
            const leftX = w * (0.18 + Math.random() * 0.16);
            const leftY = h * (0.15 + Math.random() * 0.18);
            const rightX = w * (0.66 + Math.random() * 0.16);
            const rightY = h * (0.15 + Math.random() * 0.18);

            const t1 = types[Math.floor(Math.random() * types.length)];
            const t2 = types[Math.floor(Math.random() * types.length)];

            if (Math.random() > 0.5) launchRocket(leftX, leftY, t1);
            else spawnBurst(leftX, leftY, t1, 1.0);

            if (Math.random() > 0.5) launchRocket(rightX, rightY, t2);
            else spawnBurst(rightX, rightY, t2, 1.0);
          } else {
            // Single prominent burst
            const burstX = Math.random() > 0.5
              ? w * (0.18 + Math.random() * 0.22)
              : w * (0.60 + Math.random() * 0.22);
            const burstY = h * (0.14 + Math.random() * 0.20);
            const chosenType = types[Math.floor(Math.random() * types.length)];

            if (Math.random() > 0.45) {
              launchRocket(burstX, burstY, chosenType);
            } else {
              spawnBurst(burstX, burstY, chosenType, 1.15);
            }
          }

          s.nextMajorBurstTime = now + 3000 + Math.random() * 1500;
        }
      }

      ctx.globalAlpha = 1.0;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, [spawnBurst, launchRocket, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 12 }}
    />
  );
});
