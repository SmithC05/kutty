/**
 * SONIC BLOOM — Six Songs, the Way I See You
 * Central data store for the six-song birthday experience.
 * 
 * All personal notes and metadata are centralized here for easy refinement
 * without altering visual or layout components.
 */

export const sonicBloomConfig = {
  header: {
    wordmark: "SONIC BLOOM",
    subtitleBadge: "Six Songs, the Way I See You",
    mainHeading: "Six Songs, the Way I See You.",
    supportingLine: "Six songs. Six little pieces of what you mean to me, Kutty. ❤️",
  },
  closing: {
    title: "The Full Blossom",
    message: "Six songs could never say everything, but each one carries a little piece of what you mean to me, Kutty. ❤️",
    backActionText: "Back to the Birthday",
  },
  playerPreviewNotice: "Design Preview — Audio integration reserved for final phase",
};

export const sonicBloomSongs = [
  {
    id: 'unnale',
    trackNumber: '01',
    title: 'Unnale',
    film: 'Raja Rani',
    meaning: 'Her favourite song from her favourite movie.',
    theme: 'Her Favourite Song — Recognition & Familiarity',
    personalNote: 'Your favourite song had to be the first one, Kutty. ❤️',
    colors: {
      primary: '#00f0ff',     // Bright Electric Cyan
      secondary: '#ff5376',   // Playful Coral
      glow: 'rgba(0, 240, 255, 0.45)',
      accent: '#38bdf8',
      core: '#e0f2fe',
      bgGradient: 'from-cyan-950/40 via-slate-950 to-indigo-950/50',
    },
    motion: {
      energy: 1.15,
      particleSpeed: 1.2,
      petalSpread: 1.1,
      style: 'playful',
    },
    audio: {
      src: null,
      duration: 30,
      excerptStart: 0,
      excerptEnd: 30,
      isConfigured: false,
    },
  },
  {
    id: 'chella-magale',
    trackNumber: '02',
    title: 'Chella Magale',
    film: 'Jana Nayagan',
    meaning: 'The perspective on her—how precious she is and wanting her to flourish.',
    theme: 'How Precious You Are — Flourish & Grace',
    personalNote: 'I hope you always know how precious you are to the people who care about you.',
    colors: {
      primary: '#c084fc',     // Soft Lavender
      secondary: '#67e8f9',   // Pale Cyan
      glow: 'rgba(192, 132, 252, 0.4)',
      accent: '#e9d5ff',
      core: '#f5f3ff',
      bgGradient: 'from-purple-950/40 via-slate-950 to-cyan-950/40',
    },
    motion: {
      energy: 0.85,
      particleSpeed: 0.8,
      petalSpread: 1.05,
      style: 'gentle',
    },
    audio: {
      src: null,
      duration: 30,
      excerptStart: 0,
      excerptEnd: 30,
      isConfigured: false,
    },
  },
  {
    id: 'magale',
    trackNumber: '03',
    title: 'Magale',
    film: 'Special Selection', // Configurable film credit
    meaning: 'Feeling accepted, understood, and cared for even when struggling with yourself.',
    theme: 'Accepted & Understood — Through Every Day',
    personalNote: "You have a way of making me feel understood, even on days when I don't quite understand myself.",
    colors: {
      primary: '#818cf8',     // Translucent Periwinkle
      secondary: '#c4b5fd',   // Pale Lilac
      glow: 'rgba(129, 140, 248, 0.42)',
      accent: '#a5b4fc',
      core: '#eef2ff',
      bgGradient: 'from-indigo-950/45 via-slate-950 to-blue-950/40',
    },
    motion: {
      energy: 0.9,
      particleSpeed: 0.85,
      petalSpread: 1.0,
      style: 'layered',
    },
    audio: {
      src: null,
      duration: 30,
      excerptStart: 0,
      excerptEnd: 30,
      isConfigured: false,
    },
  },
  {
    id: 'alakolava',
    trackNumber: '04',
    title: 'Alakolava',
    film: 'OM Chapter 1',
    meaning: 'How precious she is to him—his favourite person, someone irreplaceable in his life.',
    theme: 'Quietly Irreplaceable — Meaningful Connection',
    personalNote: "Out of all the people who come into our lives, some quietly become irreplaceable. You're one of those people to me. ❤️",
    colors: {
      primary: '#9333ea',     // Deep Violet
      secondary: '#fb7185',   // Luminous Coral
      glow: 'rgba(147, 51, 234, 0.48)',
      accent: '#f43f5e',
      core: '#faf5ff',
      bgGradient: 'from-violet-950/50 via-slate-950 to-rose-950/35',
    },
    motion: {
      energy: 1.0,
      particleSpeed: 1.0,
      petalSpread: 0.95,
      style: 'intimate',
    },
    audio: {
      src: null,
      duration: 30,
      excerptStart: 0,
      excerptEnd: 30,
      isConfigured: false,
    },
  },
  {
    id: 'engey-andha-vennnila',
    trackNumber: '05',
    title: 'Engey Andha Vennnila',
    film: 'Timeless Melody',
    meaning: 'Someone he turns to when sad. Her presence feels safe, caring, and comforting.',
    theme: 'A Safe Sanctuary — Warmth, Care & Comfort',
    personalNote: "When life feels heavy, you're someone I wish I could sit beside and talk to. You make me feel safe in a way that's difficult to explain.",
    colors: {
      primary: '#38bdf8',     // Muted Periwinkle / Sky
      secondary: '#818cf8',   // Midnight Indigo Accent
      glow: 'rgba(56, 189, 248, 0.35)',
      accent: '#93c5fd',
      core: '#f0f9ff',
      bgGradient: 'from-sky-950/35 via-slate-950 to-blue-950/50',
    },
    motion: {
      energy: 0.65,
      particleSpeed: 0.6,
      petalSpread: 0.9,
      style: 'quiet',
    },
    audio: {
      src: null,
      duration: 30,
      excerptStart: 0,
      excerptEnd: 30,
      isConfigured: false,
    },
  },
  {
    id: 'life-of-pazham',
    trackNumber: '06',
    title: 'Life of Pazham',
    film: 'Thiruchitrambalam',
    meaning: 'How she motivates him, lightens his outlook, and influences his life.',
    theme: 'Gratitude & Inspiration — Full Coordinated Bloom',
    personalNote: "You've probably motivated me in ways you don't even realise, Kutty. I'm really glad you're part of my life. ❤️",
    colors: {
      primary: '#06b6d4',     // Electric Cyan
      secondary: '#f43f5e',   // Radiant Coral Rose
      glow: 'rgba(6, 182, 212, 0.5)',
      accent: '#f59e0b',      // Sunrise Amber Warmth
      core: '#fffbeb',
      bgGradient: 'from-cyan-950/45 via-slate-950 to-amber-950/35',
    },
    motion: {
      energy: 1.2,
      particleSpeed: 1.15,
      petalSpread: 1.2,
      style: 'harmonious',
    },
    audio: {
      src: null,
      duration: 30,
      excerptStart: 0,
      excerptEnd: 30,
      isConfigured: false,
    },
  },
];
