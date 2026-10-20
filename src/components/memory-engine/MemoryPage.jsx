import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoFrame } from './PhotoFrame';

export function MemoryPage({ pageData, isVisible }) {
  if (!pageData) return null;

  const { photos, template, theme = 'journal', stageTitle } = pageData;
  const containerStyle = template.getContainerStyle
    ? template.getContainerStyle()
    : 'flex flex-wrap items-center justify-center w-full h-full p-4';
  const styles = template.getStyles ? template.getStyles(photos) : [];
  const tilts = template.getTilts ? template.getTilts(photos) : [];

  // Determine if this is a mixed trio layout that benefits from a bottom sub-row
  const isTrio = template.isTrioLayout && photos.length === 3;
  const landscapeIdx = isTrio
    ? photos.findIndex((p) => p.orientation === 'landscape')
    : -1;
  const topIdx = landscapeIdx >= 0 ? landscapeIdx : 0;
  const bottomIndices = isTrio ? [0, 1, 2].filter((i) => i !== topIdx) : [];

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-2 py-4 select-none overflow-hidden"
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.01, y: -12 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle Stage Header for Editorial Journal */}
          {theme === 'journal' && stageTitle && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-2 md:mb-3 flex items-center gap-2 pointer-events-none"
            >
              <span className="w-4 h-px bg-[#F5B8A8]/60" />
              <span
                className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#8B4860] font-medium"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {stageTitle}
              </span>
              <span className="w-4 h-px bg-[#F5B8A8]/60" />
            </motion.div>
          )}

          {/* Layout Container */}
          <div className={containerStyle}>
            {isTrio ? (
              <>
                {/* Top Landscape Photo */}
                <PhotoFrame
                  key={photos[topIdx].id || topIdx}
                  photo={photos[topIdx]}
                  className={styles[topIdx] || 'w-full'}
                  index={0}
                  variant={theme}
                  tilt={tilts[topIdx] || 0}
                />
                {/* Bottom Row of 2 Portraits */}
                <div className="flex flex-row items-center justify-center w-full max-w-lg md:max-w-2xl gap-2 sm:gap-3">
                  {bottomIndices.map((bIdx, subI) => (
                    <PhotoFrame
                      key={photos[bIdx].id || bIdx}
                      photo={photos[bIdx]}
                      className={styles[bIdx] || 'w-1/2'}
                      index={subI + 1}
                      variant={theme}
                      tilt={tilts[bIdx] || 0}
                    />
                  ))}
                </div>
              </>
            ) : (
              photos.map((photo, i) => (
                <PhotoFrame
                  key={photo.id || i}
                  photo={photo}
                  className={styles[i] || 'w-full'}
                  index={i}
                  variant={theme}
                  tilt={tilts[i] || 0}
                  showStagePill={false}
                />
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
