import React from 'react';
import { cn } from '@/lib/cn';

interface SectionProps {
  id?: string;
  spacing?: 'default' | 'large' | 'compact' | 'none';
  className?: string;
  children: React.ReactNode;
}

const spacingStyles = {
  default: 'py-16 sm:py-24 lg:py-40',
  large: 'py-24 sm:py-32 lg:py-52',
  compact: 'py-10 sm:py-16 lg:py-24',
  none: 'py-0',
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(({
  id,
  spacing = 'default',
  className,
  children,
}, ref) => {
  return (
    <section
      ref={ref}
      id={id}
      className={cn(spacingStyles[spacing], className)}
    >
      {children}
    </section>
  );
});

Section.displayName = 'Section';
