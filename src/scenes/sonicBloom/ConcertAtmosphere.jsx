import React from 'react';

/**
 * ConcertAtmosphere
 *
 * A passive atmospheric layer that creates the feeling of a small,
 * intimate concert venue behind the SONIC BLOOM interface.
 *
 * Features:
 *   - 2–3 slow-sweeping spotlight beams from the scene edges
 *   - 2 drifting volumetric haze pools
 *   - Song-specific mood presets (speed, intensity, and colors)
 *   - Responds to quiet passages & sustained highs from audio analysis
 *   - Sits at z-index 1, fixed, pointer-events-none
 *   - Zero JS animation loops (pure CSS keyframes)
 *   - Respects prefers-reduced-motion
 */

// Per-song concert stage mood configurations
const SONG_MOODS = [
  // 01 Unnale: lively cyan & coral, slightly faster sweeping beams
  { beamSpeed1: '14s', beamSpeed2: '18s', beamSpeed3: '22s', hazeAlpha: 0.18, beamAlpha: 0.24 },
  // 02 Chella Magale: lavender & pale cyan, slower beams, softer atmosphere
  { beamSpeed1: '22s', beamSpeed2: '28s', beamSpeed3: '32s', hazeAlpha: 0.14, beamAlpha: 0.19 },
  // 03 Magale: deeper blue & violet, layered overlapping light trails
  { beamSpeed1: '25s', beamSpeed2: '30s', beamSpeed3: '34s', hazeAlpha: 0.16, beamAlpha: 0.20 },
  // 04 Alakolava: rich violet & coral tones, intimate stage
  { beamSpeed1: '19s', beamSpeed2: '24s', beamSpeed3: '28s', hazeAlpha: 0.19, beamAlpha: 0.22 },
  // 05 Engey Andha Vennnila: quietest atmosphere, deep midnight blue, slow movement
  { beamSpeed1: '34s', beamSpeed2: '40s', beamSpeed3: '44s', hazeAlpha: 0.09, beamAlpha: 0.13 },
  // 06 Life of Pazham: celebratory energy, cyan, coral & violet moving together
  { beamSpeed1: '13s', beamSpeed2: '17s', beamSpeed3: '21s', hazeAlpha: 0.22, beamAlpha: 0.26 },
];

export function ConcertAtmosphere({
  activeTrackIndex = 0,
  primaryColor = '#0ff0c0',
  secondaryColor = '#ff6b6b',
  accentColor = '#ffd166',
  isClosingState = false,
  isMobile = false,
  audioReactivity = null,
}) {
  const mood = SONG_MOODS[activeTrackIndex] || SONG_MOODS[0];

  // Closing state unifies to a multi-song celebration palette
  const col1 = isClosingState ? '#9d3fe8' : primaryColor;
  const col2 = isClosingState ? '#ff6040' : secondaryColor;
  const col3 = isClosingState ? '#06c9ac' : (accentColor || primaryColor);

  // Audio reactivity modulation
  const isQuiet = audioReactivity?.isQuiet || false;
  const isSustainedHigh = audioReactivity?.isSustainedHigh || false;

  // Modulate alpha based on audio passage mood
  const alphaMult = isQuiet ? 0.6 : isSustainedHigh ? 1.25 : 1.0;
  const beamAlphaHex = Math.floor(Math.min(0.40, mood.beamAlpha * alphaMult) * 255)
    .toString(16)
    .padStart(2, '0');
  const beamFaintHex = Math.floor(Math.min(0.20, mood.beamAlpha * 0.45 * alphaMult) * 255)
    .toString(16)
    .padStart(2, '0');
  const hazeAlphaHex = Math.floor(Math.min(0.35, mood.hazeAlpha * alphaMult) * 255)
    .toString(16)
    .padStart(2, '0');

  // Transition duration for colour & mood shifts
  const transition = 'all 1.1s cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* ── Beam 1: Upper-left → sweeps gently right ────────────────── */}
      <div
        className="sb-beam absolute"
        style={{
          top: 0,
          left: '-5%',
          width: isMobile ? '55vw' : '50vw',
          height: '100vh',
          transformOrigin: '0 0',
          background: `linear-gradient(
            160deg,
            ${col1}${beamAlphaHex} 0%,
            ${col1}${beamFaintHex} 18%,
            transparent 45%
          )`,
          animation: `sb-beam-1 ${mood.beamSpeed1} ease-in-out infinite`,
          transition,
          filter: 'blur(2px)',
        }}
      />

      {/* ── Beam 2: Upper-right → sweeps gently left ─────── */}
      {!isMobile && (
        <div
          className="sb-beam absolute"
          style={{
            top: 0,
            right: '-5%',
            width: '44vw',
            height: '100vh',
            transformOrigin: '100% 0',
            background: `linear-gradient(
              -155deg,
              ${col2}${beamAlphaHex} 0%,
              ${col2}${beamFaintHex} 16%,
              transparent 42%
            )`,
            animation: `sb-beam-2 ${mood.beamSpeed2} ease-in-out infinite`,
            animationDelay: '-8s',
            transition,
            filter: 'blur(3px)',
          }}
        />
      )}

      {/* ── Beam 3: Centre-top — very subtle, vertical ─────────────── */}
      {!isMobile && (
        <div
          className="sb-beam absolute"
          style={{
            top: 0,
            left: '38%',
            width: '26vw',
            height: '85vh',
            transformOrigin: '50% 0',
            background: `linear-gradient(
              180deg,
              ${col3}${beamFaintHex} 0%,
              ${col3}08 25%,
              transparent 60%
            )`,
            animation: `sb-beam-3 ${mood.beamSpeed3} ease-in-out infinite`,
            animationDelay: '-14s',
            transition,
            filter: 'blur(4px)',
          }}
        />
      )}

      {/* ── Haze pool A: left-centre, larger, primary colour ────────── */}
      <div
        className="sb-haze absolute rounded-full"
        style={{
          width: isMobile ? '60vw' : '55vw',
          height: isMobile ? '45vh' : '50vh',
          left: '2%',
          top: '20%',
          background: `radial-gradient(ellipse at center, ${col1}${hazeAlphaHex} 0%, ${col1}07 45%, transparent 75%)`,
          animation: 'sb-haze 24s ease-in-out infinite',
          transition,
          filter: 'blur(1px)',
        }}
      />

      {/* ── Haze pool B: right-bottom, secondary colour ─────────────── */}
      <div
        className="sb-haze absolute rounded-full"
        style={{
          width: isMobile ? '50vw' : '48vw',
          height: isMobile ? '38vh' : '44vh',
          right: '0%',
          bottom: '10%',
          background: `radial-gradient(ellipse at center, ${col2}${hazeAlphaHex} 0%, ${col2}06 40%, transparent 70%)`,
          animation: 'sb-haze-b 30s ease-in-out infinite',
          animationDelay: '-10s',
          transition,
          filter: 'blur(1px)',
        }}
      />

      {/* ── Subtle floor glow — anchors the scene ───────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '28vh',
          background: `linear-gradient(to top, ${col1}09 0%, transparent 100%)`,
          transition,
        }}
      />
    </div>
  );
}
