import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { usePreload } from '../../context';
import { Typography } from '../core/Typography';

/**
 * PreloadProgress
 *
 * Restrained, elegant progress indicator integrated directly into the opening gift scene.
 * Adheres strictly to the website's cinematic midnight-navy and warm gold aesthetic.
 *
 * Displays:
 * 1. Genuine byte/asset progress percentage and contextual status text during download.
 * 2. Slim glowing progress bar reflecting real download and preparation tasks.
 * 3. Graceful 'ready' invitation once every asset is decoded and verified.
 * 4. Clear, recoverable error state with an instant Retry button if connection fails.
 */
export function PreloadProgress({ isOpening = false, className = '' }) {
  const { status, progress, statusText, isReady, error, retry } = usePreload();

  // ── Error State: Network Failure / Disconnection ───────────────────────────
  if (status === 'error') {
    return (
      <div
        className={`absolute bottom-8 sm:bottom-12 left-0 right-0 flex flex-col items-center justify-center px-4 z-30 pointer-events-auto ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0c1527]/90 border border-rose-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-md max-w-md text-center">
          <div className="flex items-center gap-2 text-rose-300 text-xs sm:text-sm font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error?.message || statusText || 'Unable to download all surprise memories.'}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              retry();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition shadow-[0_0_12px_rgba(59,130,246,0.4)] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-once" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Ready State (Preload Complete) ─────────────────────────────────────────
  if (isReady) {
    return (
      <div
        className={`absolute bottom-8 sm:bottom-12 left-0 right-0 flex justify-center pointer-events-none z-20 transition-opacity duration-1000 ${
          isOpening ? 'opacity-0' : 'opacity-100'
        } ${className}`}
      >
        <Typography
          variant="caption"
          className="animate-pulse opacity-85 tracking-wider normal-case text-xs sm:text-sm text-blue-200/90 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          Your surprise is waiting, Kutty. 💝
        </Typography>
      </div>
    );
  }

  // ── Loading State (In Progress) ────────────────────────────────────────────
  const displayProgress = Math.min(99.9, Math.max(0, Math.round(progress)));
  const displayLabel = isOpening
    ? `Almost ready, preparing your journey… ${displayProgress}%`
    : `${statusText} ${displayProgress}%`;

  return (
    <div
      className={`absolute bottom-7 sm:bottom-11 left-0 right-0 flex flex-col items-center justify-center px-4 z-20 pointer-events-none transition-opacity duration-700 ${
        isOpening && isReady ? 'opacity-0' : 'opacity-100'
      } ${className}`}
    >
      <div className="flex flex-col items-center gap-1.5 max-w-xs w-full">
        {/* Subtle Status Text */}
        <Typography
          variant="caption"
          className="text-[11px] sm:text-xs text-blue-200/80 tracking-wide font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
        >
          {displayLabel}
        </Typography>

        {/* Minimalist Slim Progress Bar */}
        <div className="w-44 sm:w-56 h-[3px] rounded-full bg-blue-950/70 border border-blue-500/25 overflow-hidden shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-amber-300 to-amber-400 transition-all duration-200 ease-out shadow-[0_0_8px_rgba(251,191,36,0.6)]"
            style={{ width: `${Math.max(4, displayProgress)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
