import React, { useState, useEffect, useRef } from 'react';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * TrackBurst
 *
 * Subtle, elegant light particle burst when a new track is selected.
 * Uses lightweight DOM particles and pure CSS animations without blocking rendering.
 */

const PARTICLE_COUNT = 14;
const SPARKLE_COUNT = 4;

function makeParticleStyles(i, total, distance, color, duration) {
  const angle = (i / total) * 360 + Math.random() * (360 / total) * 0.6;
  const rad = (angle * Math.PI) / 180;
  const dist = distance * (0.6 + Math.random() * 0.6);
  const dx = Math.cos(rad) * dist;
  const dy = Math.sin(rad) * dist;
  const size = 3 + Math.random() * 3;
  const delay = Math.random() * 0.12;
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
  const dist = 45 + Math.random() * 40;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * dist;
  const y = Math.sin(rad) * dist;
  const size = 3 + Math.random() * 4;
  const delay = 0.04 + Math.random() * 0.2;
  return {
    position: 'absolute',
    top: `calc(50% + ${y}px)`,
    left: `calc(50% + ${x}px)`,
    width: `${size}px`,
    height: `${size}px`,
    marginTop: `-${size / 2}px`,
    marginLeft: `-${size / 2}px`,
    clipPath:
      'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    backgroundColor: color,
    animation: `sb-sparkle 0.75s ${delay}s ease-in-out forwards`,
    pointerEvents: 'none',
  };
}

function BurstLayer({ trackIndex, burstKey, reducedMotion }) {
  if (reducedMotion || burstKey === null) return null;

  const song = sonicBloomSongs[trackIndex] || sonicBloomSongs[0];
  const count = PARTICLE_COUNT;
  const sparkleCount = SPARKLE_COUNT;
  const duration = 1.0;
  const distance = 65;

  const getColor = (i) => {
    return i % 2 === 0
      ? song.colors.primary
      : song.colors.accent || song.colors.secondary;
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
      {/* Expanding Sound Ring */}
      <div
        className="sb-bloom-ring"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '50px',
          height: '50px',
          marginTop: '-25px',
          marginLeft: '-25px',
          borderRadius: '50%',
          border: `1.5px solid ${song.colors.primary}`,
          animation: `sb-bloom-ring ${duration + 0.2}s ease-out forwards`,
          boxShadow: `0 0 10px ${song.colors.primary}44`,
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

export function TrackBurst({ activeTrackIndex, reducedMotion }) {
  const [burstKey, setBurstKey] = useState(null);
  const prevIndexRef = useRef(activeTrackIndex);

  useEffect(() => {
    if (prevIndexRef.current === activeTrackIndex) return;
    prevIndexRef.current = activeTrackIndex;
    setBurstKey(`${activeTrackIndex}-${Date.now()}`);
    const t = setTimeout(() => setBurstKey(null), 1400);
    return () => clearTimeout(t);
  }, [activeTrackIndex]);

  return (
    <BurstLayer
      trackIndex={activeTrackIndex}
      burstKey={burstKey}
      reducedMotion={reducedMotion}
    />
  );
}
