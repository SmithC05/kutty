import React, { useEffect, useRef } from 'react';

/**
 * Cinematic Stardust Magic Cursor Trail
 * Desktop only: emits delicate stardust particles that float upward
 * and slowly fade out over ~1 second as you move or hover.
 * No static dots, circles, or permanent indicators on screen.
 */
export function MagicCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Only enable on non-touch devices (desktop)
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
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2.2 + 0.6;
        this.speedX = Math.random() * 1.0 - 0.5;
        this.speedY = Math.random() * 0.9 + 0.4; // float upwards gently
        this.life = 1.0;
        this.decay = Math.random() * 0.005 + 0.014; // ~60-70 frames = ~1.0-1.2s slow fade
        // Celestial theme palette: soft baby blue, stardust white, gentle gold
        const colors = [
          '191, 219, 254', // soft blue
          '219, 234, 254', // ice blue
          '255, 255, 255', // stardust white
          '254, 243, 199', // soft champagne shimmer
        ];
        this.rgb = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y -= this.speedY; // move upwards like ethereal fairy dust
        this.life -= this.decay;
        this.size *= 0.985; // very gradual shrink
      }

      draw() {
        if (this.life <= 0) return;
        ctx.fillStyle = `rgba(${this.rgb}, ${Math.max(0, this.life * 0.88)})`;
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

      if (distance > 1) {
        // Interpolate along motion path so fast movements have a continuous, extended trail
        const steps = Math.min(6, Math.max(2, Math.ceil(distance / 8)));
        for (let i = 0; i < steps; i++) {
          if (particles.length < 120) {
            const t = i / steps;
            particles.push(
              new Particle(
                previousX + dx * t + (Math.random() - 0.5) * 4,
                previousY + dy * t + (Math.random() - 0.5) * 4
              )
            );
          }
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
        // Sleep when all particles have dissolved
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
