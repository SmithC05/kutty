import React, { useState } from 'react';
import { Play, SkipBack, SkipForward, RotateCcw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AudioPlayerShell
 * 
 * Sleek, restrained player interface shell reserved for the upcoming audio integration.
 * Provides real track navigation (Previous / Next), scrubber presentation, and an
 * unmistakable design-preview state that clearly informs the user without pretending
 * to stream copyrighted music or playing simulated audio.
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
    setTimeout(() => {
      setShowNotice(false);
    }, 4200);
  };

  const primaryColor = activeTrack?.colors?.primary || '#00f0ff';

  return (
    <div
      className={`relative w-full rounded-xl sm:rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl p-2.5 sm:p-3 select-none ${className}`}
    >
      {/* Design Preview Status Badge */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-2 min-w-0">
          <span
            className="inline-block w-2 h-2 rounded-full animate-pulse flex-shrink-0"
            style={{ backgroundColor: primaryColor }}
          />
          <span className="font-sonic-mono text-[10.5px] sm:text-[11px] tracking-wider text-slate-200 font-medium truncate">
            TRACK {activeTrack?.trackNumber || '01'} — {activeTrack?.title || 'Song'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {activeTrackIndex === 5 && onPreviewEnding && (
            <button
              type="button"
              onClick={onPreviewEnding}
              aria-label="Preview closing state resolution"
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-400/30 text-[9.5px] text-indigo-200 font-sonic-mono tracking-wide hover:bg-indigo-900/80 transition-colors cursor-pointer"
            >
              <span>Preview Finale</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePlayAttempt}
            aria-label="Audio Stage Preview Notice"
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/25 text-[9.5px] text-cyan-300 font-sonic-mono tracking-wide hover:bg-cyan-900/60 transition-colors cursor-pointer"
          >
            <Info className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Audio Preview</span>
            <span className="sm:hidden">Audio</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Presentation */}
      <div className="space-y-1 mb-2">
        <div
          className="relative w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden cursor-not-allowed"
          title="Playback progress will connect to audio excerpts in final stage"
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: '0%',
              backgroundColor: primaryColor,
              boxShadow: `0 0 10px ${primaryColor}`,
            }}
          />
        </div>

        <div className="flex justify-between font-sonic-mono text-[9.5px] text-slate-300">
          <span>0:00</span>
          <span>~0:30 (Excerpt)</span>
        </div>
      </div>

      {/* Playback Controls Shell */}
      <div className="flex items-center justify-between">
        {/* Track info hint */}
        <div className="hidden sm:block font-sonic-body text-[11px] text-slate-300 truncate max-w-[150px]">
          {activeTrack?.film ? `Film: ${activeTrack.film}` : 'Selected Track'}
        </div>

        {/* Center Controls */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mx-auto sm:mx-0">
          {/* Previous Track */}
          <button
            type="button"
            onClick={onPreviousTrack}
            disabled={activeTrackIndex === 0}
            aria-label="Previous track"
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Preview Button */}
          <button
            type="button"
            onClick={handlePlayAttempt}
            aria-label="Audio Playback Preview"
            className="relative p-2.5 rounded-full bg-gradient-to-r from-indigo-900/90 to-cyan-900/90 border border-cyan-400/40 text-cyan-200 hover:text-white hover:border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_22px_rgba(0,240,255,0.4)] transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <Play className="w-4 h-4 ml-0.5" />
          </button>

          {/* Next Track */}
          <button
            type="button"
            onClick={onNextTrack}
            disabled={activeTrackIndex === totalTracks - 1}
            aria-label="Next track"
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Replay indicator */}
        <div className="flex items-center space-x-1 text-slate-400">
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="font-sonic-mono text-[9.5px] hidden sm:inline">LOOP</span>
        </div>
      </div>

      {/* Floating Notice Toast */}
      <AnimatePresence>
        {showNotice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="absolute left-2 right-2 -top-16 sm:-top-14 z-40 px-3 py-2 rounded-xl bg-slate-900/95 border border-cyan-400/50 shadow-[0_8px_25px_rgba(0,0,0,0.7)] text-center text-xs text-cyan-200 font-sonic-body"
          >
            <span>Audio playback will connect in final stage. 3D sculpture is in visual mode.</span>
            {onPreviewEnding && (
              <button
                type="button"
                onClick={() => {
                  setShowNotice(false);
                  onPreviewEnding();
                }}
                className="ml-2 underline text-white hover:text-cyan-300 font-medium cursor-pointer"
              >
                [Preview Finale State]
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
