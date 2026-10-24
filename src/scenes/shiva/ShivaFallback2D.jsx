import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SHIVA_DEPICTION_CONFIG } from './shivaAssets';

/**
 * ShivaFallback2D
 * 
 * Deliberate, high-fidelity static devotional fallback rendered when WebGL is unavailable.
 * Uses the genuine Shiva artwork, layered CSS atmospheric backdrop, and full interactive blessing flow.
 */
export function ShivaFallback2D({
  act,
  onReceiveBlessings,
  onContinue,
  isTransitioning = false,
}) {
  const { palette, fallbackArtwork } = SHIVA_DEPICTION_CONFIG;
  const isBlessing = act === 'blessing' || act === 'complete';

  return (
    <div
      className="fixed inset-0 w-full min-h-[100dvh] flex flex-col items-center justify-between overflow-x-hidden overflow-y-auto select-none"
      style={{
        background: `radial-gradient(circle at 50% 40%, ${palette.deepBlue} 0%, ${palette.midnight} 80%)`,
      }}
    >
      {/* ── Top Header ── */}
      <header className="w-full flex justify-center pt-[max(12px,env(safe-area-inset-top))] px-4 z-20 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-amber-400/20 bg-slate-950/40 backdrop-blur-md">
          <span className="text-xs" style={{ color: palette.sacredGold }}>🔱</span>
          <span
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.38em] sm:tracking-[0.42em] font-medium"
            style={{ fontFamily: "'Manrope', sans-serif", color: palette.moonSilver }}
          >
            Lord Shiva&apos;s Blessings
          </span>
          <span className="text-xs" style={{ color: palette.sacredGold }}>🔱</span>
        </div>
      </header>

      {/* ── Central Devotional Depiction ── */}
      <div className="relative flex items-center justify-center shrink-0 my-auto py-2 sm:py-4">
        {/* Soft Celestial Aura */}
        <div
          className="absolute w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full pointer-events-none transition-all duration-1000"
          style={{
            background: isBlessing
              ? 'radial-gradient(circle, rgba(255,223,136,0.35) 0%, rgba(230,199,122,0.12) 45%, transparent 70%)'
              : 'radial-gradient(circle, rgba(200,226,251,0.25) 0%, rgba(16,43,72,0.1) 50%, transparent 70%)',
          }}
        />

        {/* Lord Shiva Artwork — Responsive height for mobile */}
        <img
          src={fallbackArtwork}
          alt="Lord Shiva in Meditation"
          className="relative max-h-[34vh] sm:max-h-[44vh] lg:max-h-[52vh] max-w-[82vw] object-contain drop-shadow-2xl rounded-2xl pointer-events-none"
          style={{
            filter: 'drop-shadow(0 0 28px rgba(16,43,72,0.8))',
          }}
        />
      </div>

      {/* ── Bottom Controls & Blessings ── */}
      <footer className="w-full flex flex-col items-center text-center px-4 pt-2 pb-[max(20px,env(safe-area-inset-bottom))] z-20 shrink-0">
        <AnimatePresence mode="wait">
          {!isBlessing ? (
            <motion.div
              key="pre-blessing"
              className="flex flex-col items-center max-w-lg w-full"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
            >
              <p
                className="text-sm sm:text-base font-light italic leading-relaxed mb-2.5 sm:mb-3 max-w-md"
                style={{ fontFamily: "'Playfair Display', serif", color: palette.moonSilver }}
              >
                May Lord Shiva always watch over you, Keerthana, and guide you towards peace and happiness. ❤️
              </p>
              <button
                type="button"
                onClick={onReceiveBlessings}
                aria-label="Receive Lord Shiva's Blessings"
                className="px-6 sm:px-8 py-3 rounded-full font-medium tracking-[0.18em] sm:tracking-[0.2em] uppercase text-xs transition-all active:scale-95 cursor-pointer shadow-lg"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  background: 'linear-gradient(135deg, rgba(230,199,122,0.24) 0%, rgba(184,148,64,0.16) 100%)',
                  color: palette.sacredGold,
                  border: '1px solid rgba(230,199,122,0.60)',
                }}
              >
                🔱 Receive Lord Shiva&apos;s Blessings
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="post-blessing"
              className="flex flex-col items-center max-w-xl w-full"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
            >
              <div
                className="rounded-2xl px-4 sm:px-6 py-3.5 sm:py-5 mb-3 border border-amber-400/25 backdrop-blur-md w-full max-w-lg"
                style={{ background: 'rgba(8,20,38,0.85)' }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.32em] font-medium mb-1.5 sm:mb-2"
                  style={{ fontFamily: "'Manrope', sans-serif", color: palette.sacredGold }}
                >
                  Lord Shiva&apos;s Blessings for Keerthana
                </p>
                <p
                  className="text-xs sm:text-base font-light italic leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', serif", color: palette.moonSilver }}
                >
                  May Lord Shiva bless your dreams, give you wisdom for the choices ahead, and guide you towards a future filled with purpose and joy. 🔱
                </p>
              </div>
              <button
                type="button"
                onClick={onContinue}
                disabled={isTransitioning}
                className="py-2.5 px-6 rounded-full text-xs uppercase tracking-[0.24em] font-medium border border-sky-300/30 text-sky-200/90 hover:text-sky-100 transition-all cursor-pointer shadow-md bg-slate-900/50 backdrop-blur-md active:scale-95"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Continue to Just You →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}
