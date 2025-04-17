
import React, { useEffect, useState } from 'react';

interface CategoryData {
  category: string;
  value: number;
  color: string;
}

interface CircleProgressBarProps {
  categories: CategoryData[];
  size?: number;
  strokeWidth?: number;
  isVisible?: boolean;
}

const CircleProgressBar: React.FC<CircleProgressBarProps> = ({ 
  categories, 
  size = 240, 
  strokeWidth = 12,
  isVisible = true
}) => {
  const [animatedValues, setAnimatedValues] = useState<number[]>(categories.map(() => 0));
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  let totalAngle = 0;
  
  // Calculate total value for percentage calculations
  const totalValue = categories.reduce((sum, cat) => sum + cat.value, 0);
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedValues(categories.map(cat => cat.value));
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setAnimatedValues(categories.map(() => 0));
    }
  }, [isVisible, categories]);
  
  // Create segments for each category
  const segments = categories.map((cat, index) => {
    // Calculate percentage of this category relative to total
    const percentage = totalValue > 0 ? animatedValues[index] / totalValue : 0;
    
    // Each segment gets a proportion of the circle based on its value
    const angle = percentage * (2 * Math.PI);
    
    // Calculate start and end positions
    const startAngle = totalAngle;
    const endAngle = totalAngle + angle;
    totalAngle += angle;
    
    // Calculate the path
    const x1 = center + radius * Math.cos(startAngle - Math.PI / 2);
    const y1 = center + radius * Math.sin(startAngle - Math.PI / 2);
    const x2 = center + radius * Math.cos(endAngle - Math.PI / 2);
    const y2 = center + radius * Math.sin(endAngle - Math.PI / 2);
    
    // Determine if the arc is more than 180 degrees
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    // Create the arc path
    const pathData = `
      M ${center} ${center - radius}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
    `;
    
    // Calculate position for the label
    const labelAngle = startAngle + angle / 2;
    const labelRadius = radius + 20;
    const labelX = center + labelRadius * Math.cos(labelAngle - Math.PI / 2);
    const labelY = center + labelRadius * Math.sin(labelAngle - Math.PI / 2);
    
    return {
      path: pathData,
      color: cat.color,
      category: cat.category,
      labelX,
      labelY,
      percentage: Math.round(percentage * 100)
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transition-all duration-1000">
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#2a2a2a"
        strokeWidth={strokeWidth}
      />
      
      {/* Category segments */}
      {segments.map((segment, i) => (
        <g key={i} className="transition-all duration-1000">
          <path
            d={segment.path}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1.5s ease-in-out',
            }}
            className="transition-all duration-1000"
          />
        </g>
      ))}
      
      {/* Center circle */}
      <circle
        cx={center}
        cy={center}
        r={radius - strokeWidth - 4}
        fill="#1a1a1a"
        className="transition-all duration-1000"
      />
      
      {/* Center text */}
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize={16}
        fontWeight="bold"
        className="transition-all duration-1000"
      >
        SKILLS
      </text>
      
      {/* Category labels */}
      {segments.map((segment, i) => {
        const angle = (i / segments.length) * Math.PI * 2 - Math.PI / 2;
        const x = center + (radius + 30) * Math.cos(angle);
        const y = center + (radius + 30) * Math.sin(angle);
        
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={segment.color}
            fontSize={12}
            fontWeight="500"
            className="transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : -10}px)`,
              transition: `opacity 0.5s ease-in-out ${i * 150}ms, transform 0.5s ease-in-out ${i * 150}ms`
            }}
          >
            {segment.category}
          </text>
        );
      })}
    </svg>
  );
};

export default CircleProgressBar;
