import React, { useState, useEffect, useCallback, useRef } from 'react';
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
 * Page sequence (all optional media checked dynamically):
 *   0 — Introduction card
 *   1 — Hero shared photograph  (requires photos.length >= 1)
 *   2 — Video memory page       (requires chapterData.video)
 *   3 — Collection spread       (requires photos.length >= 2; shows photos.slice(1))
 *   4 — Personal keepsake letter
 *
 * Pages for absent optional media are simply omitted; page count and
 * navigation stay correct automatically.
 */

// ─── VideoPage ────────────────────────────────────────────────────────────────
// Native HTML5 video rendered inside the scrapbook aesthetic.
// Does NOT advance the scrapbook page; stopPropagation is applied on all
// interactive events that would otherwise bubble to the outer onClick handler.
function VideoPage({ video }) {
  const [hasError, setHasError] = useState(false);

  const stopBubble = (e) => e.stopPropagation();

  return (
    <div
      className="relative w-full max-w-lg bg-[#FFFDF9] rounded-sm shadow-[0_14px_32px_rgba(30,41,59,0.16),0_2px_6px_rgba(0,0,0,0.05)] border border-[#E2E8F0]/60 flex flex-col overflow-hidden"
      style={{ maxHeight: '64vh' }}
    >
      {/* Washi tape accent */}
      <div
        className="absolute -top-3 left-1/2 z-10 w-24 h-7 pointer-events-none rounded-sm shadow-sm"
        style={{
          background: 'rgba(251, 207, 232, 0.88)',
          borderLeft: '1px dashed rgba(0,0,0,0.13)',
          borderRight: '1px dashed rgba(0,0,0,0.13)',
          transform: 'translateX(-50%) rotate(1deg)',
        }}
      />

      {/* Video area */}
      <div className="relative flex-1 bg-[#0F172A] overflow-hidden" style={{ minHeight: 0 }}>
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="text-3xl opacity-60">🎞️</span>
            <p
              className="text-xs text-[#94A3B8] tracking-wider uppercase"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Video unavailable
            </p>
          </div>
        ) : (
          /* stopPropagation on all video interaction events so clicks/touches
             inside the <video> element never bubble to the page-advance handler */
          <video
            src={video.src}
            poster={video.poster}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
            style={{ maxHeight: '52vh', display: 'block' }}
            onError={() => setHasError(true)}
            onClick={stopBubble}
            onTouchStart={stopBubble}
            onTouchEnd={stopBubble}
            onPointerDown={stopBubble}
          />
        )}
      </div>

      {/* Caption */}
      {video.caption && (
        <div className="px-4 py-3 text-center shrink-0">
          <p
            className="text-[#1E293B] text-base tracking-wide leading-tight"
            style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600 }}
          >
            {video.caption}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── CollectionSpread ─────────────────────────────────────────────────────────
// Lays out all photos after the hero (photos.slice(1)) in a simple stacked
// or side-by-side composition that fits 1–3 items equally well.
function CollectionSpread({ photos }) {
  const items = photos.slice(1); // never include the hero image

  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <div className="w-full max-w-sm sm:max-w-md h-[60vh] flex items-center justify-center">
        <PhotoFrame
          photo={items[0]}
          variant="scrapbook"
          tilt={-1.5}
          className="w-full h-full max-h-[56vh]"
          index={0}
        />
      </div>
    );
  }

  if (items.length === 2) {
    return (
      <div className="relative w-full max-w-xl h-[64vh] flex items-center justify-center">
        {items.map((p, i) => (
          <PhotoFrame
            key={p.id || i}
            photo={p}
            variant="scrapbook"
            tilt={i === 0 ? -2.5 : 2.0}
            className={`absolute w-[68%] sm:w-[58%] h-[50vh] ${
              i === 0
                ? '-translate-x-10 -translate-y-4 z-10'
                : 'translate-x-10 translate-y-4 z-20'
            }`}
            index={i}
          />
        ))}
      </div>
    );
  }

  // 3 or more photos: one on top centred, two below side-by-side
  const [top, ...rest] = items;
  return (
    <div className="relative w-full max-w-xl h-[68vh] flex flex-col items-center justify-center gap-2">
      {/* Top photo */}
      <div className="w-[58%] sm:w-[50%] h-[34vh]">
        <PhotoFrame
          photo={top}
          variant="scrapbook"
          tilt={-1.5}
          className="w-full h-full"
          index={0}
        />
      </div>
      {/* Bottom row */}
      <div className="flex gap-3 w-full justify-center">
        {rest.slice(0, 2).map((p, i) => (
          <div key={p.id || i} className="w-[44%] sm:w-[38%] h-[26vh]">
            <PhotoFrame
              photo={p}
              variant="scrapbook"
              tilt={i === 0 ? -2.0 : 2.0}
              className="w-full h-full"
              index={i + 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ScrapbookExperience ──────────────────────────────────────────────────────
export function ScrapbookExperience({ chapterData, onComplete }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [canTap, setCanTap] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const completedRef = useRef(false); // guard: onComplete fires exactly once
  const tapTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const photos = chapterData?.photos || [];
  const video = chapterData?.video || null;
  const hasPhotos = photos.length > 0;
  const hasVideo = Boolean(video);
  const hasCollection = photos.length > 1; // need at least 2 photos to show a collection
  const note = chapterData?.personalNote || {
    salutation: 'To Kutty —',
    body: "Miles apart across different cities, college routines, and busy days. But that one day we shared in person proved that real friendship doesn't need constant proximity—it just picks up right where it left off without skipping a beat.\n\nEvery memory from that meeting is something I treasure. Thank you for being such an extraordinary friend.",
    signoff: 'Always in your corner,',
    sender: 'Your Best Friend',
  };

  // Build the ordered list of pages that actually exist given available media.
  // Each entry has a stable key used by AnimatePresence.
  const pages = [
    { key: 'intro', type: 'intro' },
    ...(hasPhotos ? [{ key: 'hero', type: 'hero' }] : []),
    ...(hasVideo ? [{ key: 'video', type: 'video' }] : []),
    ...(hasCollection ? [{ key: 'collection', type: 'collection' }] : []),
    { key: 'letter', type: 'letter' },
  ];
  const totalPages = pages.length;
  const currentPageDef = pages[currentPage] || pages[0];

  // Pace interaction: block taps while entrance animation settles
  useEffect(() => {
    setCanTap(false);
    clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setCanTap(true), 1400);
    return () => clearTimeout(tapTimerRef.current);
  }, [currentPage]);

  // Cleanup transition timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(tapTimerRef.current);
      clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const advance = useCallback(() => {
    if (!canTap || isTransitioning) return;

    if (currentPage >= totalPages - 1) {
      // Final page: fire onComplete exactly once
      if (!completedRef.current) {
        completedRef.current = true;
        if (onComplete) onComplete();
      }
      return;
    }

    setIsTransitioning(true);
    clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsTransitioning(false);
    }, 450);
  }, [canTap, isTransitioning, currentPage, totalPages, onComplete]);

  const goBack = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (isTransitioning || currentPage <= 0) return;

      setIsTransitioning(true);
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsTransitioning(false);
      }, 450);
    },
    [isTransitioning, currentPage]
  );

  // Keyboard navigation — skip if focus is inside a media or interactive element
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      // Do not intercept keyboard while video controls or other interactive elements have focus
      if (tag === 'video' || tag === 'input' || tag === 'textarea' || tag === 'select') return;

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

  // Page-turn handler on the outer container — stop propagation from nav buttons
  const handleContainerClick = useCallback(
    (e) => {
      // Ignore clicks that came from within a <video>, <button>, or <a>
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'video' || tag === 'button' || tag === 'a') return;
      if (e.target?.closest('video') || e.target?.closest('button') || e.target?.closest('a')) return;
      advance();
    },
    [advance]
  );

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
      onClick={handleContainerClick}
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

          {/* ─────────────────────────────────────────────────────────────────
              PAGE: Introduction
              ───────────────────────────────────────────────────────────────── */}
          {currentPageDef.type === 'intro' && (
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

          {/* ─────────────────────────────────────────────────────────────────
              PAGE: Hero photograph
              ───────────────────────────────────────────────────────────────── */}
          {currentPageDef.type === 'hero' && (
            <motion.div
              key="scrapbook-hero"
              className="w-full h-full flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -16 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full max-w-sm sm:max-w-md h-[68vh] flex items-center justify-center">
                <PhotoFrame
                  photo={photos[0]}
                  variant="scrapbook"
                  tilt={-1.5}
                  className="w-full h-full max-h-[62vh]"
                  index={0}
                />
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              PAGE: Video memory
              ───────────────────────────────────────────────────────────────── */}
          {currentPageDef.type === 'video' && (
            <motion.div
              key="scrapbook-video"
              className="w-full h-full flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -16 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <VideoPage video={video} />
              <p
                className="mt-4 text-[11px] text-[#94A3B8] tracking-widest uppercase"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Tap outside the video to continue →
              </p>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              PAGE: Collection spread — all photos after the hero
              ───────────────────────────────────────────────────────────────── */}
          {currentPageDef.type === 'collection' && (
            <motion.div
              key="scrapbook-collection"
              className="w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -16 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <CollectionSpread photos={photos} />
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              PAGE: Personal keepsake letter
              ───────────────────────────────────────────────────────────────── */}
          {currentPageDef.type === 'letter' && (
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
          {currentPage < totalPages - 1 ? (
            <button
              type="button"
              onClick={(e) => {
                // Stop propagation so the outer container click handler does not
                // also fire advance(), which would schedule two transitions.
                e.stopPropagation();
                advance();
              }}
              disabled={!canTap || isTransitioning}
              className="pointer-events-auto px-3 py-1.5 rounded-full text-xs tracking-wider uppercase backdrop-blur-sm transition-all flex items-center gap-1.5 bg-white/80 text-[#1E293B]/70 hover:bg-white border border-[#CBD5E1]/60 shadow-sm disabled:opacity-40"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Next →
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
