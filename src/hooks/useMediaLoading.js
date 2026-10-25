import { useState, useEffect } from 'react';

/**
 * Media Engine
 * Preloads assets mapping and tracks loading progress (0-100).
 * Prevents FOUC (Flash of unstyled content) by ensuring critical assets are cached.
 */
export function useMediaLoading(assetList = []) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use a serialized key of asset URLs to prevent re-triggering when array reference changes
  const assetKey = Array.isArray(assetList) ? assetList.join('|') : '';

  useEffect(() => {
    const assets = assetKey ? assetKey.split('|').filter(Boolean) : [];
    if (assets.length === 0) {
      setIsLoaded(true);
      setProgress(100);
      return;
    }
    
    let loadedCount = 0;
    let isCancelled = false;
    const total = assets.length;

    // Safety timeout: ensure loader never hangs if an asset stalls
    const safetyTimeout = setTimeout(() => {
      if (!isCancelled) {
        setIsLoaded(true);
        setProgress(100);
      }
    }, 3500);

    const onAssetComplete = () => {
      if (isCancelled) return;
      loadedCount++;
      setProgress(Math.round((loadedCount / total) * 100));
      if (loadedCount >= total) {
        clearTimeout(safetyTimeout);
        setIsLoaded(true);
      }
    };

    assets.forEach((src) => {
      const img = new Image();
      img.onload = onAssetComplete;
      img.onerror = onAssetComplete;
      img.src = src;
    });

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimeout);
    };
  }, [assetKey]);

  return { progress, isLoaded };
}
