import React, { forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { createWrappingMaterial, createGoldTrimMaterial } from './materials';

/**
 * 3D Procedural Wrapping Paper Panels
 * 4 physical panels hinged at the bottom of the box that fold open/closed in real 3D.
 */
export const WrappingPanels = forwardRef((props, ref) => {
  const frontPivot = useRef(null);
  const backPivot = useRef(null);
  const leftPivot = useRef(null);
  const rightPivot = useRef(null);
  const groupRef = useRef(null);

  const paperMat = useMemo(() => createWrappingMaterial(), []);
  const goldTrimMat = useMemo(() => createGoldTrimMaterial(), []);

  // Expose pivots for GSAP timeline control
  useImperativeHandle(ref, () => ({
    get front() { return frontPivot.current; },
    get back() { return backPivot.current; },
    get left() { return leftPivot.current; },
    get right() { return rightPivot.current; },
    get group() { return groupRef.current; },
    // Helper to fold all panels open
    setFoldProgress(progress) {
      const angle = progress * (Math.PI * 0.55);
      if (frontPivot.current) frontPivot.current.rotation.x = angle;
      if (backPivot.current) backPivot.current.rotation.x = -angle;
      if (leftPivot.current) leftPivot.current.rotation.z = -angle;
      if (rightPivot.current) rightPivot.current.rotation.z = angle;
    }
  }));

  const panelWidth = 2.02;
  const panelHeight = 1.6;
  const panelThickness = 0.015;

  return (
    <group ref={groupRef} {...props}>
      {/* Bottom base wrapping sheet */}
      <mesh position={[0, -0.808, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[panelWidth, panelWidth]} />
        <primitive object={paperMat} attach="material" />
      </mesh>

      {/* Front Panel (hinge at y = -0.8, z = 1.01) */}
      <group ref={frontPivot} position={[0, -0.8, 1.01]}>
        <mesh position={[0, panelHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[panelWidth, panelHeight, panelThickness]} />
          <primitive object={paperMat} attach="material" />
        </mesh>
        {/* Subtle gold foil edge line at top of panel */}
        <mesh position={[0, panelHeight, 0]}>
          <boxGeometry args={[panelWidth, 0.02, panelThickness * 1.5]} />
          <primitive object={goldTrimMat} attach="material" />
        </mesh>
      </group>

      {/* Back Panel (hinge at y = -0.8, z = -1.01) */}
      <group ref={backPivot} position={[0, -0.8, -1.01]}>
        <mesh position={[0, panelHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[panelWidth, panelHeight, panelThickness]} />
          <primitive object={paperMat} attach="material" />
        </mesh>
        <mesh position={[0, panelHeight, 0]}>
          <boxGeometry args={[panelWidth, 0.02, panelThickness * 1.5]} />
          <primitive object={goldTrimMat} attach="material" />
        </mesh>
      </group>

      {/* Left Panel (hinge at x = -1.01, y = -0.8) */}
      <group ref={leftPivot} position={[-1.01, -0.8, 0]}>
        <mesh position={[0, panelHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[panelWidth, panelHeight, panelThickness]} />
          <primitive object={paperMat} attach="material" />
        </mesh>
        <mesh position={[0, panelHeight, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[panelWidth, 0.02, panelThickness * 1.5]} />
          <primitive object={goldTrimMat} attach="material" />
        </mesh>
      </group>

      {/* Right Panel (hinge at x = 1.01, y = -0.8) */}
      <group ref={rightPivot} position={[1.01, -0.8, 0]}>
        <mesh position={[0, panelHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[panelWidth, panelHeight, panelThickness]} />
          <primitive object={paperMat} attach="material" />
        </mesh>
        <mesh position={[0, panelHeight, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[panelWidth, 0.02, panelThickness * 1.5]} />
          <primitive object={goldTrimMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
});

WrappingPanels.displayName = 'WrappingPanels';
