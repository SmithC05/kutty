import React, { forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { createRibbonMaterial } from './materials';

/**
 * 3D Procedural Broad Satin Ribbons
 * Cross-bands wrapping the base and lid in shimmering champagne gold satin.
 * Exposes individual ribbon segments for coordinated unwrapping paths.
 */
export const BoxRibbons = forwardRef((props, ref) => {
  const ribbonMat = useMemo(() => createRibbonMaterial(), []);
  const frontRibbonRef = useRef(null);
  const backRibbonRef = useRef(null);
  const leftRibbonRef = useRef(null);
  const rightRibbonRef = useRef(null);
  const groupRef = useRef(null);

  useImperativeHandle(ref, () => ({
    get group() { return groupRef.current; },
    get front() { return frontRibbonRef.current; },
    get back() { return backRibbonRef.current; },
    get left() { return leftRibbonRef.current; },
    get right() { return rightRibbonRef.current; },
  }));

  const ribbonWidth = 0.38; // Visibly broad luxury satin ribbon
  const ribbonThick = 0.022;
  const boxW = 2.03;
  const boxH = 1.62;

  return (
    <group ref={groupRef} {...props}>
      {/* Front Vertical Ribbon */}
      <group ref={frontRibbonRef} position={[0, 0, (boxW / 2) + (ribbonThick / 2)]}>
        <mesh material={ribbonMat} castShadow receiveShadow>
          <boxGeometry args={[ribbonWidth, boxH, ribbonThick]} />
        </mesh>
      </group>

      {/* Back Vertical Ribbon */}
      <group ref={backRibbonRef} position={[0, 0, -(boxW / 2) - (ribbonThick / 2)]}>
        <mesh material={ribbonMat} castShadow receiveShadow>
          <boxGeometry args={[ribbonWidth, boxH, ribbonThick]} />
        </mesh>
      </group>

      {/* Left Vertical Ribbon */}
      <group ref={leftRibbonRef} position={[-(boxW / 2) - (ribbonThick / 2), 0, 0]}>
        <mesh material={ribbonMat} castShadow receiveShadow>
          <boxGeometry args={[ribbonThick, boxH, ribbonWidth]} />
        </mesh>
      </group>

      {/* Right Vertical Ribbon */}
      <group ref={rightRibbonRef} position={[(boxW / 2) + (ribbonThick / 2), 0, 0]}>
        <mesh material={ribbonMat} castShadow receiveShadow>
          <boxGeometry args={[ribbonThick, boxH, ribbonWidth]} />
        </mesh>
      </group>

      {/* Bottom Horizontal Ribbon crossing */}
      <mesh position={[0, -(boxH / 2) - (ribbonThick / 2), 0]} material={ribbonMat}>
        <boxGeometry args={[ribbonWidth, ribbonThick, boxW]} />
      </mesh>
      <mesh position={[0, -(boxH / 2) - (ribbonThick / 2), 0]} material={ribbonMat}>
        <boxGeometry args={[boxW, ribbonThick, ribbonWidth]} />
      </mesh>
    </group>
  );
});

BoxRibbons.displayName = 'BoxRibbons';

export const LidRibbons = forwardRef((props, ref) => {
  const ribbonMat = useMemo(() => createRibbonMaterial(), []);
  const ribbonWidth = 0.38;
  const ribbonThick = 0.022;
  const lidW = 2.13;
  const lidH = 0.34;

  return (
    <group ref={ref} {...props}>
      {/* Top Cross X-band */}
      <mesh position={[0, (lidH / 2) + (ribbonThick / 2), 0]} material={ribbonMat} castShadow receiveShadow>
        <boxGeometry args={[lidW, ribbonThick, ribbonWidth]} />
      </mesh>

      {/* Top Cross Z-band */}
      <mesh position={[0, (lidH / 2) + (ribbonThick / 2), 0]} material={ribbonMat} castShadow receiveShadow>
        <boxGeometry args={[ribbonWidth, ribbonThick, lidW]} />
      </mesh>

      {/* Lid Edge Drops (Front, Back, Left, Right) */}
      <mesh position={[0, 0, (lidW / 2) + (ribbonThick / 2)]} material={ribbonMat}>
        <boxGeometry args={[ribbonWidth, lidH, ribbonThick]} />
      </mesh>
      <mesh position={[0, 0, -(lidW / 2) - (ribbonThick / 2)]} material={ribbonMat}>
        <boxGeometry args={[ribbonWidth, lidH, ribbonThick]} />
      </mesh>
      <mesh position={[-(lidW / 2) - (ribbonThick / 2), 0, 0]} material={ribbonMat}>
        <boxGeometry args={[ribbonThick, lidH, ribbonWidth]} />
      </mesh>
      <mesh position={[(lidW / 2) + (ribbonThick / 2), 0, 0]} material={ribbonMat}>
        <boxGeometry args={[ribbonThick, lidH, ribbonWidth]} />
      </mesh>
    </group>
  );
});

LidRibbons.displayName = 'LidRibbons';
