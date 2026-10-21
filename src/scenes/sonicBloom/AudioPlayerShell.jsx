import React, { useState } from 'react';
import { Play, SkipBack, SkipForward, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AudioPlayerShell
 *
 * A calm, integral player interface — not a settings panel.
 * Clearly shows the selected song state without claiming anything is playing.
 * Navigation between songs is always live and functional.
 * Audio playback remains in the final integration phase.
 */
export function AudioPlayerShell({
  activeTrack,
  activeTrackIndex = 0,
  totalTracks = 6,
  onPreviousTrack,
  onNextTrack,
  onPreviewEnding,
  className = '',
}) {
  const [showNotice, setShowNotice] = useState(false);

  const handlePlayAttempt = () => {
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 3800);
  };

  const primaryColor = activeTrack?.colors?.primary || '#0ff0c0';
  const isLastTrack = activeTrackIndex === totalTracks - 1;

  return (
    <div
      className={`relative w-full rounded-xl sm:rounded-2xl p-2.5 sm:p-3 select-none ${className}`}
      style={{
        background: 'rgba(2, 3, 14, 0.70)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Song identity line — what is selected, not what is "playing" */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* YOUR PICK indicator — no false playing state */}
          <span
            className="text-[9px] font-sonic-mono font-bold tracking-[0.22em] uppercase flex-shrink-0"
            style={{ color: `${primaryColor}aa` }}
          >
            YOUR PICK
          </span>
          <span className="text-slate-600 text-[10px]">·</span>
          <span className="font-sonic-body text-[12px] sm:text-[13px] font-medium text-slate-200 truncate">
            {activeTrack?.title || 'Song'}
          </span>
          {activeTrack?.film && (
            <span className="font-sonic-body text-[11px] text-slate-500 truncate hidden sm:inline">
              — {activeTrack.film}
            </span>
          )}
        </div>

        {/* Explore ending — only on track 6, and not labelled as a dev feature */}
        {isLastTrack && onPreviewEnding && (
          <button
            type="button"
            onClick={onPreviewEnding}
            aria-label="See the full bloom"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sonic-mono tracking-wide transition-all cursor-pointer focus:outline-none focus-visible:ring-2 flex-shrink-0"
            style={{
              background: `${primaryColor}15`,
              border: `1px solid ${primaryColor}35`,
              color: `${primaryColor}cc`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${primaryColor}25`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${primaryColor}15`;
            }}
          >
            <Music className="w-3 h-3" />
            <span className="hidden sm:inline">Full Bloom</span>
          </button>
        )}
      </div>

      {/* Progress track — elegantly resting at zero */}
      <div className="space-y-1 mb-2.5">
        <div
          className="relative w-full h-[3px] rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.07)' }}
          title="Audio coming in the final stage"
        >
          <div
            className="h-full rounded-full"
            style={{
              width: '0%',
              background: `linear-gradient(to right, ${primaryColor}80, ${primaryColor})`,
              boxShadow: `0 0 8px ${primaryColor}60`,
              transition: 'background 0.8s ease',
            }}
          />
        </div>
        <div className="flex justify-between font-sonic-mono text-[9px] text-slate-600">
          <span>—</span>
          <span style={{ color: `${primaryColor}55` }}>audio · final stage</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Track number on the left */}
        <span className="font-sonic-mono text-[9.5px] text-slate-600 w-14">
          {activeTrack?.trackNumber || '01'} / {String(totalTracks).padStart(2, '0')}
        </span>

        {/* Centre: Previous · Play · Next */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onPreviousTrack}
            disabled={activeTrackIndex === 0}
            aria-label="Previous song"
            className="p-1.5 sm:p-2 rounded-full text-slate-500 hover:text-slate-200 disabled:opacity-25 disabled:hover:text-slate-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            style={{ '--tw-ring-color': primaryColor }}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Central play button — distinctive, not a generic circle */}
          <button
            type="button"
            onClick={handlePlayAttempt}
            aria-label="Select for playback"
            className="relative p-3 rounded-full transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            style={{
              background: `radial-gradient(circle at 40% 38%, ${primaryColor}30 0%, ${primaryColor}10 65%, transparent 100%)`,
              border: `1.5px solid ${primaryColor}50`,
              boxShadow: `0 0 18px ${primaryColor}20, inset 0 1px 0 ${primaryColor}18`,
              '--tw-ring-color': primaryColor,
              transition: 'all 0.5s ease',
            }}
          >
            <Play
              className="w-4 h-4 ml-0.5"
              style={{ color: primaryColor, transition: 'color 0.5s ease' }}
            />
          </button>

          <button
            type="button"
            onClick={onNextTrack}
            disabled={activeTrackIndex === totalTracks - 1}
            aria-label="Next song"
            className="p-1.5 sm:p-2 rounded-full text-slate-500 hover:text-slate-200 disabled:opacity-25 disabled:hover:text-slate-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            style={{ '--tw-ring-color': primaryColor }}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: placeholder for future repeat control */}
        <div className="w-14 flex justify-end">
          <span
            className="font-sonic-mono text-[8.5px] tracking-wider opacity-30"
            style={{ color: primaryColor }}
          >
            ∞
          </span>
        </div>
      </div>

      {/* Soft notice when play is tapped */}
      <AnimatePresence>
        {showNotice && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.22 }}
            className="absolute left-2 right-2 -top-14 sm:-top-12 z-40 px-3 py-2 rounded-xl text-center text-[11px] font-sonic-body"
            style={{
              background: 'rgba(5, 7, 18, 0.94)',
              border: `1px solid ${primaryColor}35`,
              boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
              color: `${primaryColor}dd`,
              backdropFilter: 'blur(12px)',
            }}
          >
            Audio connects in the final stage — for now, choose your song above.
            {onPreviewEnding && activeTrackIndex === totalTracks - 1 && (
              <button
                type="button"
                onClick={() => { setShowNotice(false); onPreviewEnding(); }}
                className="ml-2 underline text-white hover:opacity-80 font-medium cursor-pointer"
              >
                See the ending
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
