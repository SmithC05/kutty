import { kuttyRadioLyrics } from './kuttyRadioLyrics';

/**
 * KUTTY RADIO — Six Songs, the Way I See You
 * Central data store for the six-song music experience.
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
    theme: 'Her favourite, first of course',
    personalNote: 'Your favourite song had to be the first one, Kutty. ❤️',
    colors: {
      primary: '#a3e635',     // Sage-lime primary accent
      secondary: '#a78bfa',   // Muted lavender
      glow: 'rgba(163, 230, 53, 0.28)',
      accent: '#fde047',      // Warm amber sparkle
      core: '#f7fee7',
    },
    motion: {
      energy: 1.15,
      particleSpeed: 1.1,
      style: 'playful',
    },
    audio: {
      src: '/audio/sonic-bloom/01-unnale.mp3',
      duration: 422,
      excerptStart: 0,
      excerptEnd: 422,
      isConfigured: true,
    },
    lyrics: kuttyRadioLyrics.unnale,
  },
  {
    id: 'chella-magale',
    trackNumber: '02',
    title: 'Chella Magale',
    film: 'Jana Nayagan',
    theme: 'How precious you are to me',
    personalNote: 'I hope you always know how precious you are to the people who care about you.',
    colors: {
      primary: '#c084fc',     // Soft lavender
      secondary: '#2dd4bf',   // Soft teal
      glow: 'rgba(192, 132, 252, 0.28)',
      accent: '#e9d5ff',
      core: '#faf5ff',
    },
    motion: {
      energy: 0.85,
      particleSpeed: 0.8,
      style: 'gentle',
    },
    audio: {
      src: '/audio/sonic-bloom/02-chella-magale.mp3',
      duration: 35,
      excerptStart: 0,
      excerptEnd: 35,
      isConfigured: true,
    },
    lyrics: kuttyRadioLyrics['chella-magale'],
  },
  {
    id: 'magale',
    trackNumber: '03',
    title: 'Magale',
    film: null,
    theme: 'You make me feel understood',
    personalNote:
      "You have a way of making me feel understood, even on days when I don't quite understand myself.",
    colors: {
      primary: '#818cf8',     // Periwinkle-indigo
      secondary: '#c084fc',   // Soft lilac
      glow: 'rgba(129, 140, 248, 0.28)',
      accent: '#c7d2fe',
      core: '#f5f3ff',
    },
    motion: {
      energy: 0.9,
      particleSpeed: 0.85,
      style: 'layered',
    },
    audio: {
      src: '/audio/sonic-bloom/03-magale.mp3',
      duration: 31,
      excerptStart: 0,
      excerptEnd: 31,
      isConfigured: true,
    },
    lyrics: kuttyRadioLyrics.magale,
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
      primary: '#a855f7',     // Violet dusk
      secondary: '#fb923c',   // Warm amber coral
      glow: 'rgba(168, 85, 247, 0.30)',
      accent: '#f472b6',
      core: '#faf5ff',
    },
    motion: {
      energy: 1.05,
      particleSpeed: 1.0,
      style: 'intimate',
    },
    audio: {
      src: '/audio/sonic-bloom/04-alakolava.mp3',
      duration: 33,
      excerptStart: 0,
      excerptEnd: 33,
      isConfigured: true,
    },
    lyrics: kuttyRadioLyrics.alakolava,
  },
  {
    id: 'engey-andha-vennnila',
    trackNumber: '05',
    title: 'Engey Andha Vennnila',
    film: null,
    theme: 'Where I find comfort',
    personalNote:
      "When life feels heavy, you're someone I wish I could sit beside and talk to. You make me feel safe in a way that's difficult to explain.",
    colors: {
      primary: '#38bdf8',     // Midnight sky blue
      secondary: '#818cf8',   // Periwinkle dusk
      glow: 'rgba(56, 189, 248, 0.24)',
      accent: '#bae6fd',
      core: '#f0f9ff',
    },
    motion: {
      energy: 0.62,
      particleSpeed: 0.55,
      style: 'quiet',
    },
    audio: {
      src: '/audio/sonic-bloom/05-engey-andha-vennila.mp3',
      duration: 35,
      excerptStart: 0,
      excerptEnd: 35,
      isConfigured: true,
    },
    lyrics: kuttyRadioLyrics['engey-andha-vennnila'],
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
      primary: '#2dd4bf',     // Luminous teal
      secondary: '#fb7185',   // Warm rose coral
      glow: 'rgba(45, 212, 191, 0.30)',
      accent: '#fde047',      // Warm champagne amber
      core: '#f0fdfa',
    },
    motion: {
      energy: 1.25,
      particleSpeed: 1.15,
      style: 'harmonious',
    },
    audio: {
      src: '/audio/sonic-bloom/06-life-of-pazham.mp3',
      duration: 42,
      excerptStart: 0,
      excerptEnd: 42,
      isConfigured: true,
    },
    lyrics: kuttyRadioLyrics['life-of-pazham'],
  },
];
