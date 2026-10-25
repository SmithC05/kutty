import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SHIVA_DEPICTION_CONFIG } from './shivaAssets';

/**
 * ShivaDarshan3D
 * 
 * Strict Asset Quality Gate:
 * - If SHIVA_DEPICTION_CONFIG.type === '3d-model' and modelPath is set, renders the 3D model.
 * - Otherwise renders the genuine, high-quality devotional artwork integrated into 3D space
 *   with celestial rim lighting, soft radial aura, depth integration, and gentle breathing parallax.
 * 
 * Never draws cartoon faces or geometric primitives.
 */

// Generate celestial halo texture for the aura behind Shiva
function createCelestialAuraTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  // Concentric celestial aura
  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0, 'rgba(215, 235, 255, 0.95)');
  grad.addColorStop(0.35, 'rgba(180, 215, 250, 0.6)');
  grad.addColorStop(0.65, 'rgba(100, 160, 220, 0.2)');
  grad.addColorStop(1, 'rgba(8, 20, 38, 0)');
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  return new THREE.CanvasTexture(canvas);
}

// ── 3D Model Renderer (when a 3D model is provided) ──────────────────────────
function ShivaModel({ modelPath, revealProgress, _blessingProgress }) {
  const gltf = useGLTF(modelPath);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.opacity = revealProgress;
          child.material.transparent = true;
        }
      });
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      position={[0, -0.2, 0]}
      scale={[1, 1, 1]}
    />
  );
}

// ── Devotional Artwork 3D Integration ─────────────────────────────────────────
function ShivaArtwork({
  artworkPath,
  revealProgress = 1,
  blessingProgress = 0,
  reducedMotion = false,
}) {
  const texture = useLoader(THREE.TextureLoader, artworkPath);
  const auraTexture = useMemo(() => createCelestialAuraTexture(), []);

  // Configure texture properties for pristine rendering
  useMemo(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

  const groupRef = useRef();
  const auraRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (!reducedMotion && groupRef.current) {
      // Very gentle, dignified meditative float
      groupRef.current.position.y = -0.15 + Math.sin(t * 0.5) * 0.035;
    }

    // Dynamic aura pulsation & warmth
    if (auraRef.current) {
      const pulse = 1.0 + Math.sin(t * 0.8) * 0.05 + blessingProgress * 0.3;
      auraRef.current.scale.set(pulse, pulse, pulse);
    }

    // Material response to reveal & blessing
    if (materialRef.current) {
      materialRef.current.opacity = Math.max(0.001, revealProgress);
      // Soft golden emissive tint during blessings
      if (blessingProgress > 0) {
        materialRef.current.emissive = new THREE.Color(SHIVA_DEPICTION_CONFIG.palette.sacredGold);
        materialRef.current.emissiveIntensity = blessingProgress * 0.22;
      } else {
        materialRef.current.emissiveIntensity = 0;
      }
    }
  });

  const { planeWidth, planeHeight } = SHIVA_DEPICTION_CONFIG;

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* ── Celestial Aura Mesh (Behind Figure) ─────────────────────────────── */}
      <mesh
        ref={auraRef}
        position={[0, 0.25, -0.15]}
        scale={[1, 1, 1]}
      >
        <planeGeometry args={[planeWidth * 1.5, planeWidth * 1.5]} />
        <meshBasicMaterial
          map={auraTexture}
          transparent
          opacity={(0.35 + blessingProgress * 0.4) * revealProgress}
          color={blessingProgress > 0 ? new THREE.Color('#FFDF88') : new THREE.Color('#C8E2FB')}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── Lord Shiva Devotional Artwork Plane ─────────────────────────────── */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          transparent
          alphaTest={0.01}
          roughness={0.75}
          metalness={0.15}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Root ShivaDarshan3D Component ─────────────────────────────────────────────
export function ShivaDarshan3D({
  revealProgress = 1,
  blessingProgress = 0,
  reducedMotion = false,
}) {
  const is3DModel =
    SHIVA_DEPICTION_CONFIG.type === '3d-model' &&
    Boolean(SHIVA_DEPICTION_CONFIG.modelPath);

  if (is3DModel) {
    return (
      <React.Suspense fallback={null}>
        <ShivaModel
          modelPath={SHIVA_DEPICTION_CONFIG.modelPath}
          revealProgress={revealProgress}
          blessingProgress={blessingProgress}
        />
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={null}>
      <ShivaArtwork
        artworkPath={SHIVA_DEPICTION_CONFIG.artworkPath}
        revealProgress={revealProgress}
        blessingProgress={blessingProgress}
        reducedMotion={reducedMotion}
      />
    </React.Suspense>
  );
}
