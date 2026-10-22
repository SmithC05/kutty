import React, { useState, useEffect, useRef } from 'react';
import { useAudio, useScene, useTime } from '../context';
import { devMode } from '../config';
import { GiftBox } from '../components/ui/GiftBox';
import { Typography } from '../components/core/Typography';

/**
 * Opening Scene
 * The cinematic entrance to the birthday experience.
 * Features a full-screen procedural 3D gift assembly, continuous 21s rotation,
 * background freeze on interaction, and cinematic unwrapping into the handwriting reveal.
 */
export function OpeningScene() {
  const { playTrack, playSfx } = useAudio();
  const { next, setIsBackgroundPaused } = useScene();
  const timeState = useTime();

  const [isOpening, setIsOpening] = useState(false);
  const [isAliveState, setIsAliveState] = useState(false);
  const [isDevUnlocked, setIsDevUnlocked] = useState(false);

  const sceneRef = useRef(null);

  useEffect(() => {
    const handleUnlock = () => setIsDevUnlocked(true);
    window.addEventListener('developer-unlock', handleUnlock);
    return () => window.removeEventListener('developer-unlock', handleUnlock);
  }, []);

  const isBirthdayRoute =
    timeState.isUnlocked || isDevUnlocked || (devMode.enabled && devMode.bypassDate);

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
    // Start remo.mp3 on user gift interaction strictly on the birthday route
    if (isBirthdayRoute) {
      playTrack('remo');
    }
  };

  const handleOpenComplete = () => {
    // Proceed to Handwriting sequence
    next();
  };

  return (
    <div ref={sceneRef} className="fixed inset-0 w-full h-[100dvh] overflow-hidden select-none z-10">
      {/* Genuinely Full-Screen 3D Gift Canvas */}
      <GiftBox 
        isIdleAnimating={isAliveState} 
        isOpening={isOpening}
        onOpenStart={handleOpenStart}
        onFreezeStart={handleFreezeStart}
        onFreezeEnd={handleFreezeEnd}
        onOpenComplete={handleOpenComplete}
      />
      
      {/* Subtle hint text positioned cleanly at the bottom */}
      <div className={`absolute bottom-10 sm:bottom-14 left-0 right-0 flex justify-center pointer-events-none z-20 transition-opacity duration-1000 ${isOpening ? 'opacity-0' : 'opacity-100'}`}>
        <Typography variant="caption" className="animate-pulse opacity-75 tracking-wider normal-case text-xs sm:text-sm text-blue-200/90 font-medium">
          Your surprise is waiting, Kutty. 💝
        </Typography>
      </div>
    </div>
  );
}
