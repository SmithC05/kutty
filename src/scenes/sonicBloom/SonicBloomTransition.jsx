import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Disc3 } from 'lucide-react';

/**
 * SonicBloomTransition — Refined intro into Kutty Radio (~1.1 seconds)
 *
 * Displays clean equalizer pulses, subtle vinyl disc, and reveals "Kutty Radio"
 * in Outfit typography before smoothly dissolving into the interface.
 */
export function SonicBloomTransition({ onComplete, reducedMotion = false }) {
  const containerRef = useRef(null);
  const discRef = useRef(null);
  const ringRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(() => onComplete?.(), 250);
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray('.kr-eq-bar', containerRef.current);
      const timeline = gsap.timeline({
        onComplete: () => onComplete?.(),
      });

      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(discRef.current, { scale: 0.6, opacity: 0, rotation: -30 });
      gsap.set(ringRef.current, { scale: 0.7, opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0, y: 8 });
      gsap.set(bars, { scaleY: 0.2, opacity: 0, transformOrigin: 'center bottom' });

      timeline
        .to(discRef.current, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.4,
          ease: 'power2.out',
        }, 0.05)
        .to(ringRef.current, {
          scale: 1.3,
          opacity: 0.45,
          duration: 0.45,
          ease: 'power2.out',
        }, 0.1)
        .to(bars, {
          scaleY: () => 0.4 + Math.random() * 0.7,
          opacity: 0.9,
          duration: 0.18,
          stagger: 0.025,
          repeat: 1,
          yoyo: true,
          ease: 'sine.inOut',
        }, 0.2)
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.3)
        .to(containerRef.current, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 1.0);
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[80] flex select-none flex-col items-center justify-center overflow-hidden bg-[#090b10] font-['DM_Sans',sans-serif]"
      aria-label="Entering Kutty Radio"
      role="status"
    >
      {/* Diffused backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(163,230,53,0.07) 0%, rgba(192,132,252,0.05) 45%, #090b10 85%)',
        }}
      />

      {/* Concentric sound ring */}
      <div
        ref={ringRef}
        className="absolute h-48 w-48 rounded-full border sm:h-60 sm:w-60"
        style={{
          borderColor: 'rgba(163,230,53,0.20)',
          boxShadow: '0 0 50px rgba(163,230,53,0.10)',
        }}
      />

      {/* Vinyl Disc motif */}
      <div
        ref={discRef}
        className="relative grid h-24 w-24 place-items-center rounded-full border border-white/15 sm:h-32 sm:w-32"
        style={{
          background: 'conic-gradient(from 45deg, #12151c, #1a1e28, #141720, #202636, #12151c)',
          boxShadow:
            '0 0 35px rgba(163,230,53,0.12), inset 0 0 0 6px rgba(255,255,255,0.025)',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-3 rounded-full border border-white/10 sm:inset-4" />
        <div
          className="grid h-9 w-9 place-items-center rounded-full text-[#0a0d08] sm:h-11 sm:w-11 shadow-md"
          style={{ background: 'linear-gradient(135deg, #bef264, #a3e635 70%, #84cc16)' }}
        >
          <Disc3 className="h-5 w-5 sm:h-5 sm:w-5 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      {/* Audio spectrum bars */}
      <div className="mt-5 flex h-6 items-end justify-center gap-1.5" aria-hidden="true">
        {[12, 22, 10, 26, 16, 24, 14, 20, 9, 18, 25, 12, 21].map((height, index) => (
          <span
            key={index}
            className="kr-eq-bar block w-1.5 rounded-full"
            style={{
              height: `${height}px`,
              background: index % 2 === 0 ? '#a3e635' : '#c084fc',
              boxShadow: '0 0 8px rgba(163,230,53,0.12)',
            }}
          />
        ))}
      </div>

      {/* Wordmark */}
      <div
        ref={titleRef}
        className="mt-4 text-center text-xl font-bold tracking-[0.2em] text-white font-['Outfit',sans-serif] sm:text-2xl"
      >
        KUTTY RADIO
      </div>
    </div>
  );
}
