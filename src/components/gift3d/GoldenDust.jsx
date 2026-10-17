import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Procedural Ambient Golden Dust
 * Floating sparkles drifting around the present.
 */
export function GoldenDust({ count = 60 }) {
  const pointsRef = useRef(null);

  const { positions, initialY, speeds, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const inits = new Float32Array(count);
    const spds = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 1.4 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const y = -1.0 + Math.random() * 2.8;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      inits[i] = y;
      spds[i] = 0.2 + Math.random() * 0.4;
      phs[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, initialY: inits, speeds: spds, phases: phs };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Gentle vertical floating and subtle orbital drift
      pos[i * 3 + 1] = initialY[i] + Math.sin(time * speeds[i] + phases[i]) * 0.25;
    }

    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#ffe58f"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
