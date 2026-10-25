import * as THREE from 'three';

/**
 * Procedural Materials for Luxury Birthday Gift Box
 * Strict asset rule: No external PNG/JPEG/SVG files.
 * Uses physically-based materials (MeshPhysicalMaterial) tailored for an elegant,
 * warm birthday gift aesthetic: soft-lacquer midnight navy, sapphire wrapping paper
 * with embossed celebratory stars, and warm champagne-gold satin fabric ribbon.
 */

// Draw an elegant 4-point star path on canvas
function draw4PointStar(ctx, cx, cy, rOuter, rInner) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? rOuter : rInner;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// Generate in-memory procedural birthday star & sparkle foil wrapping paper texture
function createBirthdayFoilTexture() {
  if (typeof document === 'undefined') return null;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Rich Royal Sapphire Blue background
  ctx.fillStyle = '#183b6e';
  ctx.fillRect(0, 0, size, size);

  // Subtle tonal diagonal fabric weave / paper texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  const spacing = 12;
  for (let x = -size; x < size * 2; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + size, size);
    ctx.stroke();
  }

  // Delicate repeating pattern of miniature celebratory gold foil stars
  const starGrid = 64;
  for (let gx = starGrid / 2; gx < size; gx += starGrid) {
    for (let gy = starGrid / 2; gy < size; gy += starGrid) {
      // Offset alternate rows for diamond brick pattern
      const isAlt = (gy / starGrid) % 2 === 1;
      const posX = isAlt ? (gx + starGrid / 2) % size : gx;
      const posY = gy;

      // Elegant 4-point gold foil star
      ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
      draw4PointStar(ctx, posX, posY, 6.5, 2.0);
      ctx.fill();

      // Bright sparkle dot at star center
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(posX, posY, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Intermediate subtle gold sparkle dust dots
  ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
  for (let i = 0; i < 48; i++) {
    const rx = ((i * 79) + 23) % size;
    const ry = ((i * 113) + 47) % size;
    ctx.beginPath();
    ctx.arc(rx, ry, 1.0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.5, 2.5);
  texture.needsUpdate = true;
  return texture;
}

let cachedBirthdayTexture = null;
function getBirthdayFoilTexture() {
  if (!cachedBirthdayTexture) {
    cachedBirthdayTexture = createBirthdayFoilTexture();
  }
  return cachedBirthdayTexture;
}

// 1. Premium Rigid Midnight-Navy Box: Smooth paper-wrapped / soft-lacquer finish (NOT chrome!)
export const createBoxMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0d1d36'), // Deep midnight navy, clearly blue
    roughness: 0.38, // Soft diffuse highlight instead of sharp mirror reflection
    metalness: 0.04, // Non-metallic luxury paperboard feel
    clearcoat: 0.28, // Gentle satin lacquer sheen
    clearcoatRoughness: 0.36,
    reflectivity: 0.4,
  });

// 2. Box Interior Cavity
export const createInteriorMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color('#091426'),
    roughness: 0.55,
    metalness: 0.08,
  });

// 3. Wrapping Paper: Slightly brighter sapphire blue with embossed birthday stars & delicate sheen
export const createWrappingMaterial = () => {
  const map = getBirthdayFoilTexture();
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'), // White multiplier preserves procedural canvas texture colors!
    roughness: 0.40, // Tactile paper feel
    metalness: 0.06,
    clearcoat: 0.22,
    clearcoatRoughness: 0.32,
    sheen: 0.65, // Soft fabric-like angle sheen
    sheenColor: new THREE.Color('#60a5fa'),
    map: map || undefined,
    side: THREE.DoubleSide,
  });
};

// 4. Satin Champagne-Gold Ribbon: Soft woven satin fabric finish with gentle highlights
export const createRibbonMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#f5ce62'), // Warm champagne gold
    emissive: new THREE.Color('#221704'), // Warm subtle inner radiance; prevents black shadow artifacts
    roughness: 0.38, // Micro-diffusion of satin silk thread
    metalness: 0.16, // Fabric metalness (NOT metallic brass or chrome)
    clearcoat: 0.35, // Smooth satin surface gloss
    clearcoatRoughness: 0.32,
    sheen: 0.95, // Authentic grazing-angle silk highlight
    sheenColor: new THREE.Color('#fff2b2'),
    reflectivity: 0.6,
    side: THREE.DoubleSide,
  });

// 5. Refined Gold Trim & Accent Material
export const createGoldTrimMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#fcd34d'),
    emissive: new THREE.Color('#261b05'),
    roughness: 0.3,
    metalness: 0.35, // Refined accent
    clearcoat: 0.4,
    clearcoatRoughness: 0.25,
  });

// 6. Radiant Inner Light Core
export const createInnerGlowMaterial = () =>
  new THREE.MeshBasicMaterial({
    color: new THREE.Color('#fff7cc'),
  });
