
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  magnetic?: boolean;
}

const AnimatedButton = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  withArrow = false,
  magnetic = true,
  ...props
}: AnimatedButtonProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic) return;
    
    const button = e.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    
    const x = e.clientX - buttonRect.left - buttonRect.width / 2;
    const y = e.clientY - buttonRect.top - buttonRect.height / 2;
    
    // Limit the movement to a reasonable range
    const maxDistance = 15;
    const distance = Math.sqrt(x * x + y * y);
    const scaleFactor = Math.min(distance, maxDistance) / distance;
    
    setMousePosition({ 
      x: x * scaleFactor, 
      y: y * scaleFactor 
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/10',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-5 text-base',
    lg: 'h-12 px-8 text-lg',
  };

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center rounded-md font-medium transition-all duration-300',
        'whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        magnetic && 'overflow-hidden group',
        className
      )}
      style={
        magnetic 
          ? { 
              transform: `translate(${mousePosition.x / 3}px, ${mousePosition.y / 3}px)` 
            } 
          : undefined
      }
      data-magnetic={magnetic ? 'true' : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span
        className={`relative z-10 flex items-center justify-center transition-transform duration-300 ${
          isHovered && withArrow ? 'translate-x-[-4px]' : ''
        }`}
      >
        {children}
      </span>
      
      {withArrow && (
        <span
          className={`ml-2 transition-all duration-300 ${
            isHovered ? 'translate-x-0 opacity-100' : 'translate-x-[-8px] opacity-0'
          }`}
        >
          →
        </span>
      )}
      
      {magnetic && (
        <span
          className="absolute inset-0 bg-black/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            width: '150%',
            height: '150%',
            top: '-25%',
            left: '-25%',
            borderRadius: '40%',
          }}
        />
      )}
    </button>
  );
};

export default AnimatedButton;
