// ─────────────────────────────────────────────────────────────────────────────
// Template Registry — Chapter 1: "Just You" Portrait-First Editorial Journal
//
// Desktop art direction:
//   • Portrait-first photography: natural proportions respected, no stretching.
//   • Full-viewport editorial gallery with warm ivory surrounds & generous scale.
//   • Single photo: large vertical portrait alongside separate typography/caption area.
//   • Two photos: two large vertical portraits side-by-side with subtle asymmetry.
//   • Three photos: featured landscape alongside paired vertical portraits.
//   • Finale: signature portrait priority with companion photo.
//   • Mobile: compact portrait-first compositions fitting cleanly without overflow.
// ─────────────────────────────────────────────────────────────────────────────

export const templates = [

  // ── 1. Hero Single ──────────────────────────────────────────────────────────
  // Page 1: Single childhood hero portrait.
  // Desktop: Large vertical portrait frame alongside separate typography column.
  // Mobile: Centred vertical portrait frame with clean caption below.
  {
    id: 'HeroSingle',
    name: 'Hero Single',
    maxPhotos: 1,
    isSingleHero: true,
    score: (photos) => {
      if (photos.length !== 1) return -1;
      return photos[0].emphasis === 'hero' ? 120 : 70;
    },
    getContainerStyle: () =>
      'flex flex-col lg:flex-row items-center justify-center w-full h-full'
      + ' px-4 sm:px-8 lg:px-14 xl:px-20 gap-6 lg:gap-12 xl:gap-16',
    getStyles: () => [
      // Large portrait frame (aspect-ratio ~3:4 / 9:16)
      'w-full max-w-[340px] sm:max-w-sm lg:max-w-[440px] xl:max-w-[480px]'
      + ' h-[52vh] sm:h-[58vh] lg:h-[68vh] xl:h-[72vh] max-h-[720px]',
    ],
    getTilts: () => [0],
  },

  // ── 2. Overlap Duo (Paired Childhood Portraits) ─────────────────────────────
  // Page 2: Paired childhood portraits.
  // Desktop: Two large vertical portraits side-by-side with subtle editorial asymmetry.
  // Mobile: Two vertical portraits side-by-side fitting cleanly within viewport.
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
      'flex flex-row items-center justify-center'
      + ' gap-3 sm:gap-6 lg:gap-10 xl:gap-14'
      + ' w-full h-full px-3 sm:px-6 lg:px-12 xl:px-16',
    getStyles: () => [
      // First vertical portrait
      'w-[48%] sm:w-[42%] lg:w-[38%] xl:w-[36%] max-w-[420px]'
      + ' h-[48vh] sm:h-[58vh] lg:h-[66vh] xl:h-[70vh] max-h-[720px]'
      + ' sm:-translate-y-3 lg:-translate-y-4',
      // Second vertical portrait (subtly offset vertically)
      'w-[48%] sm:w-[42%] lg:w-[38%] xl:w-[36%] max-w-[420px]'
      + ' h-[48vh] sm:h-[58vh] lg:h-[66vh] xl:h-[70vh] max-h-[720px]'
      + ' sm:translate-y-3 lg:translate-y-4',
    ],
    getTilts: () => [0, 0],
  },

  // ── 3. Duo Portrait Spread ───────────────────────────────────────────────────
  // Pages 3 & 5: Growing up / Contemporary paired portraits.
  // Desktop: Two expansive vertical portraits side-by-side.
  // Mobile: Side-by-side vertical portraits.
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
      'flex flex-row items-center justify-center'
      + ' gap-3 sm:gap-6 lg:gap-10 xl:gap-14'
      + ' w-full h-full px-3 sm:px-6 lg:px-12 xl:px-16',
    getStyles: () => [
      'w-[48%] sm:w-[43%] lg:w-[39%] xl:w-[37%] max-w-[440px]'
      + ' h-[48vh] sm:h-[58vh] lg:h-[66vh] xl:h-[70vh] max-h-[720px]',
      // Subtle vertical offset on second portrait
      'w-[48%] sm:w-[43%] lg:w-[39%] xl:w-[37%] max-w-[440px]'
      + ' h-[48vh] sm:h-[58vh] lg:h-[66vh] xl:h-[70vh] max-h-[720px]'
      + ' sm:mt-6 lg:mt-10',
    ],
    getTilts: () => [0, 0],
  },

  // ── 4. Mixed Trio ────────────────────────────────────────────────────────────
  // Page 4: 1 landscape photo + 2 vertical portrait photos.
  // Desktop: Featured landscape frame with editorial typography alongside
  //          two vertical portraits standing side-by-side.
  // Mobile: Stacked featured landscape above two vertical portraits.
  {
    id: 'MixedTrio',
    name: 'Mixed Trio',
    maxPhotos: 3,
    isTrioLayout: true,
    score: (photos) => {
      if (photos.length !== 3) return -1;
      const hasLandscape = photos.some((p) => p.orientation === 'landscape');
      return hasLandscape ? 110 : 75;
    },
    getContainerStyle: () =>
      'flex flex-col lg:flex-row items-center justify-center'
      + ' gap-4 sm:gap-6 lg:gap-10 xl:gap-14'
      + ' w-full h-full px-3 sm:px-6 lg:px-12 xl:px-16',
    getStyles: (photos) => {
      const landscapeIndex = photos.findIndex((p) => p.orientation === 'landscape');
      const topIdx = landscapeIndex >= 0 ? landscapeIndex : 0;
      const bottomIndices = [0, 1, 2].filter((i) => i !== topIdx);

      const styles = [];
      // Featured landscape frame
      styles[topIdx] =
        'w-full max-w-[480px] lg:max-w-[520px]'
        + ' h-[24vh] sm:h-[28vh] lg:h-[36vh] xl:h-[38vh]';
      // Supporting vertical portraits
      styles[bottomIndices[0]] =
        'w-[48%] lg:w-[48%] max-w-[280px]'
        + ' h-[28vh] sm:h-[32vh] lg:h-[62vh] xl:h-[66vh] max-h-[680px]';
      styles[bottomIndices[1]] =
        'w-[48%] lg:w-[48%] max-w-[280px]'
        + ' h-[28vh] sm:h-[32vh] lg:h-[62vh] xl:h-[66vh] max-h-[680px]';
      return styles;
    },
    getTilts: () => [0, 0, 0],
  },

  // ── 5. Editorial Finale ──────────────────────────────────────────────────────
  // Page 6: Signature portrait as priority focus, companion photo supporting.
  // Desktop: Signature vertical portrait dominant in scale with companion alongside.
  // Mobile: Signature vertical portrait top, companion photo supporting.
  {
    id: 'EditorialFinale',
    name: 'Editorial Finale',
    maxPhotos: 2,
    isFinaleLayout: true,
    score: (photos) => {
      if (photos.length !== 2) return -1;
      if (photos.some((p) => p.emphasis === 'collage-hero')) return 125;
      return 80;
    },
    getContainerStyle: () =>
      'flex flex-row items-center justify-center'
      + ' gap-3 sm:gap-6 lg:gap-10 xl:gap-14'
      + ' w-full h-full px-3 sm:px-6 lg:px-12 xl:px-16',
    getStyles: () => [
      // Companion portrait — supporting scale
      'w-[44%] sm:w-[38%] lg:w-[32%] xl:w-[30%] max-w-[360px]'
      + ' h-[46vh] sm:h-[54vh] lg:h-[60vh] xl:h-[64vh] max-h-[640px]'
      + ' sm:mt-8 lg:mt-12',
      // Signature hero portrait — tall, grand scale, primary focus
      'w-[52%] sm:w-[48%] lg:w-[44%] xl:w-[42%] max-w-[480px]'
      + ' h-[52vh] sm:h-[62vh] lg:h-[70vh] xl:h-[74vh] max-h-[760px]',
    ],
    getTilts: () => [0, 0],
  },
];
