import React from 'react';
import { cn } from '../../utils/cn';

const variants = {
  h1: 'font-cursive text-5xl md:text-7xl lg:text-8xl tracking-tight text-primary-light glow-text',
  h2: 'font-cursive text-4xl md:text-5xl lg:text-6xl tracking-tight text-primary-light',
  quote: 'font-quote italic text-2xl md:text-3xl lg:text-4xl text-white/90',
  body: 'font-sans text-base md:text-lg text-gray-200 leading-relaxed tracking-wide',
  caption: 'font-sans text-xs md:text-sm text-gold-dark uppercase tracking-widest',
  countdown: 'font-numbers text-6xl md:text-8xl tracking-widest text-primary-light tabular-nums',
};

/**
 * Core Typography Component
 * 
 * Enforces our design system rules for text rendering across the cinematic experience.
 */
export function Typography({
  variant = 'body',
  as,
  className,
  children,
  ...props
}) {
  const Component = as || (
    variant === 'h1' ? 'h1' :
    variant === 'h2' ? 'h2' :
    variant === 'quote' ? 'blockquote' :
    variant === 'caption' ? 'span' :
    variant === 'countdown' ? 'div' :
    'p'
  );

  return (
    <Component 
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
