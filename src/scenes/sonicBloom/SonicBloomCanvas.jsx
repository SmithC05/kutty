import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SonicSculpture3D } from './SonicSculpture3D';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';

/**
 * Responsive Camera & Atmosphere Controller
 */
function SceneCameraController({ reducedMotion = false }) {
  const { camera, size, pointer } = useThree();

  // Responsive camera distance based on viewport aspect ratio
  const targetZ = useMemo(() => {
    const aspect = size.width / Math.max(1, size.height);
    if (aspect < 0.6) return 6.6; // Tall narrow mobile (360x806, 320x680)
    if (aspect < 1.0) return 5.8; // Tablet portrait / square
    return 4.9; // Desktop wide
  }, [size.width, size.height]);

  useEffect(() => {
    camera.position.set(0, 0, targetZ);
    camera.lookAt(0, 0, 0);
  }, [camera, targetZ]);

  // Subtle interactive pointer parallax on desktop
  useFrame(() => {
    if (reducedMotion) return;
    const targetX = pointer.x * 0.45;
    const targetY = pointer.y * 0.35;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Background Ambient Particles & Atmospheric Dust
 */
function AtmosphericDust({ activeColor = '#00f0ff', count = 100, reducedMotion = false }) {
  const pointsRef = useRef();

  const [geo, velocities] = useMemo(() => {
    const n = reducedMotion ? 40 : count;
    const positions = new Float32Array(n * 3);
    const vels = new Float32Array(n * 3);

    let seed = 77;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < n; i++) {
      positions[i * 3] = (rand() - 0.5) * 14;
      positions[i * 3 + 1] = (rand() - 0.5) * 10;
      positions[i * 3 + 2] = (rand() - 0.5) * 8;

      vels[i * 3] = (rand() - 0.5) * 0.05;
      vels[i * 3 + 1] = 0.05 + rand() * 0.1;
      vels[i * 3 + 2] = (rand() - 0.5) * 0.05;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return [g, vels];
  }, [count, reducedMotion]);

  useFrame((_, delta) => {
    if (reducedMotion || !pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const arr = pos.array;
    const n = arr.length / 3;

    for (let i = 0; i < n; i++) {
      arr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.045}
        color={activeColor}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
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
        camera={{ position: [0, 0, 5], fov: 48, near: 0.1, far: 50 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full"
      >
        {/* Soft atmospheric indigo & cyan studio illumination */}
        <ambientLight color="#0a1226" intensity={1.1} />

        {/* Front Directional Key Light */}
        <directionalLight
          position={[3, 4, 5]}
          intensity={1.3}
          color="#dbeafe"
        />

        {/* Rim Light 1 — Ultraviolet / Violet */}
        <pointLight
          position={[-4, 3, -2]}
          intensity={2.2}
          color="#8b5cf6"
          distance={12}
        />

        {/* Rim Light 2 — Active Track Accent Hue */}
        <pointLight
          position={[4, -2, -3]}
          intensity={2.0}
          color={activeTrack.colors.primary}
          distance={12}
        />

        {/* Backlight halo */}
        <pointLight
          position={[0, 0, -4]}
          intensity={1.2}
          color="#1e1b4b"
          distance={10}
        />

        {/* Camera controller & responsive framing */}
        <SceneCameraController reducedMotion={reducedMotion} />

        {/* Floating atmospheric dust */}
        <AtmosphericDust
          activeColor={activeTrack.colors.primary}
          reducedMotion={reducedMotion}
        />

        {/* The 6-Petal Interactive Sonic Sculpture */}
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
