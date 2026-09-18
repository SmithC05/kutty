import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeImages } from './ImageAnalyzer';
import { generatePages } from './LayoutEngine';
import { MemoryPage } from './MemoryPage';

export function MemoryBook({ photos, onComplete, initialChapterData }) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [pages, setPages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canTap, setCanTap] = useState(false);
  const [showDissolve, setShowDissolve] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function load() {
      setIsAnalyzing(true);
      const analyzed = await analyzeImages(photos);
      const layoutPages = generatePages(analyzed);
      
      if (isMounted) {
        setPages(layoutPages);
        setIsAnalyzing(false);
      }
    }
    
    load();
    
    return () => { isMounted = false; };
  }, [photos]);

  useEffect(() => {
    if (isAnalyzing) return;
    
    setCanTap(false);
    const t = setTimeout(() => {
      setCanTap(true);
    }, 4000);
    
    return () => clearTimeout(t);
  }, [currentIndex, isAnalyzing]);

  const advance = () => {
    if (!canTap || isAnalyzing) return;
    
    setShowDissolve(true);
    setTimeout(() => setShowDissolve(false), 700);

    if (currentIndex >= pages.length - 1) {
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 600);
      return;
    }

    setTimeout(() => setCurrentIndex(prev => prev + 1), 500);
  };

  if (isAnalyzing) {
    return (
      <motion.div 
        className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="w-16 h-px bg-white/20 relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-y-0 left-0 bg-white/60"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <p className="text-white/30 text-xs tracking-[0.4em] uppercase mt-6">
          Gathering Memories
        </p>
      </motion.div>
    );
  }

  if (pages.length === 0) return null;

  const currentChapterTint = initialChapterData?.backgroundTint || 'rgba(0,0,0,0)';

  return (
    <motion.div
      className="fixed inset-0 w-full h-full overflow-hidden cursor-pointer bg-[#050505]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      onClick={advance}
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{ background: currentChapterTint }}
        transition={{ duration: 3 }}
      />

      <div className="absolute inset-0 z-10">
        {pages.map((page, idx) => (
          <MemoryPage
            key={page.id}
            pageData={page}
            isVisible={currentIndex === idx}
          />
        ))}
      </div>

      <AnimatePresence>
        {canTap && (
          <motion.p
            className="absolute bottom-8 left-0 right-0 text-center text-white/25 text-xs tracking-[0.4em] uppercase z-30 pointer-events-none select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            Turn Page
          </motion.p>
        )}
      </AnimatePresence>

      {/* Blue particle visual feedback on tap */}
      <AnimatePresence>
        {showDissolve && (
          <motion.div 
            className="absolute inset-0 z-40 pointer-events-none mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              background: 'radial-gradient(circle at center, rgba(59,130,246,0.12) 0%, transparent 60%)'
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
