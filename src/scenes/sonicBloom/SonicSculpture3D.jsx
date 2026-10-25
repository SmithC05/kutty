import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * SonicSculpture3D — Six Unique Song Visual Experiences
 *
 * Each of the six songs features its own distinct 3D visual composition:
 *   1. Unnale: Warm romantic cinema with floating golden bokeh orbs and subtle amber grooves.
 *   2. Chella Magale: Soft luminous horizon and graceful upward-drifting memory pearls.
 *   3. Magale: Intimate harmonic sound-art resonance ribbons and fine sine oscillations.
 *   4. Alakolava: Stylish dramatic helical double-spiral light trails in violet and coral.
 *   5. Engey Andha Vennila: Moonlit calm with twinkling starry night sky and glowing moon corona.
 *   6. Life of Pazham: Joyful energetic spectrum equalizer bars and celebratory kinetic cascades.
 */

// ─── 1. UNNALE: Warm Romantic Cinema ─────────────────────────────────────────
function UnnaleVisualizer({ audioReactivity, reducedMotion }) {
  const groupRef = useRef();
  const bokehRef = useRef();
  const discRef = useRef();

  // Floating warm bokeh orbs
  const bokehData = useMemo(() => {
    const count = reducedMotion ? 12 : 22;
    const items = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.random() * 1.6;
      items.push({
        baseX: Math.cos(theta) * r,
        baseY: Math.sin(theta) * r,
        baseZ: (Math.random() - 0.5) * 0.8,
        scale: 0.12 + Math.random() * 0.28,
        speed: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        color: i % 2 === 0 ? '#fde047' : '#fb923c',
        opacity: 0.15 + Math.random() * 0.25,
      });
    }
    return items;
  }, [reducedMotion]);

  // Subtle vinyl record disc geometry
  const discGeo = useMemo(() => new THREE.CylinderGeometry(1.65, 1.65, 0.03, 48), []);
  const centerLabelGeo = useMemo(() => new THREE.CylinderGeometry(0.55, 0.55, 0.035, 36), []);

  useFrame((_, delta) => {
    const isPlaying = audioReactivity?.isPlaying || false;
    const amp = audioReactivity?.amplitude || 0;

    if (discRef.current && !reducedMotion) {
      discRef.current.rotation.z -= (isPlaying ? 0.45 + amp * 0.3 : 0.08) * delta;
    }

    if (bokehRef.current && !reducedMotion) {
      const time = performance.now() * 0.001;
      bokehRef.current.children.forEach((mesh, idx) => {
        const item = bokehData[idx];
        if (!item) return;
        mesh.position.y = item.baseY + Math.sin(time * item.speed + item.phase) * 0.15;
        mesh.position.x = item.baseX + Math.cos(time * item.speed * 0.8 + item.phase) * 0.12;
        const pulse = 1 + Math.sin(time * 2 + item.phase) * 0.15 + (isPlaying ? amp * 0.3 : 0);
        mesh.scale.setScalar(item.scale * pulse);
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[-0.2, 0, 0]}>
      {/* Central romantic amber record */}
      <group ref={discRef}>
        <mesh geometry={discGeo} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#120e0a" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh geometry={centerLabelGeo} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#d97706" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[0.7, 1.55, 36]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.06} />
        </mesh>
      </group>

      {/* Floating golden bokeh light orbs */}
      <group ref={bokehRef}>
        {bokehData.map((item, idx) => (
          <mesh key={idx} position={[item.baseX, item.baseY, item.baseZ]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
              color={item.color}
              transparent
              opacity={item.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Warm romantic atmosphere glow */}
      <mesh position={[0, 0, -0.1]}>
        <circleGeometry args={[2.2, 36]} />
        <meshBasicMaterial
          color="#d97706"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── 2. CHELLA MAGALE: Soft Horizon & Floating Upward Pearls ──────────────────
function ChellaMagaleVisualizer({ audioReactivity, reducedMotion }) {
  const groupRef = useRef();
  const pearlsRef = useRef();
  const horizonRef = useRef();

  // Floating upward luminous memory pearls
  const pearlsData = useMemo(() => {
    const count = reducedMotion ? 20 : 40;
    const pos = new Float32Array(count * 3);
    const vels = new Float32Array(count);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color('#c084fc');
    const c2 = new THREE.Color('#2dd4bf');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3.8;
      pos[i * 3 + 1] = -1.8 + Math.random() * 3.6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
      vels[i] = 0.25 + Math.random() * 0.45;
      sizes[i] = 0.04 + Math.random() * 0.06;

      const mixed = i % 2 === 0 ? c1 : c2;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return { geo, vels, count };
  }, [reducedMotion]);

  // Undulating Horizon Ribbon Mesh
  const horizonGeo = useMemo(() => {
    const segX = 48;
    const segY = 12;
    const geo = new THREE.PlaneGeometry(4.2, 1.4, segX, segY);
    return geo;
  }, []);

  useFrame((_, delta) => {
    const isPlaying = audioReactivity?.isPlaying || false;
    const amp = audioReactivity?.amplitude || 0;

    // Upward drift of pearls
    if (pearlsRef.current && !reducedMotion) {
      const pos = pearlsRef.current.geometry.attributes.position;
      const arr = pos.array;
      const speedMult = isPlaying ? 1.0 + amp * 1.5 : 0.6;

      for (let i = 0; i < pearlsData.count; i++) {
        arr[i * 3 + 1] += pearlsData.vels[i] * delta * speedMult;
        if (arr[i * 3 + 1] > 2.0) {
          arr[i * 3 + 1] = -1.8;
          arr[i * 3] = (Math.random() - 0.5) * 3.8;
        }
      }
      pos.needsUpdate = true;
    }

    // Horizon wave motion
    if (horizonRef.current && !reducedMotion) {
      const time = performance.now() * 0.0018;
      const pos = horizonRef.current.geometry.attributes.position;
      const arr = pos.array;
      const count = arr.length / 3;

      for (let i = 0; i < count; i++) {
        const x = arr[i * 3];
        arr[i * 3 + 2] = Math.sin(x * 2.2 + time) * (0.12 + (isPlaying ? amp * 0.25 : 0));
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* Ethereal curved horizon ribbon in lower section */}
      <mesh ref={horizonRef} geometry={horizonGeo} position={[0, -0.65, -0.2]} rotation={[-0.45, 0, 0]}>
        <meshStandardMaterial
          color="#c084fc"
          emissive="#2dd4bf"
          emissiveIntensity={0.35}
          roughness={0.4}
          metalness={0.6}
          wireframe={true}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Upward drifting luminous pearls */}
      <points ref={pearlsRef} geometry={pearlsData.geo}>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Soft central emotional aura */}
      <mesh position={[0, 0.1, -0.3]}>
        <circleGeometry args={[1.8, 32]} />
        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={0.10}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── 3. MAGALE: Intimate Layered Acoustic Sound Art ──────────────────────────
function MagaleVisualizer({ audioReactivity, reducedMotion }) {
  const groupRef = useRef();
  const ribbonsRef = useRef([]);

  // 4 Concentric harmonic sine wave ribbons
  const waveLayers = useMemo(() => {
    return [0.75, 1.15, 1.55, 1.95].map((baseRadius, layerIdx) => {
      const segments = 80;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array((segments + 1) * 3);
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        pos[i * 3] = Math.cos(theta) * baseRadius;
        pos[i * 3 + 1] = Math.sin(theta) * baseRadius;
        pos[i * 3 + 2] = 0;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      return { geo, baseRadius, segments, layerIdx };
    });
  }, []);

  useFrame((_, delta) => {
    const isPlaying = audioReactivity?.isPlaying || false;
    const mid = audioReactivity?.midFreq || 0;
    const low = audioReactivity?.lowFreq || 0;
    const time = performance.now() * 0.0015;

    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.z += 0.04 * delta;
    }

    waveLayers.forEach((layer, idx) => {
      const mesh = ribbonsRef.current[idx];
      if (!mesh || reducedMotion) return;
      const pos = mesh.geometry.attributes.position;
      const arr = pos.array;
      const freqFactor = idx % 2 === 0 ? low : mid;
      const rippleAmp = 0.03 + (isPlaying ? freqFactor * 0.18 : 0.015);

      for (let i = 0; i <= layer.segments; i++) {
        const theta = (i / layer.segments) * Math.PI * 2;
        const harmonic = Math.sin(theta * (4 + idx * 2) + time * (2 + idx));
        const r = layer.baseRadius * (1 + harmonic * rippleAmp);
        arr[i * 3] = Math.cos(theta) * r;
        arr[i * 3 + 1] = Math.sin(theta) * r;
        arr[i * 3 + 2] = Math.sin(theta * 3 + time) * 0.08;
      }
      pos.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[-0.2, 0, 0]}>
      {waveLayers.map((layer, idx) => (
        <line
          key={idx}
          ref={(el) => (ribbonsRef.current[idx] = el)}
          geometry={layer.geo}
        >
          <lineBasicMaterial
            color={idx % 2 === 0 ? '#818cf8' : '#c7d2fe'}
            transparent
            opacity={0.7 - idx * 0.12}
            blending={THREE.AdditiveBlending}
            linewidth={1.5}
          />
        </line>
      ))}

      {/* Introspective central resonance core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ─── 4. ALAKOLAVA: Stylish Dramatic Helical Light Trails ──────────────────────
function AlakolavaVisualizer({ audioReactivity, reducedMotion }) {
  const groupRef = useRef();
  const helixRef1 = useRef();
  const helixRef2 = useRef();

  // Create intertwined double-helix spline curves
  const [helixGeo1, helixGeo2] = useMemo(() => {
    const points1 = [];
    const points2 = [];
    const count = 120;
    const height = 3.2;
    const radius = 1.35;
    const coils = 3.5;

    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * coils;
      const y = (t - 0.5) * height;

      points1.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
      points2.push(new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius));
    }

    return [
      new THREE.BufferGeometry().setFromPoints(points1),
      new THREE.BufferGeometry().setFromPoints(points2),
    ];
  }, []);

  useFrame((_, delta) => {
    const isPlaying = audioReactivity?.isPlaying || false;
    const amp = audioReactivity?.amplitude || 0;

    if (groupRef.current && !reducedMotion) {
      const speed = isPlaying ? 0.75 + amp * 0.6 : 0.25;
      groupRef.current.rotation.y += speed * delta;
      groupRef.current.rotation.x = Math.sin(performance.now() * 0.001) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
      {/* Helix Strand 1: Deep Violet */}
      <line ref={helixRef1} geometry={helixGeo1}>
        <lineBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Helix Strand 2: Tangerine Coral */}
      <line ref={helixRef2} geometry={helixGeo2}>
        <lineBasicMaterial
          color="#fb923c"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Dramatic central energy disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[0.5, 1.45, 36]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ─── 5. ENGEY ANDHA VENNILA: Moonlit Calm & Starry Night ─────────────────────
function EngeyAndhaVennilaVisualizer({ audioReactivity, reducedMotion }) {
  const groupRef = useRef();
  const moonRef = useRef();
  const starsRef = useRef();

  // Serene starry night sky
  const starsData = useMemo(() => {
    const count = reducedMotion ? 40 : 80;
    const pos = new Float32Array(count * 3);
    const alphas = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4.6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.6;
      pos[i * 3 + 2] = -0.6 + (Math.random() - 0.5) * 1.5;
      alphas[i] = 0.3 + Math.random() * 0.7;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { geo, alphas, count };
  }, [reducedMotion]);

  useFrame((_, delta) => {
    // Slow drifting night sky
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.z += 0.015 * delta;
    }

    // Gentle moon breathing with subtle audio responsiveness
    if (moonRef.current && !reducedMotion) {
      const audioPulse = (audioReactivity?.energy || 0) * 0.05;
      const pulse = 1 + Math.sin(performance.now() * 0.0008) * 0.04 + audioPulse;
      moonRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Twinkling star field */}
      <points ref={starsRef} geometry={starsData.geo}>
        <pointsMaterial
          size={0.035}
          color="#bae6fd"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Soft Luminous Moon Disc with Corona */}
      <group ref={moonRef} position={[0, 0.15, -0.1]}>
        {/* Core moon body */}
        <mesh>
          <circleGeometry args={[0.95, 48]} />
          <meshBasicMaterial color="#f0f9ff" transparent opacity={0.88} />
        </mesh>
        {/* Inner corona halo */}
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[1.25, 48]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Outer peaceful dusk glow */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[1.75, 48]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}

// ─── 6. LIFE OF PAZHAM: Joyful Celebratory Spectrum Equalizer ─────────────────
function LifeOfPazhamVisualizer({ audioReactivity, reducedMotion }) {
  const groupRef = useRef();
  const barsRef = useRef([]);

  // 48 Lively radial spectrum equalizer bars
  const barCount = 48;
  const barsData = useMemo(() => {
    const items = [];
    const r = 1.35;
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const geo = new THREE.BoxGeometry(0.045, 0.35, 0.03);
      items.push({ angle, x, y, geo });
    }
    return items;
  }, [barCount]);

  // Kinetic celebratory particles
  const particleGeo = useMemo(() => {
    const count = reducedMotion ? 20 : 50;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const rad = 0.8 + Math.random() * 1.5;
      pos[i * 3] = Math.cos(theta) * rad;
      pos[i * 3 + 1] = Math.sin(theta) * rad;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [reducedMotion]);

  useFrame((_, delta) => {
    const isPlaying = audioReactivity?.isPlaying || false;
    const amp = audioReactivity?.amplitude || 0;
    const low = audioReactivity?.lowFreq || 0;
    const mid = audioReactivity?.midFreq || 0;
    const high = audioReactivity?.highFreq || 0;

    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.z += (isPlaying ? 0.6 + amp * 0.5 : 0.15) * delta;
    }

    // Dynamic jumping spectrum bars
    barsRef.current.forEach((mesh, i) => {
      if (!mesh || reducedMotion) return;
      const weight = i % 3 === 0 ? low : i % 3 === 1 ? mid : high;
      const targetScale = isPlaying
        ? 0.5 + weight * 2.8 + Math.sin(i * 0.4 + performance.now() * 0.005) * 0.3
        : 0.6 + Math.sin(i * 0.3 + performance.now() * 0.002) * 0.25;
      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, Math.max(0.3, targetScale), 0.18);
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[-0.2, 0, 0]}>
      {/* 48 Radial Spectrum Bars */}
      {barsData.map((item, idx) => {
        const col = idx % 3 === 0 ? '#2dd4bf' : idx % 3 === 1 ? '#fb7185' : '#fde047';
        return (
          <mesh
            key={idx}
            ref={(el) => (barsRef.current[idx] = el)}
            geometry={item.geo}
            position={[item.x, item.y, 0]}
            rotation={[0, 0, item.angle + Math.PI / 2]}
          >
            <meshBasicMaterial
              color={col}
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Kinetic celebratory confetti particles */}
      <points geometry={particleGeo}>
        <pointsMaterial
          size={0.05}
          color="#fde047"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Central joyous glowing disc */}
      <mesh position={[0, 0, -0.05]}>
        <circleGeometry args={[1.2, 36]} />
        <meshBasicMaterial
          color="#2dd4bf"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ─── MASTER COMPONENT: Switches genuinely distinct visualizer by song index ──
export function SonicSculpture3D({
  activeTrackIndex = 0,
  audioReactivity = null,
  reducedMotion = false,
  isClosingState = false,
}) {
  return (
    <group position={[0, 0, 0]} scale={isClosingState ? 0.85 : 1}>
      {activeTrackIndex === 0 && (
        <UnnaleVisualizer
          audioReactivity={audioReactivity}
          reducedMotion={reducedMotion}
        />
      )}
      {activeTrackIndex === 1 && (
        <ChellaMagaleVisualizer
          audioReactivity={audioReactivity}
          reducedMotion={reducedMotion}
        />
      )}
      {activeTrackIndex === 2 && (
        <MagaleVisualizer
          audioReactivity={audioReactivity}
          reducedMotion={reducedMotion}
        />
      )}
      {activeTrackIndex === 3 && (
        <AlakolavaVisualizer
          audioReactivity={audioReactivity}
          reducedMotion={reducedMotion}
        />
      )}
      {activeTrackIndex === 4 && (
        <EngeyAndhaVennilaVisualizer
          audioReactivity={audioReactivity}
          reducedMotion={reducedMotion}
        />
      )}
      {activeTrackIndex === 5 && (
        <LifeOfPazhamVisualizer
          audioReactivity={audioReactivity}
          reducedMotion={reducedMotion}
        />
      )}
    </group>
  );
}
