import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Music2 } from 'lucide-react';

/**
 * Short music-app-style handoff into Kutty Radio.
 * A luminous record and equalizer replace the previous flower/bloom motif.
 */
export function SonicBloomTransition({ onComplete, reducedMotion = false }) {
  const containerRef = useRef(null);
  const discRef = useRef(null);
  const ringRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(() => onComplete?.(), 450);
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray('.kr-eq-bar', containerRef.current);
      const timeline = gsap.timeline({
        onComplete: () => onComplete?.(),
      });

      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(discRef.current, { scale: 0.35, opacity: 0, rotation: -24 });
      gsap.set(ringRef.current, { scale: 0.55, opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0, y: 14 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 10 });
      gsap.set(bars, { scaleY: 0.12, opacity: 0, transformOrigin: 'center bottom' });

      timeline
        .to(discRef.current, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.7,
          ease: 'back.out(1.3)',
        }, 0.08)
        .to(ringRef.current, {
          scale: 1.45,
          opacity: 0.65,
          duration: 0.8,
          ease: 'power2.out',
        }, 0.12)
        .to(bars, {
          scaleY: () => 0.35 + Math.random() * 0.9,
          opacity: 1,
          duration: 0.28,
          stagger: 0.055,
          repeat: 2,
          yoyo: true,
          ease: 'sine.inOut',
        }, 0.42)
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.58)
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.78)
        .to(containerRef.current, { opacity: 0, duration: 0.45, ease: 'power2.inOut' }, 2.05);
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[80] flex select-none flex-col items-center justify-center overflow-hidden bg-[#070810]"
      aria-label="Opening Kutty Radio"
      role="status"
    >
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(78,80,130,0.26), transparent 52%), radial-gradient(circle at 18% 82%, rgba(17,196,160,0.09), transparent 30%), radial-gradient(circle at 84% 18%, rgba(190,90,220,0.12), transparent 28%)' }} />

      <div
        ref={ringRef}
        className="absolute h-56 w-56 rounded-full border sm:h-72 sm:w-72"
        style={{ borderColor: 'rgba(255,255,255,0.15)', boxShadow: '0 0 85px rgba(163,230,53,0.10), inset 0 0 60px rgba(167,139,250,0.08)' }}
      />

      <div
        ref={discRef}
        className="relative grid h-32 w-32 place-items-center rounded-full border border-white/20 sm:h-40 sm:w-40"
        style={{
          background: 'conic-gradient(from 20deg, #19221e, #151626, #29203b, #121923, #19221e)',
          boxShadow: '0 0 60px rgba(163,230,53,0.12), inset 0 0 0 9px rgba(255,255,255,0.025), inset 0 0 0 18px rgba(255,255,255,0.02)',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-5 rounded-full border border-white/10 sm:inset-6" />
        <div className="absolute inset-10 rounded-full border border-white/10 sm:inset-12" />
        <div className="grid h-12 w-12 place-items-center rounded-full text-[#0c100b] sm:h-14 sm:w-14" style={{ background: 'linear-gradient(145deg, #d9f99d, #a3e635 62%, #8bd52b)' }}>
          <Music2 className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
      </div>

      <div className="mt-8 flex h-9 items-end justify-center gap-1.5" aria-hidden="true">
        {[18, 29, 14, 34, 22, 31, 16, 27, 12, 24, 33, 17, 28].map((height, index) => (
          <span
            key={index}
            className="kr-eq-bar block w-1.5 rounded-full sm:w-2"
            style={{
              height: `${height}px`,
              background: index % 3 === 0 ? '#a3e635' : index % 3 === 1 ? '#b7a4ff' : '#72e0cd',
              boxShadow: '0 0 14px rgba(163,230,53,0.18)',
            }}
          />
        ))}
      </div>

      <div ref={titleRef} className="mt-6 text-center text-lg font-extrabold uppercase tracking-[0.24em] text-white sm:text-xl">
        Kutty Radio
      </div>
      <p ref={subtitleRef} className="mt-2 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500 sm:text-[11px]">
        A playlist made just for you
      </p>
    </div>
  );
}
