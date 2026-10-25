import React, { useEffect, useRef } from 'react';

/**
 * Cinematic Stardust Cursor Trail
 * Desktop only: renders a soft, ethereal trail ONLY when the mouse is moving.
 * No persistent dots, circles, or static indicators on screen.
 * Shuts down the animation loop when idle for zero CPU/GPU overhead.
 */
export function MagicCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let animationFrameId = null;
    let mouseX = -100;
    let mouseY = -100;
    let previousX = -100;
    let previousY = -100;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ensureRenderRunning = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    class Particle {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedX = vx || (Math.random() - 0.5) * 0.8;
        this.speedY = vy || (Math.random() - 0.5) * 0.8;
        this.life = 1.0;
        this.decay = Math.random() * 0.035 + 0.03; // ~25-35 frames (0.4-0.5s fade out)
        const palettes = [
          '255, 255, 255', // pure stardust
          '219, 234, 254', // soft ice blue
          '254, 243, 199', // warm golden shimmer
          '191, 219, 254', // celestial sky
        ];
        this.color = palettes[Math.floor(Math.random() * palettes.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.96;
      }

      draw() {
        if (this.life <= 0) return;
        const alpha = Math.max(0, this.life * 0.85);
        ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.3, this.size), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (previousX < 0 || previousY < 0) {
        previousX = mouseX;
        previousY = mouseY;
        return;
      }

      const dx = mouseX - previousX;
      const dy = mouseY - previousY;
      const distance = Math.hypot(dx, dy);

      // Only spawn particles if mouse actually moved
      if (distance > 2) {
        const steps = Math.min(5, Math.max(1, Math.floor(distance / 10)));
        for (let s = 0; s < steps; s++) {
          if (particles.length >= 65) break;
          const t = s / steps;
          const interpX = previousX + dx * t;
          const interpY = previousY + dy * t;
          const jitterX = (Math.random() - 0.5) * 3;
          const jitterY = (Math.random() - 0.5) * 3;
          const vx = (Math.random() - 0.5) * 0.6 - dx * 0.04;
          const vy = (Math.random() - 0.5) * 0.6 - dy * 0.04;
          particles.push(new Particle(interpX + jitterX, interpY + jitterY, vx, vy));
        }
        ensureRenderRunning();
      }

      previousX = mouseX;
      previousY = mouseY;
    };

    const handleMouseLeave = () => {
      previousX = -100;
      previousY = -100;
    };

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (particles.length > 0) {
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }
        particles = particles.filter((p) => p.life > 0);
        animationFrameId = requestAnimationFrame(render);
      } else {
        // All particles have faded away: sleep until next movement
        animationFrameId = null;
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    resize();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      aria-hidden="true"
    />
  );
}
