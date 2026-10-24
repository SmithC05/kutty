import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { GiftScene3D } from './GiftScene3D';
import { CSSGiftFallback } from './CSSGiftFallback';

/**
 * Check if WebGL is supported in the current environment
 */
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * GiftCanvas
 * Genuinely full-screen WebGL canvas wrapper for the procedural 3D gift experience.
 * Fills the full browser viewport, supports mouse/touch/keyboard, responsive camera,
 * and seamless full-screen cinematic transition to HandwritingReveal.
 */
export function GiftCanvas({
  isOpening = false,
  isIdleAnimating = false,
  onOpenStart,
  onFreezeStart,
  onFreezeEnd,
  onOpenComplete,
  className = ''
}) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [transitionGlow, setTransitionGlow] = useState(0);
  const canvasContainerRef = useRef(null);

  // Check WebGL availability on mount
  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleOpenCompleteInternal = () => {
    // Ramp up radiant full-screen golden wash to lead seamlessly into HandwritingReveal
    setTransitionGlow(1);
    setTimeout(() => {
      if (onOpenComplete) onOpenComplete();
    }, 450);
  };

  // Keyboard accessibility (Space or Enter opens gift)
  const handleKeyDown = (e) => {
    if (isOpening) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const canvasEl = canvasContainerRef.current?.querySelector('canvas');
      if (canvasEl) {
        canvasEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    }
  };

  if (!hasWebGL) {
    return (
      <div className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center">
        <CSSGiftFallback
          isOpening={isOpening}
          isIdleAnimating={isIdleAnimating}
          onOpenStart={onOpenStart}
          onFreezeEnd={onFreezeEnd}
          onOpenComplete={onOpenComplete}
        />
      </div>
    );
  }

  return (
    <div
      ref={canvasContainerRef}
      tabIndex={0}
      role="button"
      aria-label="Birthday gift for Kutty - click or press Enter to open"
      onKeyDown={handleKeyDown}
      className={`fixed inset-0 w-full h-[100dvh] cursor-pointer select-none focus:outline-none overflow-hidden ${className}`}
    >
      <Canvas
        camera={{ position: [0, 1.25, 5.6], fov: 42 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full block"
      >
        <GiftScene3D
          isOpening={isOpening}
          isIdleAnimating={isIdleAnimating}
          onOpenStart={onOpenStart}
          onFreezeStart={onFreezeStart}
          onFreezeEnd={onFreezeEnd}
          onOpenComplete={handleOpenCompleteInternal}
          reducedMotion={prefersReducedMotion}
        />
      </Canvas>

      {/* Screen-Wide Warm Golden Glow Veil during scene transition */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-700 z-30"
        style={{
          opacity: transitionGlow,
          background: 'radial-gradient(circle at center, rgba(254,240,138,0.92) 0%, rgba(217,119,6,0.55) 50%, rgba(13,27,51,0.95) 100%)',
        }}
      />
    </div>
  );
}
