import React, { forwardRef, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { createBoxMaterial, createInteriorMaterial, createGoldTrimMaterial } from './materials';

/**
 * 3D Procedural Box Base
 * Solid depth with softly rounded bevels, inner cavity, and gold trim rim.
 */
export const BoxBase = forwardRef((props, ref) => {
  const boxMat = useMemo(() => createBoxMaterial(), []);
  const interiorMat = useMemo(() => createInteriorMaterial(), []);
  const trimMat = useMemo(() => createGoldTrimMaterial(), []);

  return (
    <group ref={ref} {...props}>
      {/* Outer Rounded Box Base */}
      <RoundedBox
        args={[2.0, 1.6, 2.0]}
        radius={0.06}
        smoothness={4}
        castShadow
        receiveShadow
        material={boxMat}
        position={[0, 0, 0]}
      />

      {/* Gold Trim Lip along the upper rim */}
      <mesh position={[0, 0.805, 0]} material={trimMat}>
        <ringGeometry args={[0.92, 0.99, 32]} />
      </mesh>

      {/* Inner Recess / Cavity Floor where golden light shines */}
      <mesh position={[0, 0.79, 0]} rotation={[-Math.PI / 2, 0, 0]} material={interiorMat}>
        <planeGeometry args={[1.82, 1.82]} />
      </mesh>
    </group>
  );
});

BoxBase.displayName = 'BoxBase';
