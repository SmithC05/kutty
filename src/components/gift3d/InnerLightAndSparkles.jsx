import React, { forwardRef, useRef, useMemo, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createInnerGlowMaterial } from './materials';

/**
 * 3D Procedural Inner Light & Full-Screen Sparkle Burst
 * Radiant warm golden interior light, glowing core, expanding flare streaks,
 * and high-energy particles radiating to the edges of the screen.
 */
export const InnerLightAndSparkles = forwardRef(({ isOpening = false }, ref) => {
  const lightRef = useRef(null);
  const coreRef = useRef(null);
  const particlesRef = useRef(null);
  const flareGroupRef = useRef(null);
  const glowMat = useMemo(() => createInnerGlowMaterial(), []);

  // 140 High-energy burst particles
  const { particlePositions, velocities, count } = useMemo(() => {
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    const vels = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = 0.5 + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI * 0.48); // Wide upward cone
      const speed = 2.4 + Math.random() * 4.8;

      vels.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.cos(phi) * speed + 1.2,
        z: Math.sin(phi) * Math.sin(theta) * speed,
      });
    }

    return { particlePositions: positions, velocities: vels, count: particleCount };
  }, []);

  const burstProgress = useRef(0);

  useImperativeHandle(ref, () => ({
    get light() { return lightRef.current; },
    get core() { return coreRef.current; },
    get particles() { return particlesRef.current; },
    get flares() { return flareGroupRef.current; },
    setIntensity(val) {
      if (lightRef.current) lightRef.current.intensity = val;
      if (coreRef.current) coreRef.current.scale.setScalar(Math.max(0.1, val * 0.08));
      if (flareGroupRef.current) {
        const flareScale = Math.min(4.5, val * 0.15);
        flareGroupRef.current.scale.set(flareScale, flareScale, flareScale);
      }
    },
    setBurstProgress(p) {
      burstProgress.current = p;
    }
  }));

  useFrame(() => {
    if (!particlesRef.current) return;
    const geo = particlesRef.current.geometry;
    const pos = geo.attributes.position.array;
    const p = burstProgress.current;

    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      // Expand outward across full viewport space
      pos[i * 3] = v.x * p * 2.2;
      pos[i * 3 + 1] = 0.5 + v.y * p * 2.4 - (p * p * 1.0);
      pos[i * 3 + 2] = v.z * p * 2.2;
    }

    geo.attributes.position.needsUpdate = true;
    if (particlesRef.current.material) {
      particlesRef.current.material.opacity = Math.max(0, 1 - p * 0.9);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* High-intensity Warm Golden Inner Point Light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.45, 0]}
        color="#ffe699"
        intensity={0.2}
        distance={16.0}
        decay={2}
      />

      {/* Radiant Glowing Core Mesh */}
      <mesh ref={coreRef} position={[0, 0.45, 0]} scale={[0.1, 0.1, 0.1]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <primitive object={glowMat} attach="material" />
      </mesh>

      {/* Expanding Light Flare Streaks */}
      <group ref={flareGroupRef} position={[0, 0.5, 0]} scale={[0.01, 0.01, 0.01]}>
        {[0, 45, 90, 135].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]}>
            <planeGeometry args={[0.12, 3.5]} />
            <meshBasicMaterial
              color="#fffbeb"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Screen-Wide Burst Particles */}
      <points ref={particlesRef} visible={isOpening || burstProgress.current > 0}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.085}
          color="#fef08a"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
});

InnerLightAndSparkles.displayName = 'InnerLightAndSparkles';
