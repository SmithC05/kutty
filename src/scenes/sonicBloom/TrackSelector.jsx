import React, { useRef, useState } from 'react';
import { Music2, Play } from 'lucide-react';

function QueueThumbnail({ track, isActive }) {
  const [hasError, setHasError] = useState(false);
  const primary = track.colors?.primary || '#f59e0b';
  const imageSrc = !hasError && (track.thumbnail || track.artwork)
    ? (track.thumbnail || track.artwork)
    : null;

  return (
    <div
      className="relative h-9 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#161a24] shadow-sm sm:h-10 sm:w-16"
      style={{
        borderColor: isActive ? `${primary}60` : 'rgba(255,255,255,0.1)',
      }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={track.title}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${primary}30, #0f1219)`,
          }}
        >
          <Music2 className="h-4 w-4" style={{ color: primary }} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
    </div>
  );
}

/**
 * TrackSelector — Six-Song Playlist Queue
 *
 * Exact match to reference screenshot with track number, thumbnail, metadata,
 * and animated golden equalizer on the active track.
 */
function TrackSelectorComponent({
  tracks = [],
  activeTrackIndex = 0,
  onSelectTrack,
  isPlaying = false,
  className = '',
}) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  // Auto-scroll newly active track to the top of the internal queue container
  React.useEffect(() => {
    const activeEl = itemRefs.current[activeTrackIndex];
    if (!activeEl) return;

    const scrollContainer =
      activeEl.closest('[data-queue-scrollable]') ||
      activeEl.parentElement?.parentElement;

    if (scrollContainer) {
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const elementTop = activeEl.getBoundingClientRect().top;
      const currentScrollTop = scrollContainer.scrollTop;
      const targetScroll = currentScrollTop + (elementTop - containerTop) - 6;

      scrollContainer.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [activeTrackIndex]);

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
      className={`flex flex-col gap-1.5 font-['DM_Sans',sans-serif] ${className}`}
    >
      {tracks.map((track, index) => {
        const isActive = index === activeTrackIndex;
        const trackPrimary = track.colors?.primary || '#f59e0b';
        const trackAccent = track.colors?.accent || trackPrimary;

        return (
          <div role="listitem" key={track.id}>
            <button
              ref={(el) => (itemRefs.current[index] = el)}
              type="button"
              data-kutty-track-index={index}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelectTrack?.(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`group flex w-full items-center gap-2.5 rounded-2xl p-2 sm:gap-3 text-left transition-all duration-300 focus:outline-none ${
                isActive
                  ? 'shadow-md border'
                  : 'border border-transparent bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.06]'
              }`}
              style={{
                backgroundColor: isActive ? `${trackPrimary}18` : undefined,
                borderColor: isActive ? `${trackPrimary}55` : undefined,
                boxShadow: isActive ? `0 4px 20px ${trackPrimary}20` : undefined,
              }}
            >
              {/* 1. Track Number Pill */}
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-semibold tabular-nums transition-colors duration-300 ${
                  isActive ? 'border' : 'text-slate-400'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${trackPrimary}26`,
                        borderColor: `${trackPrimary}45`,
                        color: trackAccent,
                      }
                    : undefined
                }
              >
                {track.trackNumber}
              </span>

              {/* 2. Artwork Thumbnail */}
              <QueueThumbnail
                track={track}
                isActive={isActive}
              />

              {/* 3. Title & metadata */}
              <span className="min-w-0 flex-1">
                <span
                  className={`block truncate text-xs sm:text-[13px] font-['Outfit',sans-serif] transition-colors ${
                    isActive ? 'font-bold text-white' : 'font-semibold text-slate-300 group-hover:text-white'
                  }`}
                >
                  {track.title}
                </span>
                <span className="mt-0.5 block truncate text-[10px] sm:text-[11px] text-slate-400">
                  {[track.film, track.theme].filter(Boolean).join(' • ')}
                </span>
              </span>

              {/* 4. Active Equalizer or Circular Play Button */}
              <span className="flex shrink-0 items-center justify-end pr-1 text-right">
                {isActive && isPlaying ? (
                  <span className="flex h-4 w-4 items-end justify-center gap-0.5" aria-label="Playing">
                    <span className="w-0.5 rounded-full animate-pulse h-3" style={{ backgroundColor: trackAccent }} />
                    <span className="w-0.5 rounded-full animate-pulse h-4" style={{ backgroundColor: trackAccent, animationDelay: '0.2s' }} />
                    <span className="w-0.5 rounded-full animate-pulse h-2" style={{ backgroundColor: trackAccent, animationDelay: '0.4s' }} />
                  </span>
                ) : isActive ? (
                  <span className="flex h-4 w-4 items-end justify-center gap-0.5" aria-label="Selected">
                    <span className="w-0.5 rounded-full h-2.5" style={{ backgroundColor: trackAccent }} />
                    <span className="w-0.5 rounded-full h-3.5" style={{ backgroundColor: trackAccent }} />
                    <span className="w-0.5 rounded-full h-2" style={{ backgroundColor: trackAccent }} />
                  </span>
                ) : (
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full border border-white/20 text-slate-400 transition-all group-hover:border-white/40 group-hover:text-white"
                    aria-hidden="true"
                  >
                    <Play className="ml-0.5 h-3 w-3 fill-current" />
                  </span>
                )}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export const TrackSelector = React.memo(TrackSelectorComponent);
export default TrackSelector;

