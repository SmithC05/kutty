// Global constants for the cinematic experience

export const SCENES = {
  LOADING: 'LOADING',
  HANDWRITING: 'HANDWRITING', // Phase 8.5: Intermediate reveal
  DATE_AWARE: 'DATE_AWARE', // Phase 8: Pre-birthday countdown scene
  SECRET_VAULT: 'SECRET_VAULT', // Phase 9.1: Memory Unlock
  MEMORY_JOURNEY_SOLO: 'MEMORY_JOURNEY_SOLO', // Phase 9.2: Cinematic photo storytelling (Solo)
  MEMORY_JOURNEY_TOGETHER: 'MEMORY_JOURNEY_TOGETHER', // Phase 9.3: Cinematic photo storytelling (Together)
  ARTIST_CHAPTER: 'ARTIST_CHAPTER', // Phase 10: The Artist's Hand pencil reveal
  LORD_SHIVA_BLESSING: 'LORD_SHIVA_BLESSING', // Phase 11: Sacred Himalayan Blessings
  FINAL_MESSAGE: 'FINAL_MESSAGE', // Phase 12: Grand Finale
  SONIC_BLOOM: 'SONIC_BLOOM', // Phase 13: Sonic Bloom — Six Songs, the Way I See You
};

import { birthdayConfig } from '../config';

// Target date for the birthday - authoritative date from birthdayConfig
export const BIRTHDAY_DATE = birthdayConfig.targetDate;

// Animation Timings (in seconds, mapped from the design system)
export const TIMING = {
  MICRO: 0.4,
  REVEAL: 1.5,
  SCENE_TRANSITION: 2.5,
};

// Custom Easing Curves (mapped from design system)
export const EASING = {
  lux: [0.22, 1, 0.36, 1], // Slow, elegant deceleration
};
