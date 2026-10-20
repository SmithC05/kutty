import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * PhotoFrame Component
 * 
 * Supports two distinct visual worlds:
 * 1. 'journal' (Chapter 1: Just You) — Warm ivory editorial portrait frame, embossed paper shadow,
 *    subtle blush/rose tones, Playfair Display italic typography.
 * 2. 'scrapbook' (Chapter 2: Us) — Authentic Polaroid instant-print, washi tape accent,
 *    warm paper cream, Dancing Script handwritten typography.
 */
export function PhotoFrame({ 
  photo, 
  className = '', 
  index = 0, 
  variant = 'journal',
  tapeColor = 'rgba(254, 243, 199, 0.85)', // Washi tape color for scrapbook
  tilt = 0, // Optional slight rotation in degrees
  showStagePill = false,
}) {
  const [imgError, setImgError] = useState(false);
  const delay = index * 0.25;

  const isScrapbook = variant === 'scrapbook';

  return (
    <motion.div
      className={`relative select-none flex flex-col ${className}`}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transformOrigin: 'center center',
      }}
    >
      {/* ── Scrapbook Washi Tape Accent ── */}
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

      {/* ── Main Frame Outer Shell ── */}
      <div
        className={`relative w-full h-full overflow-hidden flex flex-col ${
          isScrapbook
            ? 'bg-[#FFFDF9] p-3 pb-8 rounded-sm shadow-[0_12px_28px_rgba(30,41,59,0.14),0_2px_6px_rgba(0,0,0,0.04)] border border-[#E2E8F0]/50'
            : 'bg-[#FFFDF9] p-2.5 sm:p-3.5 rounded-2xl shadow-[0_16px_38px_-8px_rgba(69,21,45,0.14),0_3px_10px_rgba(0,0,0,0.04)] border border-[#F5B8A8]/30'
        }`}
      >
        {/* Stage Pill Tag for Editorial Journal */}
        {!isScrapbook && showStagePill && photo.stageTitle && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-[#FAF7F2]/90 text-[#8B4860] border border-[#F5B8A8]/40 shadow-sm backdrop-blur-sm"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {photo.stageTitle}
            </span>
          </div>
        )}

        {/* ── Photo Container with aspect preservation ── */}
        <div className="relative w-full flex-1 overflow-hidden rounded-lg bg-[#FAF7F2] min-h-0 flex items-center justify-center">
          {!imgError ? (
            <>
              {/* Soft ambient background blur to gracefully fill non-matching aspect ratio */}
              <img
                src={photo.url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-md opacity-20 scale-105 pointer-events-none"
                loading="lazy"
                onError={() => setImgError(true)}
              />
              {/* Primary sharp photo respecting natural aspect ratio */}
              <img
                src={photo.url}
                alt={photo.caption || 'Memory'}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F2]">
              <span className="text-3xl mb-1.5 opacity-60">📷</span>
              <span
                className="text-[11px] uppercase tracking-[0.2em] text-[#8B4860] font-medium"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Memory Captured
              </span>
            </div>
          )}

          {/* Delicate warm vignette gradient for editorial journal */}
          {!isScrapbook && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/80 via-transparent to-transparent pointer-events-none opacity-40" />
          )}

          {/* Subtle paper grain texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* ── Caption Rendering ── */}
        {photo.caption && (
          <div
            className={`mt-2.5 px-2 text-center flex flex-col items-center justify-center shrink-0 ${
              isScrapbook ? 'pt-1.5' : 'pb-1'
            }`}
          >
            {isScrapbook ? (
              // Scrapbook Handwritten Caption
              <p
                className="text-[#1E293B] text-base sm:text-lg tracking-wide leading-tight"
                style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600 }}
              >
                {photo.caption}
              </p>
            ) : (
              // Editorial Journal Serif Italic Caption
              <p
                className="text-[#45152D] text-sm sm:text-base md:text-lg font-normal italic tracking-wide"
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
