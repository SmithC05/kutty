import React, { useEffect, useMemo, useRef } from 'react';
import { Clock3, Mic2, Music2 } from 'lucide-react';

function formatTime(seconds) {
  const safeSeconds = Number.isFinite(Number(seconds)) ? Math.max(0, Number(seconds)) : 0;
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * LyricsPanel — Compact, Sing-Along Karaoke Lounge
 *
 * Refined visual footprint (~10% more compact) with DM Sans typography,
 * smooth auto-centering, clear active-line emphasis, and tap-to-seek.
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

  const handleScroll = () => {
    isUserScrollingRef.current = true;
    if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
    userScrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 2500);
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
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1118]/90 backdrop-blur-xl font-['DM_Sans',sans-serif] ${className}`}
      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 35px rgba(0,0,0,0.32)`,
      }}
    >
      {/* Top subtle glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full blur-3xl"
        style={{ background: `${primaryAccent}12` }}
      />

      {/* Header bar (Compact) */}
      <div className="relative flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2.5 sm:px-5 sm:py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="grid h-7 w-7 place-items-center rounded-lg sm:h-8 sm:w-8"
            style={{
              background: `linear-gradient(135deg, ${primaryAccent}22, rgba(255,255,255,0.03))`,
              border: `1px solid ${primaryAccent}30`,
            }}
          >
            <Mic2 className="h-3.5 w-3.5" style={{ color: primaryAccent }} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold tracking-wide text-white/90">
              Sing Along · {track?.title}
            </h3>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium"
          style={{
            color: primaryAccent,
            borderColor: `${primaryAccent}30`,
            background: `${primaryAccent}0d`,
          }}
        >
          <span
            className={isPlaying ? 'h-1.5 w-1.5 animate-pulse rounded-full' : 'h-1.5 w-1.5 rounded-full'}
            style={{ backgroundColor: primaryAccent }}
          />
          {isPlaying ? 'Live' : 'Paused'}
        </span>
      </div>

      {/* Main Lyrics Body: Compact, Comfortable Sing-Along */}
      {hasLyrics ? (
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="relative flex-1 min-h-0 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-2.5 sm:space-y-3"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.12) transparent',
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
                className="transition-all duration-200"
              >
                {/* Vocal Part Marker */}
                {line.part === 'male' && (index === 0 || lyrics[index - 1]?.part !== 'male') && (
                  <span className="mb-1.5 inline-block text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                    Male Part
                  </span>
                )}
                {line.part === 'female' && (index === 0 || lyrics[index - 1]?.part !== 'female') && (
                  <span className="mb-1.5 inline-block text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                    Female Part
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => Number.isFinite(timestamp) && onSeek?.(timestamp)}
                  className={`group flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0e1118] ${
                    active
                      ? 'bg-white/[0.06] shadow-sm'
                      : 'hover:bg-white/[0.025]'
                  }`}
                  style={{
                    borderLeft: active ? `2.5px solid ${primaryAccent}` : '2.5px solid transparent',
                    '--tw-ring-color': primaryAccent,
                  }}
                  aria-current={active ? 'true' : undefined}
                >
                  <span
                    className={`mt-1 inline-flex w-9 shrink-0 items-center gap-1 text-[9.5px] tabular-nums transition-colors ${
                      active ? 'font-medium text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    <Clock3 className="h-2.5 w-2.5 shrink-0" />
                    {formatTime(timestamp)}
                  </span>

                  <span
                    className={`min-w-0 flex-1 leading-snug transition-all duration-200 ${
                      active
                        ? 'text-base sm:text-lg md:text-xl font-semibold text-white'
                        : isFar
                        ? 'text-xs sm:text-sm font-normal text-slate-400 opacity-60 hover:text-slate-300 hover:opacity-90'
                        : 'text-xs sm:text-sm font-medium text-slate-300 opacity-85 hover:text-white'
                    }`}
                    style={
                      active
                        ? {
                            color: '#ffffff',
                            textShadow: `0 0 16px ${primaryAccent}45`,
                          }
                        : {}
                    }
                  >
                    {line.text || line.lyric}
                  </span>

                  {active && (
                    <span
                      className="ml-auto mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: primaryAccent,
                        boxShadow: `0 0 8px ${primaryAccent}`,
                      }}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative flex flex-1 items-center justify-center p-4 text-center">
          <div className="max-w-xs space-y-2">
            <Mic2 className="mx-auto h-7 w-7 text-slate-400" />
            <p className="text-xs font-medium text-slate-300">Sing-along lyrics</p>
            <p className="text-[11px] text-slate-400">Lyrics for this song will appear here as it plays.</p>
          </div>
        </div>
      )}

      {/* Footer bar (Compact) */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/[0.06] px-4 py-2 text-[9.5px] text-slate-400 sm:px-5">
        <span className="inline-flex items-center gap-1">
          <Music2 className="h-3 w-3" /> Tap any line to seek
        </span>
        <span>{lyrics.length} lines</span>
      </div>
    </section>
  );
}
