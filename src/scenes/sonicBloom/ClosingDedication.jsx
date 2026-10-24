import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { sonicBloomConfig } from '../../data/sonicBloomSongs';

/**
 * ClosingDedication
 *
 * The full bloom — a warm, quiet moment shown when all six songs
 * have been explored. Concludes the experience with gratitude.
 * Returns cleanly to the birthday celebration without restarting it.
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
    title = 'The Full Bloom',
    message = 'Six songs could never say everything, but each one carries a little piece of what you mean to me, Kutty. ❤️',
  } = sonicBloomConfig.closing || {};

  const handleBack = onBackToArtist || onBackToBirthday;
  const handleForward = onContinueToUs || onContinueToWhoIsShe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`w-full max-w-lg mx-auto px-1 text-center select-none ${className}`}
    >
      {/* Colour ribbon — six-song gradient */}
      <div
        className="w-14 h-0.5 mx-auto mb-5 rounded-full"
        style={{
          background:
            'linear-gradient(to right, #0ff0c0, #b57bee, #7c8ff8, #9d3fe8, #4aa8d8, #06c9ac)',
          boxShadow: '0 0 14px rgba(15,240,192,0.45)',
        }}
      />

      {/* Title */}
      <h2 className="font-sonic-heading text-lg sm:text-xl font-bold text-white mb-3 tracking-tight">
        {title}
      </h2>

      {/* Message — comfortable, readable */}
      <p className="font-sonic-body text-[13px] sm:text-[14px] text-slate-200 leading-relaxed max-w-sm mx-auto mb-6 font-normal">
        {message}
      </p>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3">
        {handleForward && (
          <button
            type="button"
            onClick={handleForward}
            aria-label="Continue to Us"
            className="group inline-flex items-center justify-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full font-sonic-body font-semibold text-[13px] tracking-wide transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[44px] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
              color: '#1c1008',
              boxShadow: '0 0 22px rgba(245,158,11,0.30)',
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
            className="group inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full border border-violet-300/25 bg-violet-400/[0.08] hover:bg-violet-400/[0.14] font-sonic-body font-semibold text-[13px] tracking-wide text-violet-100 transition-all hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 min-h-[40px] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to the Portrait</span>
          </button>
        )}

        {onReturnToTracks && (
          <button
            type="button"
            onClick={onReturnToTracks}
            aria-label="Return to the six songs"
            className="font-sonic-body text-[11px] text-slate-500 hover:text-slate-300 transition-colors py-1 cursor-pointer"
          >
            ← Back to the songs
          </button>
        )}
      </div>
    </motion.div>
  );
}
