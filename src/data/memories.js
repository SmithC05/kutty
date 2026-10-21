// ─────────────────────────────────────────────────────────────────────────────
// Memory Journey Data — Two Distinct Visual Worlds
//
// Chapter 1: "Just You" — Editorial Portrait Journal
//   Palette: Warm Ivory, Blush, Muted Rose, Champagne
//   Photos: Real verified local solo photos spanning childhood to present
//   Three visual phases: Little beginnings · Growing up · Today
//
// Chapter 2: "Us" — Friendship Scrapbook & Keepsake
//   Palette: Soft Sky Blue, Warm Paper Cream, Butter Yellow, Restrained Coral
//   Theme: One in-person meeting between Keerthana and her long-distance best friend
// ─────────────────────────────────────────────────────────────────────────────

export const chapter1Data = {
  id: 'ch-1',
  chapterNumber: 'Chapter One',
  title: 'Just You',
  subtitle: 'A portrait journal celebrating Keerthana',
  theme: 'journal',
  palette: {
    base: '#FAF7F2',       // Warm ivory
    accent: '#F5B8A8',     // Blush
    rose: '#45152D',       // Muted deep rose
    champagne: '#F3D9A2',  // Restrained champagne
    paper: '#FFFDF9',      // Clean ivory paper
    textDark: '#3A1424',   // Deep berry
    textMuted: '#8B4860',  // Muted rose text
  },
  stages: [
    { id: 'little-beginnings', title: 'Little You' },
    { id: 'growing-up', title: 'Growing Up' },
    { id: 'today', title: 'You Today' },
  ],
  // 12 verified genuine local solo photos in deliberate chronological order
  photos: [
    // ── Phase 1: Little You ─────────────────────────────────────────────────
    {
      id: 'solo-baby-cake',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.27.18 AM (1).jpeg'),
      caption: 'Where your story began.',
      stage: 'little-beginnings',
      stageTitle: 'Little You',
      aspectRatio: 0.62,
      orientation: 'portrait',
      emphasis: 'hero',
      motion: 'zoom-in',
      pageGroup: 1, // Page 1: Hero reveal of earliest childhood memory
    },
    {
      id: 'solo-toddler-ball',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.27.18 AM.jpeg'),
      caption: 'That little smile! ❤️',
      stage: 'little-beginnings',
      stageTitle: 'Little You',
      aspectRatio: 0.60,
      orientation: 'portrait',
      emphasis: 'duo-left',
      motion: 'breathe',
      pageGroup: 2, // Page 2: Paired childhood prints
    },
    {
      id: 'solo-young-smile',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.27.18 AM (2).jpeg'),
      caption: 'That smile is still so you. ❤️',
      stage: 'little-beginnings',
      stageTitle: 'Little You',
      aspectRatio: 0.45,
      orientation: 'portrait',
      emphasis: 'duo-right',
      motion: 'pan-right',
      pageGroup: 2,
    },

    // ── Phase 2: Growing Up ────────────────────────────────────────────────
    {
      id: 'solo-green-salwar',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.27.15 AM.jpeg'),
      caption: 'That green looks so good on you. 💚',
      stage: 'growing-up',
      stageTitle: 'Growing Up',
      aspectRatio: 0.60,
      orientation: 'portrait',
      emphasis: 'spread-left',
      motion: 'zoom-out',
      pageGroup: 3, // Page 3: Asymmetric editorial spread
    },
    {
      id: 'solo-pink-saree',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.27.17 AM.jpeg'),
      caption: 'Okay, this look is gorgeous! 💗',
      stage: 'growing-up',
      stageTitle: 'Growing Up',
      aspectRatio: 0.56,
      orientation: 'portrait',
      emphasis: 'spread-right',
      motion: 'pan-left',
      pageGroup: 3,
    },
    {
      id: 'solo-red-landscape',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.27.20 AM.jpeg'),
      caption: 'You look so pretty here. ❤️',
      stage: 'growing-up',
      stageTitle: 'Growing Up',
      aspectRatio: 1.78,
      orientation: 'landscape',
      emphasis: 'trio-wide',
      motion: 'pan-right',
      pageGroup: 4, // Page 4: Mixed Trio (landscape on top, 2 portraits below)
    },
    {
      id: 'solo-red-portrait',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.27.20 AM (1).jpeg'),
      caption: 'Looking good as always! ❤️',
      stage: 'growing-up',
      stageTitle: 'Growing Up',
      aspectRatio: 0.56,
      orientation: 'portrait',
      emphasis: 'trio-sub-1',
      motion: 'zoom-in',
      pageGroup: 4,
    },
    {
      id: 'solo-purple-curls',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.27.19 AM.jpeg'),
      caption: 'Pretty girl being pretty! 💜',
      stage: 'growing-up',
      stageTitle: 'Growing Up',
      aspectRatio: 0.56,
      orientation: 'portrait',
      emphasis: 'trio-sub-2',
      motion: 'breathe',
      pageGroup: 4,
    },

    // ── Phase 3: You Today ──────────────────────────────────────────────────
    {
      id: 'solo-darkgreen-lehenga',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.27.21 AM (1).jpeg'),
      caption: 'wow!!',
      stage: 'today',
      stageTitle: 'You Today',
      aspectRatio: 0.45,
      orientation: 'portrait',
      emphasis: 'duo-left',
      motion: 'zoom-out',
      pageGroup: 5, // Page 5: Paired contemporary portraits
    },
    {
      id: 'solo-lightblue-salwar',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.27.21 AM.jpeg'),
      caption: '💙',
      stage: 'today',
      stageTitle: 'You Today',
      aspectRatio: 0.45,
      orientation: 'portrait',
      emphasis: 'duo-right',
      motion: 'pan-left',
      pageGroup: 5,
    },
    {
      id: 'solo-fun-selfie',
      url: encodeURI('/images/solo-photos/WhatsApp Image 2026-10-17 at 10.30.35 AM (1).jpeg'),
      caption: 'My favourite kind of Keerthana smile. ❤️',
      stage: 'today',
      stageTitle: 'You Today',
      aspectRatio: 0.45,
      orientation: 'portrait',
      emphasis: 'collage-side',
      motion: 'breathe',
      pageGroup: 6, // Page 6: Finale collage and signature portrait
    },
    {
      id: 'solo-kutty-signature',
      url: encodeURI('/images/solo-photos/kutty1.jpeg'),
      caption: 'And that\'s my Keerthana today. ❤️',
      stage: 'today',
      stageTitle: 'You Today',
      aspectRatio: 0.56,
      orientation: 'portrait',
      emphasis: 'collage-hero',
      motion: 'zoom-in',
      pageGroup: 6,
    },
  ],
};

export const chapter2Data = {
  id: 'ch-2',
  chapterNumber: 'Chapter Two',
  title: 'Us',
  subtitle: 'Different places. One day in the same frame.',
  theme: 'scrapbook',
  palette: {
    base: '#EBF3FA',       // Soft sky blue
    accent: '#E94B70',     // Restrained coral
    yellow: '#FEF3C7',     // Muted butter yellow
    cream: '#FFFDF9',      // Warm paper cream
    navy: '#1E293B',       // Soft slate navy
    sky: '#93C5FD',        // Sky blue accent
    tape: 'rgba(254, 243, 199, 0.85)', // Washi tape
  },
  transitionQuote: 'Before our story, there was you. Now, a little piece of our story.',
  introTitle: 'Different places. One day in the same frame.',
  introSubtitle: 'Miles apart across different cities and busy routines, yet for one special day, our worlds were in the exact same frame.',
  personalNote: {
    salutation: 'To Kutty —',
    body: "Miles apart across different cities, college routines, and busy days. But that one day we shared in person proved that real friendship doesn't need constant proximity—it just picks up right where it left off without skipping a beat.\n\nEvery memory from that meeting is something I treasure. You're my favouriteeeeee best friend ever, and I'm so glad to have you in my life. ❤️",
    signoff: 'Always in your corner,',
    sender: 'Your Best Friend',
  },
  // ── Shared photographs from the in-person meeting ──────────────────────────
  // All four files verified present in public/images/shared-photos/
  // All verified landscape-oriented (4:3, panoramic 2.22, and 16:9).
  photos: [
    {
      id: 'shared-hero',
      url: encodeURI('/images/shared-photos/WhatsApp Image 2026-10-19 at 1.37.54 PM.jpeg'),
      caption: 'In the same frame at last.',
      stage: 'hero',
      aspectRatio: 1.33,
      orientation: 'landscape',
      emphasis: 'hero-landscape',
    },
    {
      id: 'shared-2',
      url: encodeURI('/images/shared-photos/WhatsApp Image 2026-10-19 at 1.37.59 PM.jpeg'),
      caption: 'Side by side.',
      stage: 'collection',
      aspectRatio: 2.22,
      orientation: 'landscape',
      emphasis: 'panoramic-landscape',
    },
    {
      id: 'shared-3',
      url: encodeURI('/images/shared-photos/WhatsApp Image 2026-10-20 at 9.55.00 AM.jpeg'),
      caption: 'The moments that matter.',
      stage: 'collection',
      aspectRatio: 1.78,
      orientation: 'landscape',
      emphasis: 'landscape',
    },
    {
      id: 'shared-4',
      url: encodeURI('/images/shared-photos/WhatsApp Image 2026-10-20 at 9.55.09 AM.jpeg'),
      caption: 'One unforgettable day.',
      stage: 'collection',
      aspectRatio: 1.78,
      orientation: 'landscape',
      emphasis: 'landscape',
    },
  ],
  // ── Shared video memory ────────────────────────────────────────────────────
  // Kept separate from photos[] so it is never passed to analyzeImages or PhotoFrame.
  // ScrapbookExperience renders this on its own dedicated page (page 3 in the sequence).
  // poster uses the hero photograph for a clean first frame before playback.
  video: {
    id: 'shared-video',
    src: '/images/shared-photos/keerthi.mp4',
    poster: encodeURI('/images/shared-photos/WhatsApp Image 2026-10-19 at 1.37.54 PM.jpeg'),
    caption: 'A moment worth replaying.',
  },
};

// Unified export for existing components
export const memoryChapters = [
  {
    ...chapter1Data,
    memories: chapter1Data.photos,
    backgroundTint: 'rgba(245, 184, 168, 0.08)',
  },
  {
    ...chapter2Data,
    memories: chapter2Data.photos,
    backgroundTint: 'rgba(235, 243, 250, 0.12)',
  },
];

export const allMemories = memoryChapters.flatMap((ch) =>
  ch.memories.map((m) => ({ ...m, chapter: ch }))
);
