import React from 'react';
import { Check, Disc3, Pause, Play, SkipBack, SkipForward } from 'lucide-react';

function formatTime(seconds) {
  const safe = Number.isFinite(Number(seconds)) ? Math.max(0, Number(seconds)) : 0;
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * AudioPlayerShell — Docked modern playback bar for Kutty Radio
 *
 * Space-efficient, familiar controls designed to fit neatly at the bottom of the viewport.
 */
export function AudioPlayerShell({
  activeTrack,
  activeTrackIndex = 0,
  totalTracks = 6,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  onTogglePlay,
  onSeek,
  onPreviousTrack,
  onNextTrack,
  onPreviewEnding,
  className = '',
}) {
  const primary = activeTrack?.colors?.primary || '#a3e635';
  const totalDuration = duration || activeTrack?.audio?.duration || 30;
  const safeCurrentTime = Math.min(totalDuration, Math.max(0, Number(currentTime) || 0));
  const progress = totalDuration > 0 ? (safeCurrentTime / totalDuration) * 100 : 0;
  const isLastTrack = activeTrackIndex === totalTracks - 1;

  return (
    <footer
      aria-label="Music player"
      className={`relative w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11141c]/95 px-3 py-2.5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:px-5 sm:py-3 ${className}`}
      style={{
        boxShadow: `0 -10px 40px rgba(0,0,0,0.35), 0 0 25px ${primary}0a`,
      }}
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 md:grid-cols-[minmax(180px,1fr)_minmax(280px,1.4fr)_minmax(180px,1fr)] md:gap-x-6">
        {/* 1. Current Song Identity */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl sm:h-11 sm:w-11"
            style={{
              background: `linear-gradient(135deg, #181d26, #10131a)`,
              border: `1px solid rgba(255,255,255,0.08)`,
            }}
            aria-hidden="true"
          >
            {isPlaying ? (
              <Disc3 className="h-5 w-5 animate-spin text-white" style={{ animationDuration: '3s', color: primary }} />
            ) : (
              <Disc3 className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs sm:text-sm font-semibold text-white">
              {activeTrack?.title || 'Choose a song'}
            </p>
            <p className="truncate text-[10px] sm:text-[11px] text-slate-400">
              {activeTrack?.film || activeTrack?.theme || 'Curated for Kutty'}
            </p>
          </div>
        </div>

        {/* 2. Playback Controls & Scrubber (Center Column on Desktop) */}
        <div className="col-span-2 flex flex-col items-center gap-1.5 md:col-span-1 md:order-2">
          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onPreviousTrack}
              disabled={activeTrackIndex <= 0}
              aria-label="Previous song"
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 disabled:opacity-30 sm:h-9 sm:w-9"
              style={{ '--tw-ring-color': primary }}
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#0a0d08] shadow-lg transition hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#11141c]"
              style={{
                background: `linear-gradient(135deg, ${primary}, #84cc16)`,
                boxShadow: `0 0 20px ${primary}35`,
                '--tw-ring-color': primary,
              }}
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
            </button>

            <button
              type="button"
              onClick={onNextTrack}
              disabled={activeTrackIndex >= totalTracks - 1}
              aria-label="Next song"
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 disabled:opacity-30 sm:h-9 sm:w-9"
              style={{ '--tw-ring-color': primary }}
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="flex w-full min-w-0 items-center gap-2">
            <span className="w-8 shrink-0 text-right text-[10px] tabular-nums text-slate-400">
              {formatTime(safeCurrentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={Math.max(1, totalDuration)}
              step="0.1"
              value={safeCurrentTime}
              onChange={(e) => onSeek?.(Number(e.target.value))}
              aria-label="Seek through current song"
              aria-valuetext={formatTime(safeCurrentTime)}
              className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[#11141c]"
              style={{
                accentColor: primary,
                background: `linear-gradient(to right, ${primary} ${progress}%, rgba(255,255,255,0.12) ${progress}%)`,
                '--tw-ring-color': primary,
              }}
            />
            <span className="w-8 shrink-0 text-[10px] tabular-nums text-slate-400">
              {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        {/* 3. Trailing Info / Finish Button (Desktop Right) */}
        <div className="hidden items-center justify-end md:flex md:order-3">
          {isLastTrack && onPreviewEnding ? (
            <button
              type="button"
              onClick={onPreviewEnding}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2"
              style={{
                borderColor: `${primary}40`,
                color: primary,
                background: `${primary}12`,
                '--tw-ring-color': primary,
              }}
            >
              <Check className="h-3.5 w-3.5" />
              Finish playlist
            </button>
          ) : (
            <div className="flex items-center gap-2 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Kutty Radio</span>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: primary }}
              />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
