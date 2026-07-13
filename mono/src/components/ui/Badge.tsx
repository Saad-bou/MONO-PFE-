'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps {
  variant?: 'new' | 'sale';
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'new', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5',
        'font-nav text-[10px] uppercase tracking-[0.14em] font-bold',
        variant === 'new' && 'bg-mono-black text-white',
        variant === 'sale' && 'bg-mono-gold text-white',
        className
      )}
    >
      {children}
    </span>
  );
}
