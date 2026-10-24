import React from 'react';
import { ArrowLeft, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { sonicBloomConfig, sonicBloomSongs } from '../../data/sonicBloomSongs';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ClosingDedication — Full-Screen Cinematic Ending for Kutty Radio
 *
 * Requirements satisfied:
 * 1. Full-screen viewport-filling cinematic background with blurred final artwork,
 *    dark translucent overlay, and restrained ambient lighting.
 * 2. Centred dedication with exact copy:
 *    "One playlist. Six little feelings."
 *    "“Six songs could never say everything. I hope each one reminds you how much you mean to me, Kutty. ❤️”"
 * 3. Six song thumbnails in one horizontal row on desktop, touch-friendly scrollable on mobile.
 *    Each includes artwork, song number, title, hover glow, and play icon.
 *    Clicking any thumbnail exits closing state, selects that song, resets to 0, and starts playback.
 * 4. Three clear actions:
 *    - Primary: Continue to Us → (transitions to MEMORY_JOURNEY_TOGETHER)
 *    - Secondary: Listen to All Six Again (restarts from Unnale)
 *    - Tertiary: Back to the Portrait (transitions to ARTIST_CHAPTER)
 * 5. Respects reduced-motion preferences.
 */
export function ClosingDedication({
  tracks = sonicBloomSongs,
  activeTrack = sonicBloomSongs[5],
  finalTrack = sonicBloomSongs[5],
  onSelectTrack,
  onReplayAll,
  onContinueToUs,
  onBackToArtist,
  onReturnToTracks,
  className = '',
}) {
  const reducedMotion = useReducedMotion();

  const {
    title = 'One playlist. Six little feelings.',
    message = 'Six songs could never say everything. I hope each one reminds you how much you mean to me, Kutty. ❤️',
  } = sonicBloomConfig.closing || {};

  const bgArtwork =
    finalTrack?.artwork ||
    activeTrack?.artwork ||
    '/images/kutty-radio/life-of-pazham.webp';

  const themePrimary = activeTrack?.colors?.primary || '#10b981';

  return (
    <motion.div
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
      transition={{ duration: reducedMotion ? 0.15 : 0.45, ease: 'easeOut' }}
      className={`relative z-30 flex h-full max-h-[100dvh] w-full min-h-0 flex-1 flex-col justify-between items-center px-4 py-5 sm:px-8 sm:py-7 overflow-y-auto overflow-x-hidden font-['DM_Sans',sans-serif] text-white select-none ${className}`}
    >
      {/* ── 1. CINEMATIC BACKGROUND LAYERS ── */}
      {/* Blurred final song artwork */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none" aria-hidden="true">
        <img
          src={bgArtwork}
          alt=""
          className="h-full w-full object-cover scale-110 filter blur-3xl opacity-35"
        />
      </div>

      {/* Dark translucent atmosphere overlay */}
      <div
        className="absolute inset-0 -z-10 bg-[#07090e]/85 backdrop-blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Restrained theme ambient radial glow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 32%, ${themePrimary}22 0%, transparent 68%)`,
        }}
        aria-hidden="true"
      />

      {/* Audio-grade noise texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />

      {/* ── 2. CENTRED DEDICATION (TOP) ── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center pt-2 sm:pt-4 shrink-0">
        {/* Subtle multi-colour gradient bar representing all 6 songs */}
        <div
          className="w-20 h-1 mx-auto mb-3.5 rounded-full"
          style={{
            background:
              'linear-gradient(to right, #f59e0b, #fb7185, #c084fc, #38bdf8, #818cf8, #34d399)',
            boxShadow: '0 0 14px rgba(245,158,11,0.35)',
          }}
          aria-hidden="true"
        />

        {/* Small subtitle badge */}
        <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest bg-white/[0.06] border border-white/10 text-slate-300 font-['Outfit',sans-serif] mb-2.5">
          Kutty Radio · Birthday Playlist Completed
        </span>

        {/* Dedication Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight font-['Outfit',sans-serif] mb-2 sm:mb-3 drop-shadow-sm">
          {title}
        </h2>

        {/* Dedication Message */}
        <p className="text-xs sm:text-sm md:text-base text-slate-300 font-['DM_Sans',sans-serif] leading-relaxed max-w-lg mx-auto italic">
          “{message}”
        </p>
      </div>

      {/* ── 3. SIX SONG THUMBNAILS (HORIZONTAL ROW) ── */}
      <div className="relative z-10 w-full max-w-5xl my-auto py-3 sm:py-4 shrink-0">
        <div className="flex items-center justify-between px-2 mb-2 sm:mb-3">
          <span className="text-xs font-bold text-white/90 font-['Outfit',sans-serif] tracking-wide">
            All Six Songs for Kutty
          </span>
          <span className="text-[11px] text-slate-400 font-['DM_Sans',sans-serif]">
            Select any song to listen again
          </span>
        </div>

        {/* Desktop: Exactly 6 columns in 1 row | Mobile: Horizontally scrollable row with smooth snapping */}
        <div
          className="flex overflow-x-auto sm:grid sm:grid-cols-6 gap-2.5 sm:gap-3.5 pb-2 sm:pb-0 pt-1 px-1 snap-x scrollbar-thin sm:overflow-visible w-full"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.15) transparent',
          }}
        >
          {tracks.map((track, index) => {
            const isSelected = track.id === activeTrack?.id;
            const primaryColor = track.colors?.primary || '#f59e0b';
            const accentColor = track.colors?.accent || '#fde047';

            return (
              <button
                key={track.id || index}
                type="button"
                onClick={() => onSelectTrack?.(index)}
                aria-label={`Play song ${track.trackNumber}: ${track.title}`}
                className="group relative flex flex-col text-left shrink-0 w-36 sm:w-auto snap-start rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 p-2 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 cursor-pointer select-none"
                style={{
                  boxShadow: isSelected
                    ? `0 0 20px ${primaryColor}30, 0 4px 16px rgba(0,0,0,0.4)`
                    : '0 4px 14px rgba(0,0,0,0.3)',
                  borderColor: isSelected ? `${primaryColor}65` : undefined,
                }}
              >
                {/* Artwork Thumbnail Container (16:10 aspect ratio) */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-900 border border-white/10">
                  <img
                    src={track.thumbnail || track.artwork}
                    alt={track.title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient shade for legible overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                  {/* Track Number Badge */}
                  <span className="absolute top-1.5 left-1.5 rounded-md bg-black/65 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold text-white/95 font-['Outfit',sans-serif]">
                    {track.trackNumber}
                  </span>

                  {/* Play Indicator on Hover or Focus */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
                    <span
                      className="grid h-8 w-8 place-items-center rounded-full text-black shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    </span>
                  </div>
                </div>

                {/* Track Metadata */}
                <div className="mt-2 min-w-0">
                  <p className="truncate text-xs sm:text-sm font-semibold text-white font-['Outfit',sans-serif] group-hover:text-amber-200 transition-colors">
                    {track.title}
                  </p>
                  <p className="truncate text-[10px] sm:text-[11px] text-slate-400 font-['DM_Sans',sans-serif]">
                    {track.film || track.theme}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. REPLAY AND CONTINUE ACTIONS (BOTTOM) ── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pb-2 sm:pb-3 shrink-0">
        {/* Primary Action: Continue to Us → */}
        {onContinueToUs && (
          <button
            type="button"
            onClick={onContinueToUs}
            aria-label="Continue to Us"
            className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide text-[#0a0d08] transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 shadow-xl cursor-pointer min-h-[44px] w-full sm:w-auto"
            style={{
              background: 'linear-gradient(135deg, #a3e635, #84cc16)',
              boxShadow: '0 0 25px rgba(163,230,53,0.35)',
            }}
          >
            <span>Continue to Us →</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {/* Secondary Action: Listen to All Six Again */}
        {onReplayAll && (
          <button
            type="button"
            onClick={onReplayAll}
            aria-label="Listen to All Six Again"
            className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/30 font-semibold text-xs tracking-wide text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer min-h-[42px] w-full sm:w-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
            <span>Listen to All Six Again</span>
          </button>
        )}

        {/* Tertiary Action: Back to the Portrait */}
        {onBackToArtist && (
          <button
            type="button"
            onClick={onBackToArtist}
            aria-label="Back to the Portrait"
            className="group inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to the Portrait</span>
          </button>
        )}

        {/* Return to normal view helper if provided */}
        {onReturnToTracks && !onReplayAll && (
          <button
            type="button"
            onClick={onReturnToTracks}
            aria-label="Back to Kutty Radio"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors py-1 cursor-pointer"
          >
            ← Back to Kutty Radio
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default ClosingDedication;
