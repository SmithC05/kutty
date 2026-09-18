import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Typography } from '../components/core/Typography';
import { useScene } from '../context/SceneContext';
import { SCENES } from '../constants';

/**
 * Handwritten Cinematic Reveal
 * Plays directly after the gift opens, before the countdown.
 */
export function HandwritingReveal() {
  const { next } = useScene();
  const containerRef = useRef(null);
  const dearRef = useRef(null);
  const kuttyRef = useRef(null);

  useEffect(() => {
    // Use gsap.context to ensure cleanup and scoping in React Strict Mode
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          next();
        }
      });

      // 1. Brief pause after gift opens
      tl.to({}, { duration: 0.5 });

      // 2. "Dear..." fades and slowly masks in like ink
      tl.fromTo(dearRef.current, 
        { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, 
        { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power2.inOut' }
      );
      
      // Pause
      tl.to({}, { duration: 0.5 });

      // Fade out "Dear..."
      tl.to(dearRef.current, { opacity: 0, duration: 0.8, filter: 'blur(4px)' });
      
      // Quick Pause
      tl.to({}, { duration: 0.2 });

      // 3. "Kutty" written in ink
      tl.fromTo(kuttyRef.current, 
        { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, 
        { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power2.inOut' }
      );
      
      // Hold "Kutty"
      tl.to({}, { duration: 1.2 });
      
      // Fade out "Kutty"
      tl.to(containerRef.current, { opacity: 0, duration: 1 });
    }, containerRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, [next]);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="relative">
        <Typography 
          ref={dearRef}
          variant="h2" 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-white/80"
        >
          For...
        </Typography>
        
        <Typography 
          ref={kuttyRef}
          variant="h1" 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-blue-200"
        >
          Kutty
        </Typography>
      </div>
    </div>
  );
}
