import React, { forwardRef } from 'react';

/**
 * GoldenSparkIntro — Cinematic Intro from Shiva Blessing to Birthday Stage
 * 
 * Replaces the clock countdown with a seamless, poetic transition:
 *  - Act I:  Warm golden light carried from Shiva's darshan concentrates into
 *            a single luminous spark traveling to the centre of the screen.
 *  - Act II: The spark expands into a radiant ring of light, presenting:
 *            “And now, one last surprise… just for you, Kutty.”
 *            The text dissolves and the ring disperses into delicate outward embers.
 */

export const GoldenSparkIntro = forwardRef(function GoldenSparkIntro(
  {
    text = 'And now, one last surprise… just for you, Kutty.',
    sparkRef,
    ringRef,
    textRef,
    veilRef,
    dispersalRef,
    className = '',
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`fixed inset-0 pointer-events-none select-none z-35 flex items-center justify-center overflow-hidden ${className}`}
      style={{ zIndex: 35 }}
    >
      {/* ── Act I: Atmospheric Transition Veil (Connecting Shiva's Blessing) ── */}
      <div
        ref={veilRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(230, 199, 122, 0.45) 0%, rgba(8, 20, 38, 0.85) 60%, #03060d 100%)',
          opacity: 1,
        }}
      />

      {/* ── Act I: The Single Golden Spark Traveling to Center ───────── */}
      <div
        ref={sparkRef}
        className="absolute w-3 h-3 rounded-full bg-amber-200 pointer-events-none"
        style={{
          boxShadow: '0 0 16px 4px rgba(251, 191, 36, 0.95), 0 0 35px 12px rgba(245, 158, 11, 0.6), 0 0 60px 20px rgba(254, 240, 138, 0.4)',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
        }}
      />

      {/* ── Act II: Luminous Expanding Ring ───────────────────────────── */}
      <div
        ref={ringRef}
        className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full pointer-events-none flex items-center justify-center"
        style={{
          border: '1px solid rgba(253, 224, 71, 0.65)',
          boxShadow: '0 0 30px 6px rgba(245, 158, 11, 0.35), inset 0 0 30px 6px rgba(245, 158, 11, 0.25)',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, rgba(244, 63, 94, 0.05) 50%, transparent 70%)',
          transform: 'scale(0)',
          opacity: 0,
        }}
      />

      {/* ── Act II: Ring Dispersal Particles (Outward Embers) ─────────── */}
      <div
        ref={dispersalRef}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-200"
              style={{
                boxShadow: '0 0 10px 2px rgba(251, 191, 36, 0.8)',
                transform: `rotate(${angle}deg) translate(0px) rotate(-${angle}deg)`,
              }}
            />
          );
        })}
      </div>

      {/* ── Act II: Surprise Dedication Text ──────────────────────────── */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-6 max-w-2xl mx-auto"
        style={{ opacity: 0 }}
      >
        <p className="font-quote italic text-xl sm:text-2xl md:text-3xl text-amber-100 tracking-wide leading-relaxed drop-shadow-[0_0_25px_rgba(251,191,36,0.7)] font-light">
          {text}
        </p>
      </div>
    </div>
  );
});
