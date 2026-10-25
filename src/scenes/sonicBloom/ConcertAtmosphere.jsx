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
  // 03 Magale: peaceful twilight lavender & rose, gentle slow haze
  { beamSpeed1: '28s', beamSpeed2: '34s', beamSpeed3: '38s', hazeAlpha: 0.20, beamAlpha: 0.16 },
  // 04 Alakolava: sunlit courtyard, gentle daylight & sage beams
  { beamSpeed1: '24s', beamSpeed2: '30s', beamSpeed3: '36s', hazeAlpha: 0.13, beamAlpha: 0.15 },
  // 05 Engey Andha Vennnila: quietest atmosphere, deep midnight blue, slow movement
  { beamSpeed1: '34s', beamSpeed2: '40s', beamSpeed3: '44s', hazeAlpha: 0.09, beamAlpha: 0.13 },
  // 06 Life of Pazham: uplifting natural daylight, warm sage & soft cream ambient sweeps
  { beamSpeed1: '20s', beamSpeed2: '26s', beamSpeed3: '30s', hazeAlpha: 0.16, beamAlpha: 0.18 },
];

function ConcertAtmosphereComponent({
  activeTrackIndex = 0,
  primaryColor = '#a3e635',
  secondaryColor = '#a78bfa',
  accentColor = '#fde047',
  isClosingState = false,
  isMobile = false,
  audioReactivity = null,
}) {
  const mood = SONG_MOODS[activeTrackIndex] || SONG_MOODS[0];

  // Closing state unifies to a multi-song celebration palette
  const col1 = isClosingState ? '#a3e635' : primaryColor;
  const col2 = isClosingState ? '#c084fc' : secondaryColor;
  const col3 = isClosingState ? '#818cf8' : (accentColor || primaryColor);

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

export const ConcertAtmosphere = React.memo(
  ConcertAtmosphereComponent,
  (prev, next) =>
    prev.activeTrackIndex === next.activeTrackIndex &&
    prev.primaryColor === next.primaryColor &&
    prev.secondaryColor === next.secondaryColor &&
    prev.accentColor === next.accentColor &&
    prev.isClosingState === next.isClosingState &&
    prev.isMobile === next.isMobile &&
    Boolean(prev.audioReactivity?.isQuiet) === Boolean(next.audioReactivity?.isQuiet) &&
    Boolean(prev.audioReactivity?.isSustainedHigh) === Boolean(next.audioReactivity?.isSustainedHigh)
);
export default ConcertAtmosphere;
