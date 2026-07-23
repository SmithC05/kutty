import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Typography } from '../components/core/Typography';
import { Screen } from '../components/core/Screen';
import { useAudioController } from '../hooks/useAudioController';
import { useScene } from '../context/SceneContext';

/**
 * Birthday Journey (The Reveal)
 * The cinematic 3-2-1 countdown that explodes into the Birthday Greeting.
 */
export function BirthdayJourney() {
  const { playSfx, playTrack } = useAudioController();
  const { next } = useScene();
  
  const sceneRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Small delay to let the fade-in settle
      tl.to({}, { duration: 1 });

      // "3"
      tl.call(() => playSfx('heartbeat'));
      tl.fromTo('.count-3', 
        { opacity: 0, scale: 0.8, filter: 'blur(10px)' }, 
        { opacity: 1, scale: 1.1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }
      );
      tl.to('.count-3', { opacity: 0, scale: 1.2, filter: 'blur(10px)', duration: 0.5 }, "+=0.5");

      // "2"
      tl.call(() => playSfx('heartbeat'));
      tl.fromTo('.count-2', 
        { opacity: 0, scale: 0.8, filter: 'blur(10px)' }, 
        { opacity: 1, scale: 1.1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }
      );
      tl.to('.count-2', { opacity: 0, scale: 1.2, filter: 'blur(10px)', duration: 0.5 }, "+=0.5");

      // "1"
      tl.call(() => playSfx('heartbeat'));
      tl.fromTo('.count-1', 
        { opacity: 0, scale: 0.8, filter: 'blur(10px)' }, 
        { opacity: 1, scale: 1.1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }
      );
      tl.to('.count-1', { opacity: 0, scale: 1.2, filter: 'blur(10px)', duration: 0.3 }, "+=0.5");

      // The Pause
      tl.to({}, { duration: 0.4 });

      // The Explosion & Reveal
      tl.call(() => {
        playSfx('sparkle'); 
        playTrack('intro'); // or a more celebratory track if added to playlist.json
      });
      
      // Dramatic explosion of the "1" instead of screen flash
      tl.to('.count-1', { scale: 5, opacity: 0, filter: 'blur(20px)', duration: 0.8, ease: 'power2.inOut' });

      // Blurry background reveal
      tl.fromTo('.bg-reveal-image', 
        { opacity: 0, scale: 1.1, filter: 'blur(20px)' }, 
        { opacity: 0.8, scale: 1, filter: 'blur(0px)', duration: 2.5, ease: 'power2.out' },
        "-=0.5"
      );

      // "Happy Birthday" Reveal
      tl.fromTo('.birthday-title', 
        { opacity: 0, y: 50, filter: 'blur(20px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2.5, ease: 'power3.out' },
        "-=2.5"
      );

      // Fade out background and text
      tl.to('.bg-reveal-image', { opacity: 0, duration: 2, delay: 2 });
      tl.to(containerRef.current, { opacity: 0, duration: 2 }, "-=2");
      
      tl.call(() => next());
    }, sceneRef);
    
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen ref={sceneRef} className="bg-transparent transition-colors overflow-hidden">
      
      {/* Background Image Reveal */}
      <div className="bg-reveal-image absolute inset-0 w-full h-full opacity-0 pointer-events-none z-0">
        <img 
          src="/images/solo-photos/kutty1.jpeg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
        />
        <img 
          src="/images/solo-photos/kutty1.jpeg" 
          alt="Kutty" 
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        
        {/* Absolute stacking so they don't displace each other */}
        <Typography variant="countdown" className="count-3 absolute text-8xl md:text-9xl text-white/80 opacity-0">
          3
        </Typography>
        
        <Typography variant="countdown" className="count-2 absolute text-8xl md:text-9xl text-white/90 opacity-0">
          2
        </Typography>
        
        <Typography variant="countdown" className="count-1 absolute text-8xl md:text-9xl text-white opacity-0 text-glow">
          1
        </Typography>

        <div className="birthday-title absolute flex flex-col items-center space-y-6 opacity-0">
          <Typography 
            variant="h1" 
            className="text-glow text-center leading-tight"
            style={{ fontFamily: '"Alex Brush", "Dancing Script", cursive' }}
          >
            Happy Birthday<br/>Kutty ❤️
          </Typography>
          <Typography variant="body" className="text-white/60 tracking-widest uppercase text-sm">
            Have a wonderful day
          </Typography>
        </div>

      </div>
    </Screen>
  );
}
