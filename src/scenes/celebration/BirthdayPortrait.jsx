import React, { forwardRef, useState } from 'react';

/**
 * BirthdayPortrait — Keerthana's Real Portrait Centerpiece
 * 
 * Animates her transparent cutout portrait rising from below the viewport
 * into the central pool of spotlight and fireworks.
 * 
 * Features:
 *  - Primary asset: /images/artworks/keerthana-finale-cutout.webp
 *  - Fallback asset: /images/solo-photos/kutty1.jpeg
 *  - Organic bottom gradient mask to blend dress hem onto the stage floor
 *  - Dual warm rim-lighting drop-shadows (amber + rose)
 *  - Responsive sizing tailored for desktop cinema and mobile intimacy
 */

const PRIMARY_PORTRAIT = '/images/artworks/keerthana-finale-cutout.webp';
const FALLBACK_PORTRAIT = '/images/solo-photos/kutty1.jpeg';

export const BirthdayPortrait = forwardRef(function BirthdayPortrait(
  {
    isFloating = true,
    className = '',
    style = {},
  },
  ref
) {
  const [imgSrc, setImgSrc] = useState(PRIMARY_PORTRAIT);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    if (imgSrc !== FALLBACK_PORTRAIT) {
      console.warn('[BirthdayPortrait] Primary cutout failed to load, falling back to original photo.');
      setImgSrc(FALLBACK_PORTRAIT);
    }
  };

  return (
    <div
      ref={ref}
      className={`relative flex items-end justify-center select-none pointer-events-none ${className}`}
      style={{
        zIndex: 20,
        ...style,
      }}
    >
      {/* Ground illumination beneath her feet / hem */}
      <div
        className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-3/4 h-24 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.35) 0%, rgba(244, 63, 94, 0.18) 50%, transparent 75%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Portrait Image Container */}
      <div
        className={`relative transition-transform duration-1000 ease-out ${
          isFloating ? 'animate-float' : ''
        }`}
        style={{
          // Softly fade the very bottom of the dress into the stage darkness
          maskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
        }}
      >
        <img
          src={imgSrc}
          alt="Keerthana — Birthday Portrait"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`h-auto object-contain transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            // Responsive constraints: tall and majestic on desktop, balanced on mobile
            maxHeight: 'min(80vh, 760px)',
            maxWidth: 'min(90vw, 540px)',
            // Golden & rose rim-light glow framing her silhouette
            filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.38)) drop-shadow(0 0 36px rgba(244, 63, 94, 0.22))',
          }}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
});
