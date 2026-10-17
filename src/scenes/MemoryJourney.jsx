import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '../context/SceneContext';
import { memoryChapters } from '../data/memories';
import { MemoryBook } from '../components/memory-engine/MemoryBook';

// ─────────────────────────────────────────────────────────────────────────────
// Chapter Title Card
// ─────────────────────────────────────────────────────────────────────────────
function ChapterCard({ chapter, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none bg-[#050505]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="text-center px-8"
      >
        <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-3">Chapter</p>
        <p className="text-5xl mb-4">{chapter.emoji}</p>
        <h2
          className="text-white/90 text-3xl font-light italic"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {chapter.title}
        </h2>
        <motion.div
          className="mt-5 w-12 h-px bg-white/30 mx-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Memory Journey Orchestrator
// ─────────────────────────────────────────────────────────────────────────────
export function MemoryJourney({ chapterIndex: propChapterIndex }) {
  const { next, transitionTo, currentScene } = useScene();
  
  // Resolve chapter index from prop or currentScene
  const activeChapterIndex = propChapterIndex !== undefined 
    ? propChapterIndex 
    : (currentScene === 'MEMORY_JOURNEY_TOGETHER' ? 1 : 0);
  
  const [showChapterCard, setShowChapterCard] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentChapter = memoryChapters[activeChapterIndex] || memoryChapters[0];

  const handleChapterComplete = () => {
    if (activeChapterIndex >= memoryChapters.length - 1) {
      setIsCompleted(true);
      next();
    } else {
      next();
    }
  };

  if (isCompleted) {
    return (
      <div className="fixed inset-0 w-full h-full bg-[#050505] flex flex-col items-center justify-center p-6 text-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="max-w-md flex flex-col items-center space-y-6"
        >
          <span className="text-5xl">✨</span>
          <h2
            className="text-white/90 text-3xl md:text-4xl font-light italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Memories Unlocked
          </h2>
          <p className="text-white/60 text-sm tracking-widest leading-relaxed">
            Every moment with you is unforgettable, Kutty.<br />
            More magic awaits on October 30th.
          </p>
          <button
            onClick={() => {
              setIsCompleted(false);
              transitionTo('MEMORY_JOURNEY_SOLO');
            }}
            className="mt-6 px-6 py-2.5 rounded-full border border-blue-400/30 text-blue-200 text-xs tracking-[0.2em] uppercase hover:bg-blue-400/10 transition-colors"
          >
            Revisit Memories
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentChapter) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050505]">
      <AnimatePresence mode="wait">
        {showChapterCard ? (
          <ChapterCard
            key={`card-${currentChapter.id}`}
            chapter={currentChapter}
            onDismiss={() => setShowChapterCard(false)}
          />
        ) : (
          <MemoryBook
            key={`book-${currentChapter.id}`}
            photos={currentChapter.memories}
            initialChapterData={currentChapter}
            onComplete={handleChapterComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
