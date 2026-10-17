import * as THREE from 'three';

/**
 * Procedural Materials for 3D Gift Box
 * Strict asset rule: No PNG, JPEG, SVG or external textures.
 * Uses physically-based materials with tailored roughness, metalness, and clearcoat properties.
 */

// Midnight Royal Navy Lacquered Box Base
export const createBoxMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0b1a30'),
    roughness: 0.28,
    metalness: 0.18,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    reflectivity: 0.6,
  });

// Box Interior cavity
export const createInteriorMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color('#050c17'),
    roughness: 0.65,
    metalness: 0.1,
  });

// Wrapping Paper: Celestial sapphire with fine metallic sheen
export const createWrappingMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0e2447'),
    roughness: 0.35,
    metalness: 0.25,
    side: THREE.DoubleSide,
  });

// Satin Gold Ribbon: Shimmering metallic satin
export const createRibbonMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#f5c342'),
    roughness: 0.2,
    metalness: 0.78,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    reflectivity: 0.9,
  });

// Polished Gold Trim & Accents
export const createGoldTrimMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffd54f'),
    roughness: 0.18,
    metalness: 0.88,
  });

// Inner Light Core: Intense warm glow
export const createInnerGlowMaterial = () =>
  new THREE.MeshBasicMaterial({
    color: new THREE.Color('#fff2b2'),
  });
