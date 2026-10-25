import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  requestFullscreen,
  exitFullscreen,
  getFullscreenElement,
  isFullscreenSupported,
  addFullscreenChangeListener,
  addFullscreenErrorListener,
} from '../utils/fullscreen';

const FullscreenContext = createContext(null);

/**
 * FullscreenProvider
 * Manages full-screen state, listeners, and methods for the entire birthday experience.
 */
export function FullscreenProvider({ children }) {
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(getFullscreenElement()));
  const [isSupported] = useState(() => isFullscreenSupported());
  const [hasAttempted, setHasAttempted] = useState(false);

  // Listen for fullscreenchange and fullscreenerror across all browsers
  useEffect(() => {
    const unbindChange = addFullscreenChangeListener((isFs) => {
      setIsFullscreen(isFs);
    });

    const unbindError = addFullscreenErrorListener((err) => {
      console.info('[FullscreenContext] Fullscreen error intercepted:', err);
    });

    return () => {
      unbindChange();
      unbindError();
    };
  }, []);

  /**
   * Request fullscreen on the document or specified element.
   * Must be called within a user interaction handler.
   */
  const enterFullscreen = useCallback((element) => {
    setHasAttempted(true);
    if (!isFullscreenSupported()) {
      return Promise.resolve();
    }
    return requestFullscreen(element);
  }, []);

  /**
   * Exit fullscreen mode if active.
   */
  const exitFullscreenMode = useCallback(() => {
    return exitFullscreen();
  }, []);

  /**
   * Toggle between fullscreen and windowed mode.
   */
  const toggleFullscreen = useCallback((element) => {
    if (getFullscreenElement()) {
      return exitFullscreenMode();
    }
    return enterFullscreen(element);
  }, [enterFullscreen, exitFullscreenMode]);

  const value = {
    isFullscreen,
    isSupported,
    hasAttempted,
    enterFullscreen,
    exitFullscreen: exitFullscreenMode,
    toggleFullscreen,
  };

  return (
    <FullscreenContext.Provider value={value}>
      {children}
    </FullscreenContext.Provider>
  );
}

/**
 * Hook to access fullscreen state and controllers.
 */
export function useFullscreen() {
  const context = useContext(FullscreenContext);
  if (!context) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
}
