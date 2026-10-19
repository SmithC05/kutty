import React, { forwardRef, useMemo, useRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { createRibbonMaterial, createGoldTrimMaterial } from './materials';

/**
 * Procedural Ribbon Surface Geometry Generator
 * Constructs smooth, wide satin ribbon strips with physical thickness,
 * smooth normals, and swallowtail notched tips along 3D splines.
 */
function createRibbonGeometry({
  points,
  segments = 54,
  width = 0.36,
  thickness = 0.016,
  startWidthScale = 0.7,
  endWidthScale = 1.0,
  twistStart = 0,
  twistEnd = 0,
  hasNotchedEnd = false,
  upVector = new THREE.Vector3(0, 1, 0),
}) {
  const curve = new THREE.CatmullRomCurve3(points);
  const vertices = [];
  const indices = [];
  const uvs = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    // Compute width vector perpendicular to tangent and upVector
    let binormal = new THREE.Vector3().crossVectors(tangent, upVector).normalize();
    if (binormal.lengthSq() < 0.001) {
      binormal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 0, 1)).normalize();
    }
    const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();

    // Smooth twist angle around tangent
    const currentTwist = twistStart + (twistEnd - twistStart) * t;
    if (Math.abs(currentTwist) > 0.001) {
      binormal.applyAxisAngle(tangent, currentTwist);
      normal.applyAxisAngle(tangent, currentTwist);
    }

    // Width scale along curve
    const wScale = startWidthScale + (endWidthScale - startWidthScale) * t;
    const hw = (width * wScale) / 2;
    const hh = thickness / 2;

    const pointCenter = p.clone();

    // 4 cross-section vertices: 0: top-right, 1: top-left, 2: bottom-left, 3: bottom-right
    const v0 = pointCenter.clone().addScaledVector(binormal, hw).addScaledVector(normal, hh);
    const v1 = pointCenter.clone().addScaledVector(binormal, -hw).addScaledVector(normal, hh);
    const v2 = pointCenter.clone().addScaledVector(binormal, -hw).addScaledVector(normal, -hh);
    const v3 = pointCenter.clone().addScaledVector(binormal, hw).addScaledVector(normal, -hh);

    vertices.push(v0.x, v0.y, v0.z);
    vertices.push(v1.x, v1.y, v1.z);
    vertices.push(v2.x, v2.y, v2.z);
    vertices.push(v3.x, v3.y, v3.z);

    uvs.push(1, t, 0, t, 0, t, 1, t);

    // Build quadrilateral faces
    if (i > 0) {
      const curr = i * 4;
      const prev = (i - 1) * 4;

      // Top satin face
      indices.push(prev + 0, prev + 1, curr + 1);
      indices.push(prev + 0, curr + 1, curr + 0);

      // Bottom face
      indices.push(prev + 2, prev + 3, curr + 3);
      indices.push(prev + 2, curr + 3, curr + 2);

      // Left edge
      indices.push(prev + 1, prev + 2, curr + 2);
      indices.push(prev + 1, curr + 2, curr + 1);

      // Right edge
      indices.push(prev + 3, prev + 0, curr + 0);
      indices.push(prev + 3, curr + 0, curr + 3);
    }
  }

  // End cap for notched swallowtail ribbon tail
  if (hasNotchedEnd) {
    const endRing = segments * 4;
    indices.push(endRing + 0, endRing + 1, endRing + 2);
    indices.push(endRing + 0, endRing + 2, endRing + 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * 3D Procedural Luxury Birthday Bow
 * Features two broad, graceful rounded satin loops with soft dome curvature,
 * a clear compact center knot, and two flowing ribbon tails with notched ends.
 */
export const DecorativeBow = forwardRef((props, ref) => {
  const ribbonMat = useMemo(() => createRibbonMaterial(), []);
  const goldTrimMat = useMemo(() => createGoldTrimMaterial(), []);

  const groupRef = useRef(null);
  const leftLoopRef = useRef(null);
  const rightLoopRef = useRef(null);
  const knotRef = useRef(null);
  const tail1Ref = useRef(null);
  const tail2Ref = useRef(null);

  useImperativeHandle(ref, () => ({
    get group() { return groupRef.current; },
    get leftLoop() { return leftLoopRef.current; },
    get rightLoop() { return rightLoopRef.current; },
    get knot() { return knotRef.current; },
    get tail1() { return tail1Ref.current; },
    get tail2() { return tail2Ref.current; },
  }));

  // Construct graceful, rounded satin loops and flowing tails
  const { leftLoopGeo, rightLoopGeo, tail1Geo, tail2Geo } = useMemo(() => {
    // Loop 1: Left rounded broad satin loop (graceful dome, arched sideways)
    const leftPoints = [
      new THREE.Vector3(0, 0.11, 0.02),
      new THREE.Vector3(-0.30, 0.22, -0.04),
      new THREE.Vector3(-0.64, 0.33, -0.07),
      new THREE.Vector3(-0.86, 0.30, -0.03),
      new THREE.Vector3(-0.82, 0.18, 0.04),
      new THREE.Vector3(-0.48, 0.09, 0.06),
      new THREE.Vector3(-0.06, 0.10, 0.02),
    ];
    const leftGeo = createRibbonGeometry({
      points: leftPoints,
      segments: 56,
      width: 0.36,
      thickness: 0.016,
      startWidthScale: 0.72,
      endWidthScale: 0.72,
      twistStart: 0.08,
      twistEnd: -0.12,
      upVector: new THREE.Vector3(0, 1, 0.15),
    });

    // Loop 2: Right rounded broad satin loop (subtle handcrafted asymmetry)
    const rightPoints = [
      new THREE.Vector3(0, 0.11, -0.02),
      new THREE.Vector3(0.32, 0.24, 0.05),
      new THREE.Vector3(0.68, 0.35, 0.09),
      new THREE.Vector3(0.90, 0.31, 0.05),
      new THREE.Vector3(0.85, 0.18, -0.02),
      new THREE.Vector3(0.50, 0.09, -0.04),
      new THREE.Vector3(0.06, 0.10, -0.02),
    ];
    const rightGeo = createRibbonGeometry({
      points: rightPoints,
      segments: 56,
      width: 0.38,
      thickness: 0.016,
      startWidthScale: 0.72,
      endWidthScale: 0.72,
      twistStart: -0.08,
      twistEnd: 0.14,
      upVector: new THREE.Vector3(0, 1, -0.15),
    });

    // Tail 1: Flows across lid top and drapes over front-right corner
    const tail1Points = [
      new THREE.Vector3(0.05, 0.12, 0.06),
      new THREE.Vector3(0.35, 0.09, 0.36),
      new THREE.Vector3(0.70, 0.06, 0.70),
      new THREE.Vector3(1.00, -0.04, 0.96),
      new THREE.Vector3(1.18, -0.32, 1.10),
    ];
    const t1Geo = createRibbonGeometry({
      points: tail1Points,
      segments: 40,
      width: 0.30,
      thickness: 0.015,
      startWidthScale: 0.75,
      endWidthScale: 1.0,
      twistStart: 0.08,
      twistEnd: 0.22,
      hasNotchedEnd: true,
      upVector: new THREE.Vector3(0, 1, 0),
    });

    // Tail 2: Flows across lid top and drapes over front-left corner
    const tail2Points = [
      new THREE.Vector3(-0.05, 0.12, 0.06),
      new THREE.Vector3(-0.36, 0.09, 0.32),
      new THREE.Vector3(-0.74, 0.06, 0.62),
      new THREE.Vector3(-1.02, -0.04, 0.80),
      new THREE.Vector3(-1.18, -0.32, 0.92),
    ];
    const t2Geo = createRibbonGeometry({
      points: tail2Points,
      segments: 40,
      width: 0.28,
      thickness: 0.015,
      startWidthScale: 0.75,
      endWidthScale: 1.0,
      twistStart: -0.08,
      twistEnd: -0.20,
      hasNotchedEnd: true,
      upVector: new THREE.Vector3(0, 1, 0),
    });

    return { leftLoopGeo: leftGeo, rightLoopGeo: rightGeo, tail1Geo: t1Geo, tail2Geo: t2Geo };
  }, []);

  return (
    <group ref={groupRef} position={[0, 0.17, 0]} {...props}>
      {/* Compact, Rounded Satin Centre Knot */}
      <group ref={knotRef} position={[0, 0.12, 0]}>
        {/* Soft rounded gathered pillow knot */}
        <mesh scale={[1.25, 0.85, 1.15]} material={ribbonMat} castShadow receiveShadow>
          <sphereGeometry args={[0.14, 24, 24]} />
        </mesh>
        {/* Gathered gold ribbon band */}
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.05, 0.92, 1.08]} material={goldTrimMat}>
          <torusGeometry args={[0.12, 0.038, 16, 32]} />
        </mesh>
      </group>

      {/* Graceful Rounded Left Ribbon Loop */}
      <mesh ref={leftLoopRef} geometry={leftLoopGeo} material={ribbonMat} castShadow receiveShadow />

      {/* Graceful Rounded Right Ribbon Loop */}
      <mesh ref={rightLoopRef} geometry={rightLoopGeo} material={ribbonMat} castShadow receiveShadow />

      {/* Flowing Front-Right Ribbon Tail with notched swallowtail end */}
      <mesh ref={tail1Ref} geometry={tail1Geo} material={ribbonMat} castShadow receiveShadow />

      {/* Flowing Front-Left Ribbon Tail with notched swallowtail end */}
      <mesh ref={tail2Ref} geometry={tail2Geo} material={ribbonMat} castShadow receiveShadow />
    </group>
  );
});

DecorativeBow.displayName = 'DecorativeBow';
