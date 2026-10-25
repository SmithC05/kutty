import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoFrame } from './PhotoFrame';

/**
 * MemoryPage — renders a single page of the Just You portrait journal.
 *
 * Portrait-First Editorial Photography Experience:
 *   - Explicit three-row layout: header / full-viewport content / reserved nav space.
 *   - Single photo: large vertical portrait alongside dedicated editorial typography column.
 *   - Two photos: large vertical portraits side-by-side with subtle asymmetry.
 *   - Three photos: featured landscape with editorial copy alongside paired vertical portraits.
 *   - Finale: signature portrait given primary scale priority with companion photo alongside.
 *   - Photo clarity: clean ivory surrounds, pale blush borders, soft shadows, no obscuring vignettes.
 */

// Shared page-enter / exit animation variants
const pageVariants = {
  initial: { opacity: 0, y: 14, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -10, scale: 1.005 },
};
const pageTransition = { duration: 0.75, ease: [0.22, 1, 0.36, 1] };

export function MemoryPage({ pageData, isVisible }) {
  if (!pageData) return null;

  const { photos = [], template, theme = 'journal', stageTitle, pageNumber, pageTotal } = pageData;

  // Only render for journal theme (scrapbook has its own dedicated renderer)
  if (theme !== 'journal') return null;

  const isSingle = photos.length === 1 || template.id === 'HeroSingle';
  const isDuo    = photos.length === 2 && template.id !== 'EditorialFinale';
  const isFinale = template.id === 'EditorialFinale' || (photos.length === 2 && photos.some(p => p.emphasis === 'collage-hero'));
  const isTrio   = photos.length === 3 || template.id === 'MixedTrio';

  // Identify landscape vs portrait in trio
  const landscapeIdx  = isTrio ? photos.findIndex((p) => p.orientation === 'landscape') : -1;
  const topLandscapeIdx = landscapeIdx >= 0 ? landscapeIdx : 0;
  const bottomPortraitIndices = isTrio ? [0, 1, 2].filter((i) => i !== topLandscapeIdx) : [];

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={pageData.id}
          className="absolute inset-0 flex flex-col overflow-hidden select-none"
          style={{ paddingBottom: '68px' /* reserved space for bottom navigation bar */ }}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          {/* ── Atmospheric Ambient Warmth Behind Frames (Never Over Photos) ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 75% 60% at 50% 45%, rgba(245,184,168,0.08) 0%, rgba(243,217,162,0.04) 50%, transparent 80%)',
            }}
          />

          {/* ── Stage / Chapter Header ─────────────────────────────────────── */}
          <motion.header
            className="shrink-0 flex items-center justify-between px-5 sm:px-8 lg:px-14 xl:px-20 pt-3.5 sm:pt-4 pb-2 sm:pb-2.5 z-20"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Left: Chapter + stage label */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <span className="block w-5 sm:w-8 h-px bg-[#F5B8A8]/65 shrink-0" />
              <span
                className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#8B4860]/85 font-medium truncate"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {stageTitle || 'Little You'}
              </span>
            </div>

            {/* Right: Page counter */}
            {pageNumber != null && pageTotal != null && (
              <span
                className="text-[10px] sm:text-xs tracking-[0.22em] text-[#8B4860]/55 font-medium tabular-nums shrink-0 ml-3"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {String(pageNumber).padStart(2, '0')}
                {' '}
                <span className="opacity-40">/</span>
                {' '}
                {String(pageTotal).padStart(2, '0')}
              </span>
            )}
          </motion.header>

          {/* Hairline separator */}
          <motion.div
            className="shrink-0 mx-5 sm:mx-8 lg:mx-14 xl:mx-20 h-px bg-[#F5B8A8]/18 z-20"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left center' }}
          />

          {/* ── Editorial Photo Composition ─────────────────────────────────── */}
          <div className="flex-1 min-h-0 flex items-center justify-center w-full px-3 sm:px-6 lg:px-12 xl:px-16 overflow-y-auto lg:overflow-hidden">

            {/* ── Case 1: Hero Single (Single-Photo Page) ── */}
            {isSingle && (
              <div className="flex flex-col lg:flex-row items-center justify-start lg:justify-center w-full h-full max-w-6xl gap-4 sm:gap-6 lg:gap-12 xl:gap-16 py-2 lg:py-0 overflow-y-auto lg:overflow-visible">
                {/* Large vertical portrait frame */}
                <div className="shrink-0 flex items-center justify-center">
                  <PhotoFrame
                    photo={photos[0]}
                    className="w-[72vw] max-w-[260px] sm:max-w-[320px] lg:max-w-[430px] xl:max-w-[470px] h-[36vh] sm:h-[46vh] lg:h-[66vh] xl:h-[70vh] max-h-[720px]"
                    index={0}
                    variant="journal"
                    tilt={0}
                    hideCaption={false} // Clean caption visible below frame
                  />
                </div>

                {/* Separate editorial typography & storytelling column (Desktop and Mobile) */}
                <div className="flex flex-col justify-center text-center lg:text-left max-w-sm sm:max-w-md xl:max-w-lg px-2 lg:px-0">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 lg:mb-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] tracking-[0.28em] uppercase font-semibold text-[#8B4860] bg-[#FAF7F2] border border-[#F5B8A8]/40 shadow-xs"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Little You
                    </span>
                  </div>

                  <h2
                    className="text-[#45152D] text-xl sm:text-2xl lg:text-4xl xl:text-[2.75rem] font-normal italic leading-[1.18] mb-2 lg:mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    “{photos[0]?.caption || 'Where your story began.'}”
                  </h2>

                  <div className="w-12 lg:w-16 h-px bg-[#F5B8A8]/60 mx-auto lg:mx-0 mb-2.5 lg:mb-4" />

                  <p
                    className="text-[#45152D]/80 text-xs sm:text-sm lg:text-[15px] font-normal leading-relaxed italic"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Look at little Keerthana beside her birthday cake! ❤️ It’s so sweet getting a glimpse of the little girl you were. I’m glad I get to know the person you are today — and call you my best friend.
                  </p>

                  <div className="mt-3 lg:mt-6 pt-2 lg:pt-4 border-t border-[#F5B8A8]/20 flex items-center justify-center lg:justify-start gap-2">
                    <span
                      className="text-[10px] tracking-[0.3em] uppercase text-[#8B4860]/80 font-medium"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Little Keerthana ❤️
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Case 2: Duo Portraits (Two-Photo Pages) ── */}
            {isDuo && (
              <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-10 xl:gap-14 w-full h-full max-w-5xl">
                {photos.map((photo, i) => {
                  // Subtle vertical offset for visual rhythm without scrapbook clutter
                  const asymmetryClass = i === 1 ? 'sm:mt-6 lg:mt-8' : '';
                  return (
                    <PhotoFrame
                      key={photo.id || i}
                      photo={photo}
                      className={`w-[48%] sm:w-[44%] lg:w-[40%] xl:w-[38%] max-w-[430px] h-[50vh] sm:h-[60vh] lg:h-[68vh] xl:h-[72vh] max-h-[720px] ${asymmetryClass}`}
                      index={i}
                      variant="journal"
                      tilt={0}
                    />
                  );
                })}
              </div>
            )}

            {/* ── Case 3: Mixed Trio (Three-Photo Page) ── */}
            {isTrio && (
              <div className="w-full h-full max-w-6xl flex items-center justify-center">
                {/* Desktop: Featured landscape + typography on left, two vertical portraits on right */}
                <div className="hidden lg:flex flex-row items-center justify-center gap-10 xl:gap-14 w-full h-full">
                  {/* Left Column: Featured landscape photo + editorial commentary */}
                  <div className="w-[46%] xl:w-[44%] max-w-[500px] flex flex-col justify-center">
                    <PhotoFrame
                      photo={photos[topLandscapeIdx]}
                      className="w-full h-[32vh] xl:h-[36vh] max-h-[380px]"
                      index={0}
                      variant="journal"
                      tilt={0}
                    />

                    {/* Editorial stage commentary card below landscape */}
                    <div className="mt-5 p-4 rounded-lg bg-[#FAF7F2]/80 border border-[#F5B8A8]/25 text-left shadow-xs">
                      <span
                        className="text-[9px] uppercase tracking-[0.28em] text-[#8B4860] font-semibold block mb-1"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        Growing Up
                      </span>
                      <h3
                        className="text-lg xl:text-xl font-normal italic text-[#45152D] leading-snug mb-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Look at you now, Keerthana ❤️
                      </h3>
                      <p
                        className="text-xs text-[#45152D]/70 font-normal italic leading-relaxed"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        It&apos;s lovely seeing these different moments of your life, Keerthana. I hope these photos make you smile as much as they make me smile. ❤️
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Two tall vertical portraits standing side by side */}
                  <div className="w-[54%] xl:w-[56%] flex flex-row items-center justify-center gap-4 xl:gap-6">
                    {bottomPortraitIndices.map((bIdx, subI) => (
                      <PhotoFrame
                        key={photos[bIdx]?.id || bIdx}
                        photo={photos[bIdx]}
                        className="w-[48%] max-w-[280px] h-[62vh] xl:h-[66vh] max-h-[680px]"
                        index={subI + 1}
                        variant="journal"
                        tilt={0}
                      />
                    ))}
                  </div>
                </div>

                {/* Mobile: Stacked featured landscape above two vertical portraits + commentary card */}
                <div className="flex lg:hidden flex-col items-center justify-start gap-2.5 sm:gap-3.5 w-full h-full overflow-y-auto py-2">
                  {/* Top featured photo */}
                  <PhotoFrame
                    photo={photos[topLandscapeIdx]}
                    className="w-full max-w-[320px] h-[19vh] sm:h-[23vh]"
                    index={0}
                    variant="journal"
                    tilt={0}
                  />

                  {/* Bottom two vertical portraits side-by-side */}
                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 w-full max-w-[320px]">
                    {bottomPortraitIndices.map((bIdx, subI) => (
                      <PhotoFrame
                        key={photos[bIdx]?.id || bIdx}
                        photo={photos[bIdx]}
                        className="w-[48%] max-w-[155px] h-[22vh] sm:h-[26vh]"
                        index={subI + 1}
                        variant="journal"
                        tilt={0}
                      />
                    ))}
                  </div>

                  {/* Editorial stage commentary card below portraits (Mobile) */}
                  <div className="w-full max-w-[320px] p-3 rounded-lg bg-[#FAF7F2]/90 border border-[#F5B8A8]/30 text-center shadow-xs">
                    <span
                      className="text-[9px] uppercase tracking-[0.28em] text-[#8B4860] font-semibold block mb-1"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Growing Up
                    </span>
                    <h3
                      className="text-base font-normal italic text-[#45152D] leading-snug mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Look at you now, Keerthana ❤️
                    </h3>
                    <p
                      className="text-xs text-[#45152D]/80 font-normal italic leading-relaxed"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      It&apos;s lovely seeing these different moments of your life, Keerthana. I hope these photos make you smile as much as they make me smile. ❤️
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Case 4: Editorial Finale (Signature Priority) ── */}
            {isFinale && (
              <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-10 xl:gap-14 w-full h-full max-w-5xl">
                {/* Companion Portrait — Supporting Scale */}
                <div className="w-[42%] sm:w-[38%] lg:w-[32%] xl:w-[30%] max-w-[350px] sm:mt-8 lg:mt-12">
                  <PhotoFrame
                    photo={photos[0]}
                    className="w-full h-[46vh] sm:h-[54vh] lg:h-[60vh] xl:h-[64vh] max-h-[640px]"
                    index={0}
                    variant="journal"
                    tilt={0}
                  />
                </div>

                {/* Signature Hero Portrait — Primary Focal Point with Generous Scale */}
                <div className="w-[54%] sm:w-[50%] lg:w-[44%] xl:w-[42%] max-w-[480px] relative">
                  {/* Warm champagne / blush halo behind signature portrait */}
                  <div
                    className="absolute -inset-4 sm:-inset-6 pointer-events-none rounded-2xl"
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(243,217,162,0.18) 0%, rgba(245,184,168,0.10) 50%, transparent 75%)',
                    }}
                  />

                  <PhotoFrame
                    photo={photos[1]}
                    className="relative w-full h-[52vh] sm:h-[62vh] lg:h-[70vh] xl:h-[74vh] max-h-[760px]"
                    index={1}
                    variant="journal"
                    tilt={0}
                  />
                </div>
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
