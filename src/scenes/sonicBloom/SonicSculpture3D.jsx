import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * SonicSculpture3D
 *
 * A handcrafted sound sculpture made of six flowing ribbon forms — one for each song.
 * Ribbon geometry is more organic and asymmetric than a perfect radial flower.
 * The centre is an integrated luminous hub, not a flat disc pasted over the petals.
 * Particles travel along individual ribbon curves with speed and density
 * matching each song's emotional energy.
 *
 * Responds to: activeTrackIndex, isClosingState, audioReactivity (future)
 */

// ─── Geometry Helpers ─────────────────────────────────────────────────────────

/**
 * Creates an organic ribbon geometry for one song-form.
 * Each ribbon has its own length, width, and curvature twist so they
 * don't all look identical when viewed together.
 */
function createRibbonGeometry(opts = {}) {
  const {
    length = 2.3,
    widthMax = 0.65,
    curveBias = 0,   // lateral drift makes ribbons slightly asymmetric
    twistAmount = 0, // gentle axial twist along the ribbon length
    uSegments = 36,
    vSegments = 10,
  } = opts;

  const geo = new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= uSegments; i++) {
    const u = i / uSegments; // 0 (base) → 1 (tip)

    // Non-uniform radial extension — accelerates then tapers
    const r = u * length * (0.82 + 0.18 * Math.pow(u, 1.4));
    // Elevation curve — lifts in the middle, dips at tip
    const zSpine = Math.sin(u * Math.PI * 0.95) * 0.52 - u * u * 0.24;
    // Width profile — fat in middle, pointed at both ends
    const w = Math.pow(Math.sin(u * Math.PI), 0.65) * widthMax;
    // Lateral curvature bias (makes ribbons lean slightly)
    const sway = curveBias * Math.sin(u * Math.PI * 1.3) * 0.22;

    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments - 0.5; // −0.5 → +0.5

      // Axial twist along ribbon length
      const twist = twistAmount * u * Math.PI;
      const vTwisted = v * Math.cos(twist);
      const zTwist = v * Math.sin(twist) * 0.18;

      // Cross-section cup (organic arch across width)
      const arch = (1 - 4 * v * v) * 0.22 * Math.sin(u * Math.PI);

      positions.push(
        r + sway,
        vTwisted * w,
        zSpine + arch + zTwist
      );
      uvs.push(u, j / vSegments);
    }
  }

  const vCount = vSegments + 1;
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * vCount + j;
      const b = (i + 1) * vCount + j;
      const c = (i + 1) * vCount + (j + 1);
      const d = i * vCount + (j + 1);
      indices.push(a, b, d, b, c, d);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Spine curve for edge glow & particle pathing
function createSpinePoints(length = 2.3, curveBias = 0, count = 44) {
  const points = [];
  for (let i = 0; i <= count; i++) {
    const u = i / count;
    const r = u * length * (0.82 + 0.18 * Math.pow(u, 1.4));
    const z = Math.sin(u * Math.PI * 0.95) * 0.52 - u * u * 0.24 + 0.05;
    const sway = curveBias * Math.sin(u * Math.PI * 1.3) * 0.22;
    points.push(new THREE.Vector3(r + sway, 0, z));
  }
  return points;
}

// Per-ribbon configuration — slight geometric variation so they feel handcrafted
const RIBBON_CONFIGS = [
  { length: 2.30, widthMax: 0.68, curveBias:  0.12, twistAmount:  0.10 }, // 01 Unnale
  { length: 2.20, widthMax: 0.60, curveBias: -0.08, twistAmount:  0.07 }, // 02 Chella Magale
  { length: 2.35, widthMax: 0.72, curveBias:  0.05, twistAmount:  0.14 }, // 03 Magale
  { length: 2.25, widthMax: 0.65, curveBias: -0.14, twistAmount: -0.08 }, // 04 Alakolava
  { length: 2.15, widthMax: 0.58, curveBias:  0.09, twistAmount:  0.06 }, // 05 Engey Andha Vennnila
  { length: 2.40, widthMax: 0.70, curveBias: -0.06, twistAmount:  0.12 }, // 06 Life of Pazham
];

// ─── Component ────────────────────────────────────────────────────────────────

export function SonicSculpture3D({
  activeTrackIndex = 0,
  audioReactivity = null,
  reducedMotion = false,
  isClosingState = false,
}) {
  const groupRef = useRef(null);
  const hubRef = useRef(null);
  const hubAuraRef = useRef(null);
  const petalsRef = useRef([]);

  const activeTrack = sonicBloomSongs[activeTrackIndex] || sonicBloomSongs[0];

  // Geometries — one per ribbon so each can vary
  const ribbonGeos = useMemo(
    () => RIBBON_CONFIGS.map((cfg) => createRibbonGeometry(cfg)),
    []
  );
  const spineGeos = useMemo(
    () =>
      RIBBON_CONFIGS.map((cfg) => {
        const pts = createSpinePoints(cfg.length, cfg.curveBias);
        return new THREE.BufferGeometry().setFromPoints(pts);
      }),
    []
  );

  // Particle data per ribbon
  const particlesData = useMemo(() => {
    const count = reducedMotion ? 10 : 20;
    return RIBBON_CONFIGS.map((cfg, idx) => {
      const uCoords = new Float32Array(count);
      const speeds = new Float32Array(count);
      const laterals = new Float32Array(count);
      const song = sonicBloomSongs[idx];
      for (let i = 0; i < count; i++) {
        uCoords[i] = i / count;
        // Speed modulated by song energy
        speeds[i] = (0.14 + (i % 4) * 0.055) * (song.motion.particleSpeed || 1.0);
        laterals[i] = (Math.random() - 0.5) * cfg.widthMax * 0.4;
      }
      return { uCoords, speeds, laterals, count, length: cfg.length, curveBias: cfg.curveBias };
    });
  }, [reducedMotion]);

  const particleGeos = useMemo(() => {
    return particlesData.map((p) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(p.count * 3);
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      return geo;
    });
  }, [particlesData]);

  // Animated per-ribbon state
  const ribbonStates = useRef(
    Array.from({ length: 6 }).map((_, i) => ({
      scale: i === 0 ? 1.12 : 0.93,
      tilt: i === 0 ? 0.11 : 0,
      emissiveIntensity: i === 0 ? 0.72 : 0.18,
      opacity: i === 0 ? 0.90 : 0.52,
      color: new THREE.Color(sonicBloomSongs[i].colors.primary),
    }))
  );

  // GSAP smooth transitions on track or closing state change
  useEffect(() => {
    if (reducedMotion) {
      ribbonStates.current.forEach((st, idx) => {
        const isActive = isClosingState || idx === activeTrackIndex;
        st.scale = isClosingState ? 1.06 : isActive ? 1.12 : 0.93;
        st.tilt = isClosingState ? 0.07 : isActive ? 0.11 : 0;
        st.emissiveIntensity = isClosingState ? 0.70 : isActive ? 0.72 : 0.18;
        st.opacity = isClosingState ? 0.82 : isActive ? 0.90 : 0.52;
        st.color.set(sonicBloomSongs[idx].colors.primary);
      });
      return;
    }

    ribbonStates.current.forEach((st, idx) => {
      const isActive = isClosingState || idx === activeTrackIndex;
      const target = new THREE.Color(sonicBloomSongs[idx].colors.primary);

      gsap.to(st, {
        scale: isClosingState ? 1.06 : isActive ? 1.12 : 0.93,
        tilt: isClosingState ? 0.07 : isActive ? 0.13 : 0,
        emissiveIntensity: isClosingState ? 0.70 : isActive ? 0.78 : 0.18,
        opacity: isClosingState ? 0.82 : isActive ? 0.90 : 0.50,
        duration: isClosingState ? 1.5 : 0.85,
        ease: 'power2.out',
      });
      gsap.to(st.color, {
        r: target.r, g: target.g, b: target.b,
        duration: 0.75,
        ease: 'power2.out',
      });
    });
  }, [activeTrackIndex, isClosingState, reducedMotion]);

  // Entrance bloom
  useEffect(() => {
    if (groupRef.current && !reducedMotion) {
      gsap.fromTo(
        groupRef.current.scale,
        { x: 0.2, y: 0.2, z: 0.2 },
        { x: 1, y: 1, z: 1, duration: 2.0, ease: 'power3.out' }
      );
    }
  }, [reducedMotion]);

  const switchRingRef = useRef(null);

  // Faint expanding light ring when switching tracks
  useEffect(() => {
    if (switchRingRef.current && !reducedMotion) {
      switchRingRef.current.scale.set(0.1, 0.1, 0.1);
      switchRingRef.current.material.opacity = 0.85;
      gsap.to(switchRingRef.current.scale, {
        x: 2.3,
        y: 2.3,
        z: 2.3,
        duration: 1.1,
        ease: 'power2.out',
      });
      gsap.to(switchRingRef.current.material, {
        opacity: 0,
        duration: 1.1,
        ease: 'power2.out',
      });
    }
  }, [activeTrackIndex, reducedMotion]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const group = groupRef.current;
    if (!group) return;

    const isQuiet = audioReactivity?.isQuiet || false;
    const calmMult = isQuiet ? 0.55 : 1.0;

    // Ambient rotation — speed responds to selected song's energy and quiet passages
    if (!reducedMotion) {
      const energy = (activeTrack.motion.energy || 1.0) * calmMult;
      group.rotation.y += delta * 0.11 * energy;
      group.position.y = Math.sin(t * 1.1) * 0.07 * calmMult;
      group.rotation.x = Math.sin(t * 0.65) * 0.035 * calmMult;
      group.rotation.z = Math.cos(t * 0.45) * 0.025 * calmMult;
    }

    const amplitude = audioReactivity?.amplitude || 0;
    const ambientPulse = 1.0 + amplitude * 0.28 + Math.sin(t * 2.4) * 0.025;

    // Update each ribbon
    petalsRef.current.forEach((meshGroup, idx) => {
      if (!meshGroup) return;
      const st = ribbonStates.current[idx];
      const isActive = idx === activeTrackIndex;
      const song = sonicBloomSongs[idx];

      // Each ribbon has its base angle plus a tiny asymmetric phase offset
      const baseAngle = (idx * Math.PI * 2) / 6;
      // Breathing wave: each ribbon breathes slightly out of phase
      const breathPhase = idx * 1.08;
      const breathWave = Math.sin(t * (1.8 + idx * 0.12) + breathPhase) * 0.025;

      meshGroup.rotation.z = baseAngle;
      meshGroup.rotation.y = (st.tilt + breathWave) * (isActive ? 1.25 : 0.75);

      const s = st.scale * ambientPulse;
      meshGroup.scale.set(s, s, s);

      // Ribbon material
      const ribbonMesh = meshGroup.getObjectByName('ribbonMesh');
      if (ribbonMesh?.material) {
        ribbonMesh.material.color.copy(st.color);
        ribbonMesh.material.emissive.copy(st.color);
        // Active ribbon shimmers with a sine pulse
        ribbonMesh.material.emissiveIntensity =
          st.emissiveIntensity + (isActive ? Math.sin(t * 3.2 + idx) * 0.14 : 0);
        ribbonMesh.material.opacity = st.opacity;
      }

      // Particle update
      const pData = particlesData[idx];
      const pGeo = particleGeos[idx];
      if (pData && pGeo) {
        const posAttr = pGeo.attributes.position;
        const arr = posAttr.array;
        const speedMult =
          (isActive ? 1.5 : 0.7) * (song.motion.particleSpeed || 1.0) * calmMult;

        for (let p = 0; p < pData.count; p++) {
          pData.uCoords[p] = (pData.uCoords[p] + delta * pData.speeds[p] * speedMult) % 1.0;
          const u = pData.uCoords[p];
          const len = pData.length;
          const bias = pData.curveBias;

          const r = u * len * (0.82 + 0.18 * Math.pow(u, 1.4));
          const zCurve = Math.sin(u * Math.PI * 0.95) * 0.52 - u * u * 0.24 + 0.06;
          const sway = bias * Math.sin(u * Math.PI * 1.3) * 0.22;
          const wobble = Math.sin(u * 13 + t * 3.5 + idx * 0.7) * 0.035;

          arr[p * 3] = r + sway;
          arr[p * 3 + 1] = wobble + pData.laterals[p];
          arr[p * 3 + 2] = zCurve;
        }
        posAttr.needsUpdate = true;
      }
    });

    // Hub — integrated into the sculpture, not a flat disc
    if (hubRef.current) {
      const hubPulse = 1.0 + Math.sin(t * 3.8 + 0.3) * 0.10 + amplitude * 0.22;
      hubRef.current.scale.set(hubPulse, hubPulse, hubPulse);
      // Rotate the hub ring slowly
      hubRef.current.rotation.z = t * 0.25;
    }
    if (hubAuraRef.current) {
      hubAuraRef.current.rotation.z = -t * 0.18;
      const auraPulse = 1.0 + Math.sin(t * 2.1) * 0.08;
      hubAuraRef.current.scale.set(auraPulse, auraPulse, auraPulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>

      {/* ── Faint expanding light ring when switching tracks ─────────── */}
      <mesh ref={switchRingRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.85, 0.95, 64]} />
        <meshBasicMaterial
          color={activeTrack.colors.primary}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Integrated Hub — grows out of the ribbon bases ──────────── */}
      <group ref={hubRef}>
        {/* Core translucent sphere — glows with the active song's colour */}
        <mesh>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshPhysicalMaterial
            color={activeTrack.colors.core}
            emissive={activeTrack.colors.primary}
            emissiveIntensity={0.55}
            roughness={0.08}
            metalness={0.15}
            transmission={0.50}
            transparent
            opacity={0.90}
            ior={1.52}
          />
        </mesh>

        {/* Inner soft glow — additive, fades into ribbon bases */}
        <mesh>
          <sphereGeometry args={[0.52, 20, 20]} />
          <meshBasicMaterial
            color={activeTrack.colors.primary}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Orbit ring — tilted, part of the sculpture */}
        <mesh rotation={[Math.PI / 5, Math.PI / 7, 0]}>
          <torusGeometry args={[0.62, 0.012, 14, 72]} />
          <meshBasicMaterial
            color={activeTrack.colors.secondary}
            transparent
            opacity={0.60}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ── Outer aura ring — rings the whole sculpture ─────────────── */}
      <group ref={hubAuraRef}>
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[1.05, 0.006, 10, 88]} />
          <meshBasicMaterial
            color={activeTrack.colors.accent || activeTrack.colors.secondary}
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ── Six Organic Ribbon Forms ─────────────────────────────────── */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const song = sonicBloomSongs[idx];
        const isActive = idx === activeTrackIndex;

        return (
          <group
            key={song.id}
            ref={(el) => { petalsRef.current[idx] = el; }}
          >
            {/* Main translucent glass ribbon */}
            <mesh
              name="ribbonMesh"
              geometry={ribbonGeos[idx]}
              castShadow={false}
              receiveShadow={false}
            >
              <meshPhysicalMaterial
                color={song.colors.primary}
                emissive={song.colors.primary}
                emissiveIntensity={isActive ? 0.72 : 0.18}
                roughness={0.12}
                metalness={0.06}
                transmission={0.60}
                transparent
                opacity={isActive ? 0.90 : 0.52}
                ior={1.46}
                reflectivity={0.65}
                clearcoat={0.85}
                clearcoatRoughness={0.10}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>

            {/* Edge spine glow — luminous crest along the ribbon */}
            <line geometry={spineGeos[idx]}>
              <lineBasicMaterial
                color={song.colors.secondary}
                transparent
                opacity={isActive ? 0.92 : 0.38}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </line>

            {/* Traveling sound particles along the ribbon curve */}
            <points geometry={particleGeos[idx]}>
              <pointsMaterial
                size={isActive ? 0.07 : 0.045}
                color={song.colors.accent || song.colors.secondary}
                transparent
                opacity={isActive ? 0.92 : 0.55}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
                depthWrite={false}
              />
            </points>
          </group>
        );
      })}

      {/* ── Dynamic Lighting from the Hub Core ──────────────────────── */}
      <pointLight
        position={[0, 0, 0.3]}
        color={activeTrack.colors.primary}
        intensity={2.6}
        distance={7.5}
        decay={2}
      />
      <pointLight
        position={[0, 0, -0.5]}
        color={activeTrack.colors.secondary}
        intensity={1.4}
        distance={6.0}
        decay={2}
      />
    </group>
  );
}
