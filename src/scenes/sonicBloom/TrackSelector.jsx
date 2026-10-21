import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TrackSelector
 *
 * A curated, handcrafted track list — not a data table.
 * The selected track is visually elevated with its song colour and a larger presence.
 * The five inactive tracks form a compact, well-spaced list with minimal visual noise.
 *
 * Keyboard navigation: Arrow keys, Home, End.
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
      className={`flex flex-col select-none ${className}`}
    >
      {tracks.map((track, idx) => {
        const isActive = idx === activeTrackIndex;
        const color = track.colors?.primary || '#0ff0c0';

        return (
          <div key={track.id} className="group relative">
            {/* Track row */}
            <button
              type="button"
              role="tab"
              id={`sonic-track-tab-${idx}`}
              aria-selected={isActive}
              aria-controls={`sonic-track-panel-${idx}`}
              tabIndex={0}
              onClick={() => onSelectTrack(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`w-full text-left min-h-[44px] px-2.5 sm:px-3 py-2 sm:py-2.5 transition-all duration-300 flex items-center gap-3 cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${
                isActive
                  ? 'bg-white/[0.05]'
                  : 'hover:bg-white/[0.03]'
              }`}
              style={{
                focusVisibleRingColor: color,
              }}
            >
              {/* Track number — small, quiet */}
              <span
                className={`font-sonic-mono text-[10px] sm:text-[11px] font-bold tabular-nums flex-shrink-0 w-5 text-right transition-colors duration-300 ${
                  isActive ? '' : 'text-slate-600 group-hover:text-slate-500'
                }`}
                style={isActive ? { color } : {}}
              >
                {track.trackNumber}
              </span>

              {/* Vertical colour bar — only visible when active */}
              <span
                className="w-[2.5px] flex-shrink-0 rounded-full transition-all duration-500"
                style={{
                  height: isActive ? '32px' : '14px',
                  backgroundColor: isActive ? color : 'rgba(255,255,255,0.06)',
                  opacity: isActive ? 1 : 0.6,
                }}
              />

              {/* Song details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-sonic-body leading-tight transition-all duration-300 truncate ${
                      isActive
                        ? 'text-[14px] sm:text-[15px] font-semibold text-white'
                        : 'text-[13px] sm:text-[14px] font-normal text-slate-300 group-hover:text-slate-100'
                    }`}
                  >
                    {track.title}
                  </span>
                  {track.film && (
                    <span className="font-sonic-body text-[11px] text-slate-500 font-normal truncate hidden sm:inline">
                      {track.film}
                    </span>
                  )}
                </div>
                {/* Short human theme label */}
                <p
                  className={`font-sonic-body text-[10.5px] sm:text-[11px] leading-tight transition-colors duration-300 truncate mt-[2px] ${
                    isActive ? 'font-normal' : 'text-slate-500 group-hover:text-slate-400'
                  }`}
                  style={isActive ? { color: `${color}cc` } : {}}
                >
                  {track.theme}
                </p>
              </div>

              {/* Selection indicator — right edge, only for active */}
              <div className="flex-shrink-0 w-5 flex justify-end">
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                  />
                )}
              </div>
            </button>

            {/* Expanded personal note for active track */}
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
                    className="mx-3 mb-1 px-3 py-2.5 sm:py-3 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${color}0a 0%, rgba(255,255,255,0.025) 100%)`,
                      borderLeft: `2px solid ${color}55`,
                    }}
                  >
                    <p className="font-sonic-body text-[12px] sm:text-[13px] leading-relaxed text-slate-200 tracking-[0.01em]">
                      &ldquo;{track.personalNote}&rdquo;
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hairline divider — very subtle */}
            {idx < tracks.length - 1 && (
              <div className="h-[1px] w-full" style={{ background: 'rgba(255,255,255,0.035)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
