import React, { useRef } from 'react';
import { AudioLines, Check, Play } from 'lucide-react';

/**
 * TrackSelector — Space-efficient track list for Kutty Radio
 *
 * Renders the 6-song queue with compact rows, smooth hover states,
 * keyboard accessibility (ArrowUp/Down, Home, End), and clear active/playing state.
 */
export function TrackSelector({
  tracks = [],
  activeTrackIndex = 0,
  onSelectTrack,
  isPlaying = false,
  className = '',
}) {
  const containerRef = useRef(null);

  const handleKeyDown = (event, index) => {
    if (!tracks.length) return;
    let nextIndex = index;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      nextIndex = Math.min(tracks.length - 1, index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      nextIndex = Math.max(0, index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = tracks.length - 1;
    }

    if (nextIndex !== index) {
      onSelectTrack?.(nextIndex);
      containerRef.current
        ?.querySelectorAll('button[data-kutty-track-index]')
        ?.[nextIndex]
        ?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      role="list"
      aria-label="Songs in Kutty Radio"
      className={`flex flex-col gap-1.5 ${className}`}
    >
      {tracks.map((track, index) => {
        const isActive = index === activeTrackIndex;
        const primary = track.colors?.primary || '#a3e635';

        return (
          <div role="listitem" key={track.id}>
            <button
              type="button"
              data-kutty-track-index={index}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelectTrack?.(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`group flex w-full items-center gap-3 rounded-xl px-2.5 py-1.5 sm:py-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0e1118] ${
                isActive
                  ? 'border border-white/[0.12] bg-white/[0.08] shadow-sm'
                  : 'border border-transparent bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.05]'
              }`}
              style={{
                '--tw-ring-color': primary,
              }}
            >
              {/* Track number / playing indicator */}
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-semibold tabular-nums transition-colors"
                style={{
                  background: isActive ? `${primary}20` : 'rgba(255,255,255,0.04)',
                  color: isActive ? primary : '#9ca3af',
                }}
                aria-hidden="true"
              >
                {isActive && isPlaying ? (
                  <AudioLines className="h-4 w-4 animate-pulse" style={{ color: primary }} />
                ) : (
                  track.trackNumber
                )}
              </span>

              {/* Title & metadata */}
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span
                    className={`block truncate text-xs sm:text-[13px] font-semibold transition-colors ${
                      isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {track.title}
                  </span>
                  {isActive && (
                    <span
                      className="shrink-0 text-[9px] font-semibold uppercase tracking-wider"
                      style={{ color: primary }}
                    >
                      {isPlaying ? 'Playing' : 'Selected'}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-slate-400">
                  {[track.film, track.theme].filter(Boolean).join(' · ')}
                </span>
              </span>

              {/* Trailing check or play button */}
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-500 transition-all group-hover:text-white"
                aria-hidden="true"
              >
                {isActive ? (
                  <span
                    className="grid h-6 w-6 place-items-center rounded-full"
                    style={{ background: `${primary}18`, color: primary }}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                ) : (
                  <Play className="h-3.5 w-3.5 translate-x-px opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
