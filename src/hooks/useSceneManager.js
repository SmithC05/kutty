import { useState, useCallback, useEffect } from 'react';
import { SCENES } from '../constants';
import { devMode } from '../config';

/**
 * Scene Engine
 * Orchestrates the cinematic scene flow without traditional routing.
 */
export function useSceneManager() {
  const getInitialScene = () => {
    if (devMode.enabled && devMode.startScene) {
      return devMode.startScene;
    }
    // Initial entrance is always the 3D Gift Box for both Advance Journey and Birthday Journey
    return SCENES.LOADING;
  };

  const [currentScene, setCurrentScene] = useState(getInitialScene);
  const [isDevUnlocked, setIsDevUnlocked] = useState(false);
  const [isBackgroundPaused, setIsBackgroundPaused] = useState(false);
  const [hasCompletedCelebrationIntro, setHasCompletedCelebrationIntro] = useState(false);

  // Developer unlock listener: when unlocked in Advance Journey, restart from the gift box
  useEffect(() => {
    const handleUnlock = () => {
      setIsDevUnlocked(true);
      setCurrentScene(SCENES.LOADING);
    };
    window.addEventListener('developer-unlock', handleUnlock);
    return () => window.removeEventListener('developer-unlock', handleUnlock);
  }, []);

  const transitionTo = useCallback((newScene) => {
    // Allows us to intercept GSAP page transitions before React unmounts
    setCurrentScene(newScene);
  }, []);

  const preloadNext = useCallback(() => {
    // Concept: reads the next scene in the order array and triggers Media Engine early
    console.log("Preloading assets for next scene...");
  }, []);

  const next = useCallback(() => {
    const order = [
      SCENES.LOADING, 
      SCENES.HANDWRITING,
      SCENES.BIRTHDAY_REVEAL,
      SCENES.SECRET_VAULT,
      SCENES.LORD_SHIVA_BLESSING,
      SCENES.MEMORY_JOURNEY_SOLO,
      SCENES.ARTIST_CHAPTER,
      SCENES.SONIC_BLOOM,
      SCENES.MEMORY_JOURNEY_TOGETHER,
      SCENES.WHO_IS_SHE_TO_ME,
      SCENES.FINAL_MESSAGE
    ];
    // Normalize aliases like DATE_AWARE
    const activeScene = currentScene === SCENES.DATE_AWARE ? SCENES.BIRTHDAY_REVEAL : currentScene;
    const currentIndex = order.indexOf(activeScene);
    if (currentIndex >= 0 && currentIndex < order.length - 1) {
      const nextScene = order[currentIndex + 1];
      preloadNext();
      transitionTo(nextScene);
    }
  }, [currentScene, transitionTo, preloadNext]);

  return { 
    currentScene, 
    transitionTo, 
    next, 
    isBackgroundPaused, 
    setIsBackgroundPaused,
    hasCompletedCelebrationIntro,
    setHasCompletedCelebrationIntro,
    isDevUnlocked
  };
}
