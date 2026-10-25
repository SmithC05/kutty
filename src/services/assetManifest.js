/**
 * Central Asset Manifest
 *
 * Explicit central inventory of all required assets used throughout the birthday journey:
 * - Background music & sound effects
 * - Kutty Radio audio tracks, artwork, and thumbnails
 * - Devotional 3D Darshan and pencil-portrait artworks
 * - All verified solo and shared memory photographs
 * - Shared keepsake memory video
 * - Custom typography (including Tamil lyrics fonts)
 *
 * Paths are resolved through project data sources to maintain single-source integrity.
 */

import playlistData from '../data/playlist.json';
import { sonicBloomSongs } from '../data/sonicBloomSongs';
import { chapter1Data, chapter2Data } from '../data/memories';
import { SHIVA_DEPICTION_CONFIG } from '../scenes/shiva/shivaAssets';

// ── 1. Custom Typography Manifest ─────────────────────────────────────────────
export const FONT_ASSETS = [
  {
    id: 'font-kavivanar',
    family: 'Kavivanar',
    spec: '16px "Kavivanar"',
    sampleText: 'குட்டி கீர்த்தனா',
    category: 'font',
    label: 'Tamil Lyrics (Kavivanar)',
  },
  {
    id: 'font-noto-sans-tamil',
    family: 'Noto Sans Tamil',
    spec: '16px "Noto Sans Tamil"',
    sampleText: 'பிறந்தநாள் வாழ்த்துகள்',
    category: 'font',
    label: 'Tamil Lyrics (Noto Sans Tamil)',
  },
  {
    id: 'font-alex-brush',
    family: 'Alex Brush',
    spec: '16px "Alex Brush"',
    sampleText: 'Keerthana',
    category: 'font',
    label: 'Signature Script (Alex Brush)',
  },
  {
    id: 'font-dancing-script',
    family: 'Dancing Script',
    spec: '600 16px "Dancing Script"',
    sampleText: 'Happy Birthday Kutty',
    category: 'font',
    label: 'Headline Cursive (Dancing Script)',
  },
  {
    id: 'font-dm-sans',
    family: 'DM Sans',
    spec: '16px "DM Sans"',
    sampleText: 'Six songs made just for you',
    category: 'font',
    label: 'Sonic Bloom Body (DM Sans)',
  },
  {
    id: 'font-inter',
    family: 'Inter',
    spec: '16px "Inter"',
    sampleText: 'For Kutty',
    category: 'font',
    label: 'Base UI (Inter)',
  },
  {
    id: 'font-manrope',
    family: 'Manrope',
    spec: '600 16px "Manrope"',
    sampleText: 'Chapter One: Just You',
    category: 'font',
    label: 'Editorial Typography (Manrope)',
  },
  {
    id: 'font-outfit',
    family: 'Outfit',
    spec: '700 16px "Outfit"',
    sampleText: 'KUTTY RADIO',
    category: 'font',
    label: 'Kinetic & Display (Outfit)',
  },
  {
    id: 'font-playfair-display',
    family: 'Playfair Display',
    spec: 'italic 16px "Playfair Display"',
    sampleText: 'My safe place and comfort',
    category: 'font',
    label: 'Serif Quotes (Playfair Display)',
  },
  {
    id: 'font-space-mono',
    family: 'Space Mono',
    spec: '16px "Space Mono"',
    sampleText: '10:30',
    category: 'font',
    label: 'Numeric Display (Space Mono)',
  },
  {
    id: 'font-syne',
    family: 'Syne',
    spec: '700 16px "Syne"',
    sampleText: 'KUTTY',
    category: 'font',
    label: 'Hero Titles (Syne)',
  },
];

// ── 2. Audio Manifest ─────────────────────────────────────────────────────────
const APPROX_AUDIO_SIZES = {
  '/audio/music/intro.mp3': 719863,
  '/audio/music/remo.mp3': 482462,
  '/audio/music/09-Bus-Love-Pt-2-MassTamilan.com.mp3': 1431681,
  '/audio/music/friendship anthem.mp3': 2014898,
  '/audio/music/dheema.mp3': 450397,
  '/audio/music/deva_deva_instrumental.mp3': 481115,
  '/audio/music/Happy-Birthday.mp3': 3997288,
  '/audio/music/metro.mp3': 436212,
  '/audio/sound-effects/heartbeat.mp3': 34481,
  '/audio/sound-effects/sparkle.mp3': 39497,
  '/audio/sonic-bloom/01-unnale.mp3': 3377899,
  '/audio/sonic-bloom/02-chella-magale.mp3': 1400842,
  '/audio/sonic-bloom/03-magale.mp3': 1242994,
  '/audio/sonic-bloom/04-alakolava.mp3': 1052249,
  '/audio/sonic-bloom/05-engey-andha-vennila.mp3': 561390,
  '/audio/sonic-bloom/06-life-of-pazham.mp3': 1673755,
};

export const AUDIO_ASSETS = [
  // Background sound tracks
  ...playlistData.tracks.map((track) => ({
    id: `bgm-${track.id}`,
    url: track.src,
    type: 'audio',
    category: 'music',
    title: track.name,
    approxSize: APPROX_AUDIO_SIZES[track.src] || 500000,
    required: true,
  })),
  // Sound effects
  ...Object.entries(playlistData.sfx || {}).map(([key, src]) => ({
    id: `sfx-${key}`,
    url: src,
    type: 'audio',
    category: 'sfx',
    title: `SFX ${key}`,
    approxSize: APPROX_AUDIO_SIZES[src] || 35000,
    required: true,
  })),
  // Kutty Radio songs
  ...sonicBloomSongs.map((song) => ({
    id: `radio-${song.id}`,
    url: song.audio.src,
    type: 'audio',
    category: 'radio-song',
    title: `${song.title} (${song.film || 'Single'})`,
    approxSize: APPROX_AUDIO_SIZES[song.audio.src] || 1500000,
    required: true,
  })),
];

// ── 3. Image Manifest ─────────────────────────────────────────────────────────
const APPROX_IMAGE_SIZES = {
  '/images/artworks/shiva_darshan.webp': 74136,
  '/images/artworks/keerthana-pencil-portrait.webp': 768481,
  '/images/artworks/keerthana-finale-cutout.webp': 537598,
  '/images/shared-photos/spiderman-cutout.png': 798226,
  '/images/shared-photos/spiderman-duo.jpg': 121939,
  '/images/solo-photos/kutty1.jpeg': 234727,
  '/images/kutty-radio/unnale.webp': 242643,
  '/images/kutty-radio/unnale-thumb.png': 28496,
  '/images/kutty-radio/chella-magale.webp': 181662,
  '/images/kutty-radio/chella-magale-thumb.png': 35071,
  '/images/kutty-radio/magale.webp': 130448,
  '/images/kutty-radio/magale-thumb.png': 32299,
  '/images/kutty-radio/alakolava.webp': 174552,
  '/images/kutty-radio/alakolava-thumb.png': 35937,
  '/images/kutty-radio/engey-andha-vennnila.webp': 50984,
  '/images/kutty-radio/engey-andha-vennnila-thumb.png': 26171,
  '/images/kutty-radio/life-of-pazham.webp': 122928,
  '/images/kutty-radio/life-of-pazham-thumb.png': 34057,
  '/favicon.svg': 9522,
  '/icons.svg': 5031,
};

// Extract unique images from all sources
const rawImageItems = [
  // Scene Artworks & Portraits
  {
    id: 'art-shiva-darshan',
    url: SHIVA_DEPICTION_CONFIG.artworkPath || '/images/artworks/shiva_darshan.webp',
    category: 'artwork',
    title: 'Lord Shiva 3D Darshan Artwork',
  },
  {
    id: 'art-pencil-portrait',
    url: '/images/artworks/keerthana-pencil-portrait.webp',
    category: 'artwork',
    title: "The Artist's Hand Pencil Portrait",
  },
  {
    id: 'art-finale-cutout',
    url: '/images/artworks/keerthana-finale-cutout.webp',
    category: 'artwork',
    title: 'Celebration Grand Finale Portrait Cutout',
  },
  {
    id: 'art-spiderman-cutout',
    url: '/images/shared-photos/spiderman-cutout.png',
    category: 'cutout',
    title: 'Who Is She to Me — Spider-Man Cutout',
  },
  {
    id: 'art-spiderman-duo',
    url: '/images/shared-photos/spiderman-duo.jpg',
    category: 'cutout-fallback',
    title: 'Who Is She to Me — Spider-Man Duo Fallback',
  },
  {
    id: 'photo-solo-signature',
    url: '/images/solo-photos/kutty1.jpeg',
    category: 'photo-solo',
    title: 'Keerthana Signature Portrait',
  },
  // Kutty Radio Artworks & Thumbnails
  ...sonicBloomSongs.flatMap((song) => [
    {
      id: `art-radio-${song.id}`,
      url: song.artwork,
      category: 'radio-art',
      title: `${song.title} Artwork`,
    },
    {
      id: `thumb-radio-${song.id}`,
      url: song.thumbnail,
      category: 'radio-thumb',
      title: `${song.title} Thumbnail`,
    },
  ]),
  // Solo Memory Photos (Chapter 1)
  ...chapter1Data.photos.map((photo) => ({
    id: `photo-${photo.id}`,
    url: decodeURI(photo.url),
    category: 'photo-solo',
    title: photo.caption || 'Solo Memory Photo',
  })),
  // Shared Memory Photos (Chapter 2)
  ...chapter2Data.photos.map((photo) => ({
    id: `photo-${photo.id}`,
    url: decodeURI(photo.url),
    category: 'photo-together',
    title: photo.caption || 'Shared Memory Photo',
  })),
  // Video Poster
  ...(chapter2Data.video?.poster
    ? [
        {
          id: 'poster-shared-video',
          url: decodeURI(chapter2Data.video.poster),
          category: 'photo-together',
          title: 'Shared Memory Video Poster',
        },
      ]
    : []),
  // Icons
  {
    id: 'icon-favicon',
    url: '/favicon.svg',
    category: 'icon',
    title: 'Favicon',
  },
  {
    id: 'icon-svg-sheet',
    url: '/icons.svg',
    category: 'icon',
    title: 'Icon Sprite',
  },
];

// Deduplicate image assets by URL
const seenImageUrls = new Set();
export const IMAGE_ASSETS = [];
for (const item of rawImageItems) {
  if (!seenImageUrls.has(item.url)) {
    seenImageUrls.add(item.url);
    IMAGE_ASSETS.push({
      ...item,
      type: 'image',
      approxSize: APPROX_IMAGE_SIZES[item.url] || 120000,
      required: true,
    });
  }
}

// ── 4. Video Manifest ─────────────────────────────────────────────────────────
export const VIDEO_ASSETS = [
  {
    id: 'video-shared-keerthi',
    url: chapter2Data.video?.src || '/images/shared-photos/keerthi.mp4',
    type: 'video',
    category: 'memory-video',
    title: 'Shared Memory Keepsake Video',
    approxSize: 28228115, // ~28.2 MB
    required: true,
  },
];

// ── 5. Consolidated Manifest & Stats ──────────────────────────────────────────
export const ALL_MEDIA_ASSETS = [
  ...AUDIO_ASSETS,
  ...IMAGE_ASSETS,
  ...VIDEO_ASSETS,
];

export const TOTAL_EXPECTED_BYTES = ALL_MEDIA_ASSETS.reduce(
  (sum, item) => sum + (item.approxSize || 100000),
  0
);

export const MANIFEST_SUMMARY = {
  audioCount: AUDIO_ASSETS.length,
  imageCount: IMAGE_ASSETS.length,
  videoCount: VIDEO_ASSETS.length,
  fontCount: FONT_ASSETS.length,
  totalMediaAssets: ALL_MEDIA_ASSETS.length,
  totalEstimatedBytes: TOTAL_EXPECTED_BYTES,
  totalEstimatedMB: Number((TOTAL_EXPECTED_BYTES / 1024 / 1024).toFixed(1)),
};
