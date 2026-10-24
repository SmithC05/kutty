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
 * Every phrase is short (1 to 5 words), emotionally direct, and unique (no duplicates).
 *
 * Enforced Cohesive Palette:
 * - Primary text: Warm ivory (#fdfbf7)
 * - Secondary text: Muted ivory-grey (#d6d3d1 / #a8a29e)
 * - Single accent: Soft lavender (#c4b5fd / #a78bfa)
 *
 * Progressive Accumulation & Collision-Free Spatial Layout:
 * - Once each phrase appears, it stays visible until the end of the scene.
 * - Every single phrase has a dedicated, non-overlapping spatial slot in the left or right flanks,
 *   completely clear of the central headline and photo cutout.
 */
const KINETIC_PHRASES = [
  // ── Wave 1: 2.8s – 8.0s (The Foundation of Close Friendship) ────────────────
  {
    id: 'phrase-1',
    text: 'My best friend',
    startTime: 2.8,
    fontClass: "font-['Outfit',sans-serif] font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-tight",
    colorClass: 'text-[#fdfbf7] drop-shadow-[0_0_20px_rgba(253,251,247,0.35)]',
    desktopPos: { top: '11%', left: '5%' },
    mobilePos: { top: '8%', left: '4%' },
    motionType: 'slide-right',
  },
  {
    id: 'phrase-2',
    text: 'My safe place',
    startTime: 4.0,
    fontClass: "font-['Playfair_Display',serif] italic font-semibold text-lg sm:text-xl lg:text-2xl tracking-normal",
    colorClass: 'text-violet-200 drop-shadow-[0_0_20px_rgba(196,181,253,0.35)]',
    desktopPos: { top: '11%', right: '5%' },
    mobilePos: { top: '8%', right: '4%' },
    motionType: 'blur-fade',
  },
  {
    id: 'phrase-3',
    text: 'COMFORT',
    startTime: 5.2,
    fontClass: "font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl lg:text-4xl tracking-widest uppercase",
    colorClass: 'text-violet-300 drop-shadow-[0_0_24px_rgba(196,181,253,0.45)]',
    desktopPos: { top: '20%', left: '7%' },
    mobilePos: { top: '17%', left: '4%' },
    motionType: 'scale-up',
  },
  {
    id: 'phrase-4',
    text: 'My courage',
    startTime: 6.4,
    fontClass: "font-['Outfit',sans-serif] font-bold text-lg sm:text-xl lg:text-2xl tracking-tight",
    colorClass: 'text-stone-200 drop-shadow-[0_0_18px_rgba(231,229,228,0.3)]',
    desktopPos: { top: '20%', right: '7%' },
    mobilePos: { top: '17%', right: '4%' },
    motionType: 'slide-left',
  },
  {
    id: 'phrase-5',
    text: 'Unfiltered laughter',
    startTime: 7.6,
    fontClass: "font-['Dancing_Script',cursive] font-bold text-xl sm:text-2xl lg:text-3xl tracking-wide",
    colorClass: 'text-[#fdfbf7] drop-shadow-[0_0_22px_rgba(253,251,247,0.4)]',
    desktopPos: { top: '61%', left: '5%' },
    mobilePos: { top: '24%', left: '5%' },
    motionType: 'rotate-drift',
  },

  // ── Wave 2: 8.8s – 14.5s (Peace, Strength & Motivation) ─────────────────────
  {
    id: 'phrase-6',
    text: 'My peace',
    startTime: 8.8,
    fontClass: "font-['Playfair_Display',serif] italic font-semibold text-xl sm:text-2xl lg:text-3xl tracking-normal",
    colorClass: 'text-violet-200 drop-shadow-[0_0_20px_rgba(196,181,253,0.35)]',
    desktopPos: { top: '61%', right: '5%' },
    mobilePos: { top: '24%', right: '5%' },
    motionType: 'blur-fade',
  },
  {
    id: 'phrase-7',
    text: 'My motivation',
    startTime: 10.0,
    fontClass: "font-['Outfit',sans-serif] font-bold text-lg sm:text-xl lg:text-2xl tracking-tight",
    colorClass: 'text-stone-300 drop-shadow-[0_0_18px_rgba(214,211,209,0.3)]',
    desktopPos: { top: '30%', left: '4%' },
    mobilePos: { top: '31%', left: '4%' },
    motionType: 'scale-up',
  },
  {
    id: 'phrase-8',
    text: 'MY STRENGTH',
    startTime: 11.2,
    fontClass: "font-['Outfit',sans-serif] font-black text-xl sm:text-2xl lg:text-3xl tracking-wider uppercase",
    colorClass: 'text-violet-300 drop-shadow-[0_0_22px_rgba(196,181,253,0.4)]',
    desktopPos: { top: '30%', right: '4%' },
    mobilePos: { top: '31%', right: '4%' },
    motionType: 'slide-left',
  },
  {
    id: 'phrase-9',
    text: 'The one who understands me',
    startTime: 12.5,
    fontClass: "font-['DM_Sans',sans-serif] font-medium text-sm sm:text-base lg:text-lg tracking-tight",
    colorClass: 'text-stone-300 drop-shadow-[0_0_16px_rgba(214,211,209,0.3)]',
    desktopPos: { top: '71%', left: '6%' },
    mobilePos: { top: '38%', left: '4%' },
    motionType: 'slide-right',
  },
  {
    id: 'phrase-10',
    text: 'Someone who believes in me',
    startTime: 13.8,
    fontClass: "font-['DM_Sans',sans-serif] font-medium text-sm sm:text-base lg:text-lg tracking-tight",
    colorClass: 'text-stone-300 drop-shadow-[0_0_16px_rgba(214,211,209,0.3)]',
    desktopPos: { top: '71%', right: '6%' },
    mobilePos: { top: '38%', right: '4%' },
    motionType: 'slide-left',
  },

  // ── Wave 3: 15.0s – 19.5s (Supporter, Constant & Happiness) ─────────────────
  {
    id: 'phrase-11',
    text: 'My biggest supporter',
    startTime: 15.0,
    fontClass: "font-['Outfit',sans-serif] font-extrabold text-lg sm:text-xl lg:text-2xl tracking-tight",
    colorClass: 'text-[#fdfbf7] drop-shadow-[0_0_20px_rgba(253,251,247,0.35)]',
    desktopPos: { top: '40%', left: '6%' },
    mobilePos: { bottom: '26%', left: '4%' },
    motionType: 'slide-right',
  },
  {
    id: 'phrase-12',
    text: 'My happiness',
    startTime: 16.2,
    fontClass: "font-['Dancing_Script',cursive] font-bold text-xl sm:text-2xl lg:text-3xl tracking-wide",
    colorClass: 'text-violet-300 drop-shadow-[0_0_22px_rgba(196,181,253,0.4)]',
    desktopPos: { top: '40%', right: '6%' },
    mobilePos: { bottom: '26%', right: '4%' },
    motionType: 'rotate-drift',
  },
  {
    id: 'phrase-13',
    text: 'MY CONSTANT',
    startTime: 17.5,
    fontClass: "font-['Outfit',sans-serif] font-black text-xl sm:text-2xl lg:text-3xl tracking-widest uppercase",
    colorClass: 'text-[#fdfbf7] drop-shadow-[0_0_22px_rgba(253,251,247,0.4)]',
    desktopPos: { top: '81%', left: '5%' },
    mobilePos: { bottom: '18%', left: '4%' },
    motionType: 'scale-up',
  },
  {
    id: 'phrase-14',
    text: 'My inspiration',
    startTime: 18.8,
    fontClass: "font-['Playfair_Display',serif] italic font-semibold text-lg sm:text-xl lg:text-2xl tracking-normal",
    colorClass: 'text-violet-200 drop-shadow-[0_0_18px_rgba(196,181,253,0.35)]',
    desktopPos: { top: '81%', right: '5%' },
    mobilePos: { bottom: '18%', right: '4%' },
    motionType: 'blur-fade',
  },

  // ── Wave 4: 20.0s – 23.5s (Chosen Family, Warmth & Peace) ───────────────────
  {
    id: 'phrase-15',
    text: 'My chosen family',
    startTime: 20.0,
    fontClass: "font-['Dancing_Script',cursive] font-bold text-xl sm:text-2xl lg:text-3xl tracking-wide",
    colorClass: 'text-[#fdfbf7] drop-shadow-[0_0_22px_rgba(253,251,247,0.4)]',
    desktopPos: { top: '50%', left: '5%' },
    mobilePos: { bottom: '10%', left: '4%' },
    motionType: 'rotate-drift',
  },
  {
    id: 'phrase-16',
    text: 'Someone I can lean on',
    startTime: 21.2,
    fontClass: "font-['DM_Sans',sans-serif] font-normal text-xs sm:text-sm lg:text-base tracking-tight",
    colorClass: 'text-stone-300 drop-shadow-[0_0_16px_rgba(214,211,209,0.3)]',
    desktopPos: { top: '50%', right: '5%' },
    mobilePos: { bottom: '10%', right: '4%' },
    motionType: 'slide-left',
  },
  {
    id: 'phrase-17',
    text: 'Pure warmth',
    startTime: 22.4,
    fontClass: "font-['Playfair_Display',serif] italic font-semibold text-base sm:text-lg lg:text-xl tracking-normal",
    colorClass: 'text-violet-200 drop-shadow-[0_0_18px_rgba(196,181,253,0.35)]',
    desktopPos: { top: '90%', left: '7%' },
    mobilePos: { top: '44%', left: '4%' },
    motionType: 'blur-fade',
  },
  {
    id: 'phrase-18',
    text: 'My calm in the chaos',
    startTime: 23.4,
    fontClass: "font-['Outfit',sans-serif] font-bold text-sm sm:text-base lg:text-lg tracking-tight",
    colorClass: 'text-stone-300 drop-shadow-[0_0_16px_rgba(214,211,209,0.3)]',
    desktopPos: { top: '90%', right: '7%' },
    mobilePos: { top: '44%', right: '4%' },
    motionType: 'scale-up',
  },
  {
    id: 'phrase-19',
    text: 'A part of my happiest memories',
    startTime: 24.2,
    fontClass: "font-['DM_Sans',sans-serif] font-medium text-[11px] sm:text-xs lg:text-sm tracking-widest uppercase",
    colorClass: 'text-stone-400 drop-shadow-[0_0_14px_rgba(168,162,158,0.25)]',
    desktopPos: { top: '5%', left: '16%' },
    mobilePos: { top: '4%', left: '5%' },
    motionType: 'blur-fade',
  },

  // ── Wave 5: 25.0s – 27.0s (Climax Spotlight) ────────────────────────────────
  {
    id: 'phrase-20',
    text: 'Simply, Kutty. ❤️',
    startTime: 25.0,
    fontClass: "font-['Dancing_Script',cursive] font-bold text-2xl sm:text-3xl lg:text-4xl tracking-wide text-right",
    colorClass: 'text-[#fdfbf7] drop-shadow-[0_0_30px_rgba(196,181,253,0.7)]',
    desktopPos: { top: '5%', right: '16%' },
    mobilePos: { top: '3.5%', right: '5%' },
    motionType: 'climax-pulse',
  },
];

/**
 * WhoIsSheScene
 *
 * Full-screen 27-second cinematic kinetic typography experience.
 *
 * Key Architecture:
 * - Top Label: "WHO IS SHE" in an elegant glass pill badge.
 * - Central Headline: "MY FAVOURITE PERSON" placed in the center behind the photo cutout,
 *   completely readable across two balanced lines.
 * - Foreground Photo Cutout: Spider-Man duo cutout reduced by ~18% so it anchors the scene
 *   without dominating or obscuring typography.
 * - Monochromatic Palette: Warm ivory (#fdfbf7), stone grey, and soft lavender (#c4b5fd).
 * - Progressive Accumulation: 20 unique phrases enter sequentially and stay visible,
 *   filling the left and right flanks with zero collisions.
 * - No visible timer: Automatic 27-second internal timer transitions to SCENES.FINAL_MESSAGE.
 */
export function WhoIsSheScene() {
  const { transitionTo } = useScene();
  const { playTrack } = useAudio();
  const reducedMotion = useReducedMotion();
  const { width } = useWindowSize();
  const isMobile = typeof width === 'number' && width < 768;
  const transitionedRef = useRef(false);

  // Play 'metro' background audio across this scene
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

  // Exact 27-second internal timeline: automatically transitions to Final Celebration
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
        {/* Soft radial ambient lavender glow centered behind the composition */}
        <div
          className="absolute inset-0 opacity-45"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, rgba(167, 139, 250, 0.12) 0%, rgba(139, 92, 246, 0.06) 45%, transparent 72%)',
          }}
        />
        <div className="absolute -left-24 top-1/4 h-[30rem] w-[30rem] rounded-full bg-violet-600/[0.08] blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[32rem] w-[32rem] rounded-full bg-violet-500/[0.07] blur-3xl" />
        <div className="absolute left-1/3 top-0 h-72 w-72 rounded-full bg-purple-600/[0.05] blur-3xl" />

        {/* Ambient floating dust / particle sparks in warm ivory */}
        <div className="absolute inset-0 opacity-25">
          {[
            { top: '15%', left: '10%', size: 3, duration: 4 },
            { top: '22%', right: '14%', size: 2.5, duration: 5 },
            { top: '75%', left: '12%', size: 3.5, duration: 4.5 },
            { top: '65%', right: '22%', size: 3, duration: 3.5 },
            { top: '38%', left: '42%', size: 2, duration: 6 },
            { top: '82%', right: '8%', size: 3, duration: 4 },
          ].map((spark, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-[#fdfbf7]/80 shadow-[0_0_8px_rgba(253,251,247,0.85)] animate-pulse"
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
              'radial-gradient(circle at center, transparent 38%, rgba(3, 4, 8, 0.92) 100%)',
          }}
        />

        {/* Subtle film grain texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
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
          className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-stone-300 transition hover:bg-white/[0.12] hover:text-[#fdfbf7] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 cursor-pointer backdrop-blur-md shadow-lg"
          aria-label="Back to Us"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Us</span>
        </button>

        {/* Top Label: "WHO IS SHE" */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/[0.06] px-3.5 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/90 backdrop-blur-md font-['Outfit',sans-serif] shadow-lg">
          <Sparkles className="h-3 w-3 text-violet-300" />
          <span>WHO IS SHE</span>
        </div>

        {/* Skip to Celebration */}
        <button
          type="button"
          onClick={handleContinueToCelebration}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-stone-300 transition hover:bg-white/[0.12] hover:text-[#fdfbf7] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 cursor-pointer backdrop-blur-md shadow-lg"
          aria-label="Skip to Celebration"
        >
          <span>Skip to Celebration</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* ── 3. MAIN COMPOSITION STAGE (FULL SCREEN VIEWPORT) ── */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        {/*
          LAYER 1: CENTRAL HEADLINE "MY FAVOURITE PERSON" (z-10)
          Positioned in the upper-center behind the photo cutout.
          Two deliberate, balanced lines ensuring the entire phrase is completely readable.
        */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[15%] sm:top-[17%] md:top-[19%] z-10 flex flex-col items-center justify-start px-4"
          aria-label="My Favourite Person"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 25,
              filter: reducedMotion ? 'none' : 'blur(14px)',
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
            }}
            transition={{
              duration: reducedMotion ? 0.3 : 1.1,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col items-center justify-center text-center select-none max-w-5xl md:max-w-6xl w-full"
          >
            <h1
              className="font-['Outfit',sans-serif] font-black uppercase tracking-tight text-[#fdfbf7] text-center leading-[0.88] select-none text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem]"
              style={{
                textShadow:
                  '0 10px 40px rgba(0, 0, 0, 0.9), 0 0 50px rgba(196, 181, 253, 0.14)',
              }}
            >
              <span className="block tracking-tight">MY FAVOURITE</span>
              <span className="block text-violet-200/95 tracking-wide">PERSON</span>
            </h1>

            {/* Subtle luminous lavender accent bar under headline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2.5 sm:mt-4 h-1 w-24 sm:w-36 md:w-48 rounded-full"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(196, 181, 253, 0.8), transparent)',
                boxShadow: '0 0 14px rgba(196, 181, 253, 0.4)',
              }}
            />
          </motion.div>
        </div>

        {/*
          LAYER 2: FOREGROUND PHOTO CUTOUT (z-20)
          The cutout of both people wearing the Spider-Man filters.
          Scaled down by ~18% so it anchors the scene without dominating typography.
          Layered in the foreground (z-20) so the typography passes behind them.
        */}
        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 35,
            scale: reducedMotion ? 1 : 0.94,
            filter: reducedMotion ? 'none' : 'blur(14px)',
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}
          transition={{
            duration: reducedMotion ? 0.3 : 1.1,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center items-end h-full px-2 sm:px-6"
        >
          {/* Subtle lavender ambient aura glowing behind the people */}
          <div
            className="absolute bottom-6 h-72 w-72 sm:h-80 sm:w-80 md:h-[26rem] md:w-[26rem] rounded-full opacity-30 blur-3xl pointer-events-none animate-pulse"
            style={{
              background:
                'radial-gradient(circle, rgba(167, 139, 250, 0.22) 0%, rgba(139, 92, 246, 0.10) 45%, transparent 70%)',
              animationDuration: '5s',
            }}
          />

          {/* Photo Cutout Image — Reduced by ~18% from original size */}
          <div className="relative z-10 flex items-end justify-center h-[42vh] sm:h-[48vh] md:h-[60vh] lg:h-[66vh] max-h-[70vh]">
            <img
              src="/images/shared-photos/spiderman-cutout.png"
              alt="Kutty and me with Spider-Man filter"
              className="h-full w-auto max-w-none md:max-w-full object-contain object-bottom select-none pointer-events-none drop-shadow-[0_18px_40px_rgba(0,0,0,0.92)] drop-shadow-[0_0_30px_rgba(167,139,250,0.18)]"
              onError={(e) => {
                e.currentTarget.src = '/images/shared-photos/spiderman-duo.jpg';
              }}
            />
          </div>
        </motion.div>

        {/*
          LAYER 3: FLOATING KINETIC PHRASES (z-25)
          Intelligent collision-free spatial distribution:
          Each phrase enters once and remains static and visible, turning the screen
          into an accumulated poetic tapestry framing the headline and photo.
        */}
        <div className="pointer-events-none absolute inset-0 z-25 overflow-hidden" aria-hidden="true">
          {KINETIC_PHRASES.map((phrase) => {
            // Motion entrance parameters
            let initialProps = { opacity: 0, y: 12 };
            let animateProps = { opacity: 1, y: 0 };

            if (!reducedMotion) {
              if (phrase.motionType === 'slide-right') {
                initialProps = { opacity: 0, x: -24, y: -4 };
                animateProps = { opacity: 1, x: 0, y: 0 };
              } else if (phrase.motionType === 'slide-left') {
                initialProps = { opacity: 0, x: 24, y: -4 };
                animateProps = { opacity: 1, x: 0, y: 0 };
              } else if (phrase.motionType === 'rotate-drift') {
                initialProps = { opacity: 0, x: -14, y: 12, rotate: -2, scale: 0.95 };
                animateProps = { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 };
              } else if (phrase.motionType === 'blur-fade') {
                initialProps = { opacity: 0, y: -6, filter: 'blur(8px)', scale: 0.96 };
                animateProps = { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 };
              } else if (phrase.motionType === 'scale-up') {
                initialProps = { opacity: 0, scale: 0.88, y: 10 };
                animateProps = { opacity: 1, scale: 1, y: 0 };
              } else if (phrase.motionType === 'climax-pulse') {
                initialProps = { opacity: 0, scale: 0.9, y: 12 };
                animateProps = { opacity: 1, scale: 1, y: 0 };
              }
            } else {
              initialProps = { opacity: 0 };
              animateProps = { opacity: 1 };
            }

            const activePosition = isMobile ? phrase.mobilePos : phrase.desktopPos;

            return (
              <motion.div
                key={phrase.id}
                initial={initialProps}
                animate={animateProps}
                transition={{
                  duration: reducedMotion ? 0.35 : 0.8,
                  delay: phrase.startTime,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`absolute max-w-[200px] sm:max-w-xs md:max-w-sm select-none leading-tight ${phrase.fontClass} ${phrase.colorClass}`}
                style={activePosition}
              >
                {phrase.text}
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default WhoIsSheScene;
