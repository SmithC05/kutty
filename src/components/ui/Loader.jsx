import React from 'react';
import { cn } from '../../utils/cn';
import { Typography } from '../core/Typography';

/**
 * Reusable Loader Shell
 * Provides the cinematic dark loading screen while assets are fetched.
 */
export function Loader({ progress = 0, className }) {
  return (
    <div className={cn("fixed inset-0 bg-background flex flex-col items-center justify-center z-50", className)}>
      {/* 
        Future: Add Framer Motion to fade this out smoothly when progress hits 100 
      */}
      <div className="w-12 h-12 rounded-full border-t-2 border-blue-200 animate-spin mb-8"></div>
      <Typography variant="caption" className="animate-pulse">
        Magic loading... {Math.round(progress)}%
      </Typography>
    </div>
  );
}
