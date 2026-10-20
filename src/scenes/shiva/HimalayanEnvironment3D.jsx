import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SHIVA_DEPICTION_CONFIG } from './shivaAssets';

/**
 * HimalayanEnvironment3D
 * 
 * Genuine 3D Himalayan Mount Kailash environment using Three.js / React Three Fiber:
 * - Natural 3D starfield with subtle celestial twinkling
 * - Luminous 3D Moon with soft additive atmospheric halos
 * - Multi-layered 3D mountain silhouettes (Far Mount Kailash, Mid Ridge, Near Crags)
 * - Drifting 3D atmospheric mist planes responsive to blessing light
 * - Sacred procedural metallic Trishul with damru
 * - Devotional clay diyas with warm flickering illumination
 * - Sacred river reflection in foreground
 */

// Generate procedural soft mist texture
function createMistTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(243, 247, 250, 0.85)');
  grad.addColorStop(0.35, 'rgba(215, 231, 245, 0.45)');
  grad.addColorStop(0.7, 'rgba(16, 43, 72, 0.12)');
  grad.addColorStop(1, 'rgba(8, 20, 38, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

// Generate soft moon halo texture
function createHaloTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(235, 245, 255, 0.9)');
  grad.addColorStop(0.25, 'rgba(215, 231, 245, 0.4)');
  grad.addColorStop(0.6, 'rgba(180, 210, 240, 0.1)');
  grad.addColorStop(1, 'rgba(8, 20, 38, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export function HimalayanEnvironment3D({ blessingProgress = 0, reducedMotion = false }) {
  const mistTexture = useMemo(() => createMistTexture(), []);
  const haloTexture = useMemo(() => createHaloTexture(), []);

  // ── Starfield (Points) ───────────────────────────────────────────────────────
  const starGeometry = useMemo(() => {
    const count = reducedMotion ? 400 : 900;
    const positions = new Float32Array(count * 3);
    const opacities = new Float32Array(count);
    
    // Deterministic pseudo-random distribution
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < count; i++) {
      // Hemisphere of stars behind scene
      const x = (rand() - 0.5) * 60;
      const y = rand() * 32 + 2;
      const z = -rand() * 25 - 12;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      opacities[i] = 0.3 + rand() * 0.7;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    geo.computeBoundingSphere();
    return geo;
  }, [reducedMotion]);

  // ── Procedural Mountain Meshes ──────────────────────────────────────────────
  // Far Kailash Ridge Geometry
  const farMountainGeo = useMemo(() => {
    const w = 70;
    const segments = 48;
    const geo = new THREE.PlaneGeometry(w, 24, segments, 16);
    const pos = geo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Shape Mount Kailash peak in center, secondary peaks flanking
      const distFromCenter = Math.abs(x);
      let peakHeight = 0;
      if (distFromCenter < 12) {
        // Main Mount Kailash pyramidal summit
        peakHeight = Math.cos((distFromCenter / 12) * Math.PI * 0.5) * 8.5;
      } else {
        peakHeight = Math.sin(x * 0.3) * 3.2 + Math.cos(x * 0.6) * 1.8 + 2.5;
      }
      
      const normalizedY = (y + 12) / 24;
      pos.setZ(i, Math.sin(x * 0.4) * 2.5);
      pos.setY(i, y + peakHeight * normalizedY);
    }
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    return geo;
  }, []);

  // Mid Mountain Ridge Geometry
  const midMountainGeo = useMemo(() => {
    const w = 55;
    const segments = 36;
    const geo = new THREE.PlaneGeometry(w, 16, segments, 12);
    const pos = geo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const ridgeHeight = Math.sin(x * 0.35 + 1.2) * 2.8 + Math.cos(x * 0.7) * 1.5 + 3.0;
      const normalizedY = (y + 8) / 16;
      pos.setZ(i, Math.sin(x * 0.5) * 1.5);
      pos.setY(i, y + ridgeHeight * normalizedY);
    }
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    return geo;
  }, []);

  // Near Foothills & Stone Ledge
  const nearMountainGeo = useMemo(() => {
    const w = 40;
    const segments = 24;
    const geo = new THREE.PlaneGeometry(w, 10, segments, 8);
    const pos = geo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Valley opening in center for Shiva darshan
      const valley = Math.min(1.0, Math.abs(x) / 7.0);
      const ridgeHeight = valley * (Math.sin(x * 0.6) * 2.0 + 3.2);
      const normalizedY = (y + 5) / 10;
      pos.setZ(i, Math.cos(x * 0.5) * 1.2);
      pos.setY(i, y + ridgeHeight * normalizedY);
    }
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    return geo;
  }, []);

  // ── Materials ───────────────────────────────────────────────────────────────
  const farMountainMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(SHIVA_DEPICTION_CONFIG.palette.deepBlue),
    roughness: 0.85,
    metalness: 0.1,
    flatShading: true,
  }), []);

  const midMountainMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0b1d33'),
    roughness: 0.9,
    metalness: 0.05,
    flatShading: true,
  }), []);

  const nearMountainMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#071322'),
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true,
  }), []);

  // ── References for Real-Time Animation ─────────────────────────────────────
  const mist1Ref = useRef();
  const mist2Ref = useRef();
  const mist3Ref = useRef();
  const starsRef = useRef();
  const diyasGroupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (!reducedMotion) {
      // Drifting 3D mist
      if (mist1Ref.current) {
        mist1Ref.current.position.x = Math.sin(t * 0.08) * 2.5 - 1.0;
        mist1Ref.current.position.y = -1.2 + Math.cos(t * 0.12) * 0.2;
      }
      if (mist2Ref.current) {
        mist2Ref.current.position.x = Math.cos(t * 0.06) * 3.5 + 2.0;
        mist2Ref.current.position.y = -0.6 + Math.sin(t * 0.09) * 0.25;
      }
      if (mist3Ref.current) {
        mist3Ref.current.position.x = Math.sin(t * 0.05 + 2.0) * 4.0;
      }

      // Subtle diya flame flickering
      if (diyasGroupRef.current) {
        diyasGroupRef.current.children.forEach((diya, i) => {
          const flame = diya.getObjectByName('flame');
          const light = diya.getObjectByName('light');
          if (flame) {
            const flicker = Math.sin(t * 12 + i * 2.3) * 0.08 + Math.cos(t * 17 + i) * 0.05;
            flame.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
          }
          if (light) {
            light.intensity = 1.2 + Math.sin(t * 10 + i * 3) * 0.35 + blessingProgress * 0.8;
          }
        });
      }
    }
  });

  return (
    <group>
      {/* ── 3D Starfield ──────────────────────────────────────────────────────── */}
      <points ref={starsRef} geometry={starGeometry}>
        <pointsMaterial
          size={0.16}
          color={new THREE.Color(SHIVA_DEPICTION_CONFIG.palette.moonSilver)}
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* ── 3D Moon & Celestial Halos ─────────────────────────────────────────── */}
      <group position={[9.5, 11.5, -24]}>
        {/* Moon Disc */}
        <mesh>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshBasicMaterial color="#EEF8FF" />
        </mesh>
        {/* Soft Moon Halos */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[8.5, 8.5]} />
          <meshBasicMaterial
            map={haloTexture}
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[16.0, 16.0]} />
          <meshBasicMaterial
            map={haloTexture}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ── 3D Mountain Ridges ────────────────────────────────────────────────── */}
      {/* Far Ridge: Mount Kailash Peak */}
      <mesh
        geometry={farMountainGeo}
        material={farMountainMat}
        position={[0, 1.5, -20]}
        rotation={[-0.05, 0, 0]}
      />

      {/* Mid Ridge: Valley Silhouettes */}
      <mesh
        geometry={midMountainGeo}
        material={midMountainMat}
        position={[0, -1.8, -12]}
        rotation={[-0.03, 0, 0]}
      />

      {/* Near Foothills / Flanking Ledges */}
      <mesh
        geometry={nearMountainGeo}
        material={nearMountainMat}
        position={[0, -3.2, -4.5]}
      />

      {/* ── Sacred River Surface (Water Plane) ────────────────────────────────── */}
      <mesh position={[0, -3.6, -2]} rotation={[-Math.PI / 2 + 0.08, 0, 0]}>
        <planeGeometry args={[45, 18]} />
        <meshStandardMaterial
          color="#061220"
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* ── 3D Drifting Mist Planes ───────────────────────────────────────────── */}
      {/* Near Mist Plane */}
      <mesh ref={mist1Ref} position={[0, -1.2, -1.5]}>
        <planeGeometry args={[22, 6]} />
        <meshBasicMaterial
          map={mistTexture}
          transparent
          opacity={0.32 + blessingProgress * 0.15}
          color={blessingProgress > 0 ? new THREE.Color(SHIVA_DEPICTION_CONFIG.palette.sacredGold) : new THREE.Color('#D7E7F5')}
          depthWrite={false}
        />
      </mesh>

      {/* Mid-Depth Mist Plane */}
      <mesh ref={mist2Ref} position={[2, -0.6, -6]}>
        <planeGeometry args={[28, 8]} />
        <meshBasicMaterial
          map={mistTexture}
          transparent
          opacity={0.28 + blessingProgress * 0.12}
          color={blessingProgress > 0 ? new THREE.Color('#FFE8A3') : new THREE.Color('#BED6EE')}
          depthWrite={false}
        />
      </mesh>

      {/* Valley Distance Mist Plane */}
      <mesh ref={mist3Ref} position={[-2, 1.0, -13]}>
        <planeGeometry args={[36, 10]} />
        <meshBasicMaterial
          map={mistTexture}
          transparent
          opacity={0.24}
          color="#A8C8E6"
          depthWrite={false}
        />
      </mesh>

      {/* ── Sacred Trishul (3D Procedural Trident) ────────────────────────────── */}
      <group position={[-2.8, -0.6, 0.6]} rotation={[0, 0.25, 0.05]} scale={[0.85, 0.85, 0.85]}>
        {/* Shaft */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 3.8, 16]} />
          <meshStandardMaterial color="#E6C77A" roughness={0.35} metalness={0.85} />
        </mesh>
        {/* Center Spearhead */}
        <mesh position={[0, 2.7, 0]}>
          <coneGeometry args={[0.12, 0.8, 16]} />
          <meshStandardMaterial color="#F2D78E" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Left Curved Prong */}
        <mesh position={[-0.28, 2.45, 0]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.035, 0.035, 0.65, 12]} />
          <meshStandardMaterial color="#E6C77A" roughness={0.35} metalness={0.85} />
        </mesh>
        <mesh position={[-0.42, 2.75, 0]} rotation={[0, 0, -0.1]}>
          <coneGeometry args={[0.09, 0.45, 12]} />
          <meshStandardMaterial color="#F2D78E" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Right Curved Prong */}
        <mesh position={[0.28, 2.45, 0]} rotation={[0, 0, 0.35]}>
          <cylinderGeometry args={[0.035, 0.035, 0.65, 12]} />
          <meshStandardMaterial color="#E6C77A" roughness={0.35} metalness={0.85} />
        </mesh>
        <mesh position={[0.42, 2.75, 0]} rotation={[0, 0, 0.1]}>
          <coneGeometry args={[0.09, 0.45, 12]} />
          <meshStandardMaterial color="#F2D78E" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Crossbar */}
        <mesh position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 12]} />
          <meshStandardMaterial color="#D4B05C" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Damru (Hourglass Drum) */}
        <group position={[0, 1.85, 0.08]} scale={[0.18, 0.18, 0.18]}>
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.7, 0.8, 16]} />
            <meshStandardMaterial color="#8A4A1C" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.7, 0.8, 16]} />
            <meshStandardMaterial color="#8A4A1C" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ── Foreground Devotional Diyas (Oil Lamps) ───────────────────────────── */}
      <group ref={diyasGroupRef}>
        {[
          { pos: [-2.2, -2.4, 2.0], scale: 0.9 },
          { pos: [-1.1, -2.5, 2.4], scale: 1.0 },
          { pos: [1.1, -2.5, 2.4], scale: 1.0 },
          { pos: [2.2, -2.4, 2.0], scale: 0.9 },
        ].map((item, idx) => (
          <group key={idx} position={item.pos} scale={[item.scale, item.scale, item.scale]}>
            {/* Clay Bowl */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.14, 0.12, 16]} />
              <meshStandardMaterial color="#945219" roughness={0.85} />
            </mesh>
            {/* Flame */}
            <mesh name="flame" position={[0, 0.14, 0]}>
              <coneGeometry args={[0.08, 0.22, 12]} />
              <meshBasicMaterial color="#FFD152" />
            </mesh>
            {/* Flame Point Light */}
            <pointLight
              name="light"
              position={[0, 0.22, 0]}
              color="#FFA500"
              intensity={1.2}
              distance={4.5}
              decay={2}
            />
          </group>
        ))}
      </group>
    </group>
  );
}
