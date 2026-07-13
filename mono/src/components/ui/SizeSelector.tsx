'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { Size } from '@/types/product';

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
  className?: string;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  className,
}: SizeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {sizes.map((size) => (
        <button
          key={size.label}
          disabled={!size.available}
          onClick={() => size.available && onSelect(size.label)}
          className={cn(
            'w-9 h-9 flex items-center justify-center',
            'font-nav text-[10px] uppercase tracking-[0.08em] font-bold',
            'transition-all duration-200 cursor-pointer',
            size.available
              ? selectedSize === size.label
                ? 'bg-mono-black text-white'
                : 'bg-white text-mono-black border border-mono-border hover:border-mono-black'
              : 'bg-transparent text-mono-muted/40 border border-mono-border/40 cursor-not-allowed line-through'
          )}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
}
