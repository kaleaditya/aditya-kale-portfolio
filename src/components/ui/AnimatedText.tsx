
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

interface AnimatedTextProps {
  text: string;
  className?: string;
  once?: boolean;
  as?: React.ElementType;
  animation?: 'typing' | 'reveal' | 'fade';
  delay?: number;
  speed?: number;
  children?: React.ReactNode;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  once = true,
  as: Component = 'h2',
  animation = 'reveal',
  delay = 0,
  speed = 30,
  children,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { threshold: 0.1, once });
  const [displayedText, setDisplayedText] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  
  useEffect(() => {
    if (!isInView || animation !== 'typing') return;
    
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i));
        i++;
        
        if (i > text.length) {
          clearInterval(interval);
          setIsRevealed(true);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isInView, text, animation, delay, speed]);
  
  if (animation === 'typing') {
    return (
      <Component 
        ref={textRef} 
        className={cn('relative overflow-hidden', className)}
      >
        {displayedText}
        <span className={`inline-block w-0.5 h-[1em] bg-current ml-1 ${isRevealed ? 'animate-pulse' : ''}`}></span>
      </Component>
    );
  }
  
  if (animation === 'fade') {
    return (
      <Component 
        ref={textRef} 
        className={cn(
          'transition-opacity duration-700',
          isInView ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children || text}
      </Component>
    );
  }
  
  // Default 'reveal' animation
  return (
    <Component
      ref={textRef}
      className={cn('relative overflow-hidden', className)}
      aria-label={text}
    >
      <div
        className={cn(
          'transition-transform duration-700 ease-out',
          isInView ? 'translate-y-0' : 'translate-y-full',
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children || text}
      </div>
    </Component>
  );
};

export default AnimatedText;
