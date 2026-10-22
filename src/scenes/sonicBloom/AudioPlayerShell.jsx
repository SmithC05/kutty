import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * AudioPlayerShell
 *
 * A calm, integral player interface.
 * Shows selected song state and live playback progress.
 * Navigation between songs and interactive audio playback are fully live.
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
  const primaryColor = activeTrack?.colors?.primary || '#0ff0c0';
  const isLastTrack = activeTrackIndex === totalTracks - 1;
  const effectiveDuration = duration || activeTrack?.audio?.duration || 30;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100));

  const handleProgressBarClick = (e) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * effectiveDuration);
  };

  return (
    <div
      className={`relative w-full rounded-xl sm:rounded-2xl p-2.5 sm:p-3 select-none ${className}`}
      style={{
        background: 'rgba(2, 3, 14, 0.70)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Song identity line */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-[9px] font-sonic-mono font-bold tracking-[0.22em] uppercase flex-shrink-0 flex items-center gap-1.5"
            style={{ color: `${primaryColor}cc` }}
          >
            {isPlaying && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: primaryColor }}
              />
            )}
            {isPlaying ? 'PLAYING' : 'YOUR PICK'}
          </span>
          <span className="text-slate-600 text-[10px]">·</span>
          <span className="font-sonic-body text-[12px] sm:text-[13px] font-medium text-slate-200 truncate">
            {activeTrack?.title || 'Song'}
          </span>
          {activeTrack?.film && (
            <span className="font-sonic-body text-[11px] text-slate-500 truncate hidden sm:inline">
              — {activeTrack.film}
            </span>
          )}
        </div>

        {/* Explore ending — only on track 6 */}
        {isLastTrack && onPreviewEnding && (
          <button
            type="button"
            onClick={onPreviewEnding}
            aria-label="See the full bloom"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sonic-mono tracking-wide transition-all cursor-pointer focus:outline-none focus-visible:ring-2 flex-shrink-0"
            style={{
              background: `${primaryColor}15`,
              border: `1px solid ${primaryColor}35`,
              color: `${primaryColor}cc`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${primaryColor}25`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${primaryColor}15`;
            }}
          >
            <Music className="w-3 h-3" />
            <span className="hidden sm:inline">Full Bloom</span>
          </button>
        )}
      </div>

      {/* Interactive Progress track */}
      <div className="space-y-1 mb-2.5">
        <div
          role="slider"
          aria-label="Audio progress"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          onClick={handleProgressBarClick}
          className="relative w-full h-[5px] sm:h-[4px] hover:h-[6px] rounded-full overflow-hidden cursor-pointer transition-all"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          title="Click to seek"
        >
          <div
            className="h-full rounded-full pointer-events-none"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(to right, ${primaryColor}80, ${primaryColor})`,
              boxShadow: `0 0 8px ${primaryColor}60`,
              transition: isPlaying ? 'none' : 'width 0.2s ease',
            }}
          />
        </div>
        <div className="flex justify-between font-sonic-mono text-[9px] text-slate-500">
          <span>{formatTime(currentTime)}</span>
          <span style={{ color: `${primaryColor}88` }}>
            {formatTime(effectiveDuration)}
          </span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Track number on the left */}
        <span className="font-sonic-mono text-[9.5px] text-slate-600 w-14">
          {activeTrack?.trackNumber || '01'} / {String(totalTracks).padStart(2, '0')}
        </span>

        {/* Centre: Previous · Play/Pause · Next */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onPreviousTrack}
            disabled={activeTrackIndex === 0}
            aria-label="Previous song"
            className="p-1.5 sm:p-2 rounded-full text-slate-500 hover:text-slate-200 disabled:opacity-25 disabled:hover:text-slate-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            style={{ '--tw-ring-color': primaryColor }}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Central play/pause button */}
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause song' : 'Play song'}
            className="relative p-3 rounded-full transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            style={{
              background: `radial-gradient(circle at 40% 38%, ${primaryColor}30 0%, ${primaryColor}10 65%, transparent 100%)`,
              border: `1.5px solid ${primaryColor}50`,
              boxShadow: `0 0 18px ${primaryColor}20, inset 0 1px 0 ${primaryColor}18`,
              '--tw-ring-color': primaryColor,
              transition: 'all 0.5s ease',
            }}
          >
            {isPlaying ? (
              <Pause
                className="w-4 h-4"
                style={{ color: primaryColor, transition: 'color 0.5s ease' }}
              />
            ) : (
              <Play
                className="w-4 h-4 ml-0.5"
                style={{ color: primaryColor, transition: 'color 0.5s ease' }}
              />
            )}
          </button>

          <button
            type="button"
            onClick={onNextTrack}
            disabled={activeTrackIndex === totalTracks - 1}
            aria-label="Next song"
            className="p-1.5 sm:p-2 rounded-full text-slate-500 hover:text-slate-200 disabled:opacity-25 disabled:hover:text-slate-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            style={{ '--tw-ring-color': primaryColor }}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: repeat symbol */}
        <div className="w-14 flex justify-end">
          <span
            className="font-sonic-mono text-[8.5px] tracking-wider opacity-30"
            style={{ color: primaryColor }}
          >
            ∞
          </span>
        </div>
      </div>
    </div>
  );
}
