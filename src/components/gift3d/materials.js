import * as THREE from 'three';

/**
 * Procedural Materials for Luxury 3D Gift Box
 * Strict asset rule: No external PNG/JPEG/SVG textures.
 * Uses physically-based materials (MeshPhysicalMaterial) with tailored clearcoat,
 * sheen, roughness, metalness, and an in-memory procedural canvas foil accent map.
 */

// Generate an in-memory procedural micro-stipple foil canvas texture for wrapping paper
function createProceduralFoilTexture() {
  if (typeof document === 'undefined') return null;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Deep royal sapphire base
  ctx.fillStyle = '#183b6b';
  ctx.fillRect(0, 0, size, size);

  // Subtle delicate diagonal geometric foil micro-lines
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.08)';
  ctx.lineWidth = 1;
  const step = 16;
  for (let x = -size; x < size * 2; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + size, size);
    ctx.stroke();
  }

  // Tiny scattered gold dust flecks
  ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
  for (let i = 0; i < 90; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const r = Math.random() * 0.9 + 0.3;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

let cachedFoilTexture = null;
function getFoilTexture() {
  if (!cachedFoilTexture) {
    cachedFoilTexture = createProceduralFoilTexture();
  }
  return cachedFoilTexture;
}

// 1. Premium Rigid Lacquered Midnight-Navy Box Base
export const createBoxMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0d1f3b'), // Rich midnight navy (distinctly blue, not black)
    roughness: 0.22,
    metalness: 0.12,
    clearcoat: 0.85, // Deep piano-lacquer finish
    clearcoatRoughness: 0.1,
    reflectivity: 0.7,
  });

// 2. Box Interior Cavity
export const createInteriorMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color('#091426'),
    roughness: 0.55,
    metalness: 0.15,
  });

// 3. Wrapping Paper: Distinct, slightly brighter sapphire/royal navy with satin sheen and gold micro-accents
export const createWrappingMaterial = () => {
  const map = getFoilTexture();
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#1b3d73'), // Visibly brighter royal sapphire than the box underneath
    roughness: 0.32,
    metalness: 0.18,
    clearcoat: 0.45,
    clearcoatRoughness: 0.25,
    sheen: 0.6,
    sheenColor: new THREE.Color('#60a5fa'),
    map: map || undefined,
    side: THREE.DoubleSide,
  });
};

// 4. Satin Champagne-Gold Ribbon: Broad, lustrous satin with warm base, light highlights, and sheen
export const createRibbonMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#fad25d'), // Luminous warm champagne gold
    emissive: new THREE.Color('#382806'), // Prevents shadow sides from collapsing into black/brown
    roughness: 0.24,
    metalness: 0.44, // Balanced so it glints with specular light without turning black
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
    sheen: 0.85,
    sheenColor: new THREE.Color('#fffbeb'), // Pure satin silk highlight sheen
    reflectivity: 0.95,
    side: THREE.DoubleSide,
  });

// 5. Polished Gold Trim & Accents
export const createGoldTrimMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffd54f'),
    emissive: new THREE.Color('#3a2805'),
    roughness: 0.16,
    metalness: 0.65,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
  });

// 6. Radiant Inner Light Core
export const createInnerGlowMaterial = () =>
  new THREE.MeshBasicMaterial({
    color: new THREE.Color('#fff7cc'),
  });
