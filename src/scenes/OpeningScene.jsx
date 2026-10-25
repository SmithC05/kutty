import React, { useState, useEffect, useRef } from 'react';
import { useAudio, useScene, useTime, useFullscreen, usePreload } from '../context';
import { SCENES } from '../constants';
import { devMode } from '../config';
import { GiftBox } from '../components/ui/GiftBox';
import { PreloadProgress } from '../components/ui/PreloadProgress';

/**
 * Opening Scene
 * The cinematic entrance to the birthday experience.
 * Features a full-screen procedural 3D gift assembly, continuous 21s rotation,
 * background freeze on interaction, genuine asset preloading in parallel,
 * and cinematic unwrapping into the handwriting reveal only once all required
 * assets are verified and ready.
 */
export function OpeningScene() {
  const { playTrack, playSfx } = useAudio();
  const { transitionTo, setIsBackgroundPaused, isDevUnlocked } = useScene();
  const { enterFullscreen } = useFullscreen();
  const { isReady } = usePreload();
  const timeState = useTime();

  const [isOpening, setIsOpening] = useState(false);
  const [isAliveState, setIsAliveState] = useState(false);

  const sceneRef = useRef(null);
  const hasCompletedAnimationRef = useRef(false);
  const hasTransitionedRef = useRef(false);

  const isBirthdayUnlocked = Boolean(
    timeState?.isUnlocked || isDevUnlocked || (devMode.enabled && devMode.bypassDate)
  );

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

    // Request true fullscreen directly within this initial deliberate user interaction
    enterFullscreen();
  };

  const handleFreezeStart = () => {
    // 1. The Freeze: background particles stop during the 0.2s suspense pause
    setIsBackgroundPaused(true);
  };

  const handleFreezeEnd = () => {
    // 2. Unfreeze background particles and trigger audio
    setIsBackgroundPaused(false);
    playSfx('heartbeat');
    // Advance journey plays intro.mp3; birthday journey (or dev unlocked) plays remo.mp3
    if (isBirthdayUnlocked) {
      playTrack('remo');
    } else {
      playTrack('intro');
    }
  };

  const handleOpenComplete = () => {
    hasCompletedAnimationRef.current = true;
    // Strict Gate: Do not proceed into the handwriting sequence until all assets are ready
    if (isReady && !hasTransitionedRef.current) {
      hasTransitionedRef.current = true;
      transitionTo(SCENES.HANDWRITING);
    }
  };

  // If the user opened the gift before preloading finished, transition automatically as soon as ready
  useEffect(() => {
    if (isReady && hasCompletedAnimationRef.current && !hasTransitionedRef.current) {
      hasTransitionedRef.current = true;
      transitionTo(SCENES.HANDWRITING);
    }
  }, [isReady, transitionTo]);

  return (
    <div 
      ref={sceneRef} 
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden select-none z-10"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
      }}
    >
      {/* Genuinely Full-Screen 3D Gift Canvas */}
      <GiftBox 
        isIdleAnimating={isAliveState} 
        isOpening={isOpening}
        onOpenStart={handleOpenStart}
        onFreezeStart={handleFreezeStart}
        onFreezeEnd={handleFreezeEnd}
        onOpenComplete={handleOpenComplete}
      />
      
      {/* Restrained preload progress and readiness hint */}
      <PreloadProgress isOpening={isOpening} />
    </div>
  );
}
