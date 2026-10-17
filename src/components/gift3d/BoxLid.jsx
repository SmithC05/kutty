import React, { forwardRef, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { createBoxMaterial, createGoldTrimMaterial } from './materials';

/**
 * 3D Procedural Box Lid
 * A separate lid that can lift, tilt, and rotate independently.
 */
export const BoxLid = forwardRef(({ children, ...props }, ref) => {
  const boxMat = useMemo(() => createBoxMaterial(), []);
  const trimMat = useMemo(() => createGoldTrimMaterial(), []);

  return (
    <group ref={ref} position={[0, 0.96, 0]} {...props}>
      {/* Main Rounded Lid Block */}
      <RoundedBox
        args={[2.1, 0.32, 2.1]}
        radius={0.05}
        smoothness={4}
        castShadow
        receiveShadow
        material={boxMat}
        position={[0, 0, 0]}
      />

      {/* Gold Trim Accent Band around the lid's bottom lip */}
      <mesh position={[0, -0.155, 0]}>
        <boxGeometry args={[2.12, 0.03, 2.12]} />
        <primitive object={trimMat} attach="material" />
      </mesh>

      {/* Child components mounted on lid (e.g. lid ribbons, bow) */}
      {children}
    </group>
  );
});

BoxLid.displayName = 'BoxLid';
