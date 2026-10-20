import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '../context/SceneContext';
import { chapter1Data, chapter2Data } from '../data/memories';
import { MemoryBook } from '../components/memory-engine/MemoryBook';
import { ScrapbookExperience } from '../components/memory-engine/ScrapbookExperience';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─────────────────────────────────────────────────────────────────────────────
// Chapter One Cover Card — "Just You"  (redesigned editorial full-screen cover)
// Warm ivory base, blush accents, muted rose, restrained champagne, paper grain.
// Deliberately art-directed: large display title, four-corner hairlines,
// animated horizontal rule, three-stage identity, explicit Enter button.
// No auto-dismiss timer — the recipient reads at their own pace.
// ─────────────────────────────────────────────────────────────────────────────
function JournalCoverCard({ onDismiss }) {
  const reducedMotion = useReducedMotion();

  // Stagger for the sequential text reveals
  const stagger = reducedMotion ? 0 : 1;

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center select-none"
      style={{
        background:
          'radial-gradient(ellipse 110% 90% at 55% 25%, #FFFDFB 0%, #FAF7F2 55%, #F2EBE5 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.015 }}
      transition={{ duration: reducedMotion ? 0.3 : 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Paper grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.032] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Warm top-left atmospheric blush glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 10% 8%, rgba(245,184,168,0.11) 0%, transparent 70%)',
        }}
      />

      {/* Champagne bottom-right warmth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 92% 95%, rgba(243,217,162,0.09) 0%, transparent 65%)',
        }}
      />

      {/* ── Four-corner hairline frame ── */}
      {/* Outer border rectangle — visible inset */}
      <div className="absolute inset-5 sm:inset-8 lg:inset-12 border border-[#F5B8A8]/28 pointer-events-none" />
      {/* Corner accent marks — small L-shapes at each corner */}
      {/* Top-left */}
      <div className="absolute top-5 left-5 sm:top-8 sm:left-8 lg:top-12 lg:left-12 w-6 h-6 sm:w-8 sm:h-8 border-t border-l border-[#F5B8A8]/55 pointer-events-none" />
      {/* Top-right */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 lg:top-12 lg:right-12 w-6 h-6 sm:w-8 sm:h-8 border-t border-r border-[#F5B8A8]/55 pointer-events-none" />
      {/* Bottom-left */}
      <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 lg:bottom-12 lg:left-12 w-6 h-6 sm:w-8 sm:h-8 border-b border-l border-[#F5B8A8]/55 pointer-events-none" />
      {/* Bottom-right */}
      <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 lg:bottom-12 lg:right-12 w-6 h-6 sm:w-8 sm:h-8 border-b border-r border-[#F5B8A8]/55 pointer-events-none" />

      {/* ── Central Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-10 lg:px-16 max-w-3xl w-full">

        {/* Chapter label */}
        <motion.span
          className="text-[#8B4860]/65 text-[10px] sm:text-[11px] uppercase tracking-[0.42em] font-medium mb-5 sm:mb-6"
          style={{ fontFamily: "'Manrope', sans-serif" }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          Chapter One
        </motion.span>

        {/* Large display title */}
        <motion.h1
          className="text-[#45152D] font-normal italic leading-none tracking-tight mb-5 sm:mb-6"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
          }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.28 * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          Just You
        </motion.h1>

        {/* Animated horizontal rule */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[#F5B8A8] to-transparent mb-5 sm:mb-6"
          style={{ width: 'clamp(48px, 10vw, 96px)' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.42 * stagger, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Subtitle */}
        <motion.p
          className="text-[#8B4860]/80 text-sm sm:text-base lg:text-lg font-light leading-relaxed tracking-wide max-w-xs sm:max-w-sm lg:max-w-md mb-5 sm:mb-7"
          style={{ fontFamily: "'Manrope', sans-serif" }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.54 * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          A portrait journal celebrating Keerthana
        </motion.p>

        {/* Three-stage identity pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-9 sm:mb-11"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.66 * stagger }}
        >
          {['Little Beginnings', 'Growing Up', 'Today'].map((stage, i) => (
            <React.Fragment key={stage}>
              <span
                className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#8B4860]/55 font-medium"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {stage}
              </span>
              {i < 2 && (
                <span className="block w-1 h-1 rounded-full bg-[#F5B8A8]/60" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Enter button — explicit action, no auto-dismiss */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="group relative px-7 sm:px-9 py-3 sm:py-3.5 rounded-full border border-[#45152D]/25 text-[#45152D] text-[11px] sm:text-xs uppercase tracking-[0.28em] font-medium hover:bg-[#45152D] hover:text-[#FFFDF9] active:scale-95 transition-all duration-300 shadow-[0_2px_12px_rgba(69,21,45,0.08)]"
          style={{ fontFamily: "'Manrope', sans-serif" }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          Open Journal →
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Meaningful Chapter Transition — "Before our story..."
//
// 1. Warm portrait-journal colours transition into sky-blue & cream
// 2. Handwritten message appears:
//    "Before our story, there was you. Now, a little piece of our story."
// 3. Smooth entrance into Chapter Two (Us)
// ─────────────────────────────────────────────────────────────────────────────
function ChapterTransitionScreen({ onContinue }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer"
      initial={{
        background:
          'radial-gradient(ellipse at 50% 30%, #FFFDFB 0%, #FAF7F2 65%, #F4ECE6 100%)',
      }}
      animate={{
        background:
          'radial-gradient(ellipse at 50% 20%, #F4F8FC 0%, #EBF3FA 55%, #FAF7EE 100%)',
      }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
      transition={{ duration: reducedMotion ? 0.4 : 1.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={onContinue}
    >
      {/* Paper grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Washi Tape accent on the transition card */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-7 pointer-events-none rounded-sm shadow-sm"
        style={{
          background: 'rgba(254, 243, 199, 0.9)',
          borderLeft: '1px dashed rgba(0,0,0,0.15)',
          borderRight: '1px dashed rgba(0,0,0,0.15)',
          transform: 'rotate(-1deg)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-md w-full bg-[#FFFDF9]/95 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(30,41,59,0.12),0_4px_16px_rgba(0,0,0,0.04)] border border-[#E2E8F0]/80 flex flex-col items-center"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 24, scale: reducedMotion ? 1 : 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -16, scale: reducedMotion ? 1 : 1.02 }}
        transition={{ duration: reducedMotion ? 0.3 : 1.1, delay: reducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="text-[#E94B70] text-[11px] uppercase tracking-[0.35em] font-semibold mb-5"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          A New Chapter
        </span>

        {/* The Exact Handwritten Transition Message */}
        <h2
          className="text-[#1E293B] text-2xl sm:text-3xl sm:leading-snug font-semibold tracking-wide mb-6"
          style={{
            fontFamily: "'Dancing Script', cursive",
            lineHeight: '1.45',
          }}
        >
          "Before our story, there was you.
          <br />
          <span className="text-[#E94B70]">
            Now, a little piece of our story."
          </span>
        </h2>

        <div className="w-14 h-px bg-[#CBD5E1] my-1" />

        <p
          className="text-xs uppercase tracking-[0.25em] text-[#64748B] mt-4 font-medium"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Chapter Two · Us
        </p>

        {/* Enter Our Story Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onContinue();
          }}
          className="mt-8 px-6 py-2.5 rounded-full bg-[#1E293B] text-[#FFFDF9] text-xs uppercase tracking-[0.2em] font-medium shadow-md hover:bg-[#334155] active:scale-95 transition-all flex items-center gap-2"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Enter Our Story →
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Memory Journey Orchestrator
// ─────────────────────────────────────────────────────────────────────────────
export function MemoryJourney({ chapterIndex: propChapterIndex }) {
  const { next, currentScene } = useScene();

  // Resolve active chapter index
  const activeChapterIndex =
    propChapterIndex !== undefined
      ? propChapterIndex
      : currentScene === 'MEMORY_JOURNEY_TOGETHER'
      ? 1
      : 0;

  // Chapter 1 states
  const [showChapter1Cover, setShowChapter1Cover] = useState(activeChapterIndex === 0);

  // Chapter 2 states
  const [showChapter2Transition, setShowChapter2Transition] = useState(
    activeChapterIndex === 1
  );

  // Handle Chapter 1 completion -> navigate to Chapter 2
  const handleChapter1Complete = () => {
    next();
  };

  // Handle Chapter 2 completion -> continue to ArtistChapter
  const handleChapter2Complete = () => {
    next();
  };


  // ── Render Chapter One: "Just You" ──
  if (activeChapterIndex === 0) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          {showChapter1Cover ? (
            <JournalCoverCard
              key="ch1-cover"
              onDismiss={() => setShowChapter1Cover(false)}
            />
          ) : (
            <MemoryBook
              key="book-just-you"
              photos={chapter1Data.photos}
              initialChapterData={chapter1Data}
              theme="journal"
              onComplete={handleChapter1Complete}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Render Chapter Two: "Us" ──
  return (
    <div className="fixed inset-0 w-full h-full">
      <AnimatePresence mode="wait">
        {showChapter2Transition ? (
          <ChapterTransitionScreen
            key="ch2-transition"
            onContinue={() => setShowChapter2Transition(false)}
          />
        ) : (
          <ScrapbookExperience
            key="scrapbook-us"
            chapterData={chapter2Data}
            onComplete={handleChapter2Complete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
