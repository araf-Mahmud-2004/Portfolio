import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isText, setIsText] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const followerPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let animationId: number;

    // Simple cursor override
    const forceCursorOverride = () => {
      document.documentElement.style.cursor = 'none';
      document.body.style.cursor = 'none';
    };

    forceCursorOverride();

    const animate = () => {
      // Update cursor position immediately
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouseX}px`;
        cursorRef.current.style.top = `${mouseY}px`;
      }

      // Smooth following animation for the ring
      const speed = 0.12;
      followerPosition.current.x += (mouseX - followerPosition.current.x) * speed;
      followerPosition.current.y += (mouseY - followerPosition.current.y) * speed;

      if (followerRef.current) {
        followerRef.current.style.left = `${followerPosition.current.x}px`;
        followerRef.current.style.top = `${followerPosition.current.y}px`;
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      // Initialize follower position on first mouse move if not set
      if (followerPosition.current.x === 0 && followerPosition.current.y === 0) {
        followerPosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    // Simple scroll handler that only checks on scroll
    const handleScroll = () => {
      const element = document.elementFromPoint(mousePosition.current.x, mousePosition.current.y) as HTMLElement;
      if (!element) return;

      // Only check for very specific interactive elements
      const isButton = element.tagName === 'BUTTON' || element.closest('button');
      const isLink = element.tagName === 'A' || element.closest('a');
      
      if (isButton || isLink) {
        if (!isHovering) setIsHovering(true);
        if (isText) setIsText(false);
      } else {
        if (isHovering) setIsHovering(false);
        if (isText) setIsText(false);
      }
    };

    // Only handle specific hover events
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        setIsHovering(true);
        setIsText(false);
      } else if (target.tagName === 'A' || target.closest('a')) {
        setIsHovering(true);
        setIsText(false);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || target.closest('button') || 
          target.tagName === 'A' || target.closest('a')) {
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
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Only listen for buttons and links
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Start animation
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []); // Removed dependencies to prevent re-initialization

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