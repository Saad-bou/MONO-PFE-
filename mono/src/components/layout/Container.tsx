import React from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  size?: 'default' | 'wide' | 'narrow';
  className?: string;
  children: React.ReactNode;
}

const sizeStyles = {
  default: 'max-w-[1280px]',
  wide: 'max-w-[1440px]',
  narrow: 'max-w-[960px]',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({
  size = 'default',
  className,
  children,
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'w-full mx-auto px-5 sm:px-8 lg:px-12',
        sizeStyles[size],
        className
      )}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';
