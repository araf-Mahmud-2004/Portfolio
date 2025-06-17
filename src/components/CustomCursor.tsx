import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isText, setIsText] = useState(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let animationId: number;

    // Force cursor override on all elements - NUCLEAR OPTION
    const forceCursorOverride = () => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.setProperty('cursor', 'none', 'important');
      });
      
      // Also override on document and body
      document.documentElement.style.setProperty('cursor', 'none', 'important');
      document.body.style.setProperty('cursor', 'none', 'important');
    };

    // Initial override
    forceCursorOverride();

    // Override cursor on new elements and style changes
    const observer = new MutationObserver(() => {
      forceCursorOverride();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Also override on interval as a backup
    const intervalId = setInterval(forceCursorOverride, 100);

    const animate = () => {
      // Update cursor position immediately
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouseX}px`;
        cursorRef.current.style.top = `${mouseY}px`;
      }

      // Smooth following animation for the ring
      const speed = 0.12;
      followerX += (mouseX - followerX) * speed;
      followerY += (mouseY - followerY) * speed;

      if (followerRef.current) {
        followerRef.current.style.left = `${followerX}px`;
        followerRef.current.style.top = `${followerY}px`;
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for interactive elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-hover') ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true);
        setIsText(false);
      }
      // Check for text elements
      else if (
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'H4' ||
        target.tagName === 'H5' ||
        target.tagName === 'H6' ||
        target.classList.contains('cursor-text')
      ) {
        setIsText(true);
        setIsHovering(false);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-hover') ||
        target.closest('a') ||
        target.closest('button') ||
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'H4' ||
        target.tagName === 'H5' ||
        target.tagName === 'H6' ||
        target.classList.contains('cursor-text')
      ) {
        setIsHovering(false);
        setIsText(false);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Start the animation loop
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Cancel animation frame
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      // Clean up observer and interval
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''} ${isText ? 'text' : ''}`}
      />
      <div
        ref={followerRef}
        className={`cursor-follower ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''} ${isText ? 'text' : ''}`}
      />
    </>
  );
};

export default CustomCursor;