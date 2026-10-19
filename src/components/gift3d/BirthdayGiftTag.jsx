import React, { forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import { createGoldTrimMaterial } from './materials';

/**
 * Procedural Canvas Texture for the Birthday Gift Tag
 * Renders crisp, elegant typography ("For Kutty" / "Happy Birthday")
 * with a luxury gold foil border and delicate celebratory star accents.
 */
function createTagTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  // Deep Midnight Navy card stock
  ctx.fillStyle = '#0a162b';
  ctx.fillRect(0, 0, 512, 320);

  // Outer Champagne Gold Foil Border
  ctx.strokeStyle = '#f6d365';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, 476, 284);

  // Inner Delicate Inset Border
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(26, 26, 460, 268);

  // Corner Gold Accents
  ctx.fillStyle = '#fcd34d';
  const corners = [[32, 32], [480, 32], [32, 288], [480, 288]];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top Subtitle: "HAPPY BIRTHDAY"
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde68a';
  ctx.font = '600 20px "Playfair Display", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('✨ HAPPY BIRTHDAY ✨', 256, 75);

  // Center Divider Line with tiny heart
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 95);
  ctx.lineTo(230, 95);
  ctx.moveTo(282, 95);
  ctx.lineTo(412, 95);
  ctx.stroke();

  ctx.fillStyle = '#f43f5e';
  ctx.font = '16px serif';
  ctx.fillText('❤️', 256, 100);

  // Main Calligraphic Name: "For Kutty"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 58px "Playfair Display", "Dancing Script", Georgia, cursive';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('For Kutty', 256, 185);
  ctx.shadowBlur = 0;

  // Bottom Sweet Note
  ctx.fillStyle = '#93c5fd';
  ctx.font = 'italic 20px "Playfair Display", Georgia, serif';
  ctx.fillText('A magical day awaits you', 256, 240);

  // Bottom tiny stars
  ctx.fillStyle = '#fde047';
  ctx.font = '14px serif';
  ctx.fillText('⋆  ✧  ⋆', 256, 275);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * 3D Procedural Birthday Gift Tag Component
 * Physically attached to the front vertical ribbon with metallic eyelet and golden cord.
 */
export const BirthdayGiftTag = forwardRef((props, ref) => {
  const goldTrimMat = useMemo(() => createGoldTrimMaterial(), []);

  // Tag face material with canvas texture
  const tagMaterial = useMemo(() => {
    const texture = createTagTexture();
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      map: texture || undefined,
      roughness: 0.35,
      metalness: 0.08,
      clearcoat: 0.3,
      clearcoatRoughness: 0.3,
      side: THREE.DoubleSide,
    });
  }, []);

  // Delicate golden string/cord curve connecting ribbon to tag eyelet
  const stringGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.26, 0.26, 0.005), // Starts right at front vertical ribbon band
      new THREE.Vector3(-0.13, 0.22, 0.022),
      new THREE.Vector3(0, 0.17, 0.012),     // Loops through tag eyelet
      new THREE.Vector3(0.015, 0.14, 0.016), // Small tied string knot tail
    ]);
    return new THREE.TubeGeometry(curve, 28, 0.006, 8, false);
  }, []);

  return (
    <group ref={ref} position={[0.26, 0.26, 1.055]} rotation={[0, 0, -0.12]} {...props}>
      {/* Golden Attachment Cord */}
      <mesh geometry={stringGeo} material={goldTrimMat} castShadow />

      {/* Golden Eyelet Ring */}
      <mesh position={[0, 0.17, 0.008]} material={goldTrimMat} castShadow>
        <torusGeometry args={[0.028, 0.007, 16, 24]} />
      </mesh>

      {/* Main Tag Printed Front Face (PlaneGeometry ensures exact 1:1 UV mapping) */}
      <mesh position={[0, 0, 0.006]} material={tagMaterial} castShadow receiveShadow>
        <planeGeometry args={[0.68, 0.44]} />
      </mesh>

      {/* Tag Printed Back Face */}
      <mesh position={[0, 0, -0.006]} rotation={[0, Math.PI, 0]} material={tagMaterial}>
        <planeGeometry args={[0.68, 0.44]} />
      </mesh>

      {/* Gold Foil Tag Backing Plate & Beveled Rim */}
      <mesh position={[0, 0, 0]} material={goldTrimMat}>
        <boxGeometry args={[0.70, 0.46, 0.01]} />
      </mesh>
    </group>
  );
});

BirthdayGiftTag.displayName = 'BirthdayGiftTag';
