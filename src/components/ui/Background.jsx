import React, { useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Background Engine
 * Persists behind all scenes. Uses a performant HTML5 Canvas for particles and CSS for Aurora.
 */
export function Background({ className, showParticles = true, isPaused = false }) {
  const canvasRef = useRef(null);
  const isPausedRef = useRef(isPaused);
  const showParticlesRef = useRef(showParticles);

  const animRef = useRef(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (isPaused) {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    }
  }, [isPaused]);

  useEffect(() => {
    showParticlesRef.current = showParticles;
  }, [showParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedY = (Math.random() * 0.5) - 0.25;
        this.speedX = (Math.random() * 0.5) - 0.25;
        this.opacity = Math.random() * 0.5;
      }
      update() {
        this.y -= this.speedY;
        this.x -= this.speedX;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
      }
      draw() {
        ctx.fillStyle = `rgba(191, 219, 254, ${this.opacity})`; // blue-light
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const particleCount = window.innerWidth < 768 ? 24 : 48;
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    };

    const animate = () => {
      if (isPausedRef.current) {
        animRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (showParticlesRef.current) {
        particles.forEach(p => {
          p.update();
          p.draw();
        });
      }
      animRef.current = requestAnimationFrame(animate);
    };

    init();
    if (!isPausedRef.current) {
      animRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, []);

  return (
    <div className={cn("fixed inset-0 pointer-events-none -z-10", className)}>
      <div className="absolute inset-0 bg-background" />

      {/* GPU-accelerated atmospheric aurora lights with zero main-thread CPU cost */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-1/4 -left-1/4 h-[80vw] w-[80vw] rounded-full blur-[90px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, transparent 65%)',
            animationDuration: '14s',
          }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 h-[80vw] w-[80vw] rounded-full blur-[100px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(191, 219, 254, 0.14) 0%, transparent 70%)',
            animationDuration: '18s',
            animationDelay: '4s',
          }}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen" 
      />
    </div>
  );
}
