import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollAnimateWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollAnimateWrapper: React.FC<ScrollAnimateWrapperProps> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => {
  const ref = useScrollAnimation() as React.RefObject<HTMLDivElement>;

  return (
    <div 
      ref={ref}
      className={`scroll-animate ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};