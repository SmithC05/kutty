import { useState, useCallback } from 'react';
import { SCENES } from '../constants';
import { devMode } from '../config';

/**
 * Scene Engine
 * Orchestrates the cinematic scene flow without traditional routing.
 */
export function useSceneManager() {
  const [currentScene, setCurrentScene] = useState(devMode.enabled && devMode.startScene ? devMode.startScene : SCENES.LOADING);
  const [isBackgroundPaused, setIsBackgroundPaused] = useState(false);

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
      SCENES.DATE_AWARE,
      SCENES.SECRET_VAULT,
      SCENES.MEMORY_JOURNEY_SOLO,
      SCENES.MEMORY_JOURNEY_TOGETHER,
      SCENES.ARTIST_CHAPTER,
      SCENES.FINAL_MESSAGE
    ];
    const currentIndex = order.indexOf(currentScene);
    if (currentIndex >= 0 && currentIndex < order.length - 1) {
      const nextScene = order[currentIndex + 1];
      const implementedScenes = [
        SCENES.LOADING, 
        SCENES.HANDWRITING,
        SCENES.DATE_AWARE,
        SCENES.SECRET_VAULT,
        SCENES.MEMORY_JOURNEY_SOLO,
        SCENES.MEMORY_JOURNEY_TOGETHER,
        SCENES.ARTIST_CHAPTER,
      ];
      if (implementedScenes.includes(nextScene)) {
        preloadNext();
        transitionTo(nextScene);
      } else {
        console.info(`[SceneManager] "${nextScene}" is reserved for future phases. Staying on current scene to prevent blank render.`);
      }
    }
  }, [currentScene, transitionTo, preloadNext]);

  return { currentScene, transitionTo, next, isBackgroundPaused, setIsBackgroundPaused };
}
