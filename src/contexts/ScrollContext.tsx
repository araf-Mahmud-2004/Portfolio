import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface ScrollContextType {
  scrollY: number;
  scrollDirection: 'up' | 'down';
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

// Throttle function for better performance
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const prevScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollPosition = useCallback(() => {
    const currentScroll = window.scrollY;
    
    setScrollDirection(currentScroll > prevScrollY.current ? 'down' : 'up');
    setScrollY(currentScroll);
    prevScrollY.current = currentScroll;
    ticking.current = false;
  }, []);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateScrollPosition);
      ticking.current = true;
    }
  }, [updateScrollPosition]);

  // Throttled scroll handler for additional performance
  const throttledScrollHandler = useCallback(
    throttle(handleScroll, 16), // ~60fps
    [handleScroll]
  );

  useEffect(() => {
    // Set initial scroll position
    setScrollY(window.scrollY);
    prevScrollY.current = window.scrollY;

    window.addEventListener('scroll', throttledScrollHandler, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [throttledScrollHandler]);

  return (
    <ScrollContext.Provider value={{ scrollY, scrollDirection }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};