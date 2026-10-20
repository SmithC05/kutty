import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { PhotoFrame } from './PhotoFrame';

/**
 * ScrapbookExperience Component — Chapter Two: "Us"
 *
 * Visual Identity:
 * - Soft sky blue (#EBF3FA), warm paper cream (#FFFDF9), muted butter yellow (#FEF3C7),
 *   restrained coral accents (#E94B70), deep slate navy text (#1E293B).
 * - Instant-photo prints (Polaroids), washi tape accents, handwritten typography (Dancing Script).
 * - Tells the story of the one in-person meeting between Keerthana and her long-distance best friend.
 *
 * Four deliberate narrative stages:
 * 1. The Introduction: "Different places. One day in the same frame."
 * 2. The Hero Memory: Central shared photograph (or archival friendship keepsake if files pending).
 * 3. The Photo Collection: Additional photos from the meeting (if present).
 * 4. The Keepsake Page: All photos brought together with an editable personal letter from the sender.
 */
export function ScrapbookExperience({
  chapterData,
  onComplete,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [canTap, setCanTap] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reducedMotion = useReducedMotion();

  const photos = chapterData?.photos || [];
  const hasPhotos = photos.length > 0;
  const note = chapterData?.personalNote || {
    salutation: 'To Kutty —',
    body: "Miles apart across different cities, college routines, and busy days. But that one day we shared in person proved that real friendship doesn't need constant proximity—it just picks up right where it left off without skipping a beat.\n\nEvery memory from that meeting is something I treasure. Thank you for being such an extraordinary friend.",
    signoff: 'Always in your corner,',
    sender: 'Your Best Friend',
  };

  // Build page sequence dynamically based on available shared photos
  // If photos exist: Intro (0) -> Hero (1) -> Collection (2, if >1 photo) -> Keepsake Note (3)
  // If no photos yet: Intro (0) -> Archival Keepsake Card (1) -> Keepsake Note (2)
  const totalPages = hasPhotos ? (photos.length > 1 ? 4 : 3) : 3;

  // Pace interaction
  useEffect(() => {
    setCanTap(false);
    const timer = setTimeout(() => {
      setCanTap(true);
    }, 1400);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const advance = useCallback(() => {
    if (!canTap || isTransitioning) return;

    if (currentPage >= totalPages - 1) {
      if (onComplete) onComplete();
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsTransitioning(false);
    }, 450);
  }, [canTap, isTransitioning, currentPage, totalPages, onComplete]);

  const goBack = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (isTransitioning || currentPage <= 0) return;

      setIsTransitioning(true);
      setCurrentPage((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 450);
    },
    [isTransitioning, currentPage]
  );

  // Keyboard navigation
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

  return (
    <motion.div
      className="fixed inset-0 w-full h-full overflow-hidden select-none flex flex-col items-center justify-center p-4 sm:p-6"
      style={{
        background:
          'radial-gradient(ellipse at 50% 15%, #F4F8FC 0%, #EBF3FA 55%, #FAF7EE 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onClick={advance}
    >
      {/* Scrapbook paper grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Washi Tape elements in background */}
      <div
        className="absolute top-4 left-6 w-24 h-6 pointer-events-none rounded-sm shadow-sm"
        style={{
          background: 'rgba(254, 243, 199, 0.75)',
          transform: 'rotate(-4deg)',
        }}
      />
      <div
        className="absolute bottom-6 right-8 w-28 h-6 pointer-events-none rounded-sm shadow-sm"
        style={{
          background: 'rgba(251, 207, 232, 0.65)',
          transform: 'rotate(3deg)',
        }}
      />

      {/* ── Dynamic Page Views ── */}
      <div className="relative z-10 w-full max-w-2xl h-[76vh] md:h-[80vh] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────
              PAGE 0: The Introduction
              "Different places. One day in the same frame."
              ───────────────────────────────────────────────────────────── */}
          {currentPage === 0 && (
            <motion.div
              key="scrapbook-intro"
              className="relative w-full max-w-md bg-[#FFFDF9] rounded-2xl p-7 sm:p-9 shadow-[0_16px_40px_rgba(30,41,59,0.12),0_2px_8px_rgba(0,0,0,0.04)] border border-[#E2E8F0]/70 text-center flex flex-col items-center justify-center overflow-hidden"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -16 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Washi tape on top edge */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 pointer-events-none rounded-sm shadow-sm"
                style={{
                  background: 'rgba(254, 243, 199, 0.9)',
                  borderLeft: '1px dashed rgba(0,0,0,0.15)',
                  borderRight: '1px dashed rgba(0,0,0,0.15)',
                  transform: 'rotate(-1deg)',
                }}
              />

              {/* Postal stamp / friendship crest accent */}
              <div className="mb-4 w-12 h-12 rounded-full bg-[#EBF3FA] flex items-center justify-center text-xl shadow-inner border border-[#93C5FD]/40">
                ✨
              </div>

              <p
                className="text-[11px] uppercase tracking-[0.3em] text-[#E94B70] font-semibold mb-2"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Chapter Two · Us
              </p>

              <h2
                className="text-2xl sm:text-3xl text-[#1E293B] font-semibold tracking-tight leading-snug mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Different places.
                <br />
                <span className="italic font-normal text-[#E94B70]">
                  One day in the same frame.
                </span>
              </h2>

              <div className="w-12 h-px bg-[#E2E8F0] my-2" />

              <p
                className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-sm"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                A thousand miles apart, across different routines and distance.
                Yet for one meaningful day, our worlds were in the exact same room.
              </p>

              <p
                className="mt-6 text-xs text-[#94A3B8] tracking-widest uppercase font-medium"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Tap anywhere to explore our memories →
              </p>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              PAGE 1: The Hero Memory (or Archival Keepsake Card if files pending)
              ───────────────────────────────────────────────────────────── */}
          {currentPage === 1 && (
            <motion.div
              key="scrapbook-hero"
              className="w-full h-full flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -16 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              {hasPhotos ? (
                // If real shared photos exist: render Hero instant-print
                <div className="w-full max-w-sm sm:max-w-md h-[68vh] flex items-center justify-center">
                  <PhotoFrame
                    photo={photos[0]}
                    variant="scrapbook"
                    tilt={-1.5}
                    className="w-full h-full max-h-[62vh]"
                    index={0}
                  />
                </div>
              ) : (
                // Archival Keepsake Card — elegant, authentic, zero broken images
                <div className="relative w-full max-w-md bg-[#FFFDF9] rounded-2xl p-7 sm:p-9 shadow-[0_16px_40px_rgba(30,41,59,0.12)] border border-[#E2E8F0]/70 flex flex-col items-center text-center">
                  {/* Top washi tape */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 pointer-events-none rounded-sm shadow-sm"
                    style={{
                      background: 'rgba(254, 243, 199, 0.9)',
                      borderLeft: '1px dashed rgba(0,0,0,0.15)',
                      borderRight: '1px dashed rgba(0,0,0,0.15)',
                      transform: 'rotate(1.5deg)',
                    }}
                  />

                  {/* Embossed instant-print photo mount holder */}
                  <div className="w-full aspect-[4/3] rounded-lg bg-[#FAF8F5] border-2 border-dashed border-[#CBD5E1] p-4 flex flex-col items-center justify-center relative overflow-hidden mb-5">
                    <span className="text-4xl mb-2 opacity-75">📷</span>
                    <h3
                      className="text-base sm:text-lg font-medium text-[#1E293B] mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Our In-Person Meeting
                    </h3>
                    <p
                      className="text-xs text-[#64748B] max-w-xs leading-relaxed"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Preserved for the photographs taken on that one unforgettable day.
                    </p>

                    {/* Subtle corner photo mount tabs */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#94A3B8]/60" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#94A3B8]/60" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#94A3B8]/60" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#94A3B8]/60" />
                  </div>

                  <p
                    className="text-[#1E293B] text-lg sm:text-xl font-normal leading-snug"
                    style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}
                  >
                    "We finally got to share the same frame."
                  </p>
                  <p
                    className="text-xs text-[#64748B] mt-1.5"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    That one meeting meant the world.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              PAGE 2 (if multiple photos exist): Collection Spread
              ───────────────────────────────────────────────────────────── */}
          {currentPage === 2 && hasPhotos && photos.length > 1 && (
            <motion.div
              key="scrapbook-collection"
              className="w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -16 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-full max-w-xl h-[68vh] flex items-center justify-center">
                {photos.slice(1, 3).map((p, i) => (
                  <PhotoFrame
                    key={p.id || i}
                    photo={p}
                    variant="scrapbook"
                    tilt={i === 0 ? -2.5 : 2.0}
                    className={`absolute w-[72%] sm:w-[62%] h-[48vh] ${
                      i === 0
                        ? '-translate-x-8 -translate-y-4 z-10'
                        : 'translate-x-8 translate-y-4 z-20'
                    }`}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              FINAL PAGE: The Keepsake Page & Personal Note
              ───────────────────────────────────────────────────────────── */}
          {((currentPage === 2 && (!hasPhotos || photos.length <= 1)) ||
            (currentPage === 3 && hasPhotos && photos.length > 1)) && (
            <motion.div
              key="scrapbook-letter"
              className="relative w-full max-w-lg bg-[#FFFDF9] rounded-2xl p-6 sm:p-9 shadow-[0_18px_44px_rgba(30,41,59,0.14)] border border-[#E2E8F0]/80 flex flex-col justify-between max-h-[74vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -16 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top Washi Tape */}
              <div
                className="absolute -top-3 left-8 w-24 h-6 pointer-events-none rounded-sm shadow-sm"
                style={{
                  background: 'rgba(254, 243, 199, 0.85)',
                  transform: 'rotate(-2deg)',
                }}
              />
              <div
                className="absolute -top-3 right-8 w-20 h-6 pointer-events-none rounded-sm shadow-sm"
                style={{
                  background: 'rgba(251, 207, 232, 0.75)',
                  transform: 'rotate(2deg)',
                }}
              />

              <div>
                <p
                  className="text-[#E94B70] text-xl sm:text-2xl font-bold mb-3"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {note.salutation}
                </p>

                <p
                  className="text-[#334155] text-sm sm:text-base leading-relaxed whitespace-pre-line"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {note.body}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex flex-col items-end text-right">
                <p
                  className="text-[#64748B] text-xs uppercase tracking-wider mb-1"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {note.signoff}
                </p>
                <p
                  className="text-[#1E293B] text-xl font-bold text-rose-700"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {note.sender}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Discreet Scrapbook Navigation Controls ── */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
        {currentPage > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="pointer-events-auto px-3 py-1.5 rounded-full text-xs tracking-wider uppercase backdrop-blur-sm transition-all flex items-center gap-1.5 bg-white/80 text-[#1E293B]/70 hover:bg-white border border-[#CBD5E1]/60 shadow-sm"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            ← Back
          </button>
        ) : (
          <div className="w-16" />
        )}

        <div className="flex flex-col items-center pointer-events-none select-none">
          <span
            className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#1E293B]/50"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {currentPage + 1} of {totalPages}
          </span>

          <AnimatePresence>
            {canTap && (
              <motion.span
                className="mt-0.5 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#E94B70] flex items-center gap-1"
                style={{ fontFamily: "'Manrope', sans-serif" }}
                initial={{ opacity: 0, y: 3 }}
                animate={
                  reducedMotion
                    ? { opacity: 0.9 }
                    : { opacity: [0.6, 1, 0.6], y: [0, -1, 0] }
                }
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {currentPage >= totalPages - 1 ? 'Complete Journey ✨' : 'Turn Page →'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="w-16 flex justify-end">
          {currentPage < totalPages - 1 && (
            <button
              type="button"
              onClick={advance}
              disabled={!canTap || isTransitioning}
              className="pointer-events-auto px-3 py-1.5 rounded-full text-xs tracking-wider uppercase backdrop-blur-sm transition-all flex items-center gap-1.5 bg-white/80 text-[#1E293B]/70 hover:bg-white border border-[#CBD5E1]/60 shadow-sm"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
