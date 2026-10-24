import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { sonicBloomConfig } from '../../data/sonicBloomSongs';

/**
 * ClosingDedication
 *
 * Shown when all six songs have been explored or the listener finishes the playlist.
 * Warm closing words leading cleanly to the next scene (Us).
 */
export function ClosingDedication({
  onBackToArtist,
  onBackToBirthday,
  onContinueToUs,
  onContinueToWhoIsShe,
  onReturnToTracks,
  className = '',
}) {
  const {
    title = 'One playlist. Six little feelings.',
    message = 'Six songs could never say everything. I hope each one reminds you how much you mean to me, Kutty. ❤️',
  } = sonicBloomConfig.closing || {};

  const handleBack = onBackToArtist || onBackToBirthday;
  const handleForward = onContinueToUs || onContinueToWhoIsShe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`w-full max-w-md mx-auto px-4 py-6 text-center select-none rounded-3xl border border-white/[0.08] bg-[#12151f]/90 backdrop-blur-xl shadow-2xl font-['DM_Sans',sans-serif] ${className}`}
    >
      {/* Colour accent line */}
      <div
        className="w-16 h-1 mx-auto mb-4 rounded-full"
        style={{
          background:
            'linear-gradient(to right, #a3e635, #c084fc, #818cf8, #a855f7, #38bdf8, #2dd4bf)',
          boxShadow: '0 0 12px rgba(163,230,53,0.3)',
        }}
      />

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 tracking-tight font-['Outfit',sans-serif]">
        {title}
      </h2>

      {/* Message */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto mb-6">
        {message}
      </p>

      {/* Actions */}
      <div className="flex flex-col items-center gap-2.5">
        {handleForward && (
          <button
            type="button"
            onClick={handleForward}
            aria-label="Continue to Us"
            className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs tracking-wide transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 min-h-[42px] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #a3e635, #84cc16)',
              color: '#0a0d08',
              boxShadow: '0 0 20px rgba(163,230,53,0.30)',
            }}
          >
            <span>Continue to Us →</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {handleBack && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to the Portrait"
            className="group inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] font-medium text-xs tracking-wide text-slate-300 transition-all min-h-[38px] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to the Portrait</span>
          </button>
        )}

        {onReturnToTracks && (
          <button
            type="button"
            onClick={onReturnToTracks}
            aria-label="Return to the six songs"
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors py-1 cursor-pointer"
          >
            ← Back to Kutty Radio
          </button>
        )}
      </div>
    </motion.div>
  );
}
