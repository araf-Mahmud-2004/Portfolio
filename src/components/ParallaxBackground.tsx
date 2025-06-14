import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ParallaxBackgroundProps {
  scrollY: number;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ scrollY }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Throttle mouse movement for better performance
  useEffect(() => {
    let animationFrameId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Memoize particle positions to prevent recalculation
  const particlePositions = useMemo(() => 
    Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 2
    })), []
  );

  const geometricShapes = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      left: 15 + i * 10,
      top: 20 + (i % 3) * 25,
      size: 20 + (i % 3) * 10,
      duration: 12 + i * 2
    })), []
  );

  const codeElements = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      left: 10 + i * 15,
      top: 15 + (i % 3) * 25,
      symbol: ['<>', '{}', '[]', '/>', '=>', '&&'][i],
      delay: i * 0.8
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Layer 1 - Optimized particles */}
      <div 
        className="absolute inset-0"
        style={{ 
          transform: `translateY(${scrollY * 0.1}px)`,
          willChange: 'transform'
        }}
      >
        {particlePositions.slice(0, 12).map((particle, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-neon/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Layer 2 - Simplified geometric shapes */}
      <div 
        className="absolute inset-0"
        style={{ 
          transform: `translateY(${scrollY * 0.15}px)`,
          willChange: 'transform'
        }}
      >
        {geometricShapes.map((shape, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute border border-olive/20 rounded-full"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: shape.duration, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      </div>

      {/* Layer 3 - Code elements with reduced complexity */}
      <div 
        className="absolute inset-0"
        style={{ 
          transform: `translateY(${scrollY * 0.3}px)`,
          willChange: 'transform'
        }}
      >
        {codeElements.map((element, i) => (
          <motion.div
            key={`code-${i}`}
            className="absolute text-neon/10 font-mono text-xl select-none"
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
            }}
            animate={{
              y: [-8, 8, -8],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 5 + element.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay,
            }}
          >
            {element.symbol}
          </motion.div>
        ))}
      </div>

      {/* Layer 4 - Ambient glow (simplified) */}
      <motion.div
        className="absolute w-80 h-80 rounded-full pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(252, 227, 0, 0.05) 0%, transparent 70%)',
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default ParallaxBackground;