import React, { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { HimalayanEnvironment3D } from './HimalayanEnvironment3D';
import { ShivaDarshan3D } from './ShivaDarshan3D';
import { SHIVA_DEPICTION_CONFIG } from './shivaAssets';

/**
 * ShivaScene3D
 * 
 * Coordinates the full-scene React Three Fiber world:
 * - Dynamic lighting (moonlight, cyan rim light, radiant golden blessing light)
 * - Atmospheric fog matching the #081426 midnight palette
 * - Responsive camera framing tailored for desktop & mobile
 * - Smooth GSAP camera dolly and lighting transitions
 */

export function ShivaScene3D({
  act = 'transition', // 'transition' | 'environment' | 'reveal' | 'blessing' | 'complete'
  revealProgress = 1,
  blessingProgress = 0,
  reducedMotion = false,
}) {
  const { camera, size, scene } = useThree();

  // Set scene fog
  useEffect(() => {
    scene.fog = new THREE.FogExp2(SHIVA_DEPICTION_CONFIG.palette.midnight, 0.035);
    scene.background = new THREE.Color(SHIVA_DEPICTION_CONFIG.palette.midnight);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  const isMobile = size.width < 768;

  // Responsive target camera positions
  const targetCamPos = useMemo(() => {
    if (isMobile) {
      return { x: 0, y: 0.25, z: 7.2, fov: 50 };
    }
    // Desktop: 1366x768, 1440x900, 1920x1080
    return { x: 0, y: 0.1, z: 5.6, fov: 40 };
  }, [isMobile]);

  // Initial Camera Dolly Animation (Act I -> Act II)
  useEffect(() => {
    if (reducedMotion) {
      camera.position.set(targetCamPos.x, targetCamPos.y, targetCamPos.z);
      camera.lookAt(0, 0.2, 0);
      return;
    }

    // Set initial entrance camera position
    if (act === 'transition') {
      camera.position.set(targetCamPos.x, targetCamPos.y + 0.8, targetCamPos.z + 2.5);
      camera.lookAt(0, 0.4, 0);
    }

    // Dolly into Kailash sanctuary
    const ctx = gsap.context(() => {
      gsap.to(camera.position, {
        x: targetCamPos.x,
        y: targetCamPos.y,
        z: targetCamPos.z,
        duration: 3.5,
        ease: 'power2.out',
        onUpdate: () => {
          camera.lookAt(0, 0.15, 0);
        },
      });
    });

    return () => ctx.revert();
  }, [act, camera, targetCamPos, reducedMotion]);

  // Subtle mouse / touch parallax
  const pointerRef = useRef({ x: 0, y: 0 });
  useFrame(({ pointer }) => {
    if (reducedMotion) return;
    pointerRef.current.x = THREE.MathUtils.lerp(pointerRef.current.x, pointer.x * 0.18, 0.04);
    pointerRef.current.y = THREE.MathUtils.lerp(pointerRef.current.y, pointer.y * 0.12, 0.04);

    camera.position.x = targetCamPos.x + pointerRef.current.x;
    camera.position.y = targetCamPos.y + pointerRef.current.y;
    camera.lookAt(0, 0.15, 0);
  });

  // Dynamic light references
  const blessingLightRef = useRef();
  const rimLightRef = useRef();

  return (
    <>
      {/* ── Ambient Illumination (Midnight Blue) ─────────────────────────────── */}
      <ambientLight color="#102B48" intensity={0.85} />

      {/* ── Moonlight (Directional Light from Upper-Right) ───────────────────── */}
      <directionalLight
        position={[8, 10, 4]}
        color="#D7E7F5"
        intensity={1.35}
      />

      {/* ── Sacred Rim Light behind Shiva (Cool Cyan/Silver) ────────────────── */}
      <pointLight
        ref={rimLightRef}
        position={[0, 1.2, -1.2]}
        color="#C0E0FF"
        intensity={1.2 * Math.max(0.2, revealProgress)}
        distance={7}
        decay={2}
      />

      {/* ── Golden Blessing Light (Radiates during Act IV) ───────────────────── */}
      <pointLight
        ref={blessingLightRef}
        position={[0, 0.2, 2.8]}
        color="#FFE08A"
        intensity={blessingProgress * 2.8}
        distance={10}
        decay={2}
      />

      {/* ── 3D Himalayan Mount Kailash Environment ───────────────────────────── */}
      <HimalayanEnvironment3D
        blessingProgress={blessingProgress}
        reducedMotion={reducedMotion}
      />

      {/* ── Central Devotional Darshan (Lord Shiva) ─────────────────────────── */}
      <ShivaDarshan3D
        revealProgress={revealProgress}
        blessingProgress={blessingProgress}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
