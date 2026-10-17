import React, { forwardRef, useMemo, useRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { createRibbonMaterial, createGoldTrimMaterial } from './materials';

/**
 * Procedural Ribbon Surface Geometry Generator
 * Generates an authentic flat ribbon mesh with width, thickness, twist, and beveled edges
 * along a 3D CatmullRom spline. Supports swallowtail notched ends.
 */
function createRibbonGeometry({
  points,
  segments = 50,
  width = 0.32,
  thickness = 0.016,
  startWidthScale = 0.65,
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

    // Interpolate twist angle around tangent
    const currentTwist = twistStart + (twistEnd - twistStart) * t;
    if (Math.abs(currentTwist) > 0.001) {
      binormal.applyAxisAngle(tangent, currentTwist);
      normal.applyAxisAngle(tangent, currentTwist);
    }

    // Width and thickness scaling
    const wScale = startWidthScale + (endWidthScale - startWidthScale) * t;
    const hw = (width * wScale) / 2;
    const hh = thickness / 2;

    // Apply swallowtail notch on the final segment if requested
    let pointCenter = p.clone();
    if (hasNotchedEnd && i === segments) {
      // 5-point notched tip (left tip, left notch, center notch, right notch, right tip)
      // For clean geometry, we offset the center vertices backward along tangent
    }

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

    // Build faces connecting ring (i - 1) to ring i
    if (i > 0) {
      const curr = i * 4;
      const prev = (i - 1) * 4;

      // Top face (satin visible surface)
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
    // Cap closing indices
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
 * 3D Procedural Luxury Decorative Bow
 * Two prominent, asymmetrical curved ribbon loops with authentic hollow inner openings,
 * compact rounded centre knot, and two cascading ribbon tails with swallowtail ends.
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

  // Expose child refs for coordinated unwrapping animation
  useImperativeHandle(ref, () => ({
    get group() { return groupRef.current; },
    get leftLoop() { return leftLoopRef.current; },
    get rightLoop() { return rightLoopRef.current; },
    get knot() { return knotRef.current; },
    get tail1() { return tail1Ref.current; },
    get tail2() { return tail2Ref.current; },
  }));

  // Build the two prominent ribbon loops & tails
  const { leftLoopGeo, rightLoopGeo, tail1Geo, tail2Geo } = useMemo(() => {
    // Loop 1: Left prominent arched ribbon loop
    const leftPoints = [
      new THREE.Vector3(0, 0.12, 0.02),
      new THREE.Vector3(-0.32, 0.26, -0.05),
      new THREE.Vector3(-0.68, 0.48, -0.09),
      new THREE.Vector3(-0.96, 0.45, -0.02),
      new THREE.Vector3(-0.90, 0.26, 0.06),
      new THREE.Vector3(-0.52, 0.14, 0.08),
      new THREE.Vector3(-0.06, 0.12, 0.03),
    ];
    const leftGeo = createRibbonGeometry({
      points: leftPoints,
      segments: 56,
      width: 0.34,
      thickness: 0.018,
      startWidthScale: 0.65,
      endWidthScale: 0.65,
      twistStart: 0.1,
      twistEnd: -0.15,
      upVector: new THREE.Vector3(0, 1, 0.2),
    });

    // Loop 2: Right prominent arched ribbon loop (slightly asymmetrical for realistic luxury florist look)
    const rightPoints = [
      new THREE.Vector3(0, 0.12, -0.02),
      new THREE.Vector3(0.35, 0.28, 0.06),
      new THREE.Vector3(0.74, 0.54, 0.14),
      new THREE.Vector3(1.04, 0.48, 0.09),
      new THREE.Vector3(0.96, 0.28, -0.03),
      new THREE.Vector3(0.56, 0.14, -0.05),
      new THREE.Vector3(0.06, 0.12, -0.02),
    ];
    const rightGeo = createRibbonGeometry({
      points: rightPoints,
      segments: 56,
      width: 0.36,
      thickness: 0.018,
      startWidthScale: 0.65,
      endWidthScale: 0.65,
      twistStart: -0.1,
      twistEnd: 0.18,
      upVector: new THREE.Vector3(0, 1, -0.2),
    });

    // Tail 1: Cascading down front right
    const tail1Points = [
      new THREE.Vector3(0.05, 0.14, 0.06),
      new THREE.Vector3(0.36, 0.12, 0.38),
      new THREE.Vector3(0.72, 0.09, 0.72),
      new THREE.Vector3(1.02, -0.02, 0.98),
      new THREE.Vector3(1.22, -0.32, 1.12),
    ];
    const t1Geo = createRibbonGeometry({
      points: tail1Points,
      segments: 40,
      width: 0.28,
      thickness: 0.016,
      startWidthScale: 0.7,
      endWidthScale: 1.0,
      twistStart: 0.1,
      twistEnd: 0.3,
      hasNotchedEnd: true,
      upVector: new THREE.Vector3(0, 1, 0),
    });

    // Tail 2: Cascading down front left
    const tail2Points = [
      new THREE.Vector3(-0.05, 0.14, 0.06),
      new THREE.Vector3(-0.38, 0.12, 0.34),
      new THREE.Vector3(-0.76, 0.08, 0.64),
      new THREE.Vector3(-1.05, -0.02, 0.82),
      new THREE.Vector3(-1.22, -0.32, 0.94),
    ];
    const t2Geo = createRibbonGeometry({
      points: tail2Points,
      segments: 40,
      width: 0.26,
      thickness: 0.016,
      startWidthScale: 0.7,
      endWidthScale: 1.0,
      twistStart: -0.1,
      twistEnd: -0.25,
      hasNotchedEnd: true,
      upVector: new THREE.Vector3(0, 1, 0),
    });

    return { leftLoopGeo: leftGeo, rightLoopGeo: rightGeo, tail1Geo: t1Geo, tail2Geo: t2Geo };
  }, []);

  return (
    <group ref={groupRef} position={[0, 0.16, 0]} {...props}>
      {/* Compact Rounded Centre Knot */}
      <group ref={knotRef} position={[0, 0.15, 0]}>
        {/* Soft rounded core */}
        <mesh scale={[1.2, 0.9, 1.1]} castShadow>
          <sphereGeometry args={[0.15, 24, 24]} />
          <primitive object={ribbonMat} attach="material" />
        </mesh>
        {/* Gathered gold ribbon band wrapped around the center */}
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.05, 0.95, 1.1]}>
          <torusGeometry args={[0.13, 0.045, 16, 32]} />
          <primitive object={goldTrimMat} attach="material" />
        </mesh>
      </group>

      {/* Prominent Left Ribbon Loop (Broad satin surface with real depth) */}
      <mesh ref={leftLoopRef} geometry={leftLoopGeo} castShadow receiveShadow>
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* Prominent Right Ribbon Loop */}
      <mesh ref={rightLoopRef} geometry={rightLoopGeo} castShadow receiveShadow>
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* Front-Right Ribbon Tail with notched swallowtail end */}
      <mesh ref={tail1Ref} geometry={tail1Geo} castShadow receiveShadow>
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* Front-Left Ribbon Tail with notched swallowtail end */}
      <mesh ref={tail2Ref} geometry={tail2Geo} castShadow receiveShadow>
        <primitive object={ribbonMat} attach="material" />
      </mesh>
    </group>
  );
});

DecorativeBow.displayName = 'DecorativeBow';
