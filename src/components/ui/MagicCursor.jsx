import React, { useEffect, useRef } from 'react';

/**
 * Cinematic Magic Cursor
 * Desktop only: replaces the native cursor with a soft blue orb/ring
 * and a lightweight particle trail, all rendered in one Canvas.
 */
export function MagicCursor() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles = [];
    let animationFrameId;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let previousX = mouseX;
    let previousY = mouseY;
    let isInside = false;
    let pressed = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    
    const handleMouseEnter = () => {
      isInside = true;
    };

    const handleMouseLeave = () => {
      isInside = false;
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const distance = Math.hypot(mouseX - previousX, mouseY - previousY);
      const count = Math.min(4, Math.max(2, Math.ceil(distance / 12)));

      for (let i = 0; i < count; i++) {
        particles.push(
          new Particle(
            mouseX + (Math.random() - 0.5) * 4,
            mouseY + (Math.random() - 0.5) * 4
          )
        );
      }

      previousX = mouseX;
      previousY = mouseY;
    };

    const handleMouseDown = () => {
      pressed = true;
    };

    const handleMouseUp = () => {
      pressed = false;
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 + 0.5;
        this.life = 1.0;
      }
      
      update() {
        this.x += this.speedX;
        this.y -= this.speedY;
        this.life -= 0.025;
      }
      
      draw() {
        ctx.fillStyle = `rgba(191, 219, 254, ${this.life * 0.9})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const renderCursor = () => {
      const follow = 0.18;
      cursorX += (mouseX - cursorX) * follow;
      cursorY += (mouseY - cursorY) * follow;

      if (isInside) {
        const pulse = 1 + Math.sin(performance.now() * 0.006) * 0.08;
        const outerRadius = (pressed ? 15 : 12) * pulse;

        // Soft atmospheric halo
        const halo = ctx.createRadialGradient(
          cursorX, cursorY, 0,
          cursorX, cursorY, outerRadius * 3
        );
        halo.addColorStop(0, 'rgba(147, 197, 253, 0.24)');
        halo.addColorStop(0.45, 'rgba(59, 130, 246, 0.10)');
        halo.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, outerRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Blue outer ring
        ctx.strokeStyle = pressed
          ? 'rgba(191, 219, 254, 0.95)'
          : 'rgba(147, 197, 253, 0.78)';
        ctx.lineWidth = pressed ? 1.8 : 1.2;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, outerRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner light core
        ctx.fillStyle = 'rgba(219, 234, 254, 0.95)';
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, pressed ? 3.2 : 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      particles = particles.filter((particle) => particle.life > 0);
      renderCursor();

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
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
