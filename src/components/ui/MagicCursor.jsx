import React, { useEffect, useRef } from 'react';

/**
 * Magic Cursor
 * Renders cinematic star trails on desktop cursor movement.
 * Uses HTML5 Canvas for absolute 60fps performance without DOM bloat.
 */
export function MagicCursor() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let animationFrameId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

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
        this.life -= 0.02;
      }
      
      draw() {
        ctx.fillStyle = `rgba(191, 219, 254, ${this.life})`; // Blue trail
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const handleMouseMove = (e) => {
      particles.push(new Particle(e.clientX, e.clientY));
      particles.push(new Particle(e.clientX, e.clientY));
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.update();
        p.draw();
        
        if (p.life <= 0) {
          particles.splice(index, 1);
        }
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
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
