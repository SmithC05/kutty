import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SonicSculpture3D } from './SonicSculpture3D';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * SceneCameraController
 * Responsive camera framing + subtle pointer parallax on desktop.
 */
function SceneCameraController({ reducedMotion = false }) {
  const { camera, size, pointer } = useThree();

  const targetZ = useMemo(() => {
    const aspect = size.width / Math.max(1, size.height);
    if (aspect < 0.6) return 6.8; // Tall narrow mobile (360x806, 320x680)
    if (aspect < 1.0) return 6.0; // Tablet portrait / square
    return 5.1; // Desktop wide
  }, [size.width, size.height]);

  useEffect(() => {
    camera.position.set(0, 0, targetZ);
    camera.lookAt(0, 0, 0);
  }, [camera, targetZ]);

  useFrame(() => {
    if (reducedMotion) return;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.38, 0.038);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.28, 0.038);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * CelebrationDust
 *
 * Small floating particles that feel like confetti dust in a dimly lit venue.
 * Color matches the active song's energy, count is intentionally restrained.
 * Movement is very slow — no laser-light-show effect.
 */
function CelebrationDust({
  primaryColor = '#0ff0c0',
  accentColor = '#ff6b6b',
  reducedMotion = false,
  isQuiet = false,
}) {
  const pointsRef = useRef();
  const accentRef = useRef();

  const [primaryGeo, accentGeo, primaryVels, accentVels] = useMemo(() => {
    const n = reducedMotion ? 28 : 65;
    const na = reducedMotion ? 12 : 28;

    const seed = { v: 0xab37 };
    const rand = () => {
      seed.v = (seed.v * 16807 + 0xf) % 2147483647;
      return (seed.v - 1) / 2147483646;
    };

    // Primary confetti — distributed broadly
    const pPos = new Float32Array(n * 3);
    const pVel = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pPos[i * 3] = (rand() - 0.5) * 15;
      pPos[i * 3 + 1] = (rand() - 0.5) * 11;
      pPos[i * 3 + 2] = (rand() - 0.5) * 9;
      pVel[i * 3] = (rand() - 0.5) * 0.035;
      pVel[i * 3 + 1] = 0.025 + rand() * 0.07; // gently drift upward
      pVel[i * 3 + 2] = (rand() - 0.5) * 0.03;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    // Accent sparkles — fewer, smaller, slightly faster
    const aPos = new Float32Array(na * 3);
    const aVel = new Float32Array(na * 3);
    for (let i = 0; i < na; i++) {
      aPos[i * 3] = (rand() - 0.5) * 10;
      aPos[i * 3 + 1] = (rand() - 0.5) * 8;
      aPos[i * 3 + 2] = (rand() - 0.5) * 7;
      aVel[i * 3] = (rand() - 0.5) * 0.05;
      aVel[i * 3 + 1] = 0.04 + rand() * 0.09;
      aVel[i * 3 + 2] = (rand() - 0.5) * 0.04;
    }
    const ag = new THREE.BufferGeometry();
    ag.setAttribute('position', new THREE.BufferAttribute(aPos, 3));

    return [pg, ag, pVel, aVel];
  }, [reducedMotion]);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    const calmMult = isQuiet ? 0.45 : 1.0;

    [
      { ref: pointsRef, vels: primaryVels, range: 5.5 },
      { ref: accentRef, vels: accentVels, range: 4.0 },
    ].forEach(({ ref, vels, range }) => {
      if (!ref.current) return;
      const pos = ref.current.geometry.attributes.position;
      const arr = pos.array;
      const n = arr.length / 3;
      for (let i = 0; i < n; i++) {
        arr[i * 3] += vels[i * 3] * delta * calmMult;
        arr[i * 3 + 1] += vels[i * 3 + 1] * delta * calmMult;
        arr[i * 3 + 2] += vels[i * 3 + 2] * delta * calmMult;
        // Wrap vertically
        if (arr[i * 3 + 1] > range) arr[i * 3 + 1] = -range;
      }
      pos.needsUpdate = true;
    });
  });

  return (
    <>
      <points ref={pointsRef} geometry={primaryGeo}>
        <pointsMaterial
          size={0.04}
          color={primaryColor}
          transparent
          opacity={isQuiet ? 0.16 : 0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <points ref={accentRef} geometry={accentGeo}>
        <pointsMaterial
          size={0.028}
          color={accentColor}
          transparent
          opacity={isQuiet ? 0.10 : 0.20}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}

/**
 * SongMoodLighting
 *
 * Per-song coloured stage lighting — changes emotional tone on selection.
 * Uses three light positions: front warm key, side fill, and back rim.
 * Closing state unifies to a violet-coral celebration palette.
 * Calms during quiet passages, intensifies slightly during sustained highs.
 */
function SongMoodLighting({ activeTrack, isClosingState, audioReactivity }) {
  const isQuiet = audioReactivity?.isQuiet;
  const isSustainedHigh = audioReactivity?.isSustainedHigh;
  const intensityMult = isQuiet ? 0.70 : isSustainedHigh ? 1.18 : 1.0;

  // Each song has a distinct lighting configuration
  const mood = isClosingState
    ? { key: '#9d3fe8', fill: '#ff6040', rim: '#06c9ac', keyIntensity: 2.4, fillIntensity: 1.8 }
    : {
        key: activeTrack.colors.primary,
        fill: activeTrack.colors.secondary,
        rim: activeTrack.colors.accent || activeTrack.colors.primary,
        keyIntensity: 2.2 * intensityMult,
        fillIntensity: 1.6 * intensityMult,
      };

  return (
    <>
      {/* Warm fill from upper left — like a soft stage spotlight */}
      <pointLight
        position={[-3.5, 3.5, 4]}
        intensity={mood.keyIntensity}
        color={mood.key}
        distance={14}
        decay={2}
      />

      {/* Side fill from lower right — gives depth to ribbons */}
      <pointLight
        position={[4, -2, -2.5]}
        intensity={mood.fillIntensity}
        color={mood.fill}
        distance={12}
        decay={2}
      />

      {/* Back rim — gives translucent glass effect to ribbon edges */}
      <pointLight
        position={[0, 1.5, -4.5]}
        intensity={1.4 * intensityMult}
        color={mood.rim}
        distance={11}
        decay={2}
      />

      {/* Soft base ambient — midnight dark, never white */}
      <ambientLight color="#06080f" intensity={isQuiet ? 0.9 : 1.2} />
    </>
  );
}

export function SonicBloomCanvas({
  activeTrackIndex = 0,
  audioReactivity = null,
  reducedMotion = false,
  isClosingState = false,
  className = '',
}) {
  const activeTrack = sonicBloomSongs[activeTrackIndex] || sonicBloomSongs[0];

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5.1], fov: 46, near: 0.1, far: 60 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full"
      >
        {/* Song-responsive mood lighting */}
        <SongMoodLighting
          activeTrack={activeTrack}
          isClosingState={isClosingState}
          audioReactivity={audioReactivity}
        />

        {/* Responsive camera framing */}
        <SceneCameraController reducedMotion={reducedMotion} />

        {/* Celebration dust — confetti-like atmosphere */}
        <CelebrationDust
          primaryColor={activeTrack.colors.primary}
          accentColor={activeTrack.colors.accent || activeTrack.colors.secondary}
          reducedMotion={reducedMotion}
          isQuiet={audioReactivity?.isQuiet}
        />

        {/* The six-form sound sculpture */}
        <SonicSculpture3D
          activeTrackIndex={activeTrackIndex}
          audioReactivity={audioReactivity}
          reducedMotion={reducedMotion}
          isClosingState={isClosingState}
        />
      </Canvas>
    </div>
  );
}
