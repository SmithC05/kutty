import React, { useState } from 'react';
import {
  Check,
  Heart,
  Maximize2,
  Music2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide-react';

function formatTime(seconds) {
  const safe = Number.isFinite(Number(seconds)) ? Math.max(0, Number(seconds)) : 0;
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * AudioPlayerShell — Docked modern playback bar for Kutty Radio
 *
 * Exact match to reference screenshot with Timer, Heart, Shuffle, Repeat, and Volume controls.
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
  const [hasThumbError, setHasThumbError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(85);
  const [isHearted, setIsHearted] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const primary = activeTrack?.colors?.primary || '#f59e0b';
  const totalDuration = duration || activeTrack?.audio?.duration || 103;
  const safeCurrentTime = Math.min(totalDuration, Math.max(0, Number(currentTime) || 0));
  const progress = totalDuration > 0 ? (safeCurrentTime / totalDuration) * 100 : 0;
  const isLastTrack = activeTrackIndex === totalTracks - 1;

  const imageSrc = !hasThumbError && activeTrack?.thumbnail
    ? activeTrack.thumbnail
    : activeTrack?.artwork || null;

  return (
    <footer
      aria-label="Music player"
      className={`relative w-full overflow-hidden rounded-2xl border px-3 py-2.5 shadow-2xl shadow-black/70 backdrop-blur-2xl font-['DM_Sans',sans-serif] sm:px-5 sm:py-3 transition-all duration-700 ${className}`}
      style={{
        backgroundColor: activeTrack?.colors?.bgMidnight ? `${activeTrack.colors.bgMidnight}fa` : 'rgba(9, 11, 16, 0.95)',
        borderColor: activeTrack?.colors?.borderLight || 'rgba(255,255,255,0.1)',
        boxShadow: `0 -10px 40px rgba(0,0,0,0.6), 0 0 30px ${primary}14`,
      }}
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 md:grid-cols-[minmax(220px,1.1fr)_minmax(320px,1.8fr)_minmax(200px,1fr)] md:gap-x-6">
        {/* 1. Left: Timer + Track Artwork Thumbnail + Metadata + Heart */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            aria-label="Timer"
            className="hidden sm:grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:text-white transition"
          >
            <Timer className="h-4 w-4" />
          </button>

          <div
            className="relative h-11 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#161a24] shadow-md sm:h-12 sm:w-16"
            style={{ borderColor: activeTrack?.colors?.borderLight || 'rgba(255,255,255,0.12)' }}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={activeTrack?.title || 'Current track'}
                onError={() => setHasThumbError(true)}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div
                className="grid h-full w-full place-items-center"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${primary}30, #10131a)`,
                }}
              >
                <Music2 className="h-5 w-5" style={{ color: primary }} />
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
              {activeTrack?.title || 'Choose a song'}
            </p>
            <p className="truncate text-[10px] sm:text-[11px] text-slate-400">
              {activeTrack?.film || activeTrack?.theme || 'Kutty Radio'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsHearted((prev) => !prev)}
            aria-label={isHearted ? 'Remove favourite' : 'Add favourite'}
            className="text-rose-400 hover:text-rose-300 transition p-1"
          >
            <Heart className={`h-4 w-4 ${isHearted ? 'fill-rose-400' : ''}`} />
          </button>
        </div>

        {/* 2. Center: Shuffle + Prev + Large White Play + Next + Repeat + Scrubber */}
        <div className="col-span-2 flex flex-col items-center gap-1.5 md:col-span-1 md:order-2">
          {/* Transport buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsShuffle((prev) => !prev)}
              aria-label="Shuffle"
              className={`hidden sm:grid h-7 w-7 place-items-center rounded-full transition ${
                isShuffle ? '' : 'text-slate-400 hover:text-white'
              }`}
              style={{ color: isShuffle ? primary : undefined }}
            >
              <Shuffle className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={onPreviousTrack}
              disabled={activeTrackIndex <= 0}
              aria-label="Previous song"
              className="grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30 sm:h-9 sm:w-9"
            >
              <SkipBack className="h-4 w-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-black shadow-lg transition hover:scale-105 active:scale-95 focus:outline-none sm:h-11 sm:w-11"
              style={{
                backgroundColor: activeTrack?.colors?.playButtonBg || '#fef3c7',
                color: activeTrack?.colors?.headerIconColor || '#000000',
                boxShadow: `0 0 25px ${activeTrack?.colors?.playButtonGlow || 'rgba(254, 243, 199, 0.45)'}`,
              }}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              )}
            </button>

            <button
              type="button"
              onClick={onNextTrack}
              disabled={activeTrackIndex >= totalTracks - 1}
              aria-label="Next song"
              className="grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30 sm:h-9 sm:w-9"
            >
              <SkipForward className="h-4 w-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={() => setIsRepeat((prev) => !prev)}
              aria-label="Repeat"
              className={`hidden sm:grid h-7 w-7 place-items-center rounded-full transition ${
                isRepeat ? '' : 'text-slate-400 hover:text-white'
              }`}
              style={{ color: isRepeat ? primary : undefined }}
            >
              <Repeat className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="flex w-full min-w-0 items-center gap-2.5">
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
              className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full focus:outline-none"
              style={{
                accentColor: primary,
                background: `linear-gradient(to right, ${primary} ${progress}%, rgba(255,255,255,0.12) ${progress}%)`,
              }}
            />
            <span className="w-8 shrink-0 text-[10px] tabular-nums text-slate-400">
              {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        {/* 3. Right: Volume control + Maximize / Finish */}
        <div className="hidden items-center justify-end gap-3 md:flex md:order-3">
          {/* Volume Icon & Slider */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted((prev) => !prev)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="grid h-7 w-7 place-items-center text-slate-400 hover:text-white transition"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              aria-label="Volume slider"
              className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/20"
              style={{ accentColor: primary }}
            />
          </div>

          {isLastTrack && onPreviewEnding ? (
            <button
              type="button"
              onClick={onPreviewEnding}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition hover:bg-white/[0.08]"
              style={{
                borderColor: `${primary}50`,
                backgroundColor: `${primary}20`,
                color: activeTrack?.colors?.accent || primary,
              }}
            >
              <Check className="h-3.5 w-3.5" />
              Finish
            </button>
          ) : (
            <button
              type="button"
              aria-label="Toggle Fullscreen"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen?.().catch(() => {});
                } else {
                  document.exitFullscreen?.().catch(() => {});
                }
              }}
              className="grid h-7 w-7 place-items-center text-slate-400 hover:text-white transition"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
