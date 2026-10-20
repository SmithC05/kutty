import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * PhotoFrame — renders a single photograph in either journal or scrapbook style.
 *
 * Journal (Chapter 1 — Just You):
 *   - Portrait-first editorial gallery frame.
 *   - Clean ivory paper card (#FFFDF9) with pale blush borders and soft, restrained shadows.
 *   - Pure object-contain image preserving natural aspect ratio; no cropping faces or details.
 *   - Completely clean photo surround (NO vignette overlay, NO blurred background duplicate,
 *     NO textures over the photo).
 *   - Captions placed cleanly outside the image area in a dedicated footer.
 *
 * Scrapbook (Chapter 2 — Us):
 *   - Authentic Polaroid instant-print with washi tape and handwritten script.
 *   - Preserved exactly as-is for Chapter Two.
 */
export function PhotoFrame({
  photo,
  className = '',
  index = 0,
  variant = 'journal',
  tapeColor = 'rgba(254, 243, 199, 0.85)',
  tilt = 0,
  showStagePill = false,
  hideCaption = false,
}) {
  const [imgError, setImgError] = useState(false);
  const delay = Math.min(index * 0.15, 0.45);

  const isScrapbook = variant === 'scrapbook';

  return (
    <motion.div
      className={`relative select-none flex flex-col ${className}`}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: 'center center' }}
    >
      {/* ── Scrapbook: Washi Tape Accent ── */}
      {isScrapbook && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 z-30 pointer-events-none rounded-sm shadow-sm"
          style={{
            background: tapeColor,
            backdropFilter: 'blur(2px)',
            borderLeft: '1px dashed rgba(0,0,0,0.12)',
            borderRight: '1px dashed rgba(0,0,0,0.12)',
            transform: 'rotate(-1.5deg)',
          }}
        />
      )}

      {/* ── Frame Shell ── */}
      <div
        className={`
          relative w-full h-full overflow-hidden flex flex-col
          ${isScrapbook
            ? 'bg-[#FFFDF9] p-3 pb-8 rounded-sm shadow-[0_10px_26px_rgba(30,41,59,0.14),0_2px_6px_rgba(0,0,0,0.04)] border border-[#E2E8F0]/50'
            : 'bg-[#FFFDF9] rounded-lg sm:rounded-xl border border-[#F5B8A8]/28 shadow-[0_12px_32px_-6px_rgba(69,21,45,0.08),0_2px_8px_rgba(0,0,0,0.02)]'
          }
        `}
      >
        {/* Journal inner frame — fine, delicate blush line */}
        {!isScrapbook && (
          <div className="absolute inset-[5px] sm:inset-[7px] border border-[#F5B8A8]/16 rounded-[6px] sm:rounded-lg pointer-events-none z-10" />
        )}

        {/* Stage pill — editorial journal only, optional */}
        {!isScrapbook && showStagePill && photo.stageTitle && (
          <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-[#FAF7F2]/95 text-[#8B4860] border border-[#F5B8A8]/35 shadow-sm backdrop-blur-sm"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {photo.stageTitle}
            </span>
          </div>
        )}

        {/* ── Photo container ── */}
        <div
          className={`relative flex-1 min-h-0 overflow-hidden flex items-center justify-center ${
            isScrapbook ? '' : 'p-2 sm:p-2.5 lg:p-3 bg-[#FAF7F2]/45'
          }`}
        >
          {!imgError ? (
            /* Primary sharp image — 100% clean object-contain, natural aspect ratio */
            <img
              src={photo.url}
              alt={photo.caption || `Memory — ${photo.stageTitle || ''}`}
              className="relative w-full h-full object-contain pointer-events-none select-none"
              loading="lazy"
              onError={() => setImgError(true)}
              style={{ display: 'block' }}
            />
          ) : (
            /* Graceful error state */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#FAF7F2]">
              <span className="text-3xl mb-2 opacity-50">📷</span>
              <span
                className="text-[11px] uppercase tracking-[0.2em] text-[#8B4860]/70 font-medium"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Memory Captured
              </span>
            </div>
          )}
        </div>

        {/* ── Caption Footer (Outside Image Area) ── */}
        {!hideCaption && photo.caption && (
          <div
            className={`
              shrink-0 text-center overflow-hidden
              ${isScrapbook
                ? 'px-2 py-1.5'
                : 'px-3 sm:px-4 py-2 sm:py-2.5 border-t border-[#F5B8A8]/14 bg-[#FFFDF9]'
              }
            `}
          >
            {isScrapbook ? (
              <p
                className="text-[#1E293B] text-sm sm:text-base tracking-wide leading-tight line-clamp-2"
                style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600 }}
              >
                {photo.caption}
              </p>
            ) : (
              <p
                className="text-[#45152D]/85 text-[11px] sm:text-xs md:text-[13px] font-normal italic tracking-wide leading-snug line-clamp-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {photo.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
