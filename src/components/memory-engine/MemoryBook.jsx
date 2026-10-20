import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeImages } from './ImageAnalyzer';
import { generatePages } from './LayoutEngine';
import { MemoryPage } from './MemoryPage';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function MemoryBook({
  photos = [],
  onComplete,
  theme = 'journal',
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [pages, setPages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canTap, setCanTap] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pageTurnFeedback, setPageTurnFeedback] = useState(false);
  const reducedMotion = useReducedMotion();

  const isScrapbook = theme === 'scrapbook';
  const lockTimerRef = useRef(null);

  // 1. Analyze and generate layout pages
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsAnalyzing(true);
      const analyzed = await analyzeImages(photos);
      const layoutPages = generatePages(analyzed, theme);

      if (isMounted) {
        setPages(layoutPages);
        setIsAnalyzing(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [photos, theme]);

  // 2. Pace page-turning: allow recipient to advance once entrance animation settles (~1.5s)
  useEffect(() => {
    if (isAnalyzing) return;

    setCanTap(false);
    lockTimerRef.current = setTimeout(() => {
      setCanTap(true);
    }, 1500);

    return () => clearTimeout(lockTimerRef.current);
  }, [currentIndex, isAnalyzing]);

  // 3. Advance to next page safely without multi-click skipping
  const advance = useCallback(() => {
    if (!canTap || isTransitioning || isAnalyzing) return;

    setIsTransitioning(true);
    setPageTurnFeedback(true);
    setTimeout(() => setPageTurnFeedback(false), 500);

    if (currentIndex >= pages.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        if (onComplete) onComplete();
      }, 600);
      return;
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(false);
    }, 450);
  }, [canTap, isTransitioning, isAnalyzing, currentIndex, pages.length, onComplete]);

  // 4. Return to previous page
  const goBack = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (isTransitioning || isAnalyzing || currentIndex <= 0) return;

      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 450);
    },
    [isTransitioning, isAnalyzing, currentIndex]
  );

  // 5. Keyboard navigation (ArrowRight / Space / ArrowLeft)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        advance();
      } else if (e.key === 'ArrowLeft') {
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advance, goBack]);

  // ── Loading state ──
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
          {isScrapbook ? 'Assembling Keepsake' : 'Turning Pages'}
        </p>
      </motion.div>
    );
  }

  if (pages.length === 0) return null;

  return (
    <motion.div
      className="fixed inset-0 w-full h-full overflow-hidden select-none"
      style={{
        background: isScrapbook
          ? 'radial-gradient(ellipse at 50% 20%, #F8FBFE 0%, #EBF3FA 60%, #FAF6EE 100%)'
          : 'radial-gradient(ellipse at 50% 25%, #FFFDFB 0%, #FAF7F2 65%, #F4ECE6 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onClick={advance}
    >
      {/* Subtle tactile paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Pages Container */}
      <div className="absolute inset-0 z-10">
        {pages.map((page, idx) => (
          <MemoryPage
            key={page.id}
            pageData={page}
            isVisible={currentIndex === idx}
          />
        ))}
      </div>

      {/* ── Discreet, Attractive Page Controls ── */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
        {/* Previous page button */}
        {currentIndex > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className={`pointer-events-auto px-3 py-1.5 rounded-full text-xs tracking-wider uppercase backdrop-blur-sm transition-all flex items-center gap-1.5 ${
              isScrapbook
                ? 'bg-white/70 text-[#1E293B]/70 hover:bg-white border border-[#CBD5E1]/60'
                : 'bg-white/75 text-[#8B4860] hover:bg-white border border-[#F5B8A8]/40'
            }`}
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            ← Back
          </button>
        ) : (
          <div className="w-16" />
        )}

        {/* Page counter & turn indicator */}
        <div className="flex flex-col items-center pointer-events-none select-none">
          <span
            className={`text-[11px] tracking-[0.25em] uppercase font-medium ${
              isScrapbook ? 'text-[#1E293B]/50' : 'text-[#8B4860]/60'
            }`}
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {currentIndex + 1} of {pages.length}
          </span>

          <AnimatePresence>
            {canTap && (
              <motion.span
                className={`mt-0.5 text-[11px] tracking-[0.2em] uppercase font-medium flex items-center gap-1 ${
                  isScrapbook ? 'text-[#E94B70]' : 'text-[#45152D]'
                }`}
                style={{ fontFamily: "'Manrope', sans-serif" }}
                initial={{ opacity: 0, y: 3 }}
                animate={
                  reducedMotion
                    ? { opacity: 0.85 }
                    : { opacity: [0.6, 1, 0.6], y: [0, -1, 0] }
                }
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {currentIndex >= pages.length - 1 ? 'Finish Chapter ✨' : 'Turn Page →'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Forward tap area spacer */}
        <div className="w-16 flex justify-end">
          {currentIndex < pages.length - 1 && (
            <button
              type="button"
              onClick={advance}
              disabled={!canTap || isTransitioning}
              className={`pointer-events-auto px-3 py-1.5 rounded-full text-xs tracking-wider uppercase backdrop-blur-sm transition-all flex items-center gap-1.5 ${
                isScrapbook
                  ? 'bg-white/70 text-[#1E293B]/70 hover:bg-white border border-[#CBD5E1]/60'
                  : 'bg-white/75 text-[#8B4860] hover:bg-white border border-[#F5B8A8]/40'
              }`}
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Gentle visual feedback flash on page turn */}
      <AnimatePresence>
        {pageTurnFeedback && (
          <motion.div
            className="absolute inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: isScrapbook
                ? 'radial-gradient(circle at center, rgba(147,197,253,0.18) 0%, transparent 70%)'
                : 'radial-gradient(circle at center, rgba(245,184,168,0.18) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
