import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '../context/SceneContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─────────────────────────────────────────────────────────────────────────────
// ArtistChapter — Phase 10: The Artist's Hand (V3)
// TRUE 75/25 DESKTOP LAYOUT + ORGANIC STOCHASTIC GRAPHITE REVEAL
//
// Desktop: 75% artwork stage (left) + 25% editorial information panel (right)
// Artwork height: 94-96% of available viewport height
// Resolution: Native 896 x 1200 (exact 1:1 match with source artwork)
// Reveal: Multi-octave positive-modulo noise with zero NaNs and zero seams
// Single rendering surface: canvas renders reveal and resolves to 100% native image
// ─────────────────────────────────────────────────────────────────────────────

const ARTWORK_SRC = '/images/artworks/keerthana-pencil-portrait.webp';
const REVEAL_DURATION_MS = 8500; // 8.5s cinematic reveal

// Exact 1:1 native dimensions of the genuine pencil portrait
const CANVAS_W = 896;
const CANVAS_H = 1200;

// Positive modulo helper
function mod(n, m) {
  return ((n % m) + m) % m;
}

// Seeded PRNG (Mulberry32) for deterministic, repeatable stochastic distribution
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 2D Value Noise with smooth cubic interpolation & strictly positive wrapped indices
function createNoise2D(seed, scaleX, scaleY) {
  const prng = mulberry32(seed);
  const gridW = 64;
  const gridH = 64;
  const grid = new Float32Array(gridW * gridH);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = prng();
  }
  return function (x, y) {
    const gx = x * scaleX;
    const gy = y * scaleY;
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const fx = gx - x0;
    const fy = gy - y0;
    // Cubic smoothstep (Hermite interpolation)
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);

    const gx0 = mod(x0, gridW);
    const gx1 = mod(x0 + 1, gridW);
    const gy0 = mod(y0, gridH);
    const gy1 = mod(y0 + 1, gridH);

    const top = grid[gy0 * gridW + gx0] * (1 - sx) + grid[gy0 * gridW + gx1] * sx;
    const btm = grid[gy1 * gridW + gx0] * (1 - sx) + grid[gy1 * gridW + gx1] * sx;
    return top * (1 - sy) + btm * sy;
  };
}

// Precomputes the organic stochastic graphite threshold map
// Combines macro clusters (40%), meso patches (28%), angled hatching (18%), and tooth grain (14%)
// Guaranteed zero NaNs, strictly uniform distribution, perfectly distributed across the image
function generateGraphiteThresholds(w, h) {
  const total = w * h;
  const nMacro = createNoise2D(42817, 3.5, 4.5);
  const nMeso = createNoise2D(88291, 10.0, 14.0);
  const nMicro = createNoise2D(19384, 28.0, 36.0);
  const grainPrng = mulberry32(57291);

  const rawVals = new Float32Array(total);
  const indices = new Int32Array(total);

  for (let y = 0; y < h; y++) {
    const v = y / h;
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const idx = y * w + x;
      indices[idx] = idx;

      // 45-degree angle without negative modulo bugs
      const hu = u * 0.707 + v * 0.707;
      const hv = -u * 0.707 + v * 0.707;

      rawVals[idx] =
        0.40 * nMacro(u, v) +
        0.28 * nMeso(u, v) +
        0.18 * nMicro(hu, hv) +
        0.14 * grainPrng();
    }
  }

  // Quantile rank sorting: strictly uniform threshold distribution over [0.02, 0.94]
  indices.sort((a, b) => rawVals[a] - rawVals[b]);
  const thresholds = new Float32Array(total);
  for (let rank = 0; rank < total; rank++) {
    thresholds[indices[rank]] = (rank / total) * 0.92 + 0.02;
  }

  return thresholds;
}

// Restrained ambient studio dust particles
function StudioDust({ active }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: `${10 + ((i * 23) % 80)}%`,
        y: `${8 + ((i * 29) % 84)}%`,
        size: 1.2 + (i % 3) * 0.6,
        delay: (i * 0.42) % 4,
        dur: 4.5 + (i % 4) * 0.9,
      })),
    []
  );

  if (!active) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-10" aria-hidden="true">
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={p.size}
          fill="rgba(255, 235, 200, 0.22)"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.6, 0], y: [-6, -24, -40] }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  );
}

// ─── ACT I: Studio Entrance ───────────────────────────────────────────────────
function StudioEntrance({ onBegin, reducedMotion }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden w-screen h-screen min-h-[100dvh]"
      style={{
        background:
          'radial-gradient(ellipse 95% 85% at 50% 40%, #231C14 0%, #15110C 50%, #090806 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.02 }}
      transition={{ duration: reducedMotion ? 0.4 : 0.8 }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 42%, rgba(255,230,170,0.12) 0%, rgba(255,200,120,0.04) 45%, transparent 75%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(0,0,0,0.78) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <StudioDust active={!reducedMotion} />

      <div className="relative z-20 flex flex-col items-center text-center px-6 sm:px-10 max-w-xl">
        <motion.span
          className="text-[11px] sm:text-xs uppercase tracking-[0.45em] font-medium mb-5"
          style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(255,225,170,0.60)' }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Something Special for You ❤️
        </motion.span>

        <motion.h1
          className="font-normal italic leading-[1.08] tracking-tight mb-5"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.8rem, 8vw, 5.2rem)',
            color: 'rgba(255,248,238,0.98)',
          }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          Drawn Just for You ❤️
        </motion.h1>

        <motion.div
          className="h-px mb-5"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(255,215,145,0.45), transparent)',
            width: 'clamp(64px, 14vw, 120px)',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.38 }}
        />

        <motion.p
          className="text-sm sm:text-base md:text-lg font-light italic leading-relaxed tracking-wide max-w-md"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'rgba(255,232,190,0.78)',
          }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.5 }}
        >
          &ldquo;Some memories are photographed.
          <br />
          <span style={{ color: 'rgba(255,215,145,0.90)' }}>Some deserve to be drawn.&rdquo;</span>
        </motion.p>

        <motion.button
          type="button"
          onClick={onBegin}
          className="mt-9 sm:mt-11 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-medium transition-all duration-300 active:scale-95 cursor-pointer shadow-lg"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.74rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            background: 'rgba(255,240,215,0.08)',
            color: 'rgba(255,245,225,0.95)',
            border: '1px solid rgba(255,215,145,0.38)',
            backdropFilter: 'blur(10px)',
          }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          whileHover={{
            background: 'rgba(255,215,145,0.18)',
            borderColor: 'rgba(255,215,145,0.65)',
            scale: 1.03,
          }}
        >
          Look what I made for you →
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── ACT II: Exhibition Stage (75/25 Desktop Grid + Portrait-First Mobile) ─────
function StudioReveal({ onComplete, reducedMotion }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const [isComplete, setIsComplete] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);

  // Precomputed graphite thresholds (deterministic, zero NaNs, stable across replays)
  const thresholdsRef = useRef(null);
  if (!thresholdsRef.current) {
    thresholdsRef.current = generateGraphiteThresholds(CANVAS_W, CANVAS_H);
  }

  // Preloaded native image pixels
  const sourcePixelsRef = useRef(null);
  const destImageDataRef = useRef(null);

  // Mark drawing complete and render 100% native pixels onto canvas
  const markComplete = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const canvas = canvasRef.current;
    if (canvas && sourcePixelsRef.current && destImageDataRef.current) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dst = new Uint32Array(destImageDataRef.current.data.buffer);
        dst.set(sourcePixelsRef.current);
        ctx.putImageData(destImageDataRef.current, 0, 0);
      }
    }

    setIsComplete(true);
    setShowShimmer(true);
  }, []);

  // Run the organic stochastic reveal loop
  const startRevealAnimation = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (reducedMotion) {
      markComplete();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || !sourcePixelsRef.current || !destImageDataRef.current) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      markComplete();
      return;
    }

    const total = CANVAS_W * CANVAS_H;
    const thresholds = thresholdsRef.current;
    const src = sourcePixelsRef.current;
    const dstImgData = destImageDataRef.current;
    const dst = new Uint32Array(dstImgData.data.buffer);

    // Clear canvas before starting
    dst.fill(0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    startTimeRef.current = performance.now();

    const renderFrame = (now) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1.0, elapsed / REVEAL_DURATION_MS);

      // Transition window: allows graphite tone to develop smoothly across flecks
      const transitionWindow = 0.08;
      const invWindow = 1.0 / transitionWindow;

      for (let i = 0; i < total; i++) {
        const t = thresholds[i];
        if (progress < t - transitionWindow) {
          // Clean ivory paper (alpha = 0)
          dst[i] = 0;
        } else if (progress >= t) {
          // Fully resolved genuine pencil drawing pixel
          dst[i] = src[i];
        } else {
          // Developing graphite fleck: smooth Hermite ramp simulates pencil lead on tooth
          const normalized = (progress - (t - transitionWindow)) * invWindow;
          const factor = normalized * normalized * (3 - 2 * normalized);
          const alpha = (factor * 255) | 0;
          dst[i] = (src[i] & 0x00ffffff) | (alpha << 24);
        }
      }

      ctx.putImageData(dstImgData, 0, 0);

      if (progress < 1.0) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
      } else {
        markComplete();
      }
    };

    animFrameRef.current = requestAnimationFrame(renderFrame);
  }, [reducedMotion, markComplete]);

  // Load and sample the genuine pencil artwork at 100% native resolution
  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = ARTWORK_SRC;

    img.onload = () => {
      if (!active) return;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = CANVAS_W;
      offCanvas.height = CANVAS_H;
      const offCtx = offCanvas.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
        const imgData = offCtx.getImageData(0, 0, CANVAS_W, CANVAS_H);
        sourcePixelsRef.current = new Uint32Array(imgData.data.buffer);
        destImageDataRef.current = offCtx.createImageData(CANVAS_W, CANVAS_H);
      }

      setImgLoaded(true);
    };

    img.onerror = () => {
      if (active) setLoadError(true);
    };

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Trigger reveal once image pixels are sampled
  useEffect(() => {
    if (imgLoaded) {
      startRevealAnimation();
    }
  }, [imgLoaded, startRevealAnimation]);

  // Skip animation handler
  const handleSkip = useCallback(() => {
    markComplete();
  }, [markComplete]);

  // Replay animation handler
  const handleReplay = useCallback(() => {
    setIsComplete(false);
    setShowShimmer(false);
    startRevealAnimation();
  }, [startRevealAnimation]);

  return (
    <motion.div
      className="fixed inset-0 z-50 select-none overflow-hidden w-screen h-screen min-h-[100dvh]"
      style={{
        background:
          'radial-gradient(ellipse 95% 90% at 38% 50%, #241D15 0%, #16120C 50%, #0A0806 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Warm spotlight pool specifically illuminating the 75% artwork stage */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 72% 70% at 37% 50%, rgba(255, 230, 170, 0.14) 0%, rgba(255, 205, 120, 0.04) 45%, transparent 75%)',
        }}
      />

      {/* Subtle right-side ambient fill for the 25% information panel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 85% 50%, rgba(255, 220, 150, 0.04) 0%, transparent 65%)',
        }}
      />

      {/* Atmospheric perimeter vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Studio paper grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <StudioDust active={!reducedMotion} />

      {/* ── MOBILE HEADER (Hidden on Desktop) ─────────────────────────────────── */}
      <header className="lg:hidden relative z-20 w-full flex items-center justify-between px-5 pt-[max(12px,env(safe-area-inset-top))] shrink-0">
        <div className="flex flex-col">
          <span
            className="text-[9px] uppercase tracking-[0.35em] font-medium text-amber-200/60"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Something Special for You ❤️
          </span>
          <span
            className="text-xs uppercase tracking-[0.24em] font-medium text-amber-100/90"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Drawn Just for You ❤️
          </span>
        </div>

        <AnimatePresence>
          {!isComplete && (
            <motion.button
              type="button"
              onClick={handleSkip}
              className="text-[10px] uppercase tracking-[0.22em] font-medium px-3 py-1.5 rounded-full border border-amber-900/40 text-amber-200/75 bg-amber-950/20 active:scale-95 cursor-pointer"
              style={{ fontFamily: "'Manrope', sans-serif" }}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              Skip reveal →
            </motion.button>
          )}
        </AnimatePresence>
      </header>

      {/* ── MAIN LAYOUT: TRUE 75/25 GRID ON DESKTOP, VERTICAL ON MOBILE ──────── */}
      <div className="relative z-10 w-full h-full flex flex-col lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(300px,1fr)] overflow-hidden">
        
        {/* ── LEFT 75% ARTWORK STAGE: DOMINANT, 95% VIEWPORT HEIGHT ───────────── */}
        <section className="relative flex items-center justify-center w-full h-full p-2 sm:p-4 lg:p-6 overflow-hidden my-auto">
          {/* Ivory Drawing Paper Sheet — Maximize vertical scale to 95vh */}
          <div
            className="relative flex items-center justify-center overflow-hidden transition-all duration-700"
            style={{
              aspectRatio: '896 / 1200',
              // Desktop: 94-96% of available viewport height; Mobile: safe vertical fit
              height: 'clamp(360px, 95dvh, 1020px)',
              maxHeight: 'calc(100dvh - 160px)',
              maxWidth: 'calc(100vw - 24px)',
              borderRadius: '2px',
              boxShadow: isComplete
                ? '0 30px 80px -15px rgba(0,0,0,0.85), 0 10px 25px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.45)'
                : '0 20px 60px -15px rgba(0,0,0,0.75), 0 6px 18px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.35)',
              background: 'linear-gradient(155deg, #FAF6EE 0%, #F5EEDD 50%, #ECE3CE 100%)',
            }}
          >
            {/* Fine paper tooth overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.055] mix-blend-multiply z-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            {!loadError ? (
              <>
                {/* Single unified canvas: renders stochastic reveal and seamlessly holds complete artwork */}
                <canvas
                  ref={canvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  className="w-full h-full object-contain pointer-events-none select-none z-10"
                />

                {/* Subtle golden graphite finish shimmer */}
                {showShimmer && !reducedMotion && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-30"
                    style={{
                      background:
                        'linear-gradient(115deg, transparent 0%, rgba(255,248,225,0.30) 45%, rgba(255,230,170,0.14) 55%, transparent 100%)',
                      width: '60%',
                    }}
                    initial={{ x: '-120%', opacity: 0 }}
                    animate={{ x: '240%', opacity: [0, 0.85, 0] }}
                    transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <span className="text-4xl mb-3 opacity-40">✏️</span>
                <p
                  className="text-xs uppercase tracking-widest font-medium"
                  style={{ color: 'rgba(80,60,40,0.6)', fontFamily: "'Manrope', sans-serif" }}
                >
                  Your portrait, Keerthana ❤️
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── RIGHT 25% INFORMATION PANEL: REFINED EDITORIAL CURATION ─────────── */}
        <aside className="hidden lg:flex flex-col justify-center h-full px-6 xl:px-8 py-8 z-20 border-l border-amber-950/20 bg-gradient-to-r from-transparent to-black/20">
          {/* Eyebrow */}
          <motion.span
            className="text-[11px] uppercase tracking-[0.42em] font-medium mb-3 text-amber-200/60"
            style={{ fontFamily: "'Manrope', sans-serif" }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Something Special for You ❤️
          </motion.span>

          {/* Title */}
          <motion.h1
            className="font-normal italic leading-[1.08] tracking-tight mb-2 text-amber-50"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.1rem, 2.6vw, 3.2rem)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Drawn Just for You ❤️
          </motion.h1>

          {/* Supporting line */}
          <motion.p
            className="text-xs xl:text-sm font-light italic leading-relaxed text-amber-100/70 mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.28 }}
          >
            A little drawing, made just for you. ❤️
          </motion.p>

          {/* Thin champagne separator */}
          <motion.div
            className="h-px mb-6"
            style={{
              width: '80px',
              background: 'linear-gradient(to right, rgba(255,215,145,0.55), transparent)',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.38 }}
          />

          {/* Active drawing status (during reveal) */}
          <AnimatePresence>
            {!isComplete && (
              <motion.div
                className="flex flex-col gap-3 py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    className="text-sm"
                    animate={{ rotate: [0, -8, 8, -4, 0], x: [0, 2, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ✏️
                  </motion.span>
                  <span
                    className="text-[11px] uppercase tracking-[0.28em] font-medium text-amber-200/80"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Almost there…
                  </span>
                </div>
                <p
                  className="text-xs font-light text-stone-400 max-w-xs leading-relaxed"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Just wait till you see yourself, Keerthana. ❤️
                </p>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.24em] font-medium border border-amber-900/40 text-amber-200/70 hover:text-amber-100 hover:border-amber-700/60 transition-all cursor-pointer"
                    style={{ background: 'rgba(255,235,190,0.06)' }}
                  >
                    Skip reveal →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completed editorial info & action buttons (when finished) */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                className="flex flex-col gap-4 py-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Her Name */}
                <p
                  className="font-bold leading-none text-amber-50"
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 'clamp(2.5rem, 3.8vw, 3.6rem)',
                    textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  }}
                >
                  Keerthana
                </p>

                {/* Exact required caption */}
                <p
                  className="text-xs xl:text-sm font-light italic leading-relaxed text-amber-100/85 max-w-xs"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '0.02em',
                  }}
                >
                  &ldquo;A little piece of you, captured in pencil.&rdquo;
                </p>

                {/* Replay & Download actions */}
                <div className="mt-3 flex flex-col gap-2.5 max-w-xs">
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="w-full py-2.5 px-4 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all active:scale-95 cursor-pointer text-center"
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      background: 'rgba(255,235,190,0.08)',
                      color: 'rgba(255,235,190,0.85)',
                      border: '1px solid rgba(255,215,145,0.30)',
                    }}
                  >
                    ↺ Watch it draw again
                  </button>

                  <a
                    href={ARTWORK_SRC}
                    download="Keerthana-Pencil-Portrait.webp"
                    className="w-full py-2.5 px-4 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-center"
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      background: 'rgba(255,215,145,0.18)',
                      color: 'rgba(255,248,225,0.96)',
                      border: '1px solid rgba(255,215,145,0.48)',
                      textDecoration: 'none',
                    }}
                  >
                    ↓ Keep this portrait
                  </a>
                </div>

                {/* Continue action */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={onComplete}
                    className="text-xs uppercase tracking-[0.26em] font-medium text-amber-200/50 hover:text-amber-200 transition-colors cursor-pointer py-1"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Continue the journey →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {/* ── MOBILE FOOTER (Hidden on Desktop) ─────────────────────────────────── */}
      <footer className="lg:hidden relative z-20 w-full flex flex-col items-center text-center px-4 pb-[max(12px,env(safe-area-inset-bottom))] shrink-0">
        <AnimatePresence>
          {!isComplete && (
            <motion.div
              className="flex items-center gap-2 py-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-xs">✏️</span>
              <span
                className="text-[10px] uppercase tracking-[0.3em] font-medium text-amber-200/60"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Almost there…
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isComplete && (
            <motion.div
              className="flex flex-col items-center w-full max-w-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p
                className="font-bold leading-none mb-1 text-amber-50"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: 'clamp(1.7rem, 5vw, 2.4rem)',
                }}
              >
                Keerthana
              </p>

              <p
                className="text-xs font-light italic leading-snug text-amber-100/80 mb-2.5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                &ldquo;A little piece of you, captured in pencil.&rdquo;
              </p>

              <div className="flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium border border-amber-900/40 text-amber-200/80 bg-amber-950/20 active:scale-95 cursor-pointer"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  ↺ Watch again
                </button>

                <a
                  href={ARTWORK_SRC}
                  download="Keerthana-Pencil-Portrait.webp"
                  className="px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium border border-amber-600/50 text-amber-100 bg-amber-900/40 active:scale-95 cursor-pointer"
                  style={{ fontFamily: "'Manrope', sans-serif", textDecoration: 'none' }}
                >
                  ↓ Keep
                </a>
              </div>

              <button
                type="button"
                onClick={onComplete}
                className="mt-2 text-[10px] uppercase tracking-[0.26em] font-medium text-amber-200/50 hover:text-amber-200 transition-colors py-1 cursor-pointer"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Continue the journey →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </motion.div>
  );
}

// ─── Root Orchestrator: ArtistChapter ─────────────────────────────────────────
export function ArtistChapter() {
  const { next } = useScene();
  const reducedMotion = useReducedMotion();
  const [act, setAct] = useState('studio'); // 'studio' | 'reveal'

  const handleBegin = useCallback(() => {
    setAct('reveal');
  }, []);

  const handleComplete = useCallback(() => {
    next();
  }, [next]);

  return (
    <AnimatePresence mode="wait">
      {act === 'studio' && (
        <StudioEntrance
          key="studio"
          onBegin={handleBegin}
          reducedMotion={reducedMotion}
        />
      )}
      {act === 'reveal' && (
        <StudioReveal
          key="reveal"
          onComplete={handleComplete}
          reducedMotion={reducedMotion}
        />
      )}
    </AnimatePresence>
  );
}

export default ArtistChapter;
