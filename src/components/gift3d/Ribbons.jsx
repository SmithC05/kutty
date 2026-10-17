import React, { forwardRef, useMemo } from 'react';
import { createRibbonMaterial } from './materials';

/**
 * 3D Procedural Satin Ribbons
 * Cross-bands wrapping the base and lid in shimmering satin gold.
 */
export const BoxRibbons = forwardRef((props, ref) => {
  const ribbonMat = useMemo(() => createRibbonMaterial(), []);
  const ribbonWidth = 0.32;
  const ribbonThick = 0.025;
  const boxW = 2.03;
  const boxH = 1.62;

  return (
    <group ref={ref} {...props}>
      {/* Front Vertical Ribbon */}
      <mesh position={[0, 0, (boxW / 2) + (ribbonThick / 2)]} castShadow>
        <boxGeometry args={[ribbonWidth, boxH, ribbonThick]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* Back Vertical Ribbon */}
      <mesh position={[0, 0, -(boxW / 2) - (ribbonThick / 2)]} castShadow>
        <boxGeometry args={[ribbonWidth, boxH, ribbonThick]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* Left Vertical Ribbon */}
      <mesh position={[-(boxW / 2) - (ribbonThick / 2), 0, 0]} castShadow>
        <boxGeometry args={[ribbonThick, boxH, ribbonWidth]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* Right Vertical Ribbon */}
      <mesh position={[(boxW / 2) + (ribbonThick / 2), 0, 0]} castShadow>
        <boxGeometry args={[ribbonThick, boxH, ribbonWidth]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* Bottom Horizontal Ribbon crossing */}
      <mesh position={[0, -(boxH / 2) - (ribbonThick / 2), 0]}>
        <boxGeometry args={[ribbonWidth, ribbonThick, boxW]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      <mesh position={[0, -(boxH / 2) - (ribbonThick / 2), 0]}>
        <boxGeometry args={[boxW, ribbonThick, ribbonWidth]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
    </group>
  );
});

BoxRibbons.displayName = 'BoxRibbons';

export const LidRibbons = forwardRef((props, ref) => {
  const ribbonMat = useMemo(() => createRibbonMaterial(), []);
  const ribbonWidth = 0.32;
  const ribbonThick = 0.025;
  const lidW = 2.13;
  const lidH = 0.34;

  return (
    <group ref={ref} {...props}>
      {/* Top Cross X-band */}
      <mesh position={[0, (lidH / 2) + (ribbonThick / 2), 0]} castShadow>
        <boxGeometry args={[lidW, ribbonThick, ribbonWidth]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* Top Cross Z-band */}
      <mesh position={[0, (lidH / 2) + (ribbonThick / 2), 0]} castShadow>
        <boxGeometry args={[ribbonWidth, ribbonThick, lidW]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* Lid Edge Drops (Front, Back, Left, Right) */}
      <mesh position={[0, 0, (lidW / 2) + (ribbonThick / 2)]}>
        <boxGeometry args={[ribbonWidth, lidH, ribbonThick]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      <mesh position={[0, 0, -(lidW / 2) - (ribbonThick / 2)]}>
        <boxGeometry args={[ribbonWidth, lidH, ribbonThick]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      <mesh position={[-(lidW / 2) - (ribbonThick / 2), 0, 0]}>
        <boxGeometry args={[ribbonThick, lidH, ribbonWidth]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      <mesh position={[(lidW / 2) + (ribbonThick / 2), 0, 0]}>
        <boxGeometry args={[ribbonThick, lidH, ribbonWidth]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
    </group>
  );
});

LidRibbons.displayName = 'LidRibbons';
