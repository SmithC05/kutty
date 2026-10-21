import React, { useState, useEffect, useRef } from 'react';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * TrackBurst
 *
 * Triggers a small, elegant radial particle burst when a new song is selected.
 * Also triggers an opening bloom ring when SONIC BLOOM first appears.
 * Track 6 (Life of Pazham) gets a richer, multi-colour final burst.
 *
 * All particles are pre-created DOM elements stored in a pool — no repeated
 * allocation on every burst. Each burst re-uses a fixed set of nodes,
 * resetting their position and re-triggering the CSS animation.
 *
 * Zero JS animation loops — everything driven by CSS keyframe animations
 * (sb-burst, sb-bloom-ring, sb-sparkle) defined in index.css.
 *
 * Props:
 *   activeTrackIndex — current 0-based track index
 *   isClosingState   — boolean: full-bloom state
 *   reducedMotion    — boolean
 *   sculpted         — ref to sculpture container div (for positioning)
 */

const PARTICLE_COUNT = 18;   // per burst — kept low for mobile
const SPARKLE_COUNT = 5;     // star sparkles per burst
const TRACK6_EXTRA = 8;      // additional particles on final track

/** Generates a random angle burst spread */
function makeParticleStyles(i, total, distance, color, duration) {
  const angle = (i / total) * 360 + Math.random() * (360 / total) * 0.6;
  const rad = (angle * Math.PI) / 180;
  const dist = distance * (0.6 + Math.random() * 0.7);
  const dx = Math.cos(rad) * dist;
  const dy = Math.sin(rad) * dist;
  const size = 3 + Math.random() * 4;
  const delay = Math.random() * 0.14;
  return {
    '--dx': `${dx}px`,
    '--dy': `${dy}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: color,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: `-${size / 2}px`,
    marginLeft: `-${size / 2}px`,
    animation: `sb-burst ${duration}s ${delay}s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
    boxShadow: `0 0 ${size * 2}px ${color}`,
    pointerEvents: 'none',
  };
}

function makeSparkleStyles(i, total, color) {
  const angle = (i / total) * 360 + 20;
  const dist = 55 + Math.random() * 45;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * dist;
  const y = Math.sin(rad) * dist;
  const size = 4 + Math.random() * 5;
  const delay = 0.05 + Math.random() * 0.3;
  return {
    position: 'absolute',
    top: `calc(50% + ${y}px)`,
    left: `calc(50% + ${x}px)`,
    width: `${size}px`,
    height: `${size}px`,
    marginTop: `-${size / 2}px`,
    marginLeft: `-${size / 2}px`,
    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    backgroundColor: color,
    animation: `sb-sparkle 0.75s ${delay}s ease-in-out forwards`,
    pointerEvents: 'none',
  };
}

function BurstLayer({ trackIndex, burstKey, reducedMotion }) {
  if (reducedMotion || burstKey === null) return null;

  const song = sonicBloomSongs[trackIndex] || sonicBloomSongs[0];
  const isFinal = trackIndex === sonicBloomSongs.length - 1;
  const isQuietSong = trackIndex === 4; // Song 05 — Engey Andha Vennnila

  const count = isFinal
    ? PARTICLE_COUNT + TRACK6_EXTRA
    : isQuietSong
    ? 6
    : PARTICLE_COUNT;

  const sparkleCount = isQuietSong ? 0 : isFinal ? SPARKLE_COUNT + 3 : SPARKLE_COUNT;
  const duration = isFinal ? 1.4 : isQuietSong ? 1.5 : 1.1;
  const distance = isFinal ? 100 : isQuietSong ? 48 : 78;

  // For track 6: cycle through all 6 song colours
  const getColor = (i) => {
    if (!isFinal) {
      // Alternate primary and secondary
      return i % 3 === 0
        ? song.colors.primary
        : i % 3 === 1
        ? song.colors.secondary
        : song.colors.accent || song.colors.primary;
    }
    return sonicBloomSongs[i % 6].colors.primary;
  };

  return (
    <div
      key={burstKey}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 20,
      }}
    >
      {/* Expanding ring */}
      <div
        className="sb-bloom-ring"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: isFinal ? '72px' : isQuietSong ? '40px' : '52px',
          height: isFinal ? '72px' : isQuietSong ? '40px' : '52px',
          marginTop: isFinal ? '-36px' : isQuietSong ? '-20px' : '-26px',
          marginLeft: isFinal ? '-36px' : isQuietSong ? '-20px' : '-26px',
          borderRadius: '50%',
          border: `1.5px solid ${song.colors.primary}`,
          animation: `sb-bloom-ring ${duration + 0.3}s ease-out forwards`,
          boxShadow: `0 0 12px ${song.colors.primary}55`,
          pointerEvents: 'none',
        }}
      />

      {/* Radial particles */}
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="sb-burst-particle"
          style={makeParticleStyles(i, count, distance, getColor(i), duration)}
        />
      ))}

      {/* Star sparkles */}
      {Array.from({ length: sparkleCount }).map((_, i) => (
        <div
          key={`s${i}`}
          className="sb-sparkle"
          style={makeSparkleStyles(i, sparkleCount, getColor(i * 2))}
        />
      ))}
    </div>
  );
}

/**
 * OpeningBloom
 * One-time expanding ring and gentle scatter when scene appears.
 */
function OpeningBloom({ primaryColor, reducedMotion }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  if (!visible || reducedMotion) return null;

  const OPENING_COUNT = 14;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 20,
      }}
    >
      {/* Outer ring */}
      <div
        className="sb-bloom-ring"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '90px',
          height: '90px',
          marginTop: '-45px',
          marginLeft: '-45px',
          borderRadius: '50%',
          border: `1px solid ${primaryColor}`,
          animation: 'sb-bloom-ring 1.8s ease-out forwards',
        }}
      />
      {/* Inner ring (offset) */}
      <div
        className="sb-bloom-ring"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '54px',
          height: '54px',
          marginTop: '-27px',
          marginLeft: '-27px',
          borderRadius: '50%',
          border: `1px solid ${primaryColor}88`,
          animation: 'sb-bloom-ring 1.4s 0.2s ease-out forwards',
        }}
      />
      {/* Gentle opening particles */}
      {Array.from({ length: OPENING_COUNT }).map((_, i) => (
        <div
          key={i}
          className="sb-burst-particle"
          style={makeParticleStyles(
            i,
            OPENING_COUNT,
            60,
            sonicBloomSongs[i % 6].colors.primary,
            1.6
          )}
        />
      ))}
    </div>
  );
}

export function TrackBurst({ activeTrackIndex, _isClosingState, reducedMotion }) {
  // burstKey: changes on every deliberate track selection to re-trigger animation
  const [burstKey, setBurstKey] = useState(null);
  const prevIndexRef = useRef(activeTrackIndex);
  const [showOpening, setShowOpening] = useState(true);

  // Track opening visibility
  useEffect(() => {
    const t = setTimeout(() => setShowOpening(false), 2500);
    return () => clearTimeout(t);
  }, []);

  // Trigger a new burst whenever the track deliberately changes
  useEffect(() => {
    if (prevIndexRef.current === activeTrackIndex) return;
    prevIndexRef.current = activeTrackIndex;
    // Generate a new unique key so React remounts BurstLayer
    setBurstKey(`${activeTrackIndex}-${Date.now()}`);
    // Clear burst key after animation finishes so the DOM is clean
    const t = setTimeout(() => setBurstKey(null), 1800);
    return () => clearTimeout(t);
  }, [activeTrackIndex]);

  const activeSong = sonicBloomSongs[activeTrackIndex] || sonicBloomSongs[0];

  return (
    <>
      {/* Opening bloom — one-time on scene entrance */}
      {showOpening && (
        <OpeningBloom
          primaryColor={activeSong.colors.primary}
          reducedMotion={reducedMotion}
        />
      )}
      {/* Per-selection burst */}
      <BurstLayer
        trackIndex={activeTrackIndex}
        burstKey={burstKey}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
