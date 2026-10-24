import React, { useEffect, useMemo, useRef } from 'react';
import { Clock3, Mic2, Music2 } from 'lucide-react';

function formatTime(seconds) {
  const safeSeconds = Number.isFinite(Number(seconds)) ? Math.max(0, Number(seconds)) : 0;
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * LyricsPanel — After-Hours Karaoke Lounge
 *
 * Always-visible sing-along lyrics panel.
 * Follows audio playback in real time, auto-scrolls the active line to center,
 * highlights current words with sage-lime / track accent, and supports tap-to-seek.
 */
export function LyricsPanel({ track, currentTime = 0, isPlaying = false, onSeek, className = '' }) {
  const activeLineRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const userScrollTimeoutRef = useRef(null);

  const rawLyrics = track?.lyrics;
  const lyrics = useMemo(
    () => (Array.isArray(rawLyrics) ? rawLyrics.filter((line) => line && (line.text || line.lyric)) : []),
    [rawLyrics]
  );

  const activeLineIndex = useMemo(() => {
    if (!lyrics.length) return -1;
    let index = 0;
    for (let i = 0; i < lyrics.length; i++) {
      const timestamp = Number(lyrics[i].time ?? lyrics[i].start ?? 0);
      if (Number.isFinite(timestamp) && timestamp <= currentTime) {
        index = i;
      }
    }
    return index;
  }, [lyrics, currentTime]);

  // Handle user manual scroll: pause auto-scroll briefly so user can read ahead
  const handleScroll = () => {
    isUserScrollingRef.current = true;
    if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
    userScrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 2800);
  };

  useEffect(() => {
    if (activeLineIndex >= 0 && isPlaying && !isUserScrollingRef.current) {
      activeLineRef.current?.scrollIntoView?.({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLineIndex, isPlaying]);

  const primaryAccent = track?.colors?.primary || '#a3e635';
  const hasLyrics = lyrics.length > 0;

  return (
    <section
      aria-label={hasLyrics ? `Lyrics for ${track?.title || 'the current song'}` : 'Sing-along lyrics'}
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1118]/85 backdrop-blur-xl shadow-xl shadow-black/30 sm:rounded-3xl ${className}`}
      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 16px 40px rgba(0,0,0,0.35)`,
      }}
    >
      {/* Subtle top ambient light glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full blur-3xl"
        style={{ background: `${primaryAccent}15` }}
      />

      {/* Header bar */}
      <div className="relative flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="grid h-8 w-8 place-items-center rounded-lg sm:h-9 sm:w-9"
            style={{
              background: `linear-gradient(145deg, ${primaryAccent}25, rgba(255,255,255,0.04))`,
              border: `1px solid ${primaryAccent}35`,
            }}
          >
            <Mic2 className="h-4 w-4" style={{ color: primaryAccent }} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 sm:text-[13px]">
              Sing Along · {track?.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wide"
            style={{
              color: primaryAccent,
              borderColor: `${primaryAccent}35`,
              background: `${primaryAccent}10`,
            }}
          >
            <span
              className={isPlaying ? 'h-1.5 w-1.5 animate-pulse rounded-full' : 'h-1.5 w-1.5 rounded-full'}
              style={{ backgroundColor: primaryAccent }}
            />
            {isPlaying ? 'Live Lyrics' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Main Lyrics Body: Scrollable, Auto-centering */}
      {hasLyrics ? (
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="relative flex-1 min-h-0 overflow-y-auto px-4 py-8 sm:px-8 sm:py-12 space-y-4 sm:space-y-5"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.15) transparent',
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {lyrics.map((line, index) => {
            const timestamp = Number(line.time ?? line.start ?? 0);
            const active = index === activeLineIndex;
            const distance = Math.abs(index - activeLineIndex);
            const isFar = distance > 2;

            return (
              <div
                key={`${timestamp}-${index}`}
                ref={active ? activeLineRef : null}
                className="transition-all duration-300"
              >
                {/* Optional Vocal Part Marker (e.g. Male Part) */}
                {line.part === 'male' && (index === 0 || lyrics[index - 1]?.part !== 'male') && (
                  <span className="mb-2 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Male Part
                  </span>
                )}
                {line.part === 'female' && (index === 0 || lyrics[index - 1]?.part !== 'female') && (
                  <span className="mb-2 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Female Part
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => Number.isFinite(timestamp) && onSeek?.(timestamp)}
                  className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0e1118] ${
                    active
                      ? 'bg-white/[0.06] shadow-sm shadow-black/20'
                      : 'hover:bg-white/[0.03]'
                  }`}
                  style={{
                    borderLeft: active ? `3px solid ${primaryAccent}` : '3px solid transparent',
                    '--tw-ring-color': primaryAccent,
                  }}
                  aria-current={active ? 'true' : undefined}
                >
                  <span
                    className={`mt-1.5 inline-flex w-10 shrink-0 items-center gap-1 text-[10px] tabular-nums transition-colors ${
                      active ? 'font-semibold text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    <Clock3 className="h-3 w-3 shrink-0" />
                    {formatTime(timestamp)}
                  </span>

                  <span
                    className={`min-w-0 flex-1 leading-snug tracking-tight transition-all duration-300 ${
                      active
                        ? 'text-lg font-bold text-white sm:text-2xl'
                        : isFar
                        ? 'text-sm font-medium text-slate-500 opacity-60 hover:text-slate-300 hover:opacity-90 sm:text-base'
                        : 'text-base font-semibold text-slate-300 opacity-85 hover:text-white sm:text-lg'
                    }`}
                    style={
                      active
                        ? {
                            color: '#ffffff',
                            textShadow: `0 0 20px ${primaryAccent}55`,
                          }
                        : {}
                    }
                  >
                    {line.text || line.lyric}
                  </span>

                  {active && (
                    <span
                      className="ml-auto mt-2 h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: primaryAccent,
                        boxShadow: `0 0 10px ${primaryAccent}`,
                      }}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative flex flex-1 items-center justify-center p-6 text-center">
          <div className="max-w-xs space-y-3">
            <Mic2 className="mx-auto h-8 w-8 text-slate-500" />
            <p className="text-sm font-medium text-slate-300">Sing-along lyrics</p>
            <p className="text-xs text-slate-500">Lyrics for this song will appear here as it plays.</p>
          </div>
        </div>
      )}

      {/* Footer hint */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/[0.07] px-4 py-2 text-[10px] text-slate-500 sm:px-6">
        <span className="inline-flex items-center gap-1.5">
          <Music2 className="h-3.5 w-3.5" /> Tap any line to jump
        </span>
        <span>{lyrics.length} lines</span>
      </div>
    </section>
  );
}
