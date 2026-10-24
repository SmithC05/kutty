import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useScene, useAudio } from '../context';
import { SCENES } from '../constants';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useWindowSize } from '../hooks/useWindowSize';

/**
 * KINETIC_PHRASES
 *
 * Central data array for the 27-second kinetic typography experience.
 * Every phrase is short (1 to 3 words), emotionally direct, and completely unique (no duplicates).
 * Stored centrally for easy maintenance.
 *
 * Bounded responsive positioning ensures phrases fill the viewport intentionally across desktop
 * and mobile, framing the central photo and title without colliding or escaping the viewport.
 */
const KINETIC_PHRASES = [
  // ── Wave 1: 3.2s – 8.2s (The Foundation of Close Friendship) ────────────────
  {
    id: 'phrase-1',
    text: 'My best friend',
    startTime: 3.2,
    duration: 4.6,
    fontClass: "font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight",
    colorClass: 'text-amber-100 drop-shadow-[0_0_24px_rgba(254,243,199,0.5)]',
    desktopPos: { top: '14%', left: '6%' },
    mobilePos: { top: '11%', left: '6%' },
    motionType: 'slide-right',
  },
  {
    id: 'phrase-2',
    text: 'My safe place',
    startTime: 4.4,
    duration: 4.6,
    fontClass: "font-['Playfair_Display',serif] italic font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-normal",
    colorClass: 'text-emerald-200 drop-shadow-[0_0_22px_rgba(167,243,208,0.45)]',
    desktopPos: { top: '13%', right: '10%' },
    mobilePos: { top: '11%', right: '6%' },
    motionType: 'blur-fade',
  },
  {
    id: 'phrase-3',
    text: 'My favourite person',
    startTime: 5.8,
    duration: 4.6,
    fontClass: "font-['Dancing_Script',cursive] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide",
    colorClass: 'text-rose-200 drop-shadow-[0_0_26px_rgba(251,113,133,0.5)]',
    desktopPos: { bottom: '26%', left: '6%' },
    mobilePos: { top: '22%', left: '6%' },
    motionType: 'rotate-drift',
  },

  // ── Wave 2: 8.4s – 13.8s (Strength, Comfort & Peace) ────────────────────────
  {
    id: 'phrase-4',
    text: 'COMFORT',
    startTime: 8.4,
    duration: 4.5,
    fontClass: "font-['Outfit',sans-serif] font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-widest uppercase",
    colorClass: 'text-amber-300 drop-shadow-[0_0_32px_rgba(253,224,71,0.6)]',
    desktopPos: { top: '14%', left: '8%' },
    mobilePos: { top: '11%', left: '6%' },
    motionType: 'scale-up',
  },
  {
    id: 'phrase-5',
    text: 'My courage',
    startTime: 9.6,
    duration: 4.5,
    fontClass: "font-['Outfit',sans-serif] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight",
    colorClass: 'text-violet-200 drop-shadow-[0_0_24px_rgba(196,181,253,0.5)]',
    desktopPos: { top: '14%', right: '12%' },
    mobilePos: { top: '18%', right: '6%' },
    motionType: 'slide-left',
  },
  {
    id: 'phrase-6',
    text: 'My peace',
    startTime: 10.8,
    duration: 4.4,
    fontClass: "font-['Playfair_Display',serif] italic font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-normal",
    colorClass: 'text-teal-200 drop-shadow-[0_0_24px_rgba(153,246,228,0.45)]',
    desktopPos: { bottom: '24%', left: '8%' },
    mobilePos: { top: '25%', left: '7%' },
    motionType: 'blur-fade',
  },
  {
    id: 'phrase-7',
    text: 'My motivation',
    startTime: 12.0,
    duration: 4.4,
    fontClass: "font-['DM_Sans',sans-serif] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight",
    colorClass: 'text-pink-200 drop-shadow-[0_0_22px_rgba(244,114,182,0.45)]',
    desktopPos: { top: '60%', left: '7%' },
    mobilePos: { top: '32%', right: '6%' },
    motionType: 'scale-up',
  },

  // ── Wave 3: 13.8s – 19.4s (Loyalty, Constant Presence & Joy) ────────────────
  {
    id: 'phrase-8',
    text: 'My biggest supporter',
    startTime: 13.8,
    duration: 4.6,
    fontClass: "font-['Outfit',sans-serif] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight",
    colorClass: 'text-amber-200 drop-shadow-[0_0_26px_rgba(252,211,77,0.5)]',
    desktopPos: { top: '14%', left: '8%' },
    mobilePos: { top: '11%', left: '6%' },
    motionType: 'slide-right',
  },
  {
    id: 'phrase-9',
    text: 'My happiness',
    startTime: 15.2,
    duration: 4.4,
    fontClass: "font-['Dancing_Script',cursive] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide",
    colorClass: 'text-rose-200 drop-shadow-[0_0_28px_rgba(251,113,133,0.5)]',
    desktopPos: { top: '13%', right: '10%' },
    mobilePos: { top: '18%', right: '6%' },
    motionType: 'rotate-drift',
  },
  {
    id: 'phrase-10',
    text: 'MY CONSTANT',
    startTime: 16.6,
    duration: 4.4,
    fontClass: "font-['Outfit',sans-serif] font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-widest uppercase",
    colorClass: 'text-slate-100 drop-shadow-[0_0_24px_rgba(255,255,255,0.5)]',
    desktopPos: { bottom: '22%', left: '7%' },
    mobilePos: { top: '26%', left: '6%' },
    motionType: 'scale-up',
  },

  // ── Wave 4: 19.4s – 23.8s (Chosen Family & Inspiration) ─────────────────────
  {
    id: 'phrase-11',
    text: 'My chosen family',
    startTime: 19.4,
    duration: 4.2,
    fontClass: "font-['Dancing_Script',cursive] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide",
    colorClass: 'text-amber-200 drop-shadow-[0_0_28px_rgba(253,224,71,0.55)]',
    desktopPos: { top: '14%', left: '8%' },
    mobilePos: { top: '12%', left: '6%' },
    motionType: 'rotate-drift',
  },
  {
    id: 'phrase-12',
    text: 'My inspiration',
    startTime: 20.6,
    duration: 4.0,
    fontClass: "font-['Playfair_Display',serif] italic font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-normal",
    colorClass: 'text-violet-200 drop-shadow-[0_0_24px_rgba(196,181,253,0.5)]',
    desktopPos: { top: '14%', right: '12%' },
    mobilePos: { top: '20%', right: '6%' },
    motionType: 'blur-fade',
  },

  // ── Wave 5: 23.5s – 26.8s (The Climax — Emotional Spotlight) ────────────────
  {
    id: 'phrase-13',
    text: 'Simply, Kutty. ❤️',
    startTime: 23.5,
    duration: 3.3,
    fontClass: "font-['Dancing_Script',cursive] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide",
    colorClass: 'text-white drop-shadow-[0_0_40px_rgba(244,63,94,0.85)]',
    desktopPos: { bottom: '15%', left: '8%' },
    mobilePos: { top: '16%', left: '50%', transform: 'translateX(-50%)' },
    motionType: 'climax-pulse',
  },
];

/**
 * Title Lines Definition for Staggered Editorial Reveal
 * "WHO IS SHE TO ME?"
 */
const TITLE_LINES = [
  { text: 'WHO', delay: 0.4 },
  { text: 'IS SHE', delay: 0.8 },
  { text: 'TO ME?', delay: 1.2 },
];

/**
 * WhoIsSheScene
 *
 * Full-screen 27-second cinematic kinetic typography experience inspired by
 * the editorial magazine / Instagram Story subject-overlap reference.
 *
 * Architecture:
 * - Layer 1 (z-0): Deep atmospheric background with radial blooms, floating dust motes & vignette.
 * - Layer 2 (z-10): Giant multi-line typography ("WHO IS SHE TO ME?") spanning behind the subjects.
 * - Layer 3 (z-20): Duo cutout (Spider-Man filter) in foreground, overlapping the typography.
 * - Layer 4 (z-25): Curated kinetic phrases animating in waves across surrounding safe zones.
 * - Layer 5 (z-30): Header controls & bottom 27-second timeline progress bar.
 */
export function WhoIsSheScene() {
  const { transitionTo } = useScene();
  const { playTrack } = useAudio();
  const reducedMotion = useReducedMotion();
  const { width } = useWindowSize();
  const isMobile = typeof width === 'number' && width < 768;
  const transitionedRef = useRef(false);

  // Play 'friendship' background audio across this scene
  useEffect(() => {
    playTrack('metro');
  }, [playTrack]);

  // Safe single-execution forward transition to Final Birthday Celebration
  const handleContinueToCelebration = useCallback(() => {
    if (transitionedRef.current) return;
    transitionedRef.current = true;
    transitionTo(SCENES.FINAL_MESSAGE);
  }, [transitionTo]);

  const handleBackToUs = useCallback(() => {
    transitionedRef.current = true;
    transitionTo(SCENES.MEMORY_JOURNEY_TOGETHER);
  }, [transitionTo]);

  // Exact 27-second timeline: automatically transitions to Final Celebration
  useEffect(() => {
    const timer = setTimeout(() => {
      handleContinueToCelebration();
    }, 27000);

    return () => clearTimeout(timer);
  }, [handleContinueToCelebration]);

  return (
    <main
      className="relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-[#060712] font-['DM_Sans',sans-serif] text-white select-none"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* ── 1. CINEMATIC BACKGROUND & ATMOSPHERE (z-0) ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Soft radial ambient glows matching Spider-Man & editorial palette */}
        <div
          className="absolute inset-0 opacity-55"
          style={{
            background:
              'radial-gradient(circle at 65% 55%, rgba(239, 68, 68, 0.18) 0%, rgba(139, 92, 246, 0.14) 40%, transparent 72%)',
          }}
        />
        <div className="absolute -left-28 top-1/4 h-[34rem] w-[34rem] rounded-full bg-violet-600/[0.14] blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[38rem] w-[38rem] rounded-full bg-rose-600/[0.13] blur-3xl" />
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-cyan-600/[0.08] blur-3xl" />

        {/* Ambient floating dust / particle sparks */}
        <div className="absolute inset-0 opacity-30">
          {[
            { top: '15%', left: '10%', size: 3.5, duration: 4 },
            { top: '22%', right: '14%', size: 3, duration: 5 },
            { top: '75%', left: '12%', size: 4, duration: 4.5 },
            { top: '65%', right: '22%', size: 3, duration: 3.5 },
            { top: '38%', left: '42%', size: 2.5, duration: 6 },
            { top: '82%', right: '8%', size: 3.5, duration: 4 },
          ].map((spark, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse"
              style={{
                top: spark.top,
                left: spark.left,
                right: spark.right,
                width: `${spark.size}px`,
                height: `${spark.size}px`,
                animationDuration: `${spark.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Cinematic dark edge vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, transparent 35%, rgba(3, 4, 8, 0.90) 100%)',
          }}
        />

        {/* Subtle film grain texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* ── 2. HEADER CONTROLS (z-30) ── */}
      <header className="relative z-30 mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Back to Us */}
        <button
          type="button"
          onClick={handleBackToUs}
          className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.12] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 cursor-pointer backdrop-blur-md shadow-lg"
          aria-label="Back to Us"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Us</span>
        </button>

        {/* Center Scene Pill Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300 backdrop-blur-md font-['Outfit',sans-serif] shadow-lg">
          <Sparkles className="h-3 w-3 text-amber-300" />
          <span>A Story in Feelings</span>
        </div>

        {/* Skip to Celebration */}
        <button
          type="button"
          onClick={handleContinueToCelebration}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.12] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 cursor-pointer backdrop-blur-md shadow-lg"
          aria-label="Skip to Celebration"
        >
          <span>Skip to Celebration</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* ── 3. MAIN COMPOSITION STAGE (FULL SCREEN VIEWPORT) ── */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        {/*
          LAYER 1: GIGANTIC EDITORIAL TITLE (z-10)
          Positioned across the canvas, passing BESIDE and PARTIALLY BEHIND the people.
          Desktop: Anchored left-center in stacked lines extending behind the duo cutout.
          Mobile: Striking stacked headline behind the centered cutout.
        */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-start md:justify-center pt-16 md:pt-0 px-4 sm:px-8 md:px-12 lg:px-16"
          aria-label="Who Is She to Me?"
        >
          <div className="w-full max-w-7xl mx-auto flex flex-col items-start justify-center">
            {TITLE_LINES.map((line, idx) => (
              <motion.div
                key={line.text}
                initial={{
                  opacity: 0,
                  y: reducedMotion ? 0 : 36,
                  filter: reducedMotion ? 'none' : 'blur(16px)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                transition={{
                  duration: reducedMotion ? 0.3 : 1.1,
                  delay: line.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`font-['Outfit',sans-serif] font-black uppercase tracking-tight text-white/95 leading-[0.84] select-none ${
                  idx === 0
                    ? 'text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]'
                    : idx === 1
                    ? 'text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9.5rem] text-slate-100'
                    : 'text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9.5rem] bg-gradient-to-r from-white via-rose-100 to-rose-200 bg-clip-text text-transparent'
                }`}
                style={{
                  textShadow:
                    '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 50px rgba(255, 255, 255, 0.08)',
                }}
              >
                {line.text}
              </motion.div>
            ))}

            {/* Subtle luminous accent bar under title */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="origin-left mt-3 sm:mt-5 h-1 sm:h-1.5 w-24 sm:w-36 md:w-48 rounded-full"
              style={{
                background: 'linear-gradient(to right, #ef4444, #ec4899, #8b5cf6)',
                boxShadow: '0 0 16px rgba(239, 68, 68, 0.55)',
              }}
            />
          </div>
        </div>

        {/*
          LAYER 2: FOREGROUND PHOTO CUTOUT (z-20)
          The cutout of both people wearing the Spider-Man filters.
          Layered in the foreground (z-20) so the typography passes behind them.
          Desktop: Anchored towards the right/center-right at full height.
          Mobile: Anchored at the bottom center.
        */}
        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 45,
            scale: reducedMotion ? 1 : 0.93,
            filter: reducedMotion ? 'none' : 'blur(16px)',
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}
          transition={{
            duration: reducedMotion ? 0.3 : 1.2,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center md:justify-end items-end h-full px-0 sm:px-6 md:px-12 lg:px-20"
        >
          {/* Subtle Spider-Man aura glowing behind the people */}
          <div
            className="absolute right-0 md:right-12 lg:right-24 bottom-12 h-80 w-80 md:h-[32rem] md:w-[32rem] rounded-full opacity-35 blur-3xl pointer-events-none animate-pulse"
            style={{
              background:
                'radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(168, 85, 247, 0.20) 45%, transparent 70%)',
              animationDuration: '4.5s',
            }}
          />

          {/* Photo Cutout Image */}
          <div className="relative z-10 flex items-end justify-center h-[54vh] sm:h-[62vh] md:h-[78vh] lg:h-[85vh] max-h-[88vh]">
            <img
              src="/images/shared-photos/spiderman-cutout.png"
              alt="Kutty and me with Spider-Man filter"
              className="h-full w-auto max-w-none md:max-w-full object-contain object-bottom select-none pointer-events-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.92)] drop-shadow-[0_0_35px_rgba(239,68,68,0.25)]"
              onError={(e) => {
                e.currentTarget.src = '/images/shared-photos/spiderman-duo.jpg';
              }}
            />
          </div>
        </motion.div>

        {/*
          LAYER 3: FLOATING KINETIC PHRASES (z-25)
          Short, bold, unique descriptors appearing in waves around the composition.
          Each phrase appears once with varied cinematic entrances.
        */}
        <div className="pointer-events-none absolute inset-0 z-25 overflow-hidden" aria-hidden="true">
          {KINETIC_PHRASES.map((phrase) => {
            // Motion parameters based on motionType
            let initialProps = { opacity: 0, scale: 0.92 };
            let animateProps = { opacity: [0, 1, 1, 0], scale: [0.92, 1, 1, 0.96] };

            if (!reducedMotion) {
              if (phrase.motionType === 'slide-right') {
                initialProps = { opacity: 0, x: -35, y: -8, scale: 0.92 };
                animateProps = {
                  opacity: [0, 1, 1, 0],
                  x: [-35, 0, 0, 15],
                  y: [-8, 0, 0, -12],
                  scale: [0.92, 1, 1, 0.96],
                };
              } else if (phrase.motionType === 'slide-left') {
                initialProps = { opacity: 0, x: 35, y: -8, scale: 0.92 };
                animateProps = {
                  opacity: [0, 1, 1, 0],
                  x: [35, 0, 0, -15],
                  y: [-8, 0, 0, -12],
                  scale: [0.92, 1, 1, 0.96],
                };
              } else if (phrase.motionType === 'rotate-drift') {
                initialProps = { opacity: 0, x: -20, y: 15, rotate: -3, scale: 0.9 };
                animateProps = {
                  opacity: [0, 1, 1, 0],
                  x: [-20, 0, 0, 10],
                  y: [15, 0, 0, -14],
                  rotate: [-3, 0, 0, 1],
                  scale: [0.9, 1, 1, 0.96],
                };
              } else if (phrase.motionType === 'blur-fade') {
                initialProps = { opacity: 0, y: -12, filter: 'blur(12px)', scale: 0.95 };
                animateProps = {
                  opacity: [0, 1, 1, 0],
                  y: [-12, 0, 0, -16],
                  filter: ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(8px)'],
                  scale: [0.95, 1, 1, 0.98],
                };
              } else if (phrase.motionType === 'scale-up') {
                initialProps = { opacity: 0, scale: 0.82, y: 15 };
                animateProps = {
                  opacity: [0, 1, 1, 0],
                  scale: [0.82, 1, 1, 0.95],
                  y: [15, 0, 0, -12],
                };
              } else if (phrase.motionType === 'climax-pulse') {
                initialProps = { opacity: 0, scale: 0.88, y: 20 };
                animateProps = {
                  opacity: [0, 1, 1, 0.85],
                  scale: [0.88, 1.04, 1.02, 1.0],
                  y: [20, 0, 0, -4],
                };
              }
            } else {
              initialProps = { opacity: 0 };
              animateProps = { opacity: [0, 1, 1, 0] };
            }

            const activePosition = isMobile ? phrase.mobilePos : phrase.desktopPos;

            return (
              <motion.div
                key={phrase.id}
                initial={initialProps}
                animate={animateProps}
                transition={{
                  duration: phrase.duration,
                  delay: phrase.startTime,
                  times: [0, 0.16, 0.82, 1],
                  ease: 'easeInOut',
                }}
                className={`absolute max-w-[220px] sm:max-w-xs md:max-w-sm lg:max-w-md select-none leading-tight ${phrase.fontClass} ${phrase.colorClass}`}
                style={activePosition}
              >
                {phrase.text}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── 4. BOTTOM 27-SECOND TIMELINE PROGRESS BAR (z-30) ── */}
      <footer className="relative z-30 shrink-0 w-full px-4 pb-2 sm:px-6 sm:pb-3">
        <div className="relative mx-auto h-1 w-full max-w-lg overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 27, ease: 'linear' }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-rose-500 to-amber-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
          />
        </div>
      </footer>
    </main>
  );
}

export default WhoIsSheScene;
