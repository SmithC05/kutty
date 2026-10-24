import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * SonicSculpture3D — After-Hours Listening Room Visualizer
 *
 * A refined vinyl record and audio-reactive sound sculpture.
 * Replaces the old petal theme with:
 *   1. A spinning vinyl record with micro-groove rings, center label, and spindle hole.
 *   2. Concentric sound wave rings that expand and oscillate with real audio frequency data.
 *   3. Soft orbital particles traveling around the record.
 *   4. Responsive radial spectrum aura that breathes with music amplitude.
 */

// Generate concentric groove positions for the vinyl record
function createGrooveRingGeometries(count = 12) {
  const rings = [];
  const minR = 0.72;
  const maxR = 1.82;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const r = minR + t * (maxR - minR);
    const pts = [];
    const segs = 64;
    for (let j = 0; j <= segs; j++) {
      const theta = (j / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0.024));
    }
    rings.push(new THREE.BufferGeometry().setFromPoints(pts));
  }
  return rings;
}

// Generate concentric sound wave ring points with dynamic vertex counts
function createSoundWaveGeometry(radius, segments = 80) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array((segments + 1) * 3);
  const basePositions = new Float32Array((segments + 1) * 3);

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = 0;

    basePositions[i * 3] = x;
    basePositions[i * 3 + 1] = y;
    basePositions[i * 3 + 2] = 0;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.userData = { basePositions, radius, segments };
  return geo;
}

export function SonicSculpture3D({
  activeTrackIndex = 0,
  audioReactivity = null,
  reducedMotion = false,
  isClosingState = false,
}) {
  const masterGroupRef = useRef(null);
  const recordGroupRef = useRef(null);
  const labelMeshRef = useRef(null);
  const waveGroupRef = useRef(null);
  const orbitalParticlesRef = useRef(null);
  const spectrumBarsRef = useRef([]);

  const activeTrack = sonicBloomSongs[activeTrackIndex] || sonicBloomSongs[0];

  // Animated color references
  const colorsRef = useRef({
    primary: new THREE.Color(activeTrack.colors.primary),
    secondary: new THREE.Color(activeTrack.colors.secondary),
    accent: new THREE.Color(activeTrack.colors.accent || activeTrack.colors.primary),
  });

  // Track change color transition
  useEffect(() => {
    const targetPrimary = isClosingState ? '#9d3fe8' : activeTrack.colors.primary;
    const targetSecondary = isClosingState ? '#ff6040' : activeTrack.colors.secondary;
    const targetAccent = isClosingState ? '#06c9ac' : (activeTrack.colors.accent || activeTrack.colors.primary);

    gsap.to(colorsRef.current.primary, {
      r: new THREE.Color(targetPrimary).r,
      g: new THREE.Color(targetPrimary).g,
      b: new THREE.Color(targetPrimary).b,
      duration: 1.0,
      ease: 'power2.out',
    });
    gsap.to(colorsRef.current.secondary, {
      r: new THREE.Color(targetSecondary).r,
      g: new THREE.Color(targetSecondary).g,
      b: new THREE.Color(targetSecondary).b,
      duration: 1.0,
      ease: 'power2.out',
    });
    gsap.to(colorsRef.current.accent, {
      r: new THREE.Color(targetAccent).r,
      g: new THREE.Color(targetAccent).g,
      b: new THREE.Color(targetAccent).b,
      duration: 1.0,
      ease: 'power2.out',
    });
  }, [activeTrackIndex, isClosingState, activeTrack]);

  // Static geometries
  const vinylDiscGeo = useMemo(() => new THREE.CylinderGeometry(1.88, 1.88, 0.04, 64), []);
  const centerLabelGeo = useMemo(() => new THREE.CylinderGeometry(0.68, 0.68, 0.048, 48), []);
  const spindleHoleGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.08, 0.054, 32), []);
  const centerRingGeo = useMemo(() => new THREE.RingGeometry(0.66, 0.69, 48), []);
  const grooveRingGeos = useMemo(() => createGrooveRingGeometries(14), []);

  // Concentric sound wave geometries (3 distinct concentric wave rings)
  const waveGeos = useMemo(() => [
    createSoundWaveGeometry(2.02, 90),
    createSoundWaveGeometry(2.24, 90),
    createSoundWaveGeometry(2.46, 90),
  ], []);

  // 36 radial audio-spectrum tick bars around the outer perimeter
  const spectrumBarGeos = useMemo(() => {
    const count = 36;
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const geo = new THREE.BoxGeometry(0.024, 0.12, 0.015);
      items.push({ angle, geo });
    }
    return items;
  }, []);

  // Orbital dust particles
  const orbitalParticlesData = useMemo(() => {
    const count = reducedMotion ? 24 : 50;
    const positions = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    const speeds = new Float32Array(count);
    const zOffsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 1.3 + Math.random() * 1.3;
      speeds[i] = (0.2 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
      zOffsets[i] = (Math.random() - 0.5) * 0.35;

      positions[i * 3] = Math.cos(angles[i]) * radii[i];
      positions[i * 3 + 1] = Math.sin(angles[i]) * radii[i];
      positions[i * 3 + 2] = zOffsets[i];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geo, angles, radii, speeds, zOffsets, count };
  }, [reducedMotion]);

  // Frame update
  useFrame((_, delta) => {
    const isPlaying = audioReactivity?.isPlaying || false;
    const amp = audioReactivity?.amplitude || 0;
    const low = audioReactivity?.lowFreq || 0;
    const mid = audioReactivity?.midFreq || 0;
    const high = audioReactivity?.highFreq || 0;

    // 1. Vinyl Record Rotation
    if (recordGroupRef.current) {
      if (!reducedMotion) {
        const spinSpeed = isPlaying ? 0.85 + amp * 0.45 : 0.12;
        recordGroupRef.current.rotation.z -= spinSpeed * delta;
      }
    }

    // 2. Sound Wave Concentric Rings Undulation
    if (waveGroupRef.current && !reducedMotion) {
      const time = performance.now() * 0.002;
      waveGeos.forEach((geo, waveIndex) => {
        const posAttr = geo.attributes.position;
        const arr = posAttr.array;
        const { basePositions, radius, segments } = geo.userData;
        const freqWeight = waveIndex === 0 ? low : waveIndex === 1 ? mid : high;
        const waveAmp = isPlaying ? 0.04 + freqWeight * 0.16 : 0.02;

        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const harmonic = Math.sin(theta * (6 + waveIndex * 2) + time * (2 + waveIndex));
          const ripple = 1 + harmonic * waveAmp;

          arr[i * 3] = Math.cos(theta) * radius * ripple;
          arr[i * 3 + 1] = Math.sin(theta) * radius * ripple;
          arr[i * 3 + 2] = Math.sin(theta * 4 + time) * (waveAmp * 0.5);
        }
        posAttr.needsUpdate = true;
      });
    }

    // 3. Spectrum Bars around perimeter
    spectrumBarsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const angle = (i / 36) * Math.PI * 2;
      const factor = i % 3 === 0 ? low : i % 3 === 1 ? mid : high;
      const targetScaleY = isPlaying ? 1 + factor * 2.8 : 1 + Math.sin(angle * 4 + performance.now() * 0.001) * 0.2;
      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, Math.max(0.4, targetScaleY), 0.14);
    });

    // 4. Orbital Particles Update
    if (orbitalParticlesRef.current && !reducedMotion) {
      const { geo, angles, radii, speeds, zOffsets, count } = orbitalParticlesData;
      const posArr = geo.attributes.position.array;
      const speedMult = isPlaying ? 1.0 + amp * 1.2 : 0.35;

      for (let i = 0; i < count; i++) {
        angles[i] += speeds[i] * delta * speedMult;
        posArr[i * 3] = Math.cos(angles[i]) * radii[i];
        posArr[i * 3 + 1] = Math.sin(angles[i]) * radii[i];
        posArr[i * 3 + 2] = zOffsets[i] + Math.sin(angles[i] * 2) * 0.05;
      }
      geo.attributes.position.needsUpdate = true;
    }

    // 5. Center Label color update
    if (labelMeshRef.current?.material) {
      labelMeshRef.current.material.color.copy(colorsRef.current.primary);
    }
  });

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]} rotation={[-0.28, 0, 0]}>
      {/* ── Spinning Vinyl Record ── */}
      <group ref={recordGroupRef}>
        {/* Main vinyl disc body */}
        <mesh geometry={vinylDiscGeo} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#0c0e12"
            roughness={0.42}
            metalness={0.75}
            envMapIntensity={0.6}
          />
        </mesh>

        {/* Center label disc */}
        <mesh ref={labelMeshRef} geometry={centerLabelGeo} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color={activeTrack.colors.primary}
            roughness={0.5}
            metalness={0.25}
          />
        </mesh>

        {/* Center label border ring */}
        <mesh geometry={centerRingGeo} position={[0, 0, 0.026]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>

        {/* Center spindle hole */}
        <mesh geometry={spindleHoleGeo} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#050608" />
        </mesh>

        {/* Concentric groove lines */}
        {grooveRingGeos.map((ringGeo, idx) => (
          <line key={idx} geometry={ringGeo}>
            <lineBasicMaterial
              color="#ffffff"
              transparent
              opacity={idx % 3 === 0 ? 0.075 : 0.038}
            />
          </line>
        ))}
      </group>

      {/* ── Concentric Audio-Reactive Sound Wave Rings ── */}
      <group ref={waveGroupRef}>
        {waveGeos.map((geo, idx) => {
          const col = idx === 0 ? activeTrack.colors.primary : idx === 1 ? (activeTrack.colors.accent || activeTrack.colors.secondary) : activeTrack.colors.secondary;
          return (
            <line key={`wave-${idx}`} geometry={geo}>
              <lineBasicMaterial
                color={col}
                transparent
                opacity={0.55 - idx * 0.12}
                blending={THREE.AdditiveBlending}
              />
            </line>
          );
        })}
      </group>

      {/* ── Audio-Spectrum Radial Ticks ── */}
      <group position={[0, 0, 0.01]}>
        {spectrumBarGeos.map(({ angle, geo }, i) => {
          const r = 2.08;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          const col = i % 2 === 0 ? activeTrack.colors.primary : activeTrack.colors.secondary;
          return (
            <mesh
              key={`tick-${i}`}
              ref={(el) => (spectrumBarsRef.current[i] = el)}
              geometry={geo}
              position={[x, y, 0]}
              rotation={[0, 0, angle + Math.PI / 2]}
            >
              <meshBasicMaterial
                color={col}
                transparent
                opacity={0.42}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      {/* ── Orbital Particles ── */}
      <points ref={orbitalParticlesRef} geometry={orbitalParticlesData.geo}>
        <pointsMaterial
          size={0.038}
          color={activeTrack.colors.accent || activeTrack.colors.primary}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ── Soft Ambient Glow Disc beneath vinyl ── */}
      <mesh position={[0, 0, -0.06]}>
        <circleGeometry args={[2.3, 48]} />
        <meshBasicMaterial
          color={activeTrack.colors.primary}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
