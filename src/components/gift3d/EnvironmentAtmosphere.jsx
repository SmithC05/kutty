import React, { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural Soft Radial Glow Texture (Canvas-generated)
 */
function createRadialGlowTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(254, 240, 138, 0.85)'); // Warm radiant gold
  g.addColorStop(0.3, 'rgba(245, 158, 11, 0.4)');
  g.addColorStop(0.65, 'rgba(59, 130, 246, 0.15)'); // Royal sapphire tint
  g.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Procedural Star Sparkle Texture (4-point flare)
 */
function createSparkleTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 128, 128);
  // Center glow
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 30);
  g.addColorStop(0, 'rgba(255, 255, 255, 1)');
  g.addColorStop(0.4, 'rgba(254, 240, 138, 0.7)');
  g.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);

  // Vertical flare ray
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(63, 10, 2, 108);
  // Horizontal flare ray
  ctx.fillRect(10, 63, 108, 2);

  return new THREE.CanvasTexture(canvas);
}

/**
 * EnvironmentAtmosphere
 * Multi-layer cinematic environment for the full-screen gift opening.
 * Houses the luminous aura, background star field, orbiting dust motes,
 * light rays, foreground bokeh particles, and the expanding unwrapping shockwave.
 */
export const EnvironmentAtmosphere = forwardRef((_props, ref) => {
  const auraRef = useRef(null);
  const shockwaveRef = useRef(null);
  const raysRef = useRef(null);
  const orbitalRing1 = useRef(null);
  const orbitalRing2 = useRef(null);
  const bgStarsRef = useRef(null);
  const goldDustRef = useRef(null);
  const foregroundBokehRef = useRef(null);
  const confettiRef = useRef(null);

  const glowTexture = useMemo(() => createRadialGlowTexture(), []);
  const sparkleTexture = useMemo(() => createSparkleTexture(), []);

  // 1. Background Stars (120 distant specks)
  const bgStarsData = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = -4 - Math.random() * 8;
    }
    return { positions: pos, count };
  }, []);

  // 2. Midground Golden Dust (75 motes)
  const dustData = useMemo(() => {
    const count = 75;
    const pos = new Float32Array(count * 3);
    const inits = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 1.6 + Math.random() * 3.5;
      const angle = Math.random() * Math.PI * 2;
      const y = -2.0 + Math.random() * 4.5;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      inits[i] = y;
      speeds[i] = 0.3 + Math.random() * 0.5;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, inits, speeds, phases, count };
  }, []);

  // 3. Foreground Soft Bokeh Motes (18 large drifting particles near camera)
  const fgBokehData = useMemo(() => {
    const count = 18;
    const pos = new Float32Array(count * 3);
    const initsY = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5.0;
      pos[i * 3 + 2] = 2.0 + Math.random() * 2.5; // In front of the gift, creating camera depth

      initsY[i] = pos[i * 3 + 1];
      speeds[i] = 0.2 + Math.random() * 0.3;
    }
    return { positions: pos, initsY, speeds, count };
  }, []);

  // 4. Delicate Celebratory Micro-Confetti & Glitter (22 subtle floating motes)
  const confettiData = useMemo(() => {
    const count = 22;
    const pos = new Float32Array(count * 3);
    const initsY = new Float32Array(count);
    const speeds = new Float32Array(count);
    const sways = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.0;
      pos[i * 3 + 1] = -1.2 + Math.random() * 3.5;
      pos[i * 3 + 2] = -0.5 + Math.random() * 2.5;

      initsY[i] = pos[i * 3 + 1];
      speeds[i] = 0.25 + Math.random() * 0.35;
      sways[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, initsY, speeds, sways, count };
  }, []);

  // 4. Orbital Ring Curves (Delicate golden light trails)
  const { ring1Geo, ring2Geo } = useMemo(() => {
    const curve1 = new THREE.EllipseCurve(0, 0, 2.7, 2.2, 0, 2 * Math.PI, false, 0);
    const curve2 = new THREE.EllipseCurve(0, 0, 3.4, 2.8, 0, 2 * Math.PI, false, 0);

    const pts1 = curve1.getPoints(64).map((p) => new THREE.Vector3(p.x, 0, p.y));
    const pts2 = curve2.getPoints(64).map((p) => new THREE.Vector3(p.x, 0, p.y));

    const g1 = new THREE.BufferGeometry().setFromPoints(pts1);
    const g2 = new THREE.BufferGeometry().setFromPoints(pts2);
    return { ring1Geo: g1, ring2Geo: g2 };
  }, []);

  // Expose API for GSAP timelines
  useImperativeHandle(ref, () => ({
    get aura() { return auraRef.current; },
    get shockwave() { return shockwaveRef.current; },
    get rays() { return raysRef.current; },
    setShockwaveScale(s) {
      if (shockwaveRef.current) shockwaveRef.current.scale.set(s, s, 1);
    },
    setShockwaveOpacity(o) {
      if (shockwaveRef.current?.material) shockwaveRef.current.material.opacity = o;
    },
    setRaysIntensity(r) {
      if (raysRef.current) {
        raysRef.current.scale.set(r, r, 1);
        raysRef.current.traverse((child) => {
          if (child.isMesh && child.material) child.material.opacity = Math.min(1, r * 0.4);
        });
      }
    }
  }));

  // Frame animations (breathing aura, orbital ring drift, drifting particles)
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Subtle breathing halo behind gift
    if (auraRef.current) {
      const breathe = 1 + Math.sin(time * 0.9) * 0.08;
      auraRef.current.scale.set(breathe, breathe, 1);
    }

    // Slowly orbiting light rings
    if (orbitalRing1.current) orbitalRing1.current.rotation.y += delta * 0.12;
    if (orbitalRing2.current) orbitalRing2.current.rotation.y -= delta * 0.08;

    // Golden dust drifting upwards
    if (goldDustRef.current) {
      const geo = goldDustRef.current.geometry;
      const pos = geo.attributes.position.array;
      for (let i = 0; i < dustData.count; i++) {
        pos[i * 3 + 1] = dustData.inits[i] + Math.sin(time * dustData.speeds[i] + dustData.phases[i]) * 0.35;
      }
      geo.attributes.position.needsUpdate = true;
    }

    // Foreground bokeh motes gentle floating
    if (foregroundBokehRef.current) {
      const geo = foregroundBokehRef.current.geometry;
      const pos = geo.attributes.position.array;
      for (let i = 0; i < fgBokehData.count; i++) {
        pos[i * 3 + 1] = fgBokehData.initsY[i] + Math.sin(time * fgBokehData.speeds[i] + i) * 0.2;
      }
      geo.attributes.position.needsUpdate = true;
    }

    // Celebratory micro-confetti gentle floating and swaying
    if (confettiRef.current) {
      const geo = confettiRef.current.geometry;
      const pos = geo.attributes.position.array;
      for (let i = 0; i < confettiData.count; i++) {
        pos[i * 3 + 1] = confettiData.initsY[i] + Math.sin(time * confettiData.speeds[i] + confettiData.sways[i]) * 0.28;
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Luminous Radial Aura / Halo behind the present */}
      <mesh ref={auraRef} position={[0, 0.4, -1.8]}>
        <planeGeometry args={[7.5, 7.5]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Expanding Unwrapping Shockwave Ring (initially zero scale) */}
      <mesh ref={shockwaveRef} position={[0, 0.4, 0.1]} scale={[0.01, 0.01, 1]}>
        <ringGeometry args={[0.9, 1.05, 48]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Soft Volumetric Light Rays (Subtle angled shafts behind gift) */}
      <group ref={raysRef} position={[0, 0.4, -0.6]} scale={[1, 1, 1]}>
        {[-0.6, -0.2, 0.2, 0.6].map((angle, idx) => (
          <mesh key={idx} rotation={[0, 0, angle]}>
            <planeGeometry args={[0.35, 8.0]} />
            <meshBasicMaterial
              color="#fef3c7"
              transparent
              opacity={0.06}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 4. Delicate Orbital Light Arcs */}
      <group ref={orbitalRing1} position={[0, 0.2, 0]} rotation={[0.4, 0, 0.35]}>
        <lineLoop geometry={ring1Geo}>
          <lineBasicMaterial
            color="#fbbf24"
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
          />
        </lineLoop>
      </group>
      <group ref={orbitalRing2} position={[0, 0.1, 0]} rotation={[-0.35, 0, -0.45]}>
        <lineLoop geometry={ring2Geo}>
          <lineBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.16}
            blending={THREE.AdditiveBlending}
          />
        </lineLoop>
      </group>

      {/* 5. Distant Blue-White Star Particles */}
      <points ref={bgStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bgStarsData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#bfdbfe"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 6. Midground Golden Dust Motes */}
      <points ref={goldDustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          map={sparkleTexture}
          color="#fde047"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 7. Foreground Soft Bokeh Particles (Enhances 3D Camera Parallax) */}
      <points ref={foregroundBokehRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[fgBokehData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          map={glowTexture}
          color="#fef08a"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 8. Delicate Celebratory Micro-Confetti & Glitter */}
      <points ref={confettiRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[confettiData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          map={sparkleTexture}
          color="#fef3c7"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
});

EnvironmentAtmosphere.displayName = 'EnvironmentAtmosphere';
