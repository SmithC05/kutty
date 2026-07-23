import React from 'react';
import { motion } from 'framer-motion';

export function PhotoFrame({ photo, className, index }) {
  // Stagger the entrance animation based on the index in the chunk
  const delay = index * 0.3;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl bg-[#0a0a0a] shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_10px_rgba(255,255,255,0.05)] ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.95, rotate: (Math.random() - 0.5) * 4 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Blurred background layer to fill empty spaces */}
      <img
        src={photo.url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
        loading="lazy"
      />
      {/* The sharp foreground image */}
      <img
        src={photo.url}
        alt="Memory"
        className="absolute inset-0 w-full h-full object-contain"
        loading="lazy"
      />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

      {/* Film Grain Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Caption */}
      {photo.caption && (
        <motion.div
          className="absolute bottom-6 left-0 right-0 text-center px-4"
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: delay + 0.8 }}
        >
          <p 
            className="text-white/90 text-lg md:text-xl lg:text-2xl font-light italic tracking-wide drop-shadow-md"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {photo.caption}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
