import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TrackSelector
 * 
 * Sleek, refined vertical track selector for the six songs.
 * Shows number, title, film credit, and concise emotional theme label.
 * Active track expands its personal note with generous typography.
 * Supports full keyboard navigation and accessible touch targets.
 */
export function TrackSelector({
  tracks = [],
  activeTrackIndex = 0,
  onSelectTrack,
  className = '',
}) {
  const containerRef = useRef(null);

  const handleKeyDown = (e, index) => {
    let nextIndex = index;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % tracks.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + tracks.length) % tracks.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = tracks.length - 1;
    }

    if (nextIndex !== index && onSelectTrack) {
      onSelectTrack(nextIndex);
      // Focus next item button
      const buttons = containerRef.current?.querySelectorAll('button[role="tab"]');
      if (buttons && buttons[nextIndex]) {
        buttons[nextIndex].focus();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Six Songs Sequence"
      className={`flex flex-col space-y-1 sm:space-y-1.5 select-none ${className}`}
    >
      {tracks.map((track, idx) => {
        const isActive = idx === activeTrackIndex;
        const color = track.colors?.primary || '#00f0ff';
        const secondaryColor = track.colors?.secondary || '#c084fc';

        return (
          <div
            key={track.id}
            className="group relative transition-all duration-300"
          >
            {/* Interactive Track Header Button */}
            <button
              type="button"
              role="tab"
              id={`sonic-track-tab-${idx}`}
              aria-selected={isActive}
              aria-controls={`sonic-track-panel-${idx}`}
              tabIndex={0}
              onClick={() => onSelectTrack(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`w-full text-left min-h-[44px] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-slate-900/95 via-indigo-950/70 to-slate-900/85 border-cyan-400/40 shadow-[0_2px_16px_rgba(0,240,255,0.12)]'
                  : 'bg-slate-950/40 hover:bg-slate-900/50 border-white/5 hover:border-white/15'
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
            >
              {/* Left Column: Index & Song Details */}
              <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
                {/* Illuminated Track Index Pill */}
                <span
                  className={`font-sonic-mono text-[11px] sm:text-xs font-bold tracking-wider transition-colors duration-300 px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-400/40'
                      : 'text-slate-300 group-hover:text-white bg-slate-900/70 border border-white/5'
                  }`}
                >
                  {track.trackNumber}
                </span>

                {/* Song Title & Film */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline space-x-1.5 leading-tight">
                    <span
                      className={`font-sonic-body text-[13px] sm:text-[14px] font-semibold tracking-normal transition-colors truncate ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {track.title}
                    </span>
                    {track.film && (
                      <span className="font-sonic-body text-[11px] text-slate-300/80 font-normal truncate">
                        • {track.film}
                      </span>
                    )}
                  </div>
                  {/* Emotional Theme Label */}
                  <p
                    className={`font-sonic-body text-[10.5px] sm:text-[11px] tracking-normal leading-tight transition-colors truncate mt-0.5 ${
                      isActive ? 'text-cyan-300 font-medium' : 'text-slate-300'
                    }`}
                  >
                    {track.theme}
                  </p>
                </div>
              </div>

              {/* Right Column: Visual Selected Mark */}
              <div className="flex items-center pl-2 flex-shrink-0">
                {isActive ? (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: color }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2.5 w-2.5"
                      style={{ backgroundColor: color }}
                    />
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600/70 group-hover:bg-slate-400 transition-colors" />
                )}
              </div>
            </button>

            {/* Expanded Personal Note for the Active Track */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  id={`sonic-track-panel-${idx}`}
                  role="tabpanel"
                  aria-labelledby={`sonic-track-tab-${idx}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="mt-1 mb-1 mx-0.5 px-3 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-indigo-950/75 via-slate-900/85 to-slate-950/90 border-l-2 border-t border-r border-b border-t-white/5 border-r-white/5 border-b-white/5 shadow-inner"
                    style={{ borderLeftColor: color }}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: secondaryColor }}
                      />
                      <span className="font-sonic-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-300/90">
                        Personal Note
                      </span>
                    </div>

                    <p className="font-sonic-body text-xs sm:text-[13px] leading-relaxed text-slate-100 italic tracking-normal">
                      “{track.personalNote}”
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hairline subtle divider */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mt-0.5" />
          </div>
        );
      })}
    </div>
  );
}
