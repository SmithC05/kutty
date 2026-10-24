/**
 * SONIC BLOOM — Six Songs, the Way I See You
 * Central data store for the six-song birthday experience.
 *
 * All personal notes and metadata are centralized here for easy refinement
 * without altering visual or layout components.
 */

export const sonicBloomConfig = {
  header: {
    wordmark: 'KUTTY RADIO',
    subtitleBadge: 'A playlist made just for you',
    mainHeading: 'Six songs. All the things I can’t say.',
    supportingLine: 'Six songs picked with a little thought of you, Kutty. ❤️',
  },
  closing: {
    title: 'One playlist. Six little feelings.',
    message:
      'Six songs could never say everything. I hope each one reminds you how much you mean to me, Kutty. ❤️',
    backActionText: 'Back to the Birthday',
  },
  sculptureCaption: 'Six songs. One very special person.',
};

export const sonicBloomSongs = [
  {
    id: 'unnale',
    trackNumber: '01',
    title: 'Unnale',
    film: 'Raja Rani',
    // theme: short human label shown in track list
    theme: 'Her favourite, first of course',
    personalNote: 'Your favourite song had to be the first one, Kutty. ❤️',
    colors: {
      primary: '#0ff0c0',     // Brighter teal-mint — playful energy
      secondary: '#ff6b6b',   // Warm coral — warmth & recognition
      glow: 'rgba(15, 240, 192, 0.40)',
      accent: '#ffd166',      // Butter-yellow spark
      core: '#e0fff5',
    },
    motion: {
      energy: 1.15,
      particleSpeed: 1.2,
      petalSpread: 1.1,
      style: 'playful',
    },
    audio: {
      src: '/audio/sonic-bloom/01-unnale.mp3',
      duration: 422,
      excerptStart: 0,
      excerptEnd: 422,
      isConfigured: true,
    },
  },
  {
    id: 'chella-magale',
    trackNumber: '02',
    title: 'Chella Magale',
    film: 'Jana Nayagan',
    theme: 'How precious you are to me',
    personalNote: 'I hope you always know how precious you are to the people who care about you.',
    colors: {
      primary: '#b57bee',     // Warm lavender — flowing, gentle
      secondary: '#5eead4',   // Soft teal
      glow: 'rgba(181, 123, 238, 0.38)',
      accent: '#e9d5ff',
      core: '#f5f0ff',
    },
    motion: {
      energy: 0.85,
      particleSpeed: 0.8,
      petalSpread: 1.05,
      style: 'gentle',
    },
    audio: {
      src: '/audio/sonic-bloom/02-chella-magale.mp3',
      duration: 35,
      excerptStart: 0,
      excerptEnd: 35,
      isConfigured: true,
    },
  },
  {
    id: 'magale',
    trackNumber: '03',
    title: 'Magale',
    film: null, // film credit unverified — left blank
    theme: 'You make me feel understood',
    personalNote:
      "You have a way of making me feel understood, even on days when I don't quite understand myself.",
    colors: {
      primary: '#7c8ff8',     // Periwinkle-indigo — layered, contemplative
      secondary: '#c4b5fd',   // Pale lilac shimmer
      glow: 'rgba(124, 143, 248, 0.42)',
      accent: '#a5b4fc',
      core: '#eef2ff',
    },
    motion: {
      energy: 0.9,
      particleSpeed: 0.85,
      petalSpread: 1.0,
      style: 'layered',
    },
    audio: {
      src: '/audio/sonic-bloom/03-magale.mp3',
      duration: 31,
      excerptStart: 0,
      excerptEnd: 31,
      isConfigured: true,
    },
  },
  {
    id: 'alakolava',
    trackNumber: '04',
    title: 'Alakolava',
    film: 'OM Chapter 1',
    theme: 'My favourite person',
    personalNote:
      "Out of all the people who come into our lives, some quietly become irreplaceable. You're one of those people to me. ❤️",
    colors: {
      primary: '#9d3fe8',     // Rich violet — intricate, important
      secondary: '#ff7c5c',   // Tangerine-coral
      glow: 'rgba(157, 63, 232, 0.46)',
      accent: '#f43f5e',
      core: '#faf5ff',
    },
    motion: {
      energy: 1.05,
      particleSpeed: 1.0,
      petalSpread: 0.95,
      style: 'intimate',
    },
    audio: {
      src: '/audio/sonic-bloom/04-alakolava.mp3',
      duration: 33,
      excerptStart: 0,
      excerptEnd: 33,
      isConfigured: true,
    },
  },
  {
    id: 'engey-andha-vennnila',
    trackNumber: '05',
    title: 'Engey Andha Vennnila',
    film: null, // film credit unverified — left blank
    theme: 'Where I find comfort',
    personalNote:
      "When life feels heavy, you're someone I wish I could sit beside and talk to. You make me feel safe in a way that's difficult to explain.",
    colors: {
      primary: '#4aa8d8',     // Quiet midnight sky blue
      secondary: '#6d7fe8',   // Periwinkle dusk
      glow: 'rgba(74, 168, 216, 0.32)',
      accent: '#93c5fd',
      core: '#f0f9ff',
    },
    motion: {
      energy: 0.62,
      particleSpeed: 0.55,
      petalSpread: 0.9,
      style: 'quiet',
    },
    audio: {
      src: '/audio/sonic-bloom/05-engey-andha-vennila.mp3',
      duration: 35,
      excerptStart: 0,
      excerptEnd: 35,
      isConfigured: true,
    },
  },
  {
    id: 'life-of-pazham',
    trackNumber: '06',
    title: 'Life of Pazham',
    film: 'Thiruchitrambalam',
    theme: 'You keep me going',
    personalNote:
      "You've probably motivated me in ways you don't even realise, Kutty. I'm really glad you're part of my life. ❤️",
    colors: {
      primary: '#06c9ac',     // Uplifting bright cyan-teal
      secondary: '#ff6040',   // Energetic coral-red
      glow: 'rgba(6, 201, 172, 0.50)',
      accent: '#fbbf24',      // Warm amber — brightness, life
      core: '#fffbeb',
    },
    motion: {
      energy: 1.25,
      particleSpeed: 1.2,
      petalSpread: 1.2,
      style: 'harmonious',
    },
    audio: {
      src: '/audio/sonic-bloom/06-life-of-pazham.mp3',
      duration: 209,
      excerptStart: 0,
      excerptEnd: 209,
      isConfigured: true,
    },
  },
];
