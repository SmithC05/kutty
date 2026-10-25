import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Procedural Soft Contact Shadow
 * Soft radial shadow beneath the floating present that reacts dynamically to gift elevation.
 */
export function ContactShadow({ yOffset = -1.35, giftY = 0 }) {
  const meshRef = useRef(null);

  // Procedural Canvas radial gradient texture for the soft shadow
  const shadowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 5, 18, 0.7)');
    gradient.addColorStop(0.3, 'rgba(0, 8, 25, 0.45)');
    gradient.addColorStop(0.7, 'rgba(2, 12, 35, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    // Shadow scales slightly smaller and more diffuse as gift rises
    const factor = 1 - Math.max(0, giftY * 0.15);
    meshRef.current.scale.set(factor, factor, 1);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, yOffset, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[3.2, 3.2]} />
      <meshBasicMaterial
        map={shadowTexture}
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </mesh>
  );
}
