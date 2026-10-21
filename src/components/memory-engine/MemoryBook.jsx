import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeImages } from './ImageAnalyzer';
import { generatePages } from './LayoutEngine';
import { MemoryPage } from './MemoryPage';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * MemoryBook — Chapter One: "Just You"
 *
 * Orchestrates the editorial portrait journal experience.
 * Renders a full-screen, page-turning book with:
 *  - Keyboard navigation (←/→ / Space / Enter)
 *  - Paced tap lock (prevents rapid-fire page skipping)
 *  - Clean bottom navigation bar that never overlaps photo content
 *  - onComplete fires exactly once via ref guard
 *  - All timeouts cleaned up on unmount
 */
export function MemoryBook({
  photos = [],
  onComplete,
  theme = 'journal',
}) {
  const [isAnalyzing, setIsAnalyzing]       = useState(true);
  const [pages, setPages]                   = useState([]);
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [canTap, setCanTap]                 = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pageTurnFeedback, setPageTurnFeedback] = useState(false);
  const reducedMotion = useReducedMotion();

  const isScrapbook      = theme === 'scrapbook';
  const lockTimerRef     = useRef(null);
  const transitionRef    = useRef(null);
  const feedbackRef      = useRef(null);
  const completedRef     = useRef(false); // guard: onComplete fires once only

  // 1. Analyze photos → generate layout pages
  useEffect(() => {
    let alive = true;
    setIsAnalyzing(true);
    setCurrentIndex(0);
    completedRef.current = false;

    analyzeImages(photos).then((analyzed) => {
      if (!alive) return;
      // Pass total page count into each page object so MemoryPage can render "02 / 06"
      const raw = generatePages(analyzed, theme);
      const withTotal = raw.map((pg, idx) => ({
        ...pg,
        pageNumber: idx + 1,
        pageTotal:  raw.length,
      }));
      setPages(withTotal);
      setIsAnalyzing(false);
    });

    return () => { alive = false; };
  }, [photos, theme]);

  // 2. Re-lock tap after every page change (allow animation to settle)
  useEffect(() => {
    if (isAnalyzing) return;
    setCanTap(false);
    clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => setCanTap(true), 1500);
    return () => clearTimeout(lockTimerRef.current);
  }, [currentIndex, isAnalyzing]);

  // 3. Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(lockTimerRef.current);
      clearTimeout(transitionRef.current);
      clearTimeout(feedbackRef.current);
    };
  }, []);

  // 4. Advance to next page (or fire onComplete on the last page)
  const advance = useCallback(() => {
    if (!canTap || isTransitioning || isAnalyzing) return;

    setIsTransitioning(true);
    setPageTurnFeedback(true);
    clearTimeout(feedbackRef.current);
    feedbackRef.current = setTimeout(() => setPageTurnFeedback(false), 500);

    if (currentIndex >= pages.length - 1) {
      // Last page — fire completion exactly once
      clearTimeout(transitionRef.current);
      transitionRef.current = setTimeout(() => {
        setIsTransitioning(false);
        if (!completedRef.current) {
          completedRef.current = true;
          if (onComplete) onComplete();
        }
      }, 500);
      return;
    }

    clearTimeout(transitionRef.current);
    transitionRef.current = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(false);
    }, 420);
  }, [canTap, isTransitioning, isAnalyzing, currentIndex, pages.length, onComplete]);

  // 5. Go back one page
  const goBack = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (isTransitioning || isAnalyzing || currentIndex <= 0) return;

      setIsTransitioning(true);
      clearTimeout(transitionRef.current);
      transitionRef.current = setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 420);
    },
    [isTransitioning, isAnalyzing, currentIndex]
  );

  // 6. Keyboard navigation — skip if focus is on an interactive element
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'video') return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        advance();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advance, goBack]);

  // 7. Outer-container click — ignore clicks that originate from buttons or links
  const handleContainerClick = useCallback(
    (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'button' || tag === 'a') return;
      if (e.target?.closest('button') || e.target?.closest('a')) return;
      advance();
    },
    [advance]
  );

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isAnalyzing) {
    return (
      <motion.div
        className={`fixed inset-0 flex flex-col items-center justify-center z-40 ${
          isScrapbook ? 'bg-[#EBF3FA]' : 'bg-[#FAF7F2]'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="w-16 h-0.5 bg-black/10 relative overflow-hidden rounded-full">
          <motion.div
            className={`absolute inset-y-0 left-0 ${
              isScrapbook ? 'bg-[#93C5FD]' : 'bg-[#F5B8A8]'
            }`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <p
          className={`text-xs tracking-[0.35em] uppercase mt-5 ${
            isScrapbook ? 'text-[#1E293B]/60' : 'text-[#8B4860]/70'
          }`}
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Getting things ready… ❤️
        </p>
      </motion.div>
    );
  }

  if (pages.length === 0) return null;

  // ── Main Book Render ───────────────────────────────────────────────────────
  return (
    <motion.div
      className="fixed inset-0 w-full h-full overflow-hidden select-none"
      style={{
        background: isScrapbook
          ? 'radial-gradient(ellipse at 50% 20%, #F8FBFE 0%, #EBF3FA 60%, #FAF6EE 100%)'
          : 'radial-gradient(ellipse at 60% 20%, #FFFDFB 0%, #FAF7F2 60%, #F4ECE6 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      onClick={handleContainerClick}
    >
      {/* Subtle paper grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Atmospheric top-left warm vignette — journal only */}
      {!isScrapbook && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 15% 10%, rgba(245,184,168,0.08) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Pages — each absolutely positioned, shown/hidden via AnimatePresence inside MemoryPage */}
      <div className="absolute inset-0">
        {pages.map((page) => (
          <MemoryPage
            key={page.id}
            pageData={page}
            isVisible={pages[currentIndex]?.id === page.id}
          />
        ))}
      </div>

      {/* ── Bottom Navigation Bar ─────────────────────────────────────────── */}
      {/*
        Fixed at the bottom. Always visible; never overlaps photo content
        because MemoryPage reserves 64px of paddingBottom.
      */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 z-30
          flex items-center justify-between
          px-5 sm:px-8 lg:px-12 xl:px-16
          py-3 sm:py-4
          pointer-events-none
        `}
        style={{
          background: isScrapbook
            ? 'linear-gradient(to top, rgba(235,243,250,0.92) 0%, transparent 100%)'
            : 'linear-gradient(to top, rgba(250,247,242,0.94) 0%, transparent 100%)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
        }}
      >
        {/* Previous */}
        {currentIndex > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className={`
              pointer-events-auto
              flex items-center gap-1.5
              px-3.5 py-2 sm:px-4 sm:py-2.5
              rounded-full text-[11px] sm:text-xs tracking-[0.18em] uppercase font-medium
              border transition-all active:scale-95
              ${isScrapbook
                ? 'bg-white/80 border-[#CBD5E1]/60 text-[#1E293B]/70 hover:bg-white shadow-sm'
                : 'bg-[#FAF7F2]/90 border-[#F5B8A8]/50 text-[#8B4860] hover:bg-[#FAF7F2] shadow-sm'
              }
            `}
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            ← Back
          </button>
        ) : (
          <div className="w-20 sm:w-24" aria-hidden />
        )}

        {/* Centre: page indicator + turn hint */}
        <div className="flex flex-col items-center gap-0.5 select-none pointer-events-none">
          <span
            className={`text-[11px] sm:text-xs tracking-[0.22em] uppercase font-medium tabular-nums ${
              isScrapbook ? 'text-[#1E293B]/50' : 'text-[#8B4860]/60'
            }`}
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {currentIndex + 1} of {pages.length}
          </span>

          <AnimatePresence>
            {canTap && (
              <motion.span
                className={`text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold ${
                  isScrapbook ? 'text-[#E94B70]' : 'text-[#45152D]/70'
                }`}
                style={{ fontFamily: "'Manrope', sans-serif" }}
                initial={{ opacity: 0, y: 4 }}
                animate={
                  reducedMotion
                    ? { opacity: 0.85 }
                    : { opacity: [0.5, 0.95, 0.5], y: [0, -1, 0] }
                }
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {currentIndex >= pages.length - 1 ? 'On to Our Memories →' : 'Keep exploring →'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Next */}
        <div className="w-20 sm:w-24 flex justify-end">
          {currentIndex < pages.length - 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                advance();
              }}
              disabled={!canTap || isTransitioning}
              className={`
                pointer-events-auto
                flex items-center gap-1.5
                px-3.5 py-2 sm:px-4 sm:py-2.5
                rounded-full text-[11px] sm:text-xs tracking-[0.18em] uppercase font-medium
                border transition-all active:scale-95 disabled:opacity-40
                ${isScrapbook
                  ? 'bg-white/80 border-[#CBD5E1]/60 text-[#1E293B]/70 hover:bg-white shadow-sm'
                  : 'bg-[#FAF7F2]/90 border-[#F5B8A8]/50 text-[#8B4860] hover:bg-[#FAF7F2] shadow-sm'
                }
              `}
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Next →
            </button>
          ) : (
            <div className="w-20 sm:w-24" aria-hidden />
          )}
        </div>
      </div>

      {/* Gentle page-turn flash feedback */}
      <AnimatePresence>
        {pageTurnFeedback && (
          <motion.div
            className="absolute inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              background: isScrapbook
                ? 'radial-gradient(circle at center, rgba(147,197,253,0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle at center, rgba(245,184,168,0.15) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
