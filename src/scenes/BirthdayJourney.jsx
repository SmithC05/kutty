import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useAudio, useScene } from '../context';
import { useReducedMotion } from '../hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════════════════════════════
   BIRTHDAY JOURNEY — Bold Editorial Spotlight
   Keerthana's Birthday Reveal  (Final User-Controlled Interaction)

   Palette: Berry #45152D · Coral #E94B70 · Blush #F5B8A8
            Ivory #FFF0D8 · Champagne #F3D9A2 · Gold #D4A843 · Rose #FF8FA3

   Typography:
     "Happy Birthday," → Dancing Script 700 / 600
     "Keerthana"       → Alex Brush (signature)
     Label / message   → Manrope

   Interaction:
     • Celebratory reveal & rich particle shower play once, then settle
     • Scene remains visible indefinitely in resting state with gentle ambient glow
     • Keerthana clicks "ENTER THE SURPRISE →" when she is ready to continue
     • Graceful 1.0s fade-out into the Secret Vault

   vivo Y28s 5G target: 360×800 CSS viewport, 90 Hz, Android Chrome.
   Safe areas respected via env(safe-area-inset-*).
════════════════════════════════════════════════════════════════════════════ */

const PORTRAIT_SRC = '/images/solo-photos/kutty1.jpeg';

const C = {
  berry:     '#45152D',
  coral:     '#E94B70',
  blush:     '#F5B8A8',
  ivory:     '#FFF0D8',
  gold:      '#D4A843',
  champagne: '#F3D9A2',
  rose:      '#FF8FA3',
  softPink:  '#FFD6E0',
  berryDk:   '#2A0B1A',
  coralDk:   '#C53358',
};

const PALETTE = [
  C.coral,
  C.blush,
  C.ivory,
  C.champagne,
  C.rose,
  C.softPink,
  C.gold,
  '#FFF8EE',
];

/* ─── Stable seeded pseudo-random ─────────────────────────────────────── */
function seededRNG(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/* ─── Particle Drawing Helpers ─────────────────────────────────────────── */

/* 1. Soft glowing circular sparkle with delicate halo */
function drawGlowDot(ctx, x, y, radius, colorHex, alpha, glowMult = 1.9) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colorHex;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  if (radius > 1.6) {
    ctx.globalAlpha = alpha * 0.32;
    ctx.beginPath();
    ctx.arc(x, y, radius * glowMult, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* 2. Elegant 4-point luxury star glint */
function drawStarGlint(ctx, x, y, size, colorHex, alpha, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colorHex;

  const outer = size;
  const inner = size * 0.22;

  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / 4;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  /* Brilliant center highlight */
  ctx.globalAlpha = Math.min(1, alpha * 1.3);
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(0.6, inner * 0.75), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* 3. Defocused soft foreground bokeh */
function drawDefocusedBokeh(ctx, x, y, radius, colorHex, alpha) {
  ctx.save();
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, colorHex);
  grad.addColorStop(0.45, colorHex);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* 4. Tasteful delicate heart light accent */
function drawHeartAccent(ctx, x, y, size, colorHex, alpha, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colorHex;

  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s * 0.05, s * 0.20, -s * 0.5,  -s * 0.1,  -s * 0.5, -s * 0.25);
  ctx.bezierCurveTo(-s * 0.5, -s * 0.55,  0,        -s * 0.5,   0,        -s * 0.2);
  ctx.bezierCurveTo( 0,       -s * 0.5,   s * 0.5,  -s * 0.55,  s * 0.5,  -s * 0.25);
  ctx.bezierCurveTo( s * 0.5, -s * 0.1,   s * 0.05,  s * 0.20,  0,         s * 0.35);
  ctx.closePath();
  ctx.fill();

  /* Soft rim shimmer */
  ctx.globalAlpha = alpha * 0.35;
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = '#FFF8EE';
  ctx.stroke();

  ctx.restore();
}

/* ─── Canvas Engine: Spotlights · Dust · Burst · Glints · Bokeh · Hearts ── */
function useCelebrationCanvas(canvasRef, reducedMotion) {
  const rafRef   = useRef(null);
  const stateRef = useRef({
    triggered: false,
    exiting: false,
    exitStartTime: 0,
    exitDuration: 1.0,
    stopped: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = 0, h = 0;
    let spots = [];
    let ambientDust = [];
    let showerParticles = [];
    let starGlints = [];
    let foregroundBokeh = [];
    let heartAccents = [];

    const rng = seededRNG(42);
    function sr(min, max) { return rng() * (max - min) + min; }
    function pick(arr)    { return arr[Math.floor(rng() * arr.length)]; }

    function isMobile() { return w < 768; }

    /* Face-safe zone: suppress high-opacity particles directly over her face */
    function inFaceZone(x, y) {
      if (isMobile()) {
        return x >= w * 0.18 && x <= w * 0.82 && y >= h * 0.05 && y <= h * 0.40;
      } else {
        return x >= w * 0.10 && x <= w * 0.48 && y >= h * 0.08 && y <= h * 0.54;
      }
    }

    /* Headline letterform protection zone: keeps cursive text crisp & readable */
    function inHeadlineCore(x, y) {
      if (isMobile()) {
        return x >= w * 0.15 && x <= w * 0.85 && y >= h * 0.52 && y <= h * 0.70;
      } else {
        return x >= w * 0.58 && x <= w * 0.90 && y >= h * 0.28 && y <= h * 0.52;
      }
    }

    function resize() {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      initBackground();
      initAmbientDust();
      initForegroundBokeh();
    }

    function initBackground() {
      if (reducedMotion) { spots = []; return; }
      if (isMobile()) {
        spots = [
          { x: w * 0.25, y: h * 0.65, r: 180, a: 0.07, spd: 0.0004, ph: 0,           col: C.coral },
          { x: w * 0.75, y: h * 0.72, r: 150, a: 0.05, spd: 0.0006, ph: Math.PI / 2, col: C.blush },
        ];
      } else {
        spots = [
          { x: 0.15 * w, y: h * 0.30, r: 260, a: 0.06, spd: 0.0004, ph: 0,           col: C.coral },
          { x: 0.52 * w, y: h * 0.20, r: 220, a: 0.04, spd: 0.0006, ph: Math.PI / 2, col: C.blush },
          { x: 0.82 * w, y: h * 0.35, r: 200, a: 0.07, spd: 0.0005, ph: Math.PI,     col: C.ivory },
        ];
      }
    }

    function initAmbientDust() {
      if (reducedMotion) { ambientDust = []; return; }
      const count = isMobile() ? 65 : 120;
      ambientDust = Array.from({ length: count }, () => ({
        x: sr(0, w),
        y: sr(-20, h),
        vy: sr(0.35, 0.95),
        vx: sr(-0.15, 0.35),
        radius: sr(0.8, 1.8),
        baseAlpha: sr(0.25, 0.65),
        twinkleSpeed: sr(1.0, 2.5),
        twinklePhase: sr(0, Math.PI * 2),
        swaySpeed: sr(0.6, 1.4),
        swayPhase: sr(0, Math.PI * 2),
        color: pick([C.ivory, C.champagne, C.blush, C.softPink, '#FFF8EE']),
      }));
    }

    function initForegroundBokeh() {
      if (reducedMotion) { foregroundBokeh = []; return; }
      const count = isMobile() ? 5 : 10;
      foregroundBokeh = Array.from({ length: count }, (_, i) => {
        const leftSide = i % 2 === 0;
        const x = leftSide ? sr(10, w * 0.16) : sr(w * 0.84, w - 10);
        const y = sr(h * 0.1, h * 0.9);
        return {
          x, y,
          vx: sr(-0.25, 0.25),
          vy: sr(0.2, 0.55),
          radius: sr(isMobile() ? 6 : 8, isMobile() ? 12 : 16),
          alpha: sr(0.12, 0.26),
          swaySpeed: sr(0.4, 0.9),
          swayPhase: sr(0, Math.PI * 2),
          color: pick([C.blush, C.champagne, C.rose, C.softPink]),
        };
      });
    }

    /* ── Main celebratory burst at "Keerthana" reveal (fires once) ─────── */
    canvas._burst = () => {
      stateRef.current.triggered = true;
      if (reducedMotion) return;

      const mobile = isMobile();
      const originX = mobile ? w * 0.50 : w * 0.68;
      const originY = mobile ? h * 0.64 : h * 0.46;

      /* 1. Celebratory shower particles (luminous dust & glowing flakes) */
      const showerCount = mobile ? 85 : 160;
      showerParticles = Array.from({ length: showerCount }, (_, i) => {
        const angle = sr(0, Math.PI * 2);
        const speed = sr(2.0, 7.5);
        const spawnDelay = i < 30 ? 0 : sr(2, 25);
        return {
          x: originX + sr(-35, 35),
          y: originY + sr(-15, 15),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - sr(1.0, 3.2),
          friction: sr(0.935, 0.965),
          gravity: sr(0.04, 0.08),
          radius: sr(1.4, 3.5),
          color: pick(PALETTE),
          targetAlpha: sr(0.65, 0.95),
          alpha: 0,
          swayPhase: sr(0, Math.PI * 2),
          swaySpeed: sr(0.8, 1.8),
          delay: spawnDelay,
          active: true,
          age: 0,
        };
      });

      /* 2. Star glints across the viewport and framing edges */
      const starCount = mobile ? 18 : 34;
      starGlints = Array.from({ length: starCount }, (_, i) => {
        let x, y;
        if (mobile) {
          const useMargins = i % 3 !== 0;
          x = useMargins
            ? (i % 2 === 0 ? sr(w * 0.06, w * 0.22) : sr(w * 0.78, w * 0.94))
            : sr(w * 0.2, w * 0.8);
          y = sr(h * 0.40, h * 0.85);
        } else {
          const framePortrait = i < 12;
          x = framePortrait ? sr(w * 0.48, w * 0.58) : sr(w * 0.56, w * 0.95);
          y = framePortrait ? sr(h * 0.15, h * 0.85) : sr(h * 0.25, h * 0.70);
        }
        return {
          x, y,
          size: sr(3.2, 6.8),
          rot: sr(0, Math.PI),
          rotSpeed: sr(-0.015, 0.015),
          color: pick([C.ivory, C.champagne, '#FFFFFF', C.rose]),
          maxLife: sr(45, 95),
          age: 0,
          delay: sr(0, 50),
          peakAlpha: sr(0.6, 0.95),
          active: true,
        };
      });

      /* 3. Tasteful heart light accents around signature */
      const heartCount = mobile ? 9 : 15;
      heartAccents = Array.from({ length: heartCount }, (_, i) => {
        const leftSide = i % 2 === 0;
        const x = mobile
          ? (leftSide ? sr(w * 0.12, w * 0.32) : sr(w * 0.68, w * 0.88))
          : (leftSide ? originX - sr(50, 160) : originX + sr(50, 180));
        const y = originY + sr(-10, 25);
        return {
          x, y,
          vx: sr(-0.35, 0.35),
          vy: sr(-0.6, -1.4),
          size: sr(6, mobile ? 10 : 12),
          rot: sr(-0.3, 0.3),
          rotSpeed: sr(-0.01, 0.01),
          alpha: 0,
          targetAlpha: sr(0.5, 0.8),
          color: pick([C.coral, C.rose, C.blush, C.champagne]),
          age: 0,
          fadeDelay: sr(35, 75),
          active: true,
        };
      });
    };

    /* ── Smooth Fade Out on Exit ─────────────────────────────────────── */
    canvas._fadeOut = (durationSec = 1.0) => {
      stateRef.current.exiting = true;
      stateRef.current.exitStartTime = performance.now();
      stateRef.current.exitDuration = durationSec;
    };

    /* ── Immediate stop & cleanup ───────────────────────────────────── */
    canvas._stop = () => {
      stateRef.current.stopped = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      ctx.clearRect(0, 0, w, h);
    };

    let t = 0;

    function draw() {
      if (stateRef.current.stopped) return;
      rafRef.current = requestAnimationFrame(draw);
      t += 0.016;

      let envelope = 1.0;
      if (stateRef.current.exiting) {
        const elapsed = (performance.now() - stateRef.current.exitStartTime) / 1000;
        envelope = Math.max(0, 1 - (elapsed / stateRef.current.exitDuration));
        if (envelope <= 0) {
          ctx.clearRect(0, 0, w, h);
          return;
        }
      }

      ctx.clearRect(0, 0, w, h);

      /* Berry gradient background */
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0,   C.berryDk);
      bg.addColorStop(0.4, C.berry);
      bg.addColorStop(0.7, '#6B1E3A');
      bg.addColorStop(1,   C.berryDk);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      /* Spotlights */
      spots.forEach(s => {
        const sx = s.x + Math.sin(t * s.spd * 1000 + s.ph) * 50;
        const sy = s.y + Math.cos(t * s.spd * 700  + s.ph) * 35;
        const p  = s.a * (0.6 + 0.4 * Math.sin(t * 0.8 + s.ph)) * envelope;
        const hex = Math.round(p * 255).toString(16).padStart(2, '0');
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r);
        g.addColorStop(0, `${s.col}${hex}`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      /* Ambient Luminous Dust (gentle resting drift) */
      ambientDust.forEach(d => {
        d.y += d.vy;
        d.x += d.vx + Math.sin(t * d.swaySpeed + d.swayPhase) * 0.35;
        if (d.y > h + 15) {
          d.y = -10;
          d.x = sr(0, w);
        }
        let a = d.baseAlpha * (0.7 + 0.3 * Math.sin(t * d.twinkleSpeed + d.twinklePhase)) * envelope;
        if (inFaceZone(d.x, d.y)) a *= 0.15;
        drawGlowDot(ctx, d.x, d.y, d.radius, d.color, a);
      });

      /* Defocused Foreground Depth Bokeh */
      foregroundBokeh.forEach(b => {
        b.y += b.vy;
        b.x += b.vx + Math.sin(t * b.swaySpeed + b.swayPhase) * 0.25;
        if (b.y > h + b.radius * 2) {
          b.y = -b.radius * 2;
          b.x = sr(0, 1) < 0.5 ? sr(10, w * 0.18) : sr(w * 0.82, w - 10);
        }
        const a = b.alpha * envelope;
        drawDefocusedBokeh(ctx, b.x, b.y, b.radius, b.color, a);
      });

      /* Celebratory Burst Shower Particles (settle naturally once) */
      if (stateRef.current.triggered) {
        showerParticles.forEach(p => {
          if (!p.active) return;
          if (p.delay > 0) {
            p.delay--;
            return;
          }
          p.age++;
          p.vx *= p.friction;
          p.vy = p.vy * p.friction + p.gravity;
          p.x += p.vx + Math.sin(t * p.swaySpeed + p.swayPhase) * 0.45;
          p.y += p.vy;

          if (p.age < 30) {
            p.alpha = Math.min(p.alpha + 0.05, p.targetAlpha);
          } else if (p.y > h + 30) {
            p.active = false;
            return;
          }

          let drawAlpha = p.alpha * envelope;
          if (inFaceZone(p.x, p.y)) drawAlpha *= 0.12;
          else if (inHeadlineCore(p.x, p.y)) drawAlpha *= 0.35;

          if (drawAlpha > 0.01) {
            drawGlowDot(ctx, p.x, p.y, p.radius, p.color, drawAlpha, 2.2);
          }
        });

        /* Star Glints */
        starGlints.forEach(st => {
          if (!st.active) return;
          if (st.delay > 0) {
            st.delay--;
            return;
          }
          st.age++;
          st.rot += st.rotSpeed;
          const prog = st.age / st.maxLife;
          if (prog >= 1) {
            st.active = false;
            return;
          }
          const glintAlpha = Math.sin(prog * Math.PI) * st.peakAlpha * envelope;
          if (glintAlpha > 0.01) {
            drawStarGlint(ctx, st.x, st.y, st.size, st.color, glintAlpha, st.rot);
          }
        });

        /* Occasional delicate resting sparkle (restrained, non-intrusive) */
        if (!reducedMotion && !stateRef.current.exiting && Math.random() < 0.007) {
          const activeGlints = starGlints.filter(s => s.active).length;
          if (activeGlints < 3) {
            const mobile = isMobile();
            let sx, sy;
            if (mobile) {
              sx = Math.random() < 0.5 ? sr(w * 0.06, w * 0.20) : sr(w * 0.80, w * 0.94);
              sy = sr(h * 0.45, h * 0.85);
            } else {
              sx = Math.random() < 0.5 ? sr(w * 0.48, w * 0.56) : sr(w * 0.85, w * 0.95);
              sy = sr(h * 0.20, h * 0.80);
            }
            starGlints.push({
              x: sx, y: sy,
              size: sr(2.8, 5.0),
              rot: sr(0, Math.PI),
              rotSpeed: sr(-0.015, 0.015),
              color: pick([C.ivory, C.champagne, '#FFFFFF', C.rose]),
              maxLife: sr(50, 80),
              age: 0,
              delay: 0,
              peakAlpha: sr(0.5, 0.8),
              active: true,
            });
          }
        }

        /* Tasteful Heart Light Accents */
        heartAccents.forEach(hrt => {
          if (!hrt.active) return;
          hrt.age++;
          hrt.x += hrt.vx + Math.sin(t * 1.5 + hrt.rot) * 0.3;
          hrt.y += hrt.vy;
          hrt.rot += hrt.rotSpeed;

          if (hrt.age < hrt.fadeDelay) {
            hrt.alpha = Math.min(hrt.alpha + 0.045, hrt.targetAlpha);
          } else {
            hrt.alpha -= 0.012;
          }

          if (hrt.alpha <= 0 || hrt.y < -30) {
            hrt.active = false;
            return;
          }

          const hAlpha = hrt.alpha * envelope;
          if (hAlpha > 0.01) {
            drawHeartAccent(ctx, hrt.x, hrt.y, hrt.size, hrt.color, hAlpha, hrt.rot);
          }
        });
      }
    }

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);
}

/* ── Main Birthday Reveal Component ──────────────────────────────────────── */
export function BirthdayJourney() {
  const { playSfx, playTrack } = useAudio();
  const { next }               = useScene();
  const reducedMotion          = useReducedMotion();

  const sceneRef       = useRef(null);
  const canvasRef      = useRef(null);
  const panelTopRef    = useRef(null);
  const panelBotRef    = useRef(null);
  const portraitColRef = useRef(null);
  const wipeOverlayRef = useRef(null);
  const happyRef       = useRef(null);
  const birthdayRef    = useRef(null);
  const accentBarRef   = useRef(null);
  const nameRef        = useRef(null);
  const subRef         = useRef(null);
  const ctaRef         = useRef(null);

  const [portraitLoaded, setPortraitLoaded] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitioningRef = useRef(false);

  useCelebrationCanvas(canvasRef, reducedMotion);

  /* Intentional continuation trigger: only executes when Keerthana clicks the button */
  const triggerTransition = useCallback(() => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    setIsTransitioning(true);

    playSfx('sparkle');

    /* Smooth 1.0s graceful fade of canvas particles & scene content */
    canvasRef.current?._fadeOut?.(1.0);

    gsap.to(sceneRef.current, {
      opacity: 0,
      filter: 'blur(4px) brightness(0.9)',
      duration: 1.0,
      ease: 'power2.inOut',
      onComplete: () => {
        canvasRef.current?._stop?.();
        next();
      },
    });
  }, [next, playSfx]);

  /* Keyboard shortcut (Enter / Space) to proceed if desired */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      triggerTransition();
    }
  }, [triggerTransition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /* ── GSAP Reveal Choreography: Plays once, enters button, then stays ─────── */
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      /* A: Fade-in + colour sweep */
      tl.fromTo(sceneRef.current,
        { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }
      );
      tl.call(() => playTrack('intro'));

      if (!reducedMotion && panelTopRef.current && panelBotRef.current) {
        tl.fromTo([panelTopRef.current, panelBotRef.current],
          { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: 'power4.inOut', stagger: 0 },
          '<+0.1'
        );
        tl.to([panelTopRef.current, panelBotRef.current],
          { scaleY: 0, duration: 0.5, ease: 'power3.inOut', stagger: 0 },
          '+=0.15'
        );
      }

      /* B: Portrait reveal wipe
         Desktop: left-to-right clip (inset right side)
         Mobile:  top-to-bottom clip (inset top)                           */
      if (portraitColRef.current) {
        const fromClip = mobile ? 'inset(100% 0 0 0)' : 'inset(0 100% 0 0)';
        const toClip   = 'inset(0 0 0 0)';
        tl.fromTo(portraitColRef.current,
          { clipPath: fromClip, x: mobile ? 0 : (reducedMotion ? 0 : -30) },
          { clipPath: toClip,   x: 0, duration: 1.2, ease: 'power4.out' },
          reducedMotion ? '<' : '<+=0.3'
        );
      }
      if (!reducedMotion && wipeOverlayRef.current) {
        tl.fromTo(wipeOverlayRef.current,
          { x: '0%' }, { x: '105%', duration: 0.85, ease: 'power3.inOut' },
          '<+0.1'
        );
      }
      tl.call(() => playSfx('sparkle'), [], '<+=0.7');

      /* C: "Happy" + "Birthday," cursive typography stagger */
      if (happyRef.current) {
        tl.fromTo(happyRef.current,
          { y: 45, opacity: 0, skewX: reducedMotion ? 0 : 4 },
          { y: 0,  opacity: 1, skewX: 0, duration: 0.85, ease: 'power4.out' },
          '+=0.1'
        );
      }
      if (birthdayRef.current) {
        tl.fromTo(birthdayRef.current,
          { y: 50, opacity: 0, skewX: reducedMotion ? 0 : 3 },
          { y: 0,  opacity: 1, skewX: 0, duration: 0.85, ease: 'power4.out' },
          '<+0.15'
        );
      }

      /* D: "Keerthana" signature name */
      if (accentBarRef.current) {
        tl.fromTo(accentBarRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power3.out',
            transformOrigin: 'left center' },
          '+=0.2'
        );
      }
      if (nameRef.current) {
        tl.fromTo(nameRef.current,
          { x: reducedMotion ? 0 : 50, opacity: 0, scale: reducedMotion ? 1 : 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'back.out(1.5)' },
          '<+0.05'
        );
      }

      /* E: Celebratory burst of luminous particles, star glints & light hearts */
      tl.call(() => {
        canvasRef.current?._burst?.();
        playSfx('sparkle');
        playSfx('heartbeat');
      }, [], '+=0.15');

      /* F: Supporting message reveals with soft blur dissipation */
      if (subRef.current) {
        tl.fromTo(subRef.current,
          { opacity: 0, y: 18, filter: 'blur(5px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.95, ease: 'power2.out' },
          '+=0.25'
        );
      }

      /* G: Continuation Button enters smoothly and remains available indefinitely */
      if (ctaRef.current) {
        tl.fromTo(ctaRef.current,
          { opacity: 0, y: 16, scale: 0.95 },
          { opacity: 1, y: 0,  scale: 1, duration: 0.8, ease: 'back.out(1.4)' },
          '+=0.35'
        );
      }

      /* Scene now remains resting indefinitely until Keerthana clicks the button.
         NO automatic timeout, NO delayed transition, NO screen dismiss. */
    }, sceneRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portraitLoaded, reducedMotion]);

  const cs = C;

  return (
    <div ref={sceneRef} className="bd-scene" style={{ opacity: 0 }}>

      {/* ── Scoped styles ──────────────────────────────────────────────── */}
      <style>{`
        /* ── Scene shell ────────────────────────────────────────────────── */
        .bd-scene {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          overflow-x: hidden;
          overflow-y: auto;
          display: grid;
          grid-template-columns: 55fr 45fr;
          grid-template-rows: 1fr;
          background: ${cs.berryDk};
        }
        .bd-canvas {
          position: fixed; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none; z-index: 0;
        }

        /* ── Portrait column ──────────────────────────────────────────── */
        .bd-portrait-col {
          position: relative; z-index: 2;
          overflow: hidden;
          min-height: 100dvh;
        }
        .bd-portrait-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .bd-portrait-overlay {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background: linear-gradient(to right,
            rgba(69,21,45,0) 50%, rgba(42,11,26,0.80) 100%);
        }
        .bd-wipe-panel {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(135deg, ${cs.berry} 0%, ${cs.coral} 100%);
        }
        .bd-portrait-stripe {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 5px; z-index: 3;
          background: linear-gradient(to right, ${cs.coral}, ${cs.blush}, ${cs.gold});
        }
        .bd-fallback {
          position: absolute; inset: 0; display: flex;
          align-items: center; justify-content: center;
          background: linear-gradient(135deg, ${cs.berry}, ${cs.berryDk});
          font-size: 4rem;
        }

        /* ── Sweep panels ─────────────────────────────────────────────── */
        .bd-panel-top {
          position: fixed; top: 0; left: 0; right: 0; height: 50%;
          background: linear-gradient(180deg, ${cs.berry} 0%, ${cs.coral} 100%);
          transform-origin: top center; z-index: 30; pointer-events: none;
        }
        .bd-panel-bot {
          position: fixed; bottom: 0; left: 0; right: 0; height: 50%;
          background: linear-gradient(0deg, ${cs.berryDk} 0%, ${cs.coral} 100%);
          transform-origin: bottom center; z-index: 30; pointer-events: none;
        }

        /* ── Text column ──────────────────────────────────────────────── */
        .bd-text-col {
          position: relative; z-index: 3;
          display: flex; flex-direction: column; justify-content: center;
          padding: clamp(2rem,5vw,5rem) clamp(1.5rem,4vw,4rem);
          margin-left: -3vw;
        }

        /* ── Typography ────────────────────────────────────────────────── */
        .bd-label {
          font-family: 'Manrope','Inter',sans-serif;
          font-weight: 500;
          font-size: clamp(.65rem,1vw,.8rem);
          letter-spacing: .22em; text-transform: uppercase;
          color: ${cs.blush}; margin-bottom: .5rem;
        }
        .bd-happy {
          font-family: 'Dancing Script','Alex Brush',cursive;
          font-weight: 700;
          font-size: clamp(2.8rem,6vw,6.2rem);
          line-height: 1.05;
          letter-spacing: .01em;
          color: ${cs.ivory}; display: block;
          will-change: transform,opacity;
        }
        .bd-birthday {
          font-family: 'Dancing Script','Alex Brush',cursive;
          font-weight: 600;
          font-size: clamp(2.4rem,5vw,5.4rem);
          line-height: 0.95;
          letter-spacing: .02em;
          color: ${cs.coral}; display: block;
          will-change: transform,opacity;
        }
        .bd-name-row {
          position: relative; margin-top: clamp(.5rem,1.2vw,1.2rem);
          display: flex; align-items: center; gap: .55rem;
          flex-wrap: nowrap;
        }
        .bd-accent-bar {
          flex-shrink: 0; height: 3px; width: clamp(28px,5vw,60px);
          background: linear-gradient(to right, ${cs.gold}, ${cs.blush});
          border-radius: 2px; will-change: transform,opacity;
          margin-bottom: 2px;
        }
        .bd-name {
          font-family: 'Alex Brush',cursive;
          font-weight: 400;
          font-size: clamp(3.6rem,8vw,8.8rem);
          line-height: 1.15;
          letter-spacing: .01em;
          color: ${cs.ivory};
          display: inline-block; position: relative;
          will-change: transform,opacity;
          padding-bottom: 0.1em;
        }
        .bd-name::after {
          content: ''; position: absolute; bottom: 0.15em; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, ${cs.coral} 0%, ${cs.gold} 100%);
          border-radius: 2px;
        }
        .bd-sub {
          font-family: 'Manrope','Inter',sans-serif;
          font-weight: 400;
          font-size: clamp(.88rem,1.3vw,1.05rem);
          line-height: 1.72; color: rgba(245,184,168,.88);
          margin-top: clamp(1rem,2.5vw,2rem); max-width: 36ch;
          will-change: transform,opacity;
        }

        /* ── Continuation Button ───────────────────────────────────────── */
        .bd-cta-wrap {
          margin-top: clamp(1.4rem, 2.8vw, 2.4rem);
          will-change: transform,opacity;
        }
        .bd-cta {
          display: inline-flex; align-items: center; gap: .65em;
          padding: .9em 2.5em;
          background: ${cs.coral}; color: ${cs.ivory};
          font-family: 'Manrope','Inter',sans-serif;
          font-weight: 700;
          font-size: clamp(.82rem, 1.15vw, .95rem);
          letter-spacing: .12em; text-transform: uppercase;
          border: none; border-radius: 4px; cursor: pointer;
          transition: background .25s ease, box-shadow .25s ease, transform .15s ease;
          box-shadow: 0 6px 24px rgba(233,75,112,.38), 0 2px 8px rgba(0,0,0,.2);
          min-height: 48px;
          touch-action: manipulation;
          user-select: none;
        }
        .bd-cta:hover:not(:disabled) {
          background: ${cs.coralDk};
          box-shadow: 0 8px 30px rgba(233,75,112,.55), 0 3px 12px rgba(0,0,0,.25);
          transform: translateY(-1px);
        }
        .bd-cta:active:not(:disabled) {
          transform: translateY(1px) scale(.98);
          box-shadow: 0 4px 16px rgba(233,75,112,.3);
        }
        .bd-cta:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          pointer-events: none;
        }
        .bd-cta-arrow {
          font-style: normal;
          display: inline-block;
          font-weight: 800;
          transition: transform .25s ease;
        }
        .bd-cta:hover:not(:disabled) .bd-cta-arrow {
          transform: translateX(4px);
        }

        /* ══════════════════════════════════════════════════════════════════
           MOBILE LAYOUT — vivo Y28s 5G target: ~360×800 CSS px
           Stacked composition: portrait on top, text below.
        ══════════════════════════════════════════════════════════════════ */
        @media (max-width: 767px) {
          .bd-scene {
            grid-template-columns: 1fr;
            grid-template-rows: 48dvh auto;
            overflow-y: auto;
            padding-bottom: env(safe-area-inset-bottom, 0px);
          }

          /* Portrait: fixed 48dvh; min-height reset to beat desktop 100dvh rule */
          .bd-portrait-col {
            min-height: 48dvh;
            height: 48dvh;
          }

          /* Crop adjustment for portrait orientation: face centre-top */
          .bd-portrait-img {
            object-position: center 10%;
          }

          /* Bottom-fade gradient so portrait blends into text block */
          .bd-portrait-overlay {
            background: linear-gradient(
              to bottom,
              rgba(69,21,45,0) 50%,
              rgba(42,11,26,0.92) 100%
            );
          }

          /* Text block: safe padding, balanced breathing room */
          .bd-text-col {
            margin-left: 0;
            padding: 1.8rem 1.4rem 2.2rem;
            padding-bottom: max(2.2rem, env(safe-area-inset-bottom, 2.2rem));
            background: linear-gradient(160deg, ${cs.berryDk} 0%, #3A1022 100%);
            justify-content: flex-start;
            min-height: auto;
          }

          /* Typography — sized for 360px viewport */
          .bd-label    { font-size: 0.58rem; letter-spacing: .18em; margin-bottom: .4rem; }
          .bd-happy    { font-size: clamp(2.4rem, 8.5vw, 3.5rem); line-height: 1.05; }
          .bd-birthday { font-size: clamp(2.0rem, 7.5vw, 3.0rem); line-height: 0.95; }
          .bd-name-row { margin-top: 0.5rem; gap: .4rem; }
          .bd-accent-bar { width: clamp(24px, 6vw, 40px); }
          .bd-name     { font-size: clamp(3.2rem, 11vw, 5.0rem); line-height: 1.2; }
          .bd-sub      {
            max-width: none;
            font-size: clamp(.85rem, 3.8vw, 1rem);
            margin-top: 0.95rem;
            line-height: 1.65;
          }

          /* Full-width comfortable tap target on mobile */
          .bd-cta-wrap {
            margin-top: 1.3rem;
            width: 100%;
          }
          .bd-cta {
            width: 100%;
            justify-content: center;
            font-size: 0.88rem;
            padding: .95em 1.5em;
            min-height: 48px;
            letter-spacing: .10em;
          }
        }

        /* Extra-narrow phones (≤ 320px) */
        @media (max-width: 320px) {
          .bd-happy    { font-size: 2.1rem; }
          .bd-birthday { font-size: 1.8rem; }
          .bd-name     { font-size: 2.9rem; }
        }

        /* Reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .bd-cta { transition: background .15s; }
          .bd-name::after { height: 1px; }
        }
      `}</style>

      {/* Canvas */}
      <canvas ref={canvasRef} aria-hidden="true" className="bd-canvas" />

      {/* Sweep panels */}
      {!reducedMotion && <>
        <div ref={panelTopRef} className="bd-panel-top" style={{ transform:'scaleY(0)' }} aria-hidden="true" />
        <div ref={panelBotRef} className="bd-panel-bot" style={{ transform:'scaleY(0)' }} aria-hidden="true" />
      </>}

      {/* Portrait column */}
      <div
        ref={portraitColRef}
        className="bd-portrait-col"
        style={{ clipPath: window.innerWidth < 768 ? 'inset(100% 0 0 0)' : 'inset(0 100% 0 0)' }}
      >
        {!portraitFailed ? (
          <img
            src={PORTRAIT_SRC}
            alt="Keerthana ❤️"
            className="bd-portrait-img"
            onLoad={() => setPortraitLoaded(true)}
            onError={() => {
              setPortraitFailed(true);
              console.warn('[BirthdayJourney] Portrait missing:', PORTRAIT_SRC);
            }}
          />
        ) : (
          <div className="bd-fallback" role="img" aria-label="Portrait">✨</div>
        )}
        <div className="bd-portrait-overlay" aria-hidden="true" />
        {!reducedMotion && (
          <div ref={wipeOverlayRef} className="bd-wipe-panel" aria-hidden="true" />
        )}
        <div className="bd-portrait-stripe" aria-hidden="true" />
      </div>

      {/* Text column */}
      <div className="bd-text-col">
        <span className="bd-label" aria-hidden="true">October 30th · A Day Celebrating You</span>

        <span ref={happyRef}    className="bd-happy"    style={{ opacity:0 }}>Happy</span>
        <span ref={birthdayRef} className="bd-birthday" style={{ opacity:0 }}>Birthday,</span>

        <div className="bd-name-row">
          <span ref={accentBarRef} className="bd-accent-bar" style={{ opacity:0 }} aria-hidden="true" />
          <span ref={nameRef} className="bd-name" style={{ opacity:0 }}>Keerthana</span>
        </div>

        <p ref={subRef} className="bd-sub" style={{ opacity:0 }}>
          I hope this year gives you a thousand little reasons to smile with me, Kutty. ❤️
        </p>

        <div ref={ctaRef} className="bd-cta-wrap" style={{ opacity: 0 }}>
          <button
            id="birthday-cta"
            className="bd-cta"
            onClick={triggerTransition}
            disabled={isTransitioning}
            aria-label="Open your memories"
          >
            Open Your Memories
            <span className="bd-cta-arrow" aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>

    </div>
  );
}