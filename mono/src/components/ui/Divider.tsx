import React from 'react';
import { cn } from '@/lib/cn';

interface DividerProps {
  className?: string;
  gold?: boolean;
}

export function Divider({ className, gold = false }: DividerProps) {
  return (
    <hr
      className={cn(
        'border-0 h-[1px] w-full',
        gold ? 'bg-mono-gold/30' : 'bg-mono-border',
        className
      )}
    />
  );
}
