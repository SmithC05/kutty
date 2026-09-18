import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Button Shell
 */
export function Button({ children, onClick, className, variant = 'primary', ...props }) {
  const baseStyle = "px-6 py-3 rounded-full transition-all duration-400 font-sans uppercase tracking-widest text-sm";
  const variants = {
    primary: "border border-blue-700/30 hover:border-blue-700 bg-white/5 hover:bg-white/10 glow-text",
    ghost: "text-gray-300 hover:text-white"
  };

  return (
    <button 
      onClick={onClick} 
      className={cn(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
