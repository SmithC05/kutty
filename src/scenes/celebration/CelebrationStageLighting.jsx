import React, { forwardRef } from 'react';

/**
 * CelebrationStageLighting — Dynamic Spotlights & Atmospheric Glow
 * 
 * Provides:
 *  - Deep midnight navy ambient backdrop
 *  - Dual moving spotlight beams (golden champagne left, rose coral right)
 *  - Stage floor illumination pool
 *  - Luminous halo radiating behind Keerthana's silhouette
 *  - Subtle atmospheric starfield twinkle
 */

export const CelebrationStageLighting = forwardRef(function CelebrationStageLighting(
  {
    spotlightProgress = 1.0, // 0 -> 1 controlled by GSAP
    auraIntensity = 1.0,
    floorGlowIntensity = 1.0,
    className = '',
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 10 }}
    >
      {/* ── Deep Midnight Sky Atmospheric Gradient ────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #0c1836 0%, #070d1e 55%, #03060d 100%)',
        }}
      />

      {/* ── Center Stage Floor Warm Illumination Pool ─────────────── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140vw] max-w-[1200px] h-[35vh] transition-opacity duration-1000"
        style={{
          opacity: floorGlowIntensity * 0.85,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(251, 191, 36, 0.28) 0%, rgba(244, 63, 94, 0.14) 40%, transparent 75%)',
          filter: 'blur(30px)',
        }}
      />

      {/* ── Radiant Halo behind Portrait Silhouette ────────────────── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[650px] h-[75vh] max-h-[750px] rounded-full transition-opacity duration-1000"
        style={{
          opacity: auraIntensity * 0.75,
          background: 'radial-gradient(circle at 50% 45%, rgba(253, 224, 71, 0.22) 0%, rgba(244, 114, 182, 0.12) 42%, transparent 70%)',
          filter: 'blur(45px)',
          transform: `translate(-50%, -50%) scale(${0.85 + auraIntensity * 0.15})`,
        }}
      />

      {/* ── Left Golden Spotlight Beam (Sweeps from Top-Left to Stage Center) ─ */}
      <div
        className="absolute top-[-10%] left-[-15%] md:left-[-8%] w-[110vw] md:w-[70vw] max-w-[900px] h-[115vh] origin-top-left pointer-events-none"
        style={{
          opacity: spotlightProgress * 0.72,
          transform: `rotate(${24 - (1 - spotlightProgress) * 15}deg)`,
          background: 'conic-gradient(from 120deg at 0% 0%, transparent 0deg, rgba(254, 240, 138, 0.28) 18deg, rgba(245, 158, 11, 0.14) 30deg, transparent 45deg)',
          filter: 'blur(18px)',
          transition: 'transform 0.2s ease-out',
        }}
      />

      {/* ── Right Rose/Pink Spotlight Beam (Sweeps from Top-Right to Stage Center) ─ */}
      <div
        className="absolute top-[-10%] right-[-15%] md:right-[-8%] w-[110vw] md:w-[70vw] max-w-[900px] h-[115vh] origin-top-right pointer-events-none"
        style={{
          opacity: spotlightProgress * 0.65,
          transform: `rotate(${-24 + (1 - spotlightProgress) * 15}deg)`,
          background: 'conic-gradient(from 215deg at 100% 0%, transparent 0deg, rgba(253, 164, 175, 0.26) 18deg, rgba(244, 63, 94, 0.12) 30deg, transparent 45deg)',
          filter: 'blur(18px)',
          transition: 'transform 0.2s ease-out',
        }}
      />

      {/* ── Overhead Stage Vignette ──────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(3, 6, 13, 0.65) 100%)',
        }}
      />
    </div>
  );
});
