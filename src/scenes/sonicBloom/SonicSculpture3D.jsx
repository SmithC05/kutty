import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * SonicSculpture3D
 * 
 * An interactive 3D art installation sculpture formed from six luminous, curved
 * petals made of sound waves, glass-like ribbons, fine particles, and softly glowing edges.
 * 
 * All six petals belong to the same recognizable botanical sound sculpture.
 * When a song is selected, the corresponding petal unfolds and brightens, fine particles
 * travel along its curves, and the color palette shifts to match the song's emotion.
 * 
 * Ready for future audio reactivity via audioReactivity prop:
 * { amplitude, lowFreq, midFreq, highFreq, progress, isPlaying }
 */

// Procedural petal geometry generator
function createPetalGeometry(length = 2.4, widthMax = 0.75, uSegments = 32, vSegments = 8) {
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const normals = [];
  const indices = [];

  for (let i = 0; i <= uSegments; i++) {
    const u = i / uSegments; // 0 (base) to 1 (tip)

    // Spine trajectory (curves outwards and gently upwards)
    const r = u * length * (0.85 + 0.15 * u);
    const z = Math.sin(u * Math.PI) * 0.42 - u * 0.18;
    // Width profile: starts narrow, swells around u=0.5, tapers to tip
    const w = Math.pow(Math.sin(u * Math.PI), 0.72) * widthMax;

    for (let j = 0; j <= vSegments; j++) {
      const v = (j / vSegments) - 0.5; // -0.5 to +0.5 across width

      // Cupping profile across the width (organic arch)
      const arch = (1 - 4 * v * v) * 0.18 * Math.sin(u * Math.PI);

      const x = r;
      const y = v * w;
      const zPos = z + arch;

      positions.push(x, y, zPos);
      uvs.push(u, j / vSegments);
      // Rough initial normal pointing up/out
      normals.push(0, 0, 1);
    }
  }

  const vCount = vSegments + 1;
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * vCount + j;
      const b = (i + 1) * vCount + j;
      const c = (i + 1) * vCount + (j + 1);
      const d = i * vCount + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Procedural spine curve for edge filament & particle pathing
function createSpinePoints(length = 2.4, count = 40) {
  const points = [];
  for (let i = 0; i <= count; i++) {
    const u = i / count;
    const r = u * length * (0.85 + 0.15 * u);
    const z = Math.sin(u * Math.PI) * 0.42 - u * 0.18;
    points.push(new THREE.Vector3(r, 0, z + 0.04));
  }
  return points;
}

export function SonicSculpture3D({
  activeTrackIndex = 0,
  audioReactivity = null,
  reducedMotion = false,
  isClosingState = false,
}) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const petalsRef = useRef([]);

  const activeTrack = sonicBloomSongs[activeTrackIndex] || sonicBloomSongs[0];

  // Geometries
  const petalGeo = useMemo(() => createPetalGeometry(2.35, 0.72, 32, 8), []);
  const spinePoints = useMemo(() => createSpinePoints(2.35, 36), []);
  const spineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(spinePoints), [spinePoints]);

  // Particle path data for sound filaments (30 particles per petal = 180 total)
  const particlesData = useMemo(() => {
    const count = reducedMotion ? 12 : 24;
    return Array.from({ length: 6 }).map(() => {
      const uCoords = new Float32Array(count);
      const speeds = new Float32Array(count);
      const offsets = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        uCoords[i] = i / count;
        speeds[i] = 0.18 + (i % 3) * 0.08;
        offsets[i] = (Math.random() - 0.5) * 0.08;
      }
      return { uCoords, speeds, offsets, count };
    });
  }, [reducedMotion]);

  // Animated particle positions buffer
  const particleGeos = useMemo(() => {
    return particlesData.map((p) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(p.count * 3);
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      return geo;
    });
  }, [particlesData]);

  // Interpolated animated state values per petal
  const petalStates = useRef(
    Array.from({ length: 6 }).map((_, i) => ({
      scale: i === 0 ? 1.15 : 0.95,
      tilt: i === 0 ? 0.12 : 0,
      glow: i === 0 ? 1.0 : 0.25,
      emissiveIntensity: i === 0 ? 0.75 : 0.2,
      color: new THREE.Color(sonicBloomSongs[i].colors.primary),
    }))
  );

  // Smooth GSAP track transition for petals
  useEffect(() => {
    if (reducedMotion) {
      petalStates.current.forEach((st, idx) => {
        const isActive = isClosingState || idx === activeTrackIndex;
        st.scale = isClosingState ? 1.08 : (isActive ? 1.15 : 0.95);
        st.tilt = isClosingState ? 0.08 : (isActive ? 0.12 : 0);
        st.glow = isClosingState ? 0.85 : (isActive ? 1.0 : 0.25);
        st.emissiveIntensity = isClosingState ? 0.75 : (isActive ? 0.75 : 0.2);
        st.color.set(sonicBloomSongs[idx].colors.primary);
      });
      return;
    }

    petalStates.current.forEach((st, idx) => {
      const isActive = isClosingState || idx === activeTrackIndex;
      const targetColor = new THREE.Color(sonicBloomSongs[idx].colors.primary);

      gsap.to(st, {
        scale: isClosingState ? 1.08 : (isActive ? 1.15 : 0.95),
        tilt: isClosingState ? 0.08 : (isActive ? 0.14 : 0),
        glow: isClosingState ? 0.85 : (isActive ? 1.0 : 0.25),
        emissiveIntensity: isClosingState ? 0.8 : (isActive ? 0.85 : 0.2),
        duration: isClosingState ? 1.4 : 0.9,
        ease: 'power2.out',
      });

      gsap.to(st.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.8,
        ease: 'power2.out',
      });
    });
  }, [activeTrackIndex, isClosingState, reducedMotion]);

  // Subtle entrance scaling
  useEffect(() => {
    if (groupRef.current && !reducedMotion) {
      gsap.fromTo(
        groupRef.current.scale,
        { x: 0.3, y: 0.3, z: 0.3 },
        { x: 1, y: 1, z: 1, duration: 1.8, ease: 'power3.out' }
      );
    }
  }, [reducedMotion]);

  // Continuous frame animation & future audio reactivity
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const group = groupRef.current;
    if (!group) return;

    // Ambient floating & gentle rotation
    if (!reducedMotion) {
      group.rotation.y += delta * 0.14 * (activeTrack.motion.energy || 1.0);
      group.position.y = Math.sin(t * 1.2) * 0.08;
      group.rotation.x = Math.sin(t * 0.7) * 0.04;
      group.rotation.z = Math.cos(t * 0.5) * 0.03;
    }

    // Future audio amplitude modulation (defaults to ambient pulse if no audio)
    const amplitude = audioReactivity?.amplitude || 0;
    const wavePulse = 1.0 + amplitude * 0.35 + Math.sin(t * 2.2) * 0.03;

    // Update each of the 6 petals
    petalsRef.current.forEach((meshGroup, idx) => {
      if (!meshGroup) return;
      const st = petalStates.current[idx];
      const isActive = idx === activeTrackIndex;

      // Base radial angle (60 degrees apart)
      const baseAngle = (idx * Math.PI * 2) / 6;

      // Subtle breathing wave offset per petal
      const waveOffset = Math.sin(t * 2.0 + idx * 1.05) * 0.03;
      meshGroup.rotation.z = baseAngle;
      meshGroup.rotation.y = (st.tilt + waveOffset) * (isActive ? 1.2 : 0.8);
      
      const s = st.scale * wavePulse;
      meshGroup.scale.set(s, s, s);

      // Update petal mesh material colors & radiance
      const petalMesh = meshGroup.getObjectByName('petalMesh');
      if (petalMesh && petalMesh.material) {
        petalMesh.material.color.copy(st.color);
        petalMesh.material.emissive.copy(st.color);
        petalMesh.material.emissiveIntensity = st.emissiveIntensity + (isActive ? Math.sin(t * 3.5) * 0.15 : 0);
      }

      // Update particle positions along this petal's curve
      const pData = particlesData[idx];
      const pGeo = particleGeos[idx];
      if (pData && pGeo) {
        const posAttr = pGeo.attributes.position;
        const arr = posAttr.array;
        const speedMultiplier = (isActive ? 1.6 : 0.8) * (activeTrack.motion.particleSpeed || 1.0);

        for (let p = 0; p < pData.count; p++) {
          pData.uCoords[p] = (pData.uCoords[p] + delta * pData.speeds[p] * speedMultiplier) % 1.0;
          const u = pData.uCoords[p];

          // Compute 3D coordinate along petal curve
          const r = u * 2.35 * (0.85 + 0.15 * u);
          const zCurve = Math.sin(u * Math.PI) * 0.42 - u * 0.18 + 0.04;
          const lateralWobble = Math.sin(u * 14 + t * 4.0) * 0.04;

          arr[p * 3] = r;
          arr[p * 3 + 1] = lateralWobble + pData.offsets[p];
          arr[p * 3 + 2] = zCurve;
        }
        posAttr.needsUpdate = true;
      }
    });

    // Central pulsing core
    if (coreRef.current) {
      const corePulse = 1.0 + Math.sin(t * 3.0) * 0.08 + amplitude * 0.25;
      coreRef.current.scale.set(corePulse, corePulse, corePulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Central Luminous Sound Core ────────────────────────────── */}
      <group ref={coreRef}>
        {/* Inner radiant crystal sphere */}
        <mesh>
          <sphereGeometry args={[0.34, 28, 28]} />
          <meshBasicMaterial
            color={activeTrack.colors.core}
            transparent
            opacity={0.92}
          />
        </mesh>
        {/* Soft volumetric inner aura */}
        <mesh>
          <sphereGeometry args={[0.62, 24, 24]} />
          <meshBasicMaterial
            color={activeTrack.colors.primary}
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Delicate orbit ring around core */}
        <mesh rotation={[Math.PI / 4, Math.PI / 6, 0]}>
          <torusGeometry args={[0.72, 0.015, 16, 64]} />
          <meshBasicMaterial
            color={activeTrack.colors.secondary}
            transparent
            opacity={0.55}
          />
        </mesh>
      </group>

      {/* ── Six Luminous Sound Petals (Curved Wave Ribbons) ────────── */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const song = sonicBloomSongs[idx];
        const isActive = idx === activeTrackIndex;

        return (
          <group
            key={song.id}
            ref={(el) => {
              petalsRef.current[idx] = el;
            }}
          >
            {/* Translucent Glass Ribbon Body */}
            <mesh
              name="petalMesh"
              geometry={petalGeo}
              position={[0, 0, 0]}
              castShadow={false}
              receiveShadow={false}
            >
              <meshPhysicalMaterial
                color={song.colors.primary}
                emissive={song.colors.primary}
                emissiveIntensity={isActive ? 0.75 : 0.2}
                roughness={0.18}
                metalness={0.08}
                transmission={0.65}
                transparent
                opacity={isActive ? 0.88 : 0.55}
                ior={1.48}
                reflectivity={0.7}
                clearcoat={1.0}
                clearcoatRoughness={0.12}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>

            {/* Glowing Soundwave Edge Crest (Upper spine) */}
            <line geometry={spineGeo}>
              <lineBasicMaterial
                color={song.colors.secondary}
                transparent
                opacity={isActive ? 0.95 : 0.45}
                linewidth={2}
                blending={THREE.AdditiveBlending}
              />
            </line>

            {/* Traveling Soundwave Particles along the curve */}
            <points geometry={particleGeos[idx]}>
              <pointsMaterial
                size={isActive ? 0.09 : 0.06}
                color={song.colors.accent || song.colors.secondary}
                transparent
                opacity={isActive ? 0.95 : 0.6}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
                depthWrite={false}
              />
            </points>
          </group>
        );
      })}

      {/* ── Dynamic Point Light at the Sculpture Heart ─────────────── */}
      <pointLight
        position={[0, 0, 0.4]}
        color={activeTrack.colors.primary}
        intensity={2.8}
        distance={8.0}
        decay={2}
      />
      <pointLight
        position={[0, 0, -0.4]}
        color={activeTrack.colors.secondary}
        intensity={1.6}
        distance={6.5}
        decay={2}
      />
    </group>
  );
}
