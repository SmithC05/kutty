import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Template Registry and Layout Specifications
//
// Designed for both Chapter 1 (Editorial Portrait Journal) and Chapter 2 (Friendship Scrapbook)
// Responsive: tailored for 360×800 CSS viewport (vivo Y28s 5G) as well as desktop viewports.
// ─────────────────────────────────────────────────────────────────────────────

export const templates = [
  // ── 1. Hero Single ────────────────────────────────────────────────────────
  {
    id: 'HeroSingle',
    name: 'Hero Single',
    maxPhotos: 1,
    score: (photos) => {
      if (photos.length !== 1) return -1;
      return photos[0].emphasis === 'hero' ? 120 : 70;
    },
    getContainerStyle: () =>
      'flex flex-col items-center justify-center w-full max-w-md md:max-w-xl mx-auto px-4 h-[74vh] md:h-[80vh]',
    getStyles: () => [
      'w-full h-full max-h-[66vh] md:max-h-[75vh]',
    ],
    getTilts: () => [0],
  },

  // ── 2. Overlap Duo ────────────────────────────────────────────────────────
  {
    id: 'OverlapDuo',
    name: 'Overlap Duo',
    maxPhotos: 2,
    score: (photos) => {
      if (photos.length !== 2) return -1;
      if (photos.some((p) => p.emphasis?.startsWith('duo'))) return 100;
      return 60;
    },
    getContainerStyle: () =>
      'relative w-full max-w-lg md:max-w-2xl mx-auto px-4 h-[74vh] md:h-[80vh] flex items-center justify-center overflow-visible',
    getStyles: () => [
      // First photo slightly back and left
      'w-[74%] sm:w-[68%] md:w-[60%] h-[48vh] md:h-[56vh] -translate-x-6 sm:-translate-x-10 -translate-y-6 z-10',
      // Second photo slightly forward and right
      'w-[74%] sm:w-[68%] md:w-[60%] h-[48vh] md:h-[56vh] translate-x-6 sm:translate-x-10 translate-y-6 z-20',
    ],
    getTilts: () => [-2.5, 2.0],
  },

  // ── 3. Duo Editorial Spread ───────────────────────────────────────────────
  {
    id: 'DuoPortraits',
    name: 'Duo Portraits',
    maxPhotos: 2,
    score: (photos) => {
      if (photos.length !== 2) return -1;
      const portraits = photos.filter((p) => p.orientation === 'portrait').length;
      return portraits === 2 ? 95 : 50;
    },
    getContainerStyle: () =>
      'flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 w-full max-w-4xl mx-auto px-4 h-[76vh] md:h-[80vh]',
    getStyles: () => [
      'w-full max-w-[270px] md:max-w-none md:w-1/2 h-[35vh] md:h-[68vh]',
      'w-full max-w-[270px] md:max-w-none md:w-1/2 h-[35vh] md:h-[68vh] md:mt-8', // slight offset on desktop
    ],
    getTilts: () => [-0.5, 0.8],
  },

  // ── 4. Mixed Trio (1 Landscape on top + 2 Portraits below) ────────────────
  {
    id: 'MixedTrio',
    name: 'Mixed Trio',
    maxPhotos: 3,
    score: (photos) => {
      if (photos.length !== 3) return -1;
      const hasLandscape = photos.some((p) => p.orientation === 'landscape');
      return hasLandscape ? 110 : 75;
    },
    getContainerStyle: () =>
      'flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-3xl mx-auto px-4 h-[78vh] md:h-[82vh]',
    getStyles: (photos) => {
      // Find landscape photo to place on top
      const landscapeIndex = photos.findIndex((p) => p.orientation === 'landscape');
      const topIdx = landscapeIndex >= 0 ? landscapeIndex : 0;
      const bottomIndices = [0, 1, 2].filter((i) => i !== topIdx);

      const styles = [];
      styles[topIdx] = 'w-full max-w-lg md:max-w-2xl h-[34vh] md:h-[39vh] z-10';
      styles[bottomIndices[0]] = 'w-1/2 max-w-[240px] md:max-w-xs h-[36vh] md:h-[39vh] pr-1.5 z-20';
      styles[bottomIndices[1]] = 'w-1/2 max-w-[240px] md:max-w-xs h-[36vh] md:h-[39vh] pl-1.5 z-20';
      return styles;
    },
    getTilts: (photos) => {
      const landscapeIndex = photos.findIndex((p) => p.orientation === 'landscape');
      const topIdx = landscapeIndex >= 0 ? landscapeIndex : 0;
      const bottomIndices = [0, 1, 2].filter((i) => i !== topIdx);

      const tilts = [];
      tilts[topIdx] = 0;
      tilts[bottomIndices[0]] = -1.2;
      tilts[bottomIndices[1]] = 1.2;
      return tilts;
    },
    // Sub-row wrapper for the bottom two items
    isTrioLayout: true,
  },

  // ── 5. Editorial Finale (Signature Hero + Companion) ──────────────────────
  {
    id: 'EditorialFinale',
    name: 'Editorial Finale',
    maxPhotos: 2,
    score: (photos) => {
      if (photos.length !== 2) return -1;
      if (photos.some((p) => p.emphasis === 'collage-hero')) return 125;
      return 80;
    },
    getContainerStyle: () =>
      'flex flex-col md:flex-row items-center justify-center gap-3.5 md:gap-8 w-full max-w-4xl mx-auto px-4 h-[76vh] md:h-[82vh]',
    getStyles: () => [
      // Companion photo (e.g. playful mirror selfie)
      'w-full max-w-[260px] md:max-w-none md:w-2/5 h-[30vh] md:h-[58vh] order-2 md:order-1',
      // Hero signature portrait (e.g. kutty1.jpeg)
      'w-full max-w-[320px] md:max-w-none md:w-3/5 h-[42vh] md:h-[74vh] order-1 md:order-2',
    ],
    getTilts: () => [-1.5, 0],
  },
];
