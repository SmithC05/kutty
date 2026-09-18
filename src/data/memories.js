// ─────────────────────────────────────────────────────────────────────────────
// Memory Journey Data — uses real local photos
//
// Solo photos:   /images/solo-photos/kutty1.jpeg
// Shared photos: /images/shared-photos/together1.jpg → together7.jpg
//
// Motion options: 'zoom-in' | 'zoom-out' | 'pan-right' | 'pan-left' | 'breathe'
// Caption: max 4 words
// ─────────────────────────────────────────────────────────────────────────────

export const memoryChapters = [
  // ── Chapter 1: Just You ─────────────────────────────────────────────────────
  {
    id: 'ch-1',
    title: 'Just You',
    emoji: '✨',
    backgroundTint: 'rgba(59, 130, 246, 0.06)',
    memories: [
      { id: 's1',  url: '/images/solo-photos/kutty1.jpeg', caption: 'That smile.',       motion: 'zoom-in'   },
      { id: 's2',  url: '/images/solo-photos/kutty1.jpeg', caption: 'Radiant.',           motion: 'pan-right' },
      { id: 's3',  url: '/images/solo-photos/kutty1.jpeg', caption: 'My favorite.',       motion: 'zoom-out'  },
      { id: 's4',  url: '/images/solo-photos/kutty1.jpeg', caption: 'Always stunning.',   motion: 'breathe'   },
      { id: 's5',  url: '/images/solo-photos/kutty1.jpeg', caption: 'Keep shining.',      motion: 'zoom-in'   },
      { id: 's6',  url: '/images/solo-photos/kutty1.jpeg', caption: 'Beautiful.',         motion: 'pan-left'  },
      { id: 's7',  url: '/images/solo-photos/kutty1.jpeg', caption: 'Effortlessly you.',  motion: 'zoom-out'  },
      { id: 's8',  url: '/images/solo-photos/kutty1.jpeg', caption: 'Glowing.',           motion: 'breathe'   },
      { id: 's9',  url: '/images/solo-photos/kutty1.jpeg', caption: 'Iconic.',             motion: 'zoom-in'   },
      { id: 's10', url: '/images/solo-photos/kutty1.jpeg', caption: 'Pure light.',        motion: 'pan-right' },
      { id: 's11', url: '/images/solo-photos/kutty1.jpeg', caption: 'Still laughing.',    motion: 'zoom-out'  },
      { id: 's12', url: '/images/solo-photos/kutty1.jpeg', caption: 'Never change.',      motion: 'breathe'   },
    ],
  },

  // ── Chapter 2: Together ──────────────────────────────────────────────────────
  {
    id: 'ch-2',
    title: 'Together',
    emoji: '💙',
    backgroundTint: 'rgba(96, 165, 250, 0.06)',
    memories: [
      { id: 't1', url: '/images/shared-photos/together1.jpg', caption: 'We laughed.',       motion: 'pan-left'  },
      { id: 't2', url: '/images/shared-photos/together2.jpg', caption: 'Always together.',  motion: 'zoom-in'   },
      { id: 't3', url: '/images/shared-photos/together3.jpg', caption: 'Still my favorite.',motion: 'breathe'   },
      { id: 't4', url: '/images/shared-photos/together4.jpg', caption: 'Best moments.',     motion: 'zoom-out'  },
      { id: 't5', url: '/images/shared-photos/together5.jpg', caption: 'A little chaos.',   motion: 'pan-right' },
      { id: 't6', url: '/images/shared-photos/together6.jpg', caption: 'Golden days.',      motion: 'zoom-in'   },
      { id: 't7', url: '/images/shared-photos/together7.jpg', caption: 'Always.',           motion: 'breathe'   },
    ],
  },
];

export const allMemories = memoryChapters.flatMap(ch =>
  ch.memories.map(m => ({ ...m, chapter: ch }))
);
