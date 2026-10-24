import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Disc3 } from 'lucide-react';

/**
 * SonicBloomTransition
 *
 * Short, sleek opening transition into Kutty Radio (~1.1 seconds).
 * Features a subtle spinning vinyl disc motif with equalizer pulses and
 * dissolves smoothly into the after-hours listening room.
 */
export function SonicBloomTransition({ onComplete, reducedMotion = false }) {
  const containerRef = useRef(null);
  const discRef = useRef(null);
  const ringRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(() => onComplete?.(), 280);
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray('.kr-eq-bar', containerRef.current);
      const timeline = gsap.timeline({
        onComplete: () => onComplete?.(),
      });

      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(discRef.current, { scale: 0.5, opacity: 0, rotation: -40 });
      gsap.set(ringRef.current, { scale: 0.6, opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0, y: 10 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 8 });
      gsap.set(bars, { scaleY: 0.15, opacity: 0, transformOrigin: 'center bottom' });

      timeline
        .to(discRef.current, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.45,
          ease: 'power2.out',
        }, 0.05)
        .to(ringRef.current, {
          scale: 1.35,
          opacity: 0.5,
          duration: 0.5,
          ease: 'power2.out',
        }, 0.1)
        .to(bars, {
          scaleY: () => 0.4 + Math.random() * 0.8,
          opacity: 0.9,
          duration: 0.2,
          stagger: 0.03,
          repeat: 1,
          yoyo: true,
          ease: 'sine.inOut',
        }, 0.25)
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.35)
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.45)
        .to(containerRef.current, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 1.05);
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[80] flex select-none flex-col items-center justify-center overflow-hidden bg-[#090b10]"
      aria-label="Entering Kutty Radio"
      role="status"
    >
      {/* Diffused stage light backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(163,230,53,0.08) 0%, rgba(192,132,252,0.06) 42%, #090b10 85%)',
        }}
      />

      {/* Concentric sound ring */}
      <div
        ref={ringRef}
        className="absolute h-52 w-52 rounded-full border sm:h-64 sm:w-64"
        style={{
          borderColor: 'rgba(163,230,53,0.22)',
          boxShadow: '0 0 60px rgba(163,230,53,0.12), inset 0 0 40px rgba(192,132,252,0.08)',
        }}
      />

      {/* Vinyl Disc motif */}
      <div
        ref={discRef}
        className="relative grid h-28 w-28 place-items-center rounded-full border border-white/15 sm:h-36 sm:w-36"
        style={{
          background: 'conic-gradient(from 45deg, #12151c, #1a1e28, #141720, #202636, #12151c)',
          boxShadow:
            '0 0 45px rgba(163,230,53,0.15), inset 0 0 0 8px rgba(255,255,255,0.025), inset 0 0 0 16px rgba(255,255,255,0.02)',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-4 rounded-full border border-white/10 sm:inset-5" />
        <div className="absolute inset-8 rounded-full border border-white/10 sm:inset-10" />
        <div
          className="grid h-10 w-10 place-items-center rounded-full text-[#0a0d08] sm:h-12 sm:w-12 shadow-md"
          style={{ background: 'linear-gradient(135deg, #bef264, #a3e635 70%, #84cc16)' }}
        >
          <Disc3 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      {/* Audio spectrum bars */}
      <div className="mt-6 flex h-7 items-end justify-center gap-1.5" aria-hidden="true">
        {[14, 24, 12, 28, 18, 26, 15, 22, 10, 20, 27, 14, 23].map((height, index) => (
          <span
            key={index}
            className="kr-eq-bar block w-1.5 rounded-full"
            style={{
              height: `${height}px`,
              background: index % 2 === 0 ? '#a3e635' : '#c084fc',
              boxShadow: '0 0 10px rgba(163,230,53,0.15)',
            }}
          />
        ))}
      </div>

      {/* Wordmark */}
      <div ref={titleRef} className="mt-5 text-center text-lg font-bold tracking-[0.25em] text-white sm:text-xl font-['Manrope']">
        KUTTY RADIO
      </div>
      <p ref={subtitleRef} className="mt-1.5 text-center text-[10px] font-medium tracking-[0.2em] text-slate-400 uppercase">
        After-Hours Listening Room
      </p>
    </div>
  );
}
