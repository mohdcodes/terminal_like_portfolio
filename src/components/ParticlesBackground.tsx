import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

interface ParticlesBackgroundProps {
  themeMode: 'dark' | 'light';
  themeColor: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ themeMode, themeColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  
  const getColorByTheme = (): string => {
    if (themeMode === 'dark') {
      switch (themeColor) {
        case 'blue': return 'rgba(59, 130, 246, 0.5)';
        case 'purple': return 'rgba(139, 92, 246, 0.5)';
        case 'green': return 'rgba(16, 185, 129, 0.5)';
        case 'orange': return 'rgba(249, 115, 22, 0.5)';
        case 'pink': return 'rgba(236, 72, 153, 0.5)';
        default: return 'rgba(59, 130, 246, 0.5)';
      }
    } else {
      switch (themeColor) {
        case 'blue': return 'rgba(59, 130, 246, 0.2)';
        case 'purple': return 'rgba(139, 92, 246, 0.2)';
        case 'green': return 'rgba(16, 185, 129, 0.2)';
        case 'orange': return 'rgba(249, 115, 22, 0.2)';
        case 'pink': return 'rgba(236, 72, 153, 0.2)';
        default: return 'rgba(59, 130, 246, 0.2)';
      }
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize particles
    const particleCount = 50;
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: getColorByTheme()
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Connect particles
        for (let j = index + 1; j < particlesRef.current.length; j++) {
          const dx = particle.x - particlesRef.current[j].x;
          const dy = particle.y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `${particle.color.slice(0, -4)}, ${0.2 - distance/500})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [themeMode, themeColor]);
  
  // Update particle colors when theme changes
  useEffect(() => {
    particlesRef.current.forEach(particle => {
      particle.color = getColorByTheme();
    });
  }, [themeMode, themeColor]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
    />
  );
};