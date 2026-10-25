// Global constants for the cinematic experience

export const SCENES = {
  ADVANCE_JOURNEY: 'ADVANCE_JOURNEY', // Phase 8: Pre-birthday countdown scene
  LOADING: 'LOADING', // Phase 8.1: Opening 3D gift box
  HANDWRITING: 'HANDWRITING', // Phase 8.5: Intermediate handwriting reveal
  BIRTHDAY_REVEAL: 'BIRTHDAY_REVEAL', // Phase 8.6: True Birthday Reveal ("Happy Birthday," -> Keerthana)
  DATE_AWARE: 'DATE_AWARE', // Backwards compatibility alias for Birthday Reveal
  SECRET_VAULT: 'SECRET_VAULT', // Phase 9.1: Memory Unlock PIN
  LORD_SHIVA_BLESSING: 'LORD_SHIVA_BLESSING', // Phase 11: Sacred Himalayan Blessings
  MEMORY_JOURNEY_SOLO: 'MEMORY_JOURNEY_SOLO', // Phase 9.2: Cinematic photo storytelling (Solo) — Just You
  ARTIST_CHAPTER: 'ARTIST_CHAPTER', // Phase 10: The Artist's Hand pencil reveal
  SONIC_BLOOM: 'SONIC_BLOOM', // Phase 13: Sonic Bloom — Six Songs, the Way I See You
  MEMORY_JOURNEY_TOGETHER: 'MEMORY_JOURNEY_TOGETHER', // Phase 9.3: Cinematic photo storytelling (Together) — Us
  WHO_IS_SHE_TO_ME: 'WHO_IS_SHE_TO_ME', // Phase 14: Who Is She to Me?
  FINAL_MESSAGE: 'FINAL_MESSAGE', // Phase 12: Grand Finale
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
