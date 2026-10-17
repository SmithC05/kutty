import React, { useState, useEffect, useRef } from 'react';
import { useAudio, useScene } from '../context';
import { GiftBox } from '../components/ui/GiftBox';
import { Typography } from '../components/core/Typography';
import { Screen } from '../components/core/Screen';

/**
 * Opening Scene
 * The cinematic entrance to the birthday experience.
 * Features the procedural 3D gift assembly, idle "Alive" breathing,
 * background freeze on interaction, and cinematic unwrapping into the handwriting reveal.
 */
export function OpeningScene() {
  const { playTrack, playSfx } = useAudio();
  const { next, setIsBackgroundPaused } = useScene();

  const [isOpening, setIsOpening] = useState(false);
  const [isAliveState, setIsAliveState] = useState(false);
  
  const sceneRef = useRef(null);

  // The Gift "Alive" Attention Pulse (every 25 seconds)
  useEffect(() => {
    if (isOpening) return;

    const idleInterval = setInterval(() => {
      setIsAliveState(true);
      playSfx('sparkle');
      setTimeout(() => setIsAliveState(false), 2000);
    }, 25000);

    return () => clearInterval(idleInterval);
  }, [isOpening, playSfx]);

  const handleOpenStart = () => {
    if (isOpening) return;
    setIsOpening(true);
  };

  const handleFreezeStart = () => {
    // 1. The Freeze: background particles stop during the 0.2s suspense pause
    setIsBackgroundPaused(true);
  };

  const handleFreezeEnd = () => {
    // 2. Unfreeze background particles and trigger audio
    setIsBackgroundPaused(false);
    playSfx('heartbeat');
    playTrack('intro');
  };

  const handleOpenComplete = () => {
    // Proceed to Handwriting sequence
    next();
  };

  return (
    <Screen ref={sceneRef} className="bg-transparent transition-colors">
      <div className="z-10 flex flex-col items-center justify-center space-y-8 mt-6">
        <GiftBox 
          isIdleAnimating={isAliveState} 
          isOpening={isOpening}
          onOpenStart={handleOpenStart}
          onFreezeStart={handleFreezeStart}
          onFreezeEnd={handleFreezeEnd}
          onOpenComplete={handleOpenComplete}
        />
        
        {/* Subtle hint text that fades out upon interaction */}
        <div className={`transition-opacity duration-1000 ${isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <Typography variant="caption" className="animate-pulse opacity-50 tracking-[0.3em] uppercase">
            Awaits
          </Typography>
        </div>
      </div>
    </Screen>
  );
}
