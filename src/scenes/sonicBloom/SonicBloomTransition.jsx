import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * SonicBloomTransition
 * 
 * Cinematic 2.5s transition bridging the birthday celebration and Sonic Bloom:
 *  1. Celebration softens
 *  2. A single luminous particle remains in centre
 *  3. Particle stretches into a flowing, multicoloured sound filament
 *  4. Filament curves and blooms into a six-petal outline
 *  5. Seamlessly dissolves as the 3D sculpture materializes
 */
export function SonicBloomTransition({ onComplete, reducedMotion = false }) {
  const containerRef = useRef(null);
  const particleRef = useRef(null);
  const filamentRef = useRef(null);
  const petalOutlineRef = useRef(null);
  const glowAuraRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      // Respect prefers-reduced-motion: clean, brief crossfade
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 700);
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      // Initial state
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(particleRef.current, { scale: 0, opacity: 0 });
      gsap.set(filamentRef.current, { scaleX: 0, scaleY: 1, opacity: 0 });
      gsap.set(petalOutlineRef.current, { scale: 0.6, opacity: 0, rotation: -30 });
      gsap.set(glowAuraRef.current, { scale: 0.3, opacity: 0 });

      // Step 1 & 2: Single luminous particle coalesces at center (0.0s -> 0.7s)
      tl.to(particleRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      }, 0.1)
      .to(glowAuraRef.current, {
        scale: 1,
        opacity: 0.65,
        duration: 0.7,
        ease: 'power2.out',
      }, 0.1)

      // Step 3: Particle stretches into a flowing sound filament (0.7s -> 1.4s)
      .to(particleRef.current, {
        scale: 0.3,
        opacity: 0.5,
        duration: 0.4,
        ease: 'power1.in',
      }, 0.7)
      .to(particleRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      }, 1.1)
      .to(filamentRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 0.65,
        ease: 'power2.out',
      }, 0.75)

      // Step 4: Filament curves and forms six-petal outline (1.3s -> 2.1s)
      .to(filamentRef.current, {
        opacity: 0,
        scaleY: 2.2,
        duration: 0.5,
        ease: 'power2.in',
      }, 1.3)
      .to(petalOutlineRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'back.out(1.2)',
      }, 1.4)
      .to(glowAuraRef.current, {
        scale: 1.6,
        opacity: 0.85,
        duration: 0.7,
        ease: 'power1.out',
      }, 1.4)

      // Step 5: Transition into the new indigo sonic environment (2.1s -> 2.6s)
      .to(petalOutlineRef.current, {
        scale: 1.25,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      }, 2.1)
      .to(glowAuraRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      }, 2.1)
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.55,
        ease: 'power2.inOut',
      }, 2.2)
      .set(containerRef.current, { display: 'none' }, 2.75);

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#03050c] pointer-events-none select-none transition-opacity"
    >
      {/* Background Volumetric Indigo / Cyan Radial Glow */}
      <div
        ref={glowAuraRef}
        className="absolute w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-600/25 to-pink-500/15 blur-3xl"
      />

      {/* 1. Single Central Luminous Particle */}
      <div
        ref={particleRef}
        className="absolute w-5 h-5 rounded-full bg-cyan-200 shadow-[0_0_30px_#00f0ff,0_0_60px_#8b5cf6]"
      />

      {/* 2. Flowing Multicolored Sound Filament */}
      <div
        ref={filamentRef}
        className="absolute w-48 sm:w-72 h-[3px] rounded-full bg-gradient-to-r from-transparent via-cyan-400 via-violet-400 to-transparent shadow-[0_0_20px_#00f0ff]"
      />

      {/* 3. Blooming Six-Petal Outline (SVG) */}
      <div ref={petalOutlineRef} className="absolute w-64 h-64 sm:w-80 sm:h-80">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ff6363" stopOpacity="0.7" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 6 Radial Petal Loops */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <path
              key={deg}
              d="M 100 100 C 80 50, 80 20, 100 15 C 120 20, 120 50, 100 100"
              fill="none"
              stroke="url(#petalGrad)"
              strokeWidth="2.2"
              filter="url(#glow)"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}

          {/* Center node */}
          <circle cx="100" cy="100" r="5" fill="#ffffff" filter="url(#glow)" />
        </svg>
      </div>
    </div>
  );
}
