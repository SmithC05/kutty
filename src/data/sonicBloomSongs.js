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
    artwork: '/images/kutty-radio/unnale.webp',
    thumbnail: '/images/kutty-radio/unnale-thumb.png',
    artworkAlt: 'Unnale — young woman sitting beside a window at golden hour looking toward distant city lights',
    visualMood: 'Warm Romantic Cinema',
    colors: {
      primary: '#f59e0b',     // Warm amber / gold
      secondary: '#fb7185',   // Muted rose
      glow: 'rgba(245, 158, 11, 0.28)',
      accent: '#fde047',      // Warm champagne sparkle
      highlight: '#fcd34d',
      champagne: '#fef3c7',
      bgMidnight: '#0c0a09',  // Warm dark charcoal
      panelBg: '#161311',     // Warm elevated charcoal
      borderLight: 'rgba(245, 158, 11, 0.16)',
      playButtonBg: '#fef3c7',
      playButtonGlow: 'rgba(254, 243, 199, 0.45)',
      headerIconBg: '#a3e635',
      headerIconColor: '#000000',
      activeLyricIndicator: '#f59e0b',
      core: '#fffbeb',
      mutedText: '#a8a29e',
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
    artwork: '/images/kutty-radio/chella-magale.webp',
    thumbnail: '/images/kutty-radio/chella-magale-thumb.png',
    artworkAlt: 'Chella Magale — two friends looking out at majestic turquoise waterfalls and emerald green mountains',
    visualMood: 'Turquoise Cascades & Emotional Trust',
    colors: {
      primary: '#06b6d4',     // Fresh turquoise / cyan
      secondary: '#10b981',   // Emerald green
      glow: 'rgba(6, 182, 212, 0.28)',
      accent: '#a5f3fc',      // Pale aqua mist
      highlight: '#38bdf8',
      champagne: '#f0fdfa',
      bgMidnight: '#040d12',  // Cool dark cyan-charcoal
      panelBg: '#09181f',     // Elevated cyan-tinted panel
      borderLight: 'rgba(6, 182, 212, 0.16)',
      playButtonBg: '#cffafe',
      playButtonGlow: 'rgba(6, 182, 212, 0.45)',
      headerIconBg: '#06b6d4',
      headerIconColor: '#040d12',
      activeLyricIndicator: '#06b6d4',
      core: '#ecfeff',
      mutedText: '#94a3b8',
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
    artwork: '/images/kutty-radio/magale.webp',
    thumbnail: '/images/kutty-radio/magale-thumb.png',
    artworkAlt: 'Magale — young man and woman holding hands along a quiet twilight path overlooking lakes and lantern-lit fences',
    visualMood: 'Quiet Twilight & Emotional Healing',
    colors: {
      primary: '#b8a5e8',       // Muted lavender
      secondary: '#f472b6',     // Dusty rose
      glow: 'rgba(184, 165, 232, 0.25)',
      accent: '#c4b5fd',        // Soft lavender highlight
      highlight: '#a5b4fc',     // Desaturated periwinkle
      champagne: '#fde68a',     // Restrained champagne light
      bgMidnight: '#08091a',    // Deep midnight indigo
      panelBg: '#121326',       // Soft charcoal with subtle violet tint
      borderLight: 'rgba(184, 165, 232, 0.18)',
      playButtonBg: '#ede9fe',  // Soft lavender-tinted cream
      playButtonGlow: 'rgba(184, 165, 232, 0.45)',
      headerIconBg: '#b8a5e8',  // Subtle lavender header music icon
      headerIconColor: '#08091a',
      activeLyricIndicator: '#c4b5fd',
      core: '#fdfcfb',          // Warm off-white
      mutedText: '#94a3b8',     // Soft blue-grey
    },
    motion: {
      energy: 0.70,
      particleSpeed: 0.65,
      style: 'healing',
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
    artwork: '/images/kutty-radio/alakolava.webp',
    thumbnail: '/images/kutty-radio/alakolava-thumb.png',
    artworkAlt: 'Alakolava — two people looking at each other in a sunlit pastel courtyard with pink flowering vines and a charming café',
    visualMood: 'Sunlit Pastel Courtyard & Café',
    colors: {
      primary: '#e07a98',       // Muted rose / blossom accent
      secondary: '#6b8f71',     // Sage green
      glow: 'rgba(224, 122, 152, 0.22)',
      accent: '#f472b6',        // Blush pink
      highlight: '#7fc8f8',     // Clear sky blue environmental accent
      champagne: '#fefae0',     // Warm cream and ivory
      bgMidnight: '#171513',    // Warm limestone charcoal neutral base
      panelBg: '#221f1d',       // Warm limestone elevated surface
      borderLight: 'rgba(212, 197, 185, 0.20)', // Warm limestone border
      playButtonBg: '#fef3e2',  // Soft warm cream
      playButtonGlow: 'rgba(224, 122, 152, 0.35)',
      headerIconBg: '#6b8f71',  // Sage green icon
      headerIconColor: '#fefae0',
      activeLyricIndicator: '#e07a98', // Muted rose
      core: '#fdfbf7',          // Warm ivory off-white
      mutedText: '#a8a29e',     // Soft warm stone grey
    },
    motion: {
      energy: 0.85,
      particleSpeed: 0.75,
      style: 'courtyard',
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
    artwork: '/images/kutty-radio/engey-andha-vennnila.webp',
    thumbnail: '/images/kutty-radio/engey-andha-vennnila-thumb.png',
    artworkAlt: "Engey Andha Vennila — young man resting his head in a young woman's lap under a glowing full moon on a quiet terrace",
    visualMood: 'Quiet Rooftop Moonlight & Safe Harbor',
    colors: {
      primary: '#818cf8',       // Dusty periwinkle / moonlit blue
      secondary: '#60a5fa',     // Silver-blue
      glow: 'rgba(129, 140, 248, 0.20)',
      accent: '#93c5fd',        // Soft moonlight silver-blue
      highlight: '#cbd5e1',     // Soft moonlight silver
      champagne: '#f8fafc',     // Warm ivory
      bgMidnight: '#070c18',    // Midnight navy primary background
      panelBg: '#0e1726',       // Deep slate blue elevated panels
      borderLight: 'rgba(148, 163, 184, 0.16)', // Subtle silver-blue border
      playButtonBg: '#e0e7ff',  // Soft periwinkle moonlight play button
      playButtonGlow: 'rgba(129, 140, 248, 0.38)',
      headerIconBg: '#818cf8',  // Periwinkle blue header icon
      headerIconColor: '#070c18',
      activeLyricIndicator: '#818cf8', // Periwinkle indicator
      core: '#f8fafc',          // Warm ivory off-white
      mutedText: '#94a3b8',     // Muted blue-grey
    },
    motion: {
      energy: 0.55,
      particleSpeed: 0.50,
      style: 'moonlight',
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
    artwork: '/images/kutty-radio/life-of-pazham.webp',
    thumbnail: '/images/kutty-radio/life-of-pazham-thumb.png',
    artworkAlt: "Life of Pazham — young woman resting encouraging hands on young man's shoulders in a cosy sunlit study room filled with books and plants",
    visualMood: 'Cosy Sunlit Study Room & Quiet Encouragement',
    colors: {
      primary: '#6b9e78',       // Sage green interactive accent
      secondary: '#87986a',     // Soft olive
      glow: 'rgba(107, 158, 120, 0.22)',
      accent: '#86efac',        // Fresh eucalyptus / sage highlight
      highlight: '#a3b18a',     // Soft olive detail
      champagne: '#fefae0',     // Warm ivory / light cream
      peach: '#fed7aa',         // Restrained soft peach
      bgMidnight: '#0c1510',    // Deep forest charcoal primary background
      panelBg: '#142018',       // Deep forest elevated panel
      borderLight: 'rgba(107, 158, 120, 0.18)', // Muted eucalyptus border
      playButtonBg: '#fef3e2',  // Warm cream play button
      playButtonGlow: 'rgba(107, 158, 120, 0.38)',
      headerIconBg: '#6b9e78',  // Sage green icon
      headerIconColor: '#0c1510',
      activeLyricIndicator: '#6b9e78', // Sage green indicator
      core: '#fdfbf7',          // Warm ivory text
      mutedText: '#a3b18a',     // Soft olive / sage-tinted readable grey
    },
    motion: {
      energy: 0.90,
      particleSpeed: 0.80,
      style: 'study_room',
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
