/**
 * Lord Shiva Scene Asset Configuration & Quality Gate
 * 
 * Strict Asset Quality Gate:
 * 1. Preferred: Legitimate, professional 3D devotional model (.glb/.gltf)
 * 2. Alternative: High-quality devotional artwork integrated into real 3D environment
 * 
 * Never use cartoon primitives, spheres, or emoji for the central deity.
 * This file serves as the local asset interface so new models or artwork can be
 * plugged in without rewriting the 3D scene architecture.
 */

export const SHIVA_DEPICTION_CONFIG = {
  // 'illustration' | '3d-model'
  type: 'illustration',

  // 3D Model Path (set if a licensed .glb/.gltf model is placed in public/models/)
  modelPath: null,

  // Devotional Artwork Path (high-resolution authentic depiction)
  artworkPath: '/images/artworks/shiva_darshan.webp',

  // Fallback artwork if WebGL is disabled
  fallbackArtwork: '/images/artworks/shiva_darshan.webp',

  // Provenance & Licensing Information
  source: 'Statue of Lord Shiva in Meditation at Parmarth Niketan, Rishikesh on the banks of River Ganga',
  photographer: 'Iqbal Mohammed',
  license: 'Creative Commons Attribution-ShareAlike 4.0 / 2.0 (CC BY-SA)',
  canonicalUrl: 'https://commons.wikimedia.org/wiki/File:Shiva_meditating_Rishikesh.jpg',

  // Dimensions & Aspect Ratio of the artwork plane in 3D units
  planeWidth: 3.2,
  planeHeight: 4.0,

  // Colors
  palette: {
    midnight: '#081426',
    deepBlue: '#102B48',
    moonSilver: '#D7E7F5',
    sacredGold: '#E6C77A',
    mistWhite: '#F3F7FA',
    indigo: '#183454',
  }
};
