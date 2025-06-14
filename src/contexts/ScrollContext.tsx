import React, { createContext, useContext, useState, useEffect } from 'react';

interface ScrollContextType {
  scrollY: number;
  scrollDirection: 'up' | 'down';
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setPrevScrollY(scrollY);
      setScrollY(currentScroll);
      setScrollDirection(currentScroll > prevScrollY ? 'down' : 'up');
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: true
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY, prevScrollY]);

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
