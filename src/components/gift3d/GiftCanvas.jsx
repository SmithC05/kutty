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
 * The high-level canvas wrapper for the procedural 3D gift experience.
 * Manages WebGL support fallback, responsiveness, accessibility, and scene transition.
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
    // Ramp up golden transition glow to smoothly transition to HandwritingReveal
    setTransitionGlow(1);
    setTimeout(() => {
      if (onOpenComplete) onOpenComplete();
    }, 400);
  };

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (isOpening) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Dispatch click to trigger opening
      const canvasEl = canvasContainerRef.current?.querySelector('canvas');
      if (canvasEl) {
        canvasEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    }
  };

  if (!hasWebGL) {
    return (
      <CSSGiftFallback
        isOpening={isOpening}
        isIdleAnimating={isIdleAnimating}
        onOpenStart={onOpenStart}
        onOpenComplete={onOpenComplete}
      />
    );
  }

  return (
    <div
      ref={canvasContainerRef}
      tabIndex={0}
      role="button"
      aria-label="Birthday gift for Kutty - click or press Enter to open"
      onKeyDown={handleKeyDown}
      className={`relative w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] cursor-pointer select-none focus:outline-none ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
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

      {/* Warm Golden Glow Flash during scene transition */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full transition-opacity duration-700 blur-3xl"
        style={{
          opacity: transitionGlow,
          background: 'radial-gradient(circle, rgba(254,240,138,0.7) 0%, rgba(217,119,6,0.3) 50%, transparent 80%)',
        }}
      />
    </div>
  );
}
