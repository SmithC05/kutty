import React, { forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import { createRibbonMaterial, createGoldTrimMaterial } from './materials';

/**
 * 3D Procedural Decorative Bow
 * Features authentic curved ribbon loops, center knot, and flowing ribbon tails.
 * Constructed entirely from procedural 3D geometries (Torus, Sphere, Spline Tubes).
 */
export const DecorativeBow = forwardRef((props, ref) => {
  const ribbonMat = useMemo(() => createRibbonMaterial(), []);
  const goldTrimMat = useMemo(() => createGoldTrimMaterial(), []);

  // Procedural 3D Spline Curves for the ribbon tails
  const { tailGeo1, tailGeo2 } = useMemo(() => {
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.16, 0),
      new THREE.Vector3(0.38, 0.18, 0.38),
      new THREE.Vector3(0.72, 0.15, 0.72),
      new THREE.Vector3(1.05, 0.02, 0.92),
      new THREE.Vector3(1.22, -0.28, 1.02),
    ]);
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.16, 0),
      new THREE.Vector3(-0.42, 0.18, 0.32),
      new THREE.Vector3(-0.78, 0.14, 0.62),
      new THREE.Vector3(-1.08, 0.02, 0.78),
      new THREE.Vector3(-1.22, -0.28, 0.86),
    ]);

    const geo1 = new THREE.TubeGeometry(curve1, 32, 0.045, 8, false);
    const geo2 = new THREE.TubeGeometry(curve2, 32, 0.045, 8, false);
    return { tailGeo1: geo1, tailGeo2: geo2 };
  }, []);

  // 6 3D Curved Ribbon Loops configuration
  const loops = useMemo(() => [
    // 4 Primary diagonal loops
    { rotation: [0.45, Math.PI * 0.25, 0.2], position: [0.22, 0.22, 0.22], scale: [0.75, 1.25, 0.55] },
    { rotation: [0.45, Math.PI * 0.75, 0.2], position: [-0.22, 0.22, 0.22], scale: [0.75, 1.25, 0.55] },
    { rotation: [0.45, Math.PI * 1.25, 0.2], position: [-0.22, 0.22, -0.22], scale: [0.75, 1.25, 0.55] },
    { rotation: [0.45, Math.PI * 1.75, 0.2], position: [0.22, 0.22, -0.22], scale: [0.75, 1.25, 0.55] },
    // 2 Upper accent loops for lush volume
    { rotation: [0.65, Math.PI * 0.48, 0], position: [0, 0.32, 0.18], scale: [0.65, 1.05, 0.48] },
    { rotation: [0.65, Math.PI * 1.48, 0], position: [0, 0.32, -0.18], scale: [0.65, 1.05, 0.48] },
  ], []);

  return (
    <group ref={ref} position={[0, 0.17, 0]} {...props}>
      {/* Center Ribbon Knot */}
      <mesh position={[0, 0.16, 0]} scale={[1.15, 0.85, 1.15]} castShadow>
        <sphereGeometry args={[0.16, 24, 24]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      
      {/* Golden knot wrap ring */}
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.035, 16, 24]} />
        <primitive object={goldTrimMat} attach="material" />
      </mesh>

      {/* 6 Curved 3D Ribbon Loops */}
      {loops.map((loop, idx) => (
        <group key={idx} position={loop.position} rotation={loop.rotation} scale={loop.scale}>
          <mesh castShadow receiveShadow>
            <torusGeometry args={[0.36, 0.065, 16, 32, Math.PI * 1.55]} />
            <primitive object={ribbonMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Ribbon Tail 1 */}
      <mesh geometry={tailGeo1} castShadow>
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* Ribbon Tail 2 */}
      <mesh geometry={tailGeo2} castShadow>
        <primitive object={ribbonMat} attach="material" />
      </mesh>
    </group>
  );
});

DecorativeBow.displayName = 'DecorativeBow';
