
import { useState, useEffect, RefObject } from 'react';

type CursorState = {
  x: number;
  y: number;
  width: number;
  height: number;
  magneticElements: Element[];
};

export const useAnimatedCursor = (
  cursorRef: RefObject<HTMLDivElement>,
  targetSelector: string = '[data-magnetic]'
) => {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    magneticElements: [],
  });

  useEffect(() => {
    // Initialize cursor position
    const moveCursor = (e: MouseEvent) => {
      setCursor((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
      
      // Apply cursor position
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    // Collect all magnetic elements
    const magneticElements = document.querySelectorAll(targetSelector);

    setCursor((prev) => ({ 
      ...prev, 
      magneticElements: Array.from(magneticElements)
    }));

    // Add event listeners for cursor movement
    window.addEventListener('mousemove', moveCursor);
    
    // Handle hover animations for magnetic elements
    magneticElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        setCursor((prev) => ({ ...prev, width: 60, height: 60 }));
        if (cursorRef.current) {
          cursorRef.current.classList.add('scale-150', 'bg-primary/50');
        }
      });
      
      element.addEventListener('mouseleave', () => {
        setCursor((prev) => ({ ...prev, width: 32, height: 32 }));
        if (cursorRef.current) {
          cursorRef.current.classList.remove('scale-150', 'bg-primary/50');
        }
      });
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      
      magneticElements.forEach((element) => {
        element.removeEventListener('mouseenter', () => {});
        element.removeEventListener('mouseleave', () => {});
      });
    };
  }, [cursorRef, targetSelector]);

  return cursor;
};
