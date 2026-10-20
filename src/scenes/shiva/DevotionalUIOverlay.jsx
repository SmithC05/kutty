import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SHIVA_DEPICTION_CONFIG } from './shivaAssets';

/**
 * DevotionalUIOverlay
 * 
 * Cinematic typography and accessible interactive controls:
 * - Act III: "A Moment of Blessings" + serene quote + "Receive Blessings" button
 * - Act IV & V: Reverent blessing card for Keerthana + "Continue to Your Celebration →"
 * - Mobile safe-area constraints and restrained typography
 * - Never covers Lord Shiva's face or central iconography
 */

export function DevotionalUIOverlay({
  act, // 'transition' | 'environment' | 'reveal' | 'blessing' | 'complete'
  onReceiveBlessings,
  onContinue,
  isTransitioning = false,
}) {
  const { palette } = SHIVA_DEPICTION_CONFIG;
  const isReveal = act === 'reveal';
  const isBlessing = act === 'blessing' || act === 'complete';

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between select-none">
      {/* ── TOP HEADER: Sacred Scene Moniker ───────────────────────────────── */}
      <header className="w-full flex justify-center pt-[max(16px,env(safe-area-inset-top))] px-4">
        <AnimatePresence>
          {(isReveal || isBlessing) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 px-5 py-2 rounded-full border border-amber-400/20 bg-slate-950/40 backdrop-blur-md shadow-lg"
            >
              <span className="text-xs" style={{ color: palette.sacredGold }}>🔱</span>
              <span
                className="text-[11px] uppercase tracking-[0.42em] font-medium"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: palette.moonSilver,
                }}
              >
                A Moment of Blessings
              </span>
              <span className="text-xs" style={{ color: palette.sacredGold }}>🔱</span>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── BOTTOM STAGE: Reverent Text & Action Buttons ───────────────────── */}
      <footer className="w-full flex flex-col items-center text-center px-4 sm:px-6 pb-[max(24px,env(safe-area-inset-bottom))]">
        {/* ── ACT III: Pre-Blessing Contemplation ── */}
        <AnimatePresence>
          {isReveal && (
            <motion.div
              className="flex flex-col items-center max-w-lg pointer-events-auto"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Contemplative Quote */}
              <p
                className="text-base sm:text-lg md:text-xl font-light italic leading-relaxed mb-3"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: palette.moonSilver,
                  textShadow: '0 2px 14px rgba(0,0,0,0.85)',
                }}
              >
                &ldquo;May peace find you, strength guide you,<br className="hidden sm:inline" />
                and blessings follow every step.&rdquo;
              </p>

              {/* Ornamental Gold Divider */}
              <div
                className="h-px my-4"
                style={{
                  width: '64px',
                  background: `linear-gradient(to right, transparent, ${palette.sacredGold}, transparent)`,
                }}
              />

              {/* Receive Blessings Button */}
              <motion.button
                type="button"
                onClick={onReceiveBlessings}
                className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-medium tracking-[0.2em] uppercase text-xs sm:text-sm transition-all duration-300 active:scale-95 cursor-pointer shadow-2xl"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  background: 'linear-gradient(135deg, rgba(230,199,122,0.24) 0%, rgba(184,148,64,0.16) 100%)',
                  color: palette.sacredGold,
                  border: `1px solid rgba(230,199,122,0.60)`,
                  backdropFilter: 'blur(14px)',
                  boxShadow: '0 6px 28px rgba(230,199,122,0.22), 0 0 50px rgba(0,0,0,0.5)',
                }}
                whileHover={{
                  background: 'linear-gradient(135deg, rgba(230,199,122,0.40) 0%, rgba(184,148,64,0.28) 100%)',
                  borderColor: palette.sacredGold,
                  scale: 1.04,
                  boxShadow: '0 8px 36px rgba(230,199,122,0.35)',
                }}
                aria-label="Receive Blessings"
              >
                🔱 Receive Blessings
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ACT IV & V: Sacred Birthday Blessing Card ── */}
        <AnimatePresence>
          {isBlessing && (
            <motion.div
              className="flex flex-col items-center max-w-xl pointer-events-auto"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Blessing Editorial Card */}
              <div
                className="relative rounded-2xl px-6 sm:px-9 py-5 sm:py-7 mb-4 backdrop-blur-xl border border-amber-400/25 shadow-2xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(8,20,38,0.85) 0%, rgba(16,43,72,0.80) 100%)',
                  boxShadow: '0 10px 48px rgba(0,0,0,0.65), 0 0 80px rgba(230,199,122,0.08)',
                  maxWidth: '560px',
                }}
              >
                {/* Top Sacred Arch Ornament */}
                <div className="flex items-center gap-3 justify-center mb-3">
                  <div
                    className="h-px flex-1"
                    style={{ background: `linear-gradient(to right, transparent, ${palette.sacredGold})` }}
                  />
                  <span style={{ color: palette.sacredGold, fontSize: '0.95rem' }}>🔱</span>
                  <div
                    className="h-px flex-1"
                    style={{ background: `linear-gradient(to left, transparent, ${palette.sacredGold})` }}
                  />
                </div>

                {/* Subtitle */}
                <p
                  className="text-[10px] sm:text-xs uppercase tracking-[0.36em] font-medium mb-3"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: `${palette.sacredGold}E6`,
                  }}
                >
                  Blessings for Keerthana
                </p>

                {/* Authoritative Required Blessing */}
                <p
                  className="text-sm sm:text-base md:text-lg font-light italic leading-relaxed"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: palette.moonSilver,
                    lineHeight: '1.85',
                    textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                  }}
                >
                  &ldquo;May Lord Shiva guide your path, protect your heart,
                  give you courage through every challenge, and fill your life
                  with peace, happiness, and countless blessings.&rdquo;
                </p>

                {/* Bottom Filigree */}
                <div className="flex items-center gap-3 justify-center mt-3">
                  <div
                    className="h-px flex-1"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(215,231,245,0.25))' }}
                  />
                  <span style={{ color: 'rgba(215,231,245,0.5)', fontSize: '0.65rem' }}>✦</span>
                  <div
                    className="h-px flex-1"
                    style={{ background: 'linear-gradient(to left, transparent, rgba(215,231,245,0.25))' }}
                  />
                </div>
              </div>

              {/* Continue Action */}
              <motion.button
                type="button"
                onClick={onContinue}
                disabled={isTransitioning}
                className="py-2.5 px-6 rounded-full text-xs sm:text-sm uppercase tracking-[0.28em] font-medium transition-all duration-300 cursor-pointer border border-sky-300/20 bg-slate-900/40 backdrop-blur-md active:scale-95"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: 'rgba(215,231,245,0.75)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.8 }}
                whileHover={{
                  color: palette.moonSilver,
                  borderColor: 'rgba(215,231,245,0.5)',
                  backgroundColor: 'rgba(16,43,72,0.6)',
                }}
              >
                Continue to Your Celebration →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}
