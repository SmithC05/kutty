export const siteConfig = {
  title: "Keerthana's Birthday",
  description: "A cinematic interactive experience.",
  author: "Founding Frontend Engineer",
};

export const birthdayConfig = {
  targetDate: "2026-08-03T00:00:00Z",
  nickname: "Kutty",
};

// The secret PIN for the birthday lock screen.
// 0308 = August 3rd (her birthday 🎂)
export const vaultConfig = {
  secretPin: "0308",
};

export const animationTimings = {
  micro: 0.4,
  reveal: 1.5,
  sceneTransition: 2.5,
  portraitDraw: 8.0,
};

export const themeConfig = {
  colors: {
    background: '#0a0a0a',
    gold: '#eab308',
  }
};

export const devMode = {
  enabled: true, // Master switch for dev features
  startScene: null, // e.g., 'MEMORY_JOURNEY_SOLO' (null to start from beginning)
  bypassDate: true, // If true, treats the date as after August 3rd
};
