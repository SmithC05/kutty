import React, { useEffect, useMemo, useRef } from 'react';
import { Clock3, Mic2, Music2, Sparkles } from 'lucide-react';

function formatTime(seconds) {
  const safeSeconds = Number.isFinite(Number(seconds)) ? Math.max(0, Number(seconds)) : 0;
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * LyricsPanel
 *
 * Karaoke-style lyrics panel. Add user-provided/licensed lines to a song in
 * sonicBloomSongs as [{ time: seconds, text: '...' }]. The active line follows
 * playback time, and tapping any line seeks to its timestamp.
 */
export function LyricsPanel({ track, currentTime = 0, isPlaying = false, onSeek }) {
  const activeLineRef = useRef(null);
  const lyrics = Array.isArray(track?.lyrics)
    ? track.lyrics.filter((line) => line && (line.text || line.lyric))
    : [];

  const activeLineIndex = useMemo(() => {
    if (!lyrics.length) return -1;
    let index = 0;
    lyrics.forEach((line, lineIndex) => {
      const timestamp = Number(line.time ?? line.start ?? 0);
      if (Number.isFinite(timestamp) && timestamp <= currentTime) index = lineIndex;
    });
    return index;
  }, [lyrics, currentTime]);

  useEffect(() => {
    if (activeLineIndex >= 0 && isPlaying) {
      activeLineRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLineIndex, isPlaying]);

  const accent = track?.colors?.primary || '#a78bfa';
  const hasLyrics = lyrics.length > 0;

  return (
    <section
      aria-label={hasLyrics ? `Lyrics for ${track?.title || 'the current song'}` : 'Sing-along lyrics'}
      className="relative min-h-[340px] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#070914]/75"
      style={{ boxShadow: `inset 0 1px 0 ${accent}12` }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl"
        style={{ background: `${accent}18` }}
      />
      <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 place-items-center rounded-xl"
            style={{ background: `linear-gradient(145deg, ${accent}30, rgba(255,255,255,0.04))`, border: `1px solid ${accent}35` }}
          >
            <Mic2 className="h-5 w-5" style={{ color: accent }} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Sing-along mode
            </p>
            <h3 className="mt-0.5 text-sm font-semibold text-white">
              {hasLyrics ? 'Follow the words' : 'Sing it your way'}
            </h3>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]"
          style={{
            color: hasLyrics ? accent : '#a1a1aa',
            borderColor: hasLyrics ? `${accent}40` : 'rgba(255,255,255,0.10)',
            background: hasLyrics ? `${accent}12` : 'rgba(255,255,255,0.04)',
          }}
        >
          <span className={isPlaying ? 'h-1.5 w-1.5 animate-pulse rounded-full' : 'h-1.5 w-1.5 rounded-full'} style={{ backgroundColor: hasLyrics ? accent : '#71717a' }} />
          {hasLyrics ? 'Synced lyrics' : 'Lyrics pending'}
        </span>
      </div>

      {hasLyrics ? (
        <>
          <div
            className="relative max-h-[min(48vh,420px)] min-h-[260px] overflow-y-auto px-4 py-8 sm:px-6 sm:py-10"
            aria-live="polite"
            aria-atomic="true"
          >
            {lyrics.map((line, index) => {
              const timestamp = Number(line.time ?? line.start ?? 0);
              const active = index === activeLineIndex;
              const distance = Math.abs(index - activeLineIndex);
              const muted = distance > 2;

              return (
                <button
                  key={`${timestamp}-${index}`}
                  ref={active ? activeLineRef : null}
                  type="button"
                  onClick={() => Number.isFinite(timestamp) && onSeek?.(timestamp)}
                  className="group mx-auto flex w-full max-w-xl items-start gap-3 rounded-xl px-2 py-2.5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2"
                  style={{
                    color: active ? '#ffffff' : muted ? '#555969' : '#969bab',
                    opacity: muted ? 0.48 : active ? 1 : 0.82,
                    '--tw-ring-color': accent,
                  }}
                  aria-current={active ? 'true' : undefined}
                >
                  <span className="mt-1 inline-flex w-9 shrink-0 items-center gap-1 text-[10px] tabular-nums text-slate-600">
                    <Clock3 className="h-3 w-3" />
                    {formatTime(timestamp)}
                  </span>
                  <span
                    className={active ? 'text-[19px] font-semibold leading-snug sm:text-[22px]' : 'text-[16px] font-medium leading-snug sm:text-[18px]'}
                    style={active ? { textShadow: `0 0 24px ${accent}65` } : {}}
                  >
                    {line.text || line.lyric}
                  </span>
                  {active && <span className="ml-auto mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }} />}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3 text-[10px] text-slate-500 sm:px-5">
            <span className="inline-flex items-center gap-1.5"><Music2 className="h-3.5 w-3.5" /> Tap a line to jump to it</span>
            <span>{lyrics.length} lines</span>
          </div>
        </>
      ) : (
        <div className="relative flex min-h-[286px] flex-col items-center justify-center px-6 py-8 text-center sm:px-10">
          <div className="relative mb-5 grid h-16 w-16 place-items-center rounded-full" style={{ background: `radial-gradient(circle, ${accent}30, ${accent}08 68%, transparent 70%)` }}>
            <div className="absolute inset-0 rounded-full border" style={{ borderColor: `${accent}35`, boxShadow: `0 0 30px ${accent}15` }} />
            <Mic2 className="h-7 w-7" style={{ color: accent }} />
            <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-amber-200" />
          </div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: accent }}>A little sing-along space</p>
          <h4 className="max-w-sm text-xl font-semibold leading-tight text-white sm:text-2xl">
            Every word, in its own time.
          </h4>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            The synced lyric lines for this track haven’t been added yet. Once they’re included, they’ll light up here as the song plays.
          </p>
          {track?.personalNote && (
            <blockquote className="mt-6 max-w-sm rounded-2xl border px-4 py-3 text-sm leading-relaxed text-slate-200" style={{ borderColor: `${accent}25`, background: `${accent}0c` }}>
              “{track.personalNote}”
            </blockquote>
          )}
        </div>
      )}
    </section>
  );
}
