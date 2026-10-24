import React from 'react';
import { AudioLines, Check, Music2, Pause, Play, SkipBack, SkipForward } from 'lucide-react';

function formatTime(seconds) {
  const safe = Number.isFinite(Number(seconds)) ? Math.max(0, Number(seconds)) : 0;
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Docked streaming-style player for Kutty Radio.
 * Playback and seek state are controlled by SonicBloomScene.
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
  const secondary = activeTrack?.colors?.secondary || '#a78bfa';
  const totalDuration = duration || activeTrack?.audio?.duration || 30;
  const safeCurrentTime = Math.min(totalDuration, Math.max(0, Number(currentTime) || 0));
  const progress = totalDuration > 0 ? (safeCurrentTime / totalDuration) * 100 : 0;
  const isLastTrack = activeTrackIndex === totalTracks - 1;

  return (
    <section
      aria-label="Music player"
      className={`relative w-full overflow-hidden rounded-2xl border border-white/[0.1] px-3 py-3 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:px-5 sm:py-4 ${className}`}
      style={{
        background: 'linear-gradient(115deg, rgba(17,19,31,0.96), rgba(8,10,18,0.95))',
        boxShadow: `0 -12px 50px rgba(0,0,0,0.20), 0 0 32px ${primary}0c`,
      }}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 md:grid-cols-[minmax(0,1fr)_minmax(250px,1.15fr)_minmax(0,1fr)] md:gap-6">
        {/* Current song identity */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl sm:h-14 sm:w-14"
            style={{ background: `linear-gradient(145deg, ${primary}70, ${secondary}45 60%, #10121c)` }}
            aria-hidden="true"
          >
            <span className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 15%, rgba(255,255,255,.38), transparent 55%)' }} />
            {isPlaying ? (
              <AudioLines className="relative h-6 w-6 text-white" />
            ) : (
              <Music2 className="relative h-6 w-6 text-white" />
            )}
            <span className="absolute bottom-0 inset-x-0 h-[2px]" style={{ background: primary }} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{activeTrack?.title || 'Choose a song'}</p>
            <p className="mt-1 truncate text-[11px] text-slate-400">
              {activeTrack?.film || 'A song picked for Kutty'}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: primary }}>
              <span className={isPlaying ? 'h-1.5 w-1.5 animate-pulse rounded-full' : 'h-1.5 w-1.5 rounded-full'} style={{ background: primary }} />
              {isPlaying ? 'Now playing' : 'Ready when you are'}
            </p>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 md:justify-center">
          <button
            type="button"
            onClick={onPreviousTrack}
            disabled={activeTrackIndex <= 0}
            aria-label="Previous song"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 disabled:opacity-30 sm:h-11 sm:w-11"
            style={{ '--tw-ring-color': primary }}
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause song' : 'Play song'}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#10120d] shadow-lg transition hover:scale-[1.04] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1019] sm:h-12 sm:w-12"
            style={{
              background: `linear-gradient(145deg, ${primary}, ${primary}d9)`,
              boxShadow: `0 0 25px ${primary}24`,
              '--tw-ring-color': primary,
            }}
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
          </button>
          <button
            type="button"
            onClick={onNextTrack}
            disabled={activeTrackIndex >= totalTracks - 1}
            aria-label="Next song"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 disabled:opacity-30 sm:h-11 sm:w-11"
            style={{ '--tw-ring-color': primary }}
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Context action */}
        <div className="hidden justify-end md:flex">
          {isLastTrack && onPreviewEnding ? (
            <button
              type="button"
              onClick={onPreviewEnding}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2"
              style={{ borderColor: `${primary}45`, color: primary, '--tw-ring-color': primary }}
            >
              <Check className="h-3.5 w-3.5" />
              Finish playlist
            </button>
          ) : (
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Curated for</p>
              <p className="mt-1 text-sm font-medium text-slate-200">Kutty <span aria-hidden="true">♡</span></p>
            </div>
          )}
        </div>

        {/* Accessible seek slider spans the bottom */}
        <div className="col-span-2 flex min-w-0 items-center gap-2 md:col-span-3 md:gap-3">
          <span className="w-9 shrink-0 text-right text-[10px] tabular-nums text-slate-500">{formatTime(safeCurrentTime)}</span>
          <input
            type="range"
            min="0"
            max={Math.max(1, totalDuration)}
            step="0.1"
            value={safeCurrentTime}
            onChange={(event) => onSeek?.(Number(event.target.value))}
            aria-label="Seek through current song"
            aria-valuetext={formatTime(safeCurrentTime)}
            className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1019]"
            style={{
              accentColor: primary,
              background: `linear-gradient(to right, ${primary} ${progress}%, rgba(255,255,255,0.13) ${progress}%)`,
              '--tw-ring-color': primary,
            }}
          />
          <span className="w-9 shrink-0 text-[10px] tabular-nums text-slate-500">{formatTime(totalDuration)}</span>
          {isLastTrack && onPreviewEnding && (
            <button
              type="button"
              onClick={onPreviewEnding}
              aria-label="Finish playlist"
              className="ml-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border md:hidden"
              style={{ borderColor: `${primary}45`, color: primary }}
            >
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
