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
      className="fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-between overflow-hidden select-none"
      style={{
        background: `radial-gradient(circle at 50% 40%, ${palette.deepBlue} 0%, ${palette.midnight} 80%)`,
      }}
    >
      {/* ── Top Header ── */}
      <header className="w-full flex justify-center pt-[max(16px,env(safe-area-inset-top))] px-4 z-20">
        <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-amber-400/20 bg-slate-950/40 backdrop-blur-md">
          <span className="text-xs" style={{ color: palette.sacredGold }}>🔱</span>
          <span
            className="text-[11px] uppercase tracking-[0.42em] font-medium"
            style={{ fontFamily: "'Manrope', sans-serif", color: palette.moonSilver }}
          >
            Lord Shiva&apos;s Blessings
          </span>
          <span className="text-xs" style={{ color: palette.sacredGold }}>🔱</span>
        </div>
      </header>

      {/* ── Central Devotional Depiction ── */}
      <div className="relative flex items-center justify-center flex-1 my-auto max-h-[58vh]">
        {/* Soft Celestial Aura */}
        <div
          className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full pointer-events-none transition-all duration-1000"
          style={{
            background: isBlessing
              ? 'radial-gradient(circle, rgba(255,223,136,0.35) 0%, rgba(230,199,122,0.12) 45%, transparent 70%)'
              : 'radial-gradient(circle, rgba(200,226,251,0.25) 0%, rgba(16,43,72,0.1) 50%, transparent 70%)',
          }}
        />

        {/* Lord Shiva Artwork */}
        <img
          src={fallbackArtwork}
          alt="Lord Shiva in Meditation"
          className="relative max-h-[52vh] sm:max-h-[58vh] max-w-[85vw] object-contain drop-shadow-2xl rounded-2xl pointer-events-none"
          style={{
            filter: 'drop-shadow(0 0 28px rgba(16,43,72,0.8))',
          }}
        />
      </div>

      {/* ── Bottom Controls & Blessings ── */}
      <footer className="w-full flex flex-col items-center text-center px-4 pb-[max(24px,env(safe-area-inset-bottom))] z-20">
        <AnimatePresence mode="wait">
          {!isBlessing ? (
            <motion.div
              key="pre-blessing"
              className="flex flex-col items-center max-w-lg"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
            >
              <p
                className="text-base sm:text-lg font-light italic leading-relaxed mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: palette.moonSilver }}
              >
                May Lord Shiva always watch over you, Keerthana, and guide you towards peace and happiness. ❤️
              </p>
              <button
                type="button"
                onClick={onReceiveBlessings}
                aria-label="Receive Lord Shiva's Blessings"
                className="px-8 py-3 rounded-full font-medium tracking-[0.2em] uppercase text-xs transition-all active:scale-95 cursor-pointer"
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
              className="flex flex-col items-center max-w-xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
            >
              <div
                className="rounded-2xl px-6 py-5 mb-3 border border-amber-400/25 backdrop-blur-md"
                style={{ background: 'rgba(8,20,38,0.85)' }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.35em] font-medium mb-2"
                  style={{ fontFamily: "'Manrope', sans-serif", color: palette.sacredGold }}
                >
                  Lord Shiva&apos;s Blessings for Keerthana
                </p>
                <p
                  className="text-sm sm:text-base font-light italic leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', serif", color: palette.moonSilver }}
                >
                  May Lord Shiva bless your dreams, give you wisdom for the choices ahead, and guide you towards a future filled with purpose and joy. 🔱
                </p>
              </div>
              <button
                type="button"
                onClick={onContinue}
                disabled={isTransitioning}
                className="py-2 px-5 rounded-full text-xs uppercase tracking-[0.28em] font-medium border border-sky-300/20 text-sky-200/80 hover:text-sky-100 transition-all cursor-pointer"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Continue to Your Celebration →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}
