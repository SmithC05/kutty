import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Screen Shell
 * 
 * Represents a full-viewport cinematic scene. Usually managed by AnimatePresence.
 */
export function Screen({ children, className, style, ...props }) {
  return (
    <div 
      className={cn("relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden flex flex-col items-center justify-center", className)}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
