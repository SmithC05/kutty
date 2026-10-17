import React, { forwardRef, useRef, useMemo, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createInnerGlowMaterial } from './materials';

/**
 * 3D Procedural Inner Light & Sparkle Burst
 * Houses the warm golden inner light and radiating procedural sparkle particles.
 */
export const InnerLightAndSparkles = forwardRef(({ isOpening = false }, ref) => {
  const lightRef = useRef(null);
  const coreRef = useRef(null);
  const particlesRef = useRef(null);
  const glowMat = useMemo(() => createInnerGlowMaterial(), []);

  // Burst particle data
  const { particlePositions, velocities, count } = useMemo(() => {
    const particleCount = 85;
    const positions = new Float32Array(particleCount * 3);
    const vels = [];

    for (let i = 0; i < particleCount; i++) {
      // Start near center of the box cavity
      positions[i * 3] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = 0.5 + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      // Spherical radiating velocities with upward bias
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI * 0.45); // biased upwards
      const speed = 1.2 + Math.random() * 2.2;

      vels.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.cos(phi) * speed + 0.8,
        z: Math.sin(phi) * Math.sin(theta) * speed,
        scale: 0.6 + Math.random() * 0.8,
      });
    }

    return { particlePositions: positions, velocities: vels, count: particleCount };
  }, []);

  const burstProgress = useRef(0);

  // Expose API for GSAP timelines
  useImperativeHandle(ref, () => ({
    get light() { return lightRef.current; },
    get core() { return coreRef.current; },
    get particles() { return particlesRef.current; },
    setIntensity(val) {
      if (lightRef.current) lightRef.current.intensity = val;
      if (coreRef.current) coreRef.current.scale.setScalar(val * 0.1);
    },
    setBurstProgress(p) {
      burstProgress.current = p;
    }
  }));

  // Update particles on frame
  useFrame(() => {
    if (!particlesRef.current) return;
    const geo = particlesRef.current.geometry;
    const pos = geo.attributes.position.array;
    const p = burstProgress.current;

    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      // Expand outward according to burst progress
      pos[i * 3] = v.x * p * 1.5;
      pos[i * 3 + 1] = 0.6 + v.y * p * 1.6 - (p * p * 0.8); // slight gravity arc
      pos[i * 3 + 2] = v.z * p * 1.5;
    }

    geo.attributes.position.needsUpdate = true;
    if (particlesRef.current.material) {
      // Fade out near end of burst
      particlesRef.current.material.opacity = Math.max(0, 1 - p * 0.95);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Inner Point Light (Radiant warm gold) */}
      <pointLight
        ref={lightRef}
        position={[0, 0.4, 0]}
        color="#ffe58f"
        intensity={0.2}
        distance={7.0}
        decay={2}
      />

      {/* Radiant Glowing Core Mesh */}
      <mesh ref={coreRef} position={[0, 0.4, 0]} scale={[0.1, 0.1, 0.1]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <primitive object={glowMat} attach="material" />
      </mesh>

      {/* Procedural Golden Sparkle Burst Particles */}
      <points ref={particlesRef} visible={isOpening || burstProgress.current > 0}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          color="#ffeb99"
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
