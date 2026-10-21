/**
 * Editable Birthday Configuration & Message Data
 * 
 * Users can customize the dedication, quotes, and personal message
 * without needing to rewrite any scene or animation code.
 */

export const birthdayFinaleData = {
  // Cinematic Opening Surprise Dedication
  surpriseIntroText: 'And now, one last surprise… just for you, Kutty.',

  // Main Birthday Typography
  title: 'HAPPY BIRTHDAY',
  recipientName: 'Keerthana',
  heartEmoji: '❤️',
  dedicationQuote: '“To the girl who deserves all the light in the world.”',

  // Personal Letter / Message from Best Friend (Editable)
  personalMessage: {
    salutation: 'Dearest Kutty,',
    body: 'To the girl who deserves all the happiness in the world — may this new year of your life bring you beautiful memories, courage for every challenge, and countless reasons to smile. Happy Birthday, Kutty. Always in your corner. ❤️',
    signoff: 'With love, always',
  },

  // Action Buttons
  actions: {
    replayText: 'Celebrate Again',
    revisitText: 'Revisit Memories',
  },

  // Optional voice / audio note support (user triggered only, no autoplay)
  audio: {
    enabled: false,
    src: null,
    label: 'Listen to Birthday Note',
  }
};
