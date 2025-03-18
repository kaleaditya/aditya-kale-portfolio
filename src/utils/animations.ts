
export const staggerChildren = (delay: number = 0.1) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
    },
  },
});

export const fadeIn = (
  direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'up',
  delay: number = 0
) => {
  const directionMap = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  };

  return {
    hidden: {
      opacity: 0,
      ...directionMap[direction],
    },
    show: {
      opacity: 1,
      ...Object.fromEntries(
        Object.entries(directionMap[direction]).map(([key]) => [key, 0])
      ),
      transition: {
        type: 'tween',
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };
};

export const scaleIn = (delay: number = 0) => ({
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay,
    },
  },
});

export const getRandomDelay = (min: number = 0, max: number = 0.5): number => {
  return Math.random() * (max - min) + min;
};

export const generateRandomPath = () => {
  // Generate random SVG path for decorative elements
  const points = Array.from({ length: 5 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));
  
  return `M${points[0].x},${points[0].y} 
    C${points[1].x},${points[1].y} 
    ${points[2].x},${points[2].y} 
    ${points[3].x},${points[3].y}
    S${points[4].x},${points[4].y} 
    ${points[0].x},${points[0].y}`;
};

export const getTransitionClasses = (
  isInView: boolean,
  animation: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale',
  delay: number = 0
): string => {
  const baseClasses = 'transition-all duration-700';
  const delayClass = `delay-[${delay}ms]`;
  
  if (!isInView) {
    return `${baseClasses} opacity-0 ${
      animation === 'fade' ? '' :
      animation === 'slide-up' ? 'translate-y-10' :
      animation === 'slide-down' ? '-translate-y-10' :
      animation === 'slide-left' ? 'translate-x-10' :
      animation === 'slide-right' ? '-translate-x-10' :
      animation === 'scale' ? 'scale-95' : ''
    }`;
  }
  
  return `${baseClasses} ${delayClass} opacity-100 translate-y-0 translate-x-0 scale-100`;
};
