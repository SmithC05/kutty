import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { preloaderEngine } from '../services/preloaderEngine';

const PreloadContext = createContext(null);

export function PreloadProvider({ children }) {
  const [preloadState, setPreloadState] = useState(() => preloaderEngine.getState());

  useEffect(() => {
    // Subscribe to preloader state updates
    const unsubscribe = preloaderEngine.subscribe((newState) => {
      setPreloadState(newState);
    });

    // Automatically trigger preload pipeline on initial mount
    if (preloaderEngine.status === 'idle') {
      preloaderEngine.start();
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      ...preloadState,
      retry: () => preloaderEngine.retry(),
    }),
    [preloadState]
  );

  return (
    <PreloadContext.Provider value={value}>
      {children}
    </PreloadContext.Provider>
  );
}

export function usePreload() {
  const context = useContext(PreloadContext);
  if (!context) {
    throw new Error('usePreload must be used within a PreloadProvider');
  }
  return context;
}
