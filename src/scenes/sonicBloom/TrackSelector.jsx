import React, { useRef } from 'react';
import { AudioLines, Check, Music2, Play } from 'lucide-react';

/**
 * A familiar streaming-app playlist list, personalized for Kutty.
 * ArrowUp/ArrowDown, Home and End work while a song row is focused.
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
        const secondary = track.colors?.secondary || '#a78bfa';

        return (
          <div role="listitem" key={track.id}>
            <button
              type="button"
              data-kutty-track-index={index}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelectTrack?.(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="group flex min-h-[68px] w-full items-center gap-3 rounded-xl border px-2.5 py-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[#10121c]"
              style={{
                borderColor: isActive ? `${primary}35` : 'transparent',
                background: isActive
                  ? 'linear-gradient(100deg, rgba(255,255,255,0.085), rgba(255,255,255,0.025))'
                  : 'transparent',
                '--tw-ring-color': primary,
              }}
              onMouseEnter={(event) => {
                if (!isActive) event.currentTarget.style.background = 'rgba(255,255,255,0.035)';
              }}
              onMouseLeave={(event) => {
                if (!isActive) event.currentTarget.style.background = 'transparent';
              }}
            >
              <span
                className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg"
                style={{
                  background: `linear-gradient(145deg, ${primary}70, ${secondary}48 58%, #10121c)`,
                  boxShadow: isActive ? `0 0 22px ${primary}1c` : 'none',
                }}
                aria-hidden="true"
              >
                <span className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(circle at 25% 20%, rgba(255,255,255,.6), transparent 52%)' }} />
                {isActive && isPlaying ? (
                  <AudioLines className="relative h-5 w-5 text-white" />
                ) : (
                  <Music2 className="relative h-5 w-5 text-white/90" />
                )}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: primary }} />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className={`block truncate text-[13px] font-semibold ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                    {track.title}
                  </span>
                  {isActive && isPlaying && (
                    <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: primary }}>Playing</span>
                  )}
                </span>
                <span className="mt-1 block truncate text-[11px] text-slate-500">
                  {[track.film, track.theme].filter(Boolean).join(' · ')}
                </span>
              </span>

              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-500 transition-all group-hover:text-white" aria-hidden="true">
                {isActive ? (
                  <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: `${primary}18`, color: primary }}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <Play className="h-4 w-4 translate-x-px opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
