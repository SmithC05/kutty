import React, { forwardRef } from 'react';
import { GiftCanvas } from '../gift3d';

/**
 * GiftBox Component
 * Procedural real-time 3D interactive gift box built directly in Three.js / React Three Fiber.
 * Complies with strict asset rule: 0% image/texture dependency.
 * Fully animated assembly, floating idle, and multi-stage unwrapping sequence.
 */
export const GiftBox = forwardRef(({
  className = '',
  isIdleAnimating = false,
  isOpening = false,
  onOpenStart,
  onFreezeStart,
  onFreezeEnd,
  onOpenComplete
}, ref) => {
  return (
    <div ref={ref} className="relative flex items-center justify-center">
      <GiftCanvas
        className={className}
        isOpening={isOpening}
        isIdleAnimating={isIdleAnimating}
        onOpenStart={onOpenStart}
        onFreezeStart={onFreezeStart}
        onFreezeEnd={onFreezeEnd}
        onOpenComplete={onOpenComplete}
      />
    </div>
  );
});

GiftBox.displayName = 'GiftBox';
