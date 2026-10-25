import React, { forwardRef } from 'react';
import { GiftCanvas } from '../gift3d';

/**
 * GiftBox Component
 * Luxury procedural 3D real-time presentation built directly in Three.js / React Three Fiber.
 * Fills the full viewport for a truly cinematic motion-design opening sequence.
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
    <div ref={ref} className="fixed inset-0 w-full h-full">
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
