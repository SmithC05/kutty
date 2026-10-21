import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { sonicBloomConfig } from '../../data/sonicBloomSongs';

/**
 * ClosingDedication
 * 
 * Calm, complete closing moment revealed when Track 06 has been explored.
 * Concludes the six-song narrative with gratitude and warmth.
 * Provides the "Back to the Birthday" action that cleanly returns to the
 * celebration finale without restarting fireworks or losing state.
 */
export function ClosingDedication({
  onBackToBirthday,
  onReturnToTracks,
  className = '',
}) {
  const {
    title = "The Full Blossom",
    message = "Six songs could never say everything, but each one carries a little piece of what you mean to me, Kutty. ❤️",
    backActionText = "Back to the Birthday",
  } = sonicBloomConfig.closing || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`w-full max-w-lg mx-auto rounded-2xl bg-gradient-to-br from-indigo-950/85 via-slate-900/90 to-cyan-950/80 border border-cyan-400/30 p-4 sm:p-5 text-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none ${className}`}
    >
      {/* Delicate Rainbow Accent Line */}
      <div className="w-16 h-1 mx-auto mb-3 rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400 shadow-[0_0_12px_rgba(0,240,255,0.6)]" />

      {/* Distinct Resolution Title */}
      <h2 className="font-sonic-heading text-base sm:text-lg font-bold text-white mb-2">
        {title}
      </h2>

      {/* Meaningful Closing Note */}
      <p className="font-sonic-body text-xs sm:text-[13px] text-slate-100 leading-relaxed max-w-md mx-auto mb-4 font-normal">
        {message}
      </p>

      {/* Actions */}
      <div className="flex flex-col items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={onBackToBirthday}
          aria-label={backActionText}
          className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-amber-500/95 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-sonic-body font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_30px_rgba(245,158,11,0.55)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{backActionText}</span>
          <Sparkles className="w-3.5 h-3.5 opacity-70" />
        </button>

        {onReturnToTracks && (
          <button
            type="button"
            onClick={onReturnToTracks}
            aria-label="Return to track selection"
            className="font-sonic-body text-xs text-slate-400 hover:text-white transition-colors underline underline-offset-4 py-1 cursor-pointer"
          >
            ← Return to Tracks
          </button>
        )}
      </div>
    </motion.div>
  );
}
