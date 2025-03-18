
import React, { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface SkillBarProps {
  name: string;
  percentage: number;
  color?: string;
  delay?: number;
}

const SkillBar: React.FC<SkillBarProps> = ({
  name,
  percentage,
  color = 'bg-primary',
  delay = 0,
}) => {
  const skillRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(skillRef, { threshold: 0.1, once: true });

  return (
    <div ref={skillRef} className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-base font-medium">{name}</h4>
        <span className="text-sm font-medium text-muted-foreground">{percentage}%</span>
      </div>
      
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out',
            color
          )}
          style={{
            width: isInView ? `${percentage}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
};

export default SkillBar;
