import React from 'react';
import { cn } from '@/lib/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'text-[16px] tracking-[0.3em]',
  md: 'text-[20px] tracking-[0.35em]',
  lg: 'text-[28px] tracking-[0.4em]',
};

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <span
      className={cn(
        'font-nav font-bold uppercase text-mono-black select-none',
        sizeStyles[size],
        className
      )}
    >
      MONO
    </span>
  );
}
