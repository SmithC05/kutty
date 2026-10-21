import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ScrapbookExperience Component — Chapter Two: "Us"
 *
 * Visual Identity:
 * - Soft sky blue (#EBF3FA), warm paper cream (#FFFDF9), muted butter yellow (#FEF3C7),
 *   restrained coral accents (#E94B70), deep slate navy text (#1E293B), sky-blue accent (#93C5FD).
 * - Cinematic landscape-oriented friendship gallery.
 * - Tells the story of the one in-person meeting between Keerthana and her long-distance best friend.
 *
 * Page Sequence:
 *   Page A (0) — Chapter Introduction: "Different places. One day in the same frame."
 *   Page B (1) — Hero Landscape Photograph (4:3 wide landscape)
 *   Page C (2) — Dedicated Video Memory (HTML5 landscape video stage)
 *   Page D (3) — Shared Photograph Gallery (All remaining landscape photos)
 *   Page E (4) — Personal Keepsake Letter (Warm stationery letter)
 */

// ─── Sub-Component: VideoPage (Page C) ────────────────────────────────────────
function VideoPage({ video }) {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  const stopBubble = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="relative w-full max-w-3xl lg:max-w-4xl bg-[#FFFDF9] rounded-xl sm:rounded-2xl shadow-[0_18px_44px_rgba(30,41,59,0.14),0_2px_8px_rgba(0,0,0,0.04)] border border-[#93C5FD]/35 flex flex-col overflow-hidden"
      style={{ maxHeight: '66vh' }}
      onClick={stopBubble}
      onPointerDown={stopBubble}
    >
      {/* Delicate washi tape accent */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-28 h-7 pointer-events-none rounded-sm shadow-sm"
        style={{
          background: 'rgba(251, 207, 232, 0.88)',
          borderLeft: '1px dashed rgba(0,0,0,0.12)',
          borderRight: '1px dashed rgba(0,0,0,0.12)',
          transform: 'translateX(-50%) rotate(0.8deg)',
        }}
      />

      {/* Video display stage */}
      <div
        className="relative flex-1 min-h-0 bg-[#0F172A] overflow-hidden flex items-center justify-center"
        style={{ maxHeight: '52vh' }}
      >
        {hasError ? (
          <div className="flex flex-col items-center justify-center gap-3 p-8 text-center bg-[#0F172A]">
            <span className="text-3xl opacity-60">🎞️</span>
            <p
              className="text-xs text-[#94A3B8] tracking-widest uppercase font-medium"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Oops, this little moment won&apos;t play right now. ❤️
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={video.src}
            poster={video.poster}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
            style={{ maxHeight: '52vh', display: 'block' }}
            onError={() => setHasError(true)}
            onClick={stopBubble}
            onPointerDown={stopBubble}
            onTouchStart={stopBubble}
            onTouchEnd={stopBubble}
            onKeyDown={stopBubble}
          />
        )}
      </div>

      {/* Video caption footer */}
      <div className="px-4 py-2.5 sm:py-3 bg-[#FFFDF9] border-t border-[#93C5FD]/20 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left shrink-0">
        <p
          className="text-[#1E293B] text-sm sm:text-base font-semibold tracking-wide"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          {video.caption || 'A moment worth replaying.'}
        </p>
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-[#64748B] font-medium"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Press play to watch ❤️
        </span>
      </div>
    </div>
  );
}

// ─── Sub-Component: GallerySpread (Page D) ───────────────────────────────────
// Displays every remaining unique shared photograph after the hero image.
// On desktop: Balanced landscape layout (wide panoramic top + 2 balanced landscapes bottom).
// On mobile: An intuitive single-photo landscape slide view with dot pagination.
function GallerySpread({ photos }) {
  const items = photos.slice(1); // all photos after hero photo
  const [mobileIndex, setMobileIndex] = useState(0);

  if (items.length === 0) return null;

  // Mobile navigation handlers
  const handleMobilePrev = (e) => {
    e.stopPropagation();
    setMobileIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleMobileNext = (e) => {
    e.stopPropagation();
    setMobileIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full h-full max-w-5xl flex items-center justify-center">

      {/* ── Desktop Composition (lg:flex) ── */}
      {/* Balanced landscape layout: Wide panoramic photo on top + two 16:9 photos below */}
      <div className="hidden lg:flex flex-col items-center justify-center gap-3.5 xl:gap-4 w-full">
        {/* Top: Panoramic wide photo (items[0]) */}
        {items[0] && (
          <div className="w-full max-w-4xl bg-[#FFFDF9] rounded-xl shadow-[0_12px_32px_rgba(30,41,59,0.10),0_2px_8px_rgba(0,0,0,0.03)] border border-[#93C5FD]/35 p-2.5 flex flex-col overflow-hidden">
            <div className="relative w-full h-[26vh] xl:h-[28vh] max-h-[300px] bg-[#F0F6FC]/50 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={items[0].url}
                alt={items[0].caption || 'Shared memory'}
                className="w-full h-full object-contain pointer-events-none select-none"
                loading="lazy"
              />
            </div>
            {items[0].caption && (
              <div className="pt-2 px-2 flex items-center justify-between">
                <p
                  className="text-[#1E293B] text-sm font-semibold tracking-wide"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {items[0].caption}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom: Two 16:9 landscape photos side-by-side (items[1] & items[2]) */}
        <div className="flex flex-row items-center justify-center gap-4 w-full max-w-4xl">
          {items.slice(1, 3).map((item, idx) => (
            <div
              key={item.id || idx}
              className="w-[49%] bg-[#FFFDF9] rounded-xl shadow-[0_12px_32px_rgba(30,41,59,0.10),0_2px_8px_rgba(0,0,0,0.03)] border border-[#93C5FD]/35 p-2.5 flex flex-col overflow-hidden"
            >
              <div className="relative w-full h-[22vh] xl:h-[24vh] max-h-[240px] bg-[#F0F6FC]/50 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.caption || 'Shared memory'}
                  className="w-full h-full object-contain pointer-events-none select-none"
                  loading="lazy"
                />
              </div>
              {item.caption && (
                <div className="pt-2 px-2 flex items-center justify-between">
                  <p
                    className="text-[#1E293B] text-sm font-semibold tracking-wide"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {item.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile Composition (lg:hidden) ── */}
      {/* Dedicated single-photo slide view — generous landscape size with intuitive controls */}
      <div className="flex lg:hidden flex-col items-center justify-center w-full max-w-sm px-2">
        <div className="relative w-full bg-[#FFFDF9] rounded-xl shadow-[0_14px_36px_rgba(30,41,59,0.12),0_2px_8px_rgba(0,0,0,0.03)] border border-[#93C5FD]/35 p-2.5 flex flex-col overflow-hidden">
          {/* Top washi tape */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-24 h-6 pointer-events-none rounded-sm shadow-sm"
            style={{
              background: 'rgba(254, 243, 199, 0.85)',
              transform: 'translateX(-50%) rotate(-1deg)',
            }}
          />

          {/* Active landscape image */}
          <div className="relative w-full h-[36vh] sm:h-[40vh] bg-[#F0F6FC]/50 rounded-lg overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={items[mobileIndex]?.id || mobileIndex}
                src={items[mobileIndex]?.url}
                alt={items[mobileIndex]?.caption || ''}
                className="w-full h-full object-contain select-none"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                loading="lazy"
              />
            </AnimatePresence>
          </div>

          {/* Caption */}
          <div className="pt-2.5 pb-1 px-2 text-center">
            <p
              className="text-[#1E293B] text-base font-semibold tracking-wide"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {items[mobileIndex]?.caption}
            </p>
          </div>
        </div>

        {/* Mobile Gallery Controls (Prev / Dots / Next) */}
        <div className="flex items-center justify-between w-full mt-3 px-2">
          <button
            type="button"
            onClick={handleMobilePrev}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 border border-[#CBD5E1]/70 text-[#1E293B] shadow-sm active:scale-95 transition-all"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            ← Back
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {items.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileIndex(dotIdx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  mobileIndex === dotIdx
                    ? 'bg-[#E94B70] scale-110'
                    : 'bg-[#CBD5E1] hover:bg-[#94A3B8]'
                }`}
                aria-label={`View photograph ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleMobileNext}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 border border-[#CBD5E1]/70 text-[#1E293B] shadow-sm active:scale-95 transition-all"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Next →
          </button>
        </div>
      </div>

    </div>
  );
}

// ─── Main ScrapbookExperience Component ───────────────────────────────────────
export function ScrapbookExperience({ chapterData, onComplete }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [canTap, setCanTap] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const completedRef = useRef(false);
  const tapTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const photos = chapterData?.photos || [];
  const video = chapterData?.video || null;
  const hasPhotos = photos.length > 0;
  const hasVideo = Boolean(video);
  const hasGallery = photos.length > 1;

  const note = chapterData?.personalNote || {
    salutation: 'To Kutty —',
    body: "Miles apart across different cities, college routines, and busy days. But that one day we shared in person proved that real friendship doesn't need constant proximity—it just picks up right where it left off without skipping a beat.\n\nEvery memory from that meeting is something I treasure. Thank you for being such an extraordinary friend.",
    signoff: 'Always in your corner,',
    sender: 'Your Best Friend',
  };

  // Build the ordered pages array
  const pages = [
    { key: 'intro', type: 'intro', label: 'Our Story' },
    ...(hasPhotos ? [{ key: 'hero', type: 'hero', label: 'Hero Memory' }] : []),
    ...(hasVideo ? [{ key: 'video', type: 'video', label: 'Video Memory' }] : []),
    ...(hasGallery ? [{ key: 'gallery', type: 'gallery', label: 'Shared Moments' }] : []),
    { key: 'letter', type: 'letter', label: 'Keepsake Letter' },
  ];
  const totalPages = pages.length;
  const currentPageDef = pages[currentPage] || pages[0];

  // Pace interaction: block taps while page transition settles
  useEffect(() => {
    setCanTap(false);
    clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setCanTap(true), 1200);
    return () => clearTimeout(tapTimerRef.current);
  }, [currentPage]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(tapTimerRef.current);
      clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const advance = useCallback(() => {
    if (!canTap || isTransitioning) return;

    if (currentPage >= totalPages - 1) {
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
    }, 400);
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
      }, 400);
    },
    [isTransitioning, currentPage]
  );

  // Keyboard navigation — ignore if video or interactive element has focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
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

  // Outer container click handler — ignore clicks originating from buttons, links, or video
  const handleContainerClick = useCallback(
    (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'video' || tag === 'button' || tag === 'a') return;
      if (e.target?.closest('video') || e.target?.closest('button') || e.target?.closest('a')) return;
      advance();
    },
    [advance]
  );

  return (
    <motion.div
      className="fixed inset-0 w-full h-full overflow-hidden select-none flex flex-col"
      style={{
        background:
          'radial-gradient(ellipse 110% 90% at 50% 18%, #F8FBFE 0%, #EBF3FA 55%, #F0F6FC 100%)',
        paddingBottom: '68px', /* reserved space for bottom navigation bar */
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      onClick={handleContainerClick}
    >
      {/* Paper grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.032] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Atmospheric ambient sky-blue / champagne background lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(147,197,253,0.12) 0%, rgba(254,243,199,0.06) 50%, transparent 80%)',
        }}
      />

      {/* ── Top Chapter Header ── */}
      <header className="shrink-0 flex items-center justify-between px-5 sm:px-8 lg:px-14 xl:px-20 pt-3.5 sm:pt-4 pb-2 sm:pb-2.5 z-20">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <span className="block w-5 sm:w-8 h-px bg-[#93C5FD]/70 shrink-0" />
          <span
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#1E293B]/75 font-semibold truncate"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            You & Me · {currentPageDef.label}
          </span>
        </div>

        {/* Page counter */}
        <span
          className="text-[10px] sm:text-xs tracking-[0.22em] text-[#1E293B]/50 font-medium tabular-nums shrink-0 ml-3"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          {String(currentPage + 1).padStart(2, '0')}{' '}
          <span className="opacity-40">/</span>{' '}
          {String(totalPages).padStart(2, '0')}
        </span>
      </header>

      {/* Hairline separator */}
      <div className="shrink-0 mx-5 sm:mx-8 lg:mx-14 xl:px-20 h-px bg-[#93C5FD]/25 z-20" />

      {/* ── Dynamic Page Views ── */}
      <div className="flex-1 min-h-0 flex items-center justify-center w-full px-3 sm:px-6 lg:px-12 xl:px-16 overflow-hidden">
        <AnimatePresence mode="wait">

          {/* ─────────────────────────────────────────────────────────────────
              PAGE A (0): Chapter Introduction ("Different places...")
              ───────────────────────────────────────────────────────────────── */}
          {currentPageDef.type === 'intro' && (
            <motion.div
              key="scrapbook-intro"
              className="relative w-full max-w-lg bg-[#FFFDF9] rounded-2xl p-7 sm:p-10 shadow-[0_20px_50px_rgba(30,41,59,0.12),0_2px_8px_rgba(0,0,0,0.04)] border border-[#93C5FD]/40 text-center flex flex-col items-center justify-center overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.01, y: -12 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Washi tape accent on top edge */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-7 pointer-events-none rounded-sm shadow-sm"
                style={{
                  background: 'rgba(254, 243, 199, 0.9)',
                  borderLeft: '1px dashed rgba(0,0,0,0.14)',
                  borderRight: '1px dashed rgba(0,0,0,0.14)',
                  transform: 'rotate(-1deg)',
                }}
              />

              {/* Friendship crest icon */}
              <div className="mb-4 w-12 h-12 rounded-full bg-[#EBF3FA] flex items-center justify-center text-xl shadow-inner border border-[#93C5FD]/50">
                ✨
              </div>

              <span
                className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#E94B70] font-semibold mb-3 block"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                You & Me ❤️
              </span>

              {/* Display Title */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl text-[#1E293B] font-normal leading-snug tracking-tight mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Different places.
                <span
                  className="block italic font-normal text-[#E94B70] mt-1"
                  style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.15em' }}
                >
                  One day in the same frame.
                </span>
              </h1>

              <div className="w-14 h-px bg-[#CBD5E1] my-2" />

              <p
                className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-sm"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Miles apart across different cities and busy routines, yet for one special day, our worlds were in the exact same frame.
              </p>

              {/* Media summary tag */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium bg-[#EBF3FA] text-[#1E293B]/70 border border-[#93C5FD]/40"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  4 photos, a video, and a little letter from me to you. ❤️
                </span>
              </div>

              {/* Enter Our Story Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  advance();
                }}
                className="mt-7 px-8 py-3 rounded-full bg-[#1E293B] text-[#FFFDF9] text-xs uppercase tracking-[0.22em] font-medium shadow-md hover:bg-[#334155] active:scale-95 transition-all flex items-center gap-2"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Let&apos;s Look Back →
              </button>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              PAGE B (1): Hero Landscape Photograph (4:3 wide landscape)
              ───────────────────────────────────────────────────────────────── */}
          {currentPageDef.type === 'hero' && (
            <motion.div
              key="scrapbook-hero"
              className="w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.01, y: -12 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full max-w-4xl lg:max-w-5xl bg-[#FFFDF9] rounded-xl sm:rounded-2xl shadow-[0_18px_44px_rgba(30,41,59,0.12),0_2px_8px_rgba(0,0,0,0.03)] border border-[#93C5FD]/35 p-2.5 sm:p-3.5 flex flex-col overflow-hidden relative">
                {/* Washi tape accent */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-32 h-7 pointer-events-none rounded-sm shadow-sm"
                  style={{
                    background: 'rgba(254, 243, 199, 0.88)',
                    borderLeft: '1px dashed rgba(0,0,0,0.12)',
                    borderRight: '1px dashed rgba(0,0,0,0.12)',
                    transform: 'translateX(-50%) rotate(-1deg)',
                  }}
                />

                {/* Hero image container */}
                <div
                  className="relative w-full h-[52vh] sm:h-[58vh] lg:h-[64vh] max-h-[660px] bg-[#F0F6FC]/50 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center p-1.5"
                >
                  <img
                    src={photos[0].url}
                    alt={photos[0].caption || 'Hero memory'}
                    className="w-full h-full object-contain pointer-events-none select-none"
                    loading="eager"
                  />
                </div>

                {/* Caption footer */}
                <div className="pt-3 pb-1 px-3 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
                  <p
                    className="text-[#1E293B] text-base sm:text-lg font-semibold tracking-wide"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {photos[0].caption || 'In the same frame at last.'}
                  </p>
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] text-[#64748B] font-medium"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    That Day in May · You &amp; Me ❤️
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              PAGE C (2): Dedicated Video Memory
              ───────────────────────────────────────────────────────────────── */}
          {currentPageDef.type === 'video' && (
            <motion.div
              key="scrapbook-video"
              className="w-full h-full flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.01, y: -12 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <VideoPage video={video} />
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              PAGE D (3): Shared Photograph Gallery (All remaining photos)
              ───────────────────────────────────────────────────────────────── */}
          {currentPageDef.type === 'gallery' && (
            <motion.div
              key="scrapbook-gallery"
              className="w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.01, y: -12 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <GallerySpread photos={photos} />
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              PAGE E (4): Personal Keepsake Letter
              ───────────────────────────────────────────────────────────────── */}
          {currentPageDef.type === 'letter' && (
            <motion.div
              key="scrapbook-letter"
              className="relative w-full max-w-xl bg-[#FFFDF9] rounded-2xl p-7 sm:p-10 shadow-[0_20px_50px_rgba(30,41,59,0.14),0_2px_8px_rgba(0,0,0,0.04)] border border-[#E2E8F0] flex flex-col justify-between max-h-[68vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.01, y: -12 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top Washi Tape strips */}
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

              {/* Letter content */}
              <div>
                <p
                  className="text-[#E94B70] text-2xl sm:text-3xl font-bold mb-4"
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

              {/* Sign-off */}
              <div className="mt-8 pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span
                  className="text-[10px] uppercase tracking-[0.25em] text-[#94A3B8] font-medium"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  A little note for you ❤️
                </span>

                <div className="text-right">
                  <p
                    className="text-[#64748B] text-xs uppercase tracking-wider mb-0.5"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {note.signoff}
                  </p>
                  <p
                    className="text-[#1E293B] text-2xl font-bold"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {note.sender}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Discreet Bottom Navigation Bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-5 sm:px-8 lg:px-14 xl:px-20 py-3 sm:py-3.5 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(235,243,250,0.95) 0%, transparent 100%)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
        }}
      >
        {/* Previous Button */}
        {currentPage > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="pointer-events-auto px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs tracking-[0.18em] uppercase font-medium bg-white/80 text-[#1E293B]/75 hover:bg-white border border-[#CBD5E1]/60 shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            ← Back
          </button>
        ) : (
          <div className="w-20 sm:w-24" aria-hidden />
        )}

        {/* Center Indicator + Turn Hint */}
        <div className="flex flex-col items-center gap-0.5 select-none pointer-events-none">
          <span
            className="text-[11px] sm:text-xs tracking-[0.22em] uppercase font-medium text-[#1E293B]/50 tabular-nums"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {currentPage + 1} of {totalPages}
          </span>

          <AnimatePresence>
            {canTap && (
              <motion.span
                className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold text-[#E94B70]"
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
                {currentPage >= totalPages - 1 ? 'Hope this made you smile ❤️' : 'Keep exploring →'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <div className="w-20 sm:w-24 flex justify-end">
          {currentPage < totalPages - 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                advance();
              }}
              disabled={!canTap || isTransitioning}
              className="pointer-events-auto px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs tracking-[0.18em] uppercase font-medium bg-white/80 text-[#1E293B]/75 hover:bg-white border border-[#CBD5E1]/60 shadow-sm active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-40"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                advance();
              }}
              disabled={!canTap || isTransitioning}
              className="pointer-events-auto px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs tracking-[0.18em] uppercase font-semibold bg-[#1E293B] text-white hover:bg-[#334155] shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-40"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              That&apos;s All ❤️
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
