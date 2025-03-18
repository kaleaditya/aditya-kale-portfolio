
import { useEffect, useState, RefObject } from 'react';

type InViewOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

export function useInView(
  ref: RefObject<Element>,
  options: InViewOptions = {}
): boolean {
  const { threshold = 0.1, rootMargin = '0px', once = false } = options;
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        
        if (inView) {
          setIsInView(true);
          
          // If once is true, disconnect after it comes into view
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold, rootMargin, once]);

  return isInView;
}
