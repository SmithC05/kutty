import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Graceful CSS 3D Gift Fallback
 * Used ONLY when WebGL is unavailable.
 * Completely code-generated with CSS 3D transforms, satin gold gradients, and physical panels.
 * Never uses PNG or image artwork.
 */
export function CSSGiftFallback({ isOpening, onOpenStart, onOpenComplete, isIdleAnimating }) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);
  const lidRef = useRef(null);
  const bowRef = useRef(null);
  const panelsRef = useRef(null);
  const glowRef = useRef(null);

  // Trigger assembly on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        scale: 0.6,
        opacity: 0,
        y: 40,
        duration: 1.8,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle unwrapping sequence
  const handleClick = () => {
    if (hasInteracted || isOpening) return;
    setHasInteracted(true);
    if (onOpenStart) onOpenStart();

    const tl = gsap.timeline({
      onComplete: () => {
        if (onOpenComplete) onOpenComplete();
      }
    });

    // 1. Tactile shrink & brief freeze
    tl.to(containerRef.current, { scale: 0.94, duration: 0.2, ease: 'power2.out' });
    tl.to(containerRef.current, { scale: 1, duration: 0.2, ease: 'power2.in' });

    // 2. Bow unbinds and flies up
    tl.to(bowRef.current, { y: -60, opacity: 0, scale: 1.3, duration: 0.8, ease: 'power2.out' }, '+=0.1');

    // 3. Wrapping panels fold outward
    tl.to(panelsRef.current, { scale: 1.15, opacity: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.5');

    // 4. Lid lifts up and rotates
    tl.to(lidRef.current, {
      y: -120,
      rotateZ: 22,
      rotateX: -20,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.inOut'
    }, '-=0.3');

    // 5. Golden light burst
    tl.to(glowRef.current, {
      opacity: 1,
      scale: 3.5,
      duration: 1.2,
      ease: 'power2.out'
    }, '-=0.8');

    // 6. Camera zoom and fade transition
    tl.to(containerRef.current, {
      scale: 2.2,
      opacity: 0,
      duration: 1.0,
      ease: 'power2.inOut'
    }, '-=0.4');
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Birthday gift for Kutty - click or press Enter to open"
      className="relative w-64 h-64 md:w-72 md:h-72 cursor-pointer select-none focus:outline-none flex items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      {/* Gentle Floating CSS 3D Box Container */}
      <div
        className={`relative w-48 h-48 transition-transform duration-700 ${
          isIdleAnimating ? 'animate-pulse scale-105' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-18deg) rotateY(28deg)',
        }}
      >
        {/* Soft Contact Shadow beneath */}
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-16 rounded-full bg-black/60 blur-xl pointer-events-none"
        />

        {/* Box Base (Royal Navy with Satin Gold Trim) */}
        <div
          className="absolute inset-0 rounded-2xl border border-amber-400/30 shadow-[0_20px_60px_rgba(0,10,30,0.8)] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0b1a30 0%, #060e1c 100%)',
          }}
        >
          {/* Base Satin Gold Vertical Ribbon */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-9 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
          {/* Base Satin Gold Horizontal Ribbon */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-9 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
        </div>

        {/* Wrapping Paper Panels (Folds away upon click) */}
        <div ref={panelsRef} className="absolute inset-0 pointer-events-none rounded-2xl border border-blue-400/20 bg-blue-950/40 backdrop-blur-xs" />

        {/* Inner Golden Glow (Burst on open) */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-full opacity-0 pointer-events-none blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(254,240,138,0.95) 0%, rgba(245,158,11,0.6) 50%, transparent 80%)',
          }}
        />

        {/* Box Lid */}
        <div
          ref={lidRef}
          className="absolute -top-3 -left-3 -right-3 h-14 rounded-2xl border border-amber-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
          style={{
            background: 'linear-gradient(135deg, #0d213d 0%, #081324 100%)',
          }}
        >
          {/* Lid Ribbon Cross */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-9 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500" />
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-9 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500" />

          {/* 3D Decorative Bow */}
          <div ref={bowRef} className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center justify-center">
            {/* Center knot */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 shadow-[0_0_12px_rgba(251,191,36,0.6)] z-10" />

            {/* Ribbon Loops */}
            <div className="absolute -left-6 -top-2 w-8 h-10 rounded-full border-4 border-amber-300 -rotate-45 shadow-sm" />
            <div className="absolute -right-6 -top-2 w-8 h-10 rounded-full border-4 border-amber-300 rotate-45 shadow-sm" />
            <div className="absolute -left-5 top-1 w-7 h-8 rounded-full border-4 border-amber-400 -rotate-15 shadow-sm" />
            <div className="absolute -right-5 top-1 w-7 h-8 rounded-full border-4 border-amber-400 rotate-15 shadow-sm" />

            {/* Ribbon Tails */}
            <div className="absolute top-4 -left-4 w-4 h-9 border-l-4 border-b-4 border-amber-400 rotate-12 rounded-bl-xl" />
            <div className="absolute top-4 -right-4 w-4 h-9 border-r-4 border-b-4 border-amber-400 -rotate-12 rounded-br-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
