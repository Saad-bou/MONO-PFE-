'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 10,
  className,
}: QuantitySelectorProps) {
  return (
    <div className={cn('flex items-center border border-mono-border', className)}>
      <button
        onClick={onDecrement}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={cn(
          'w-10 h-10 flex items-center justify-center',
          'text-mono-black hover:text-mono-gray',
          'transition-colors duration-300 cursor-pointer',
          'disabled:opacity-30 disabled:cursor-not-allowed'
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
          <line x1="3" y1="7" x2="11" y2="7" />
        </svg>
      </button>

      <span className="w-10 h-10 flex items-center justify-center font-nav text-[12px] font-bold tracking-[0.08em] text-mono-black border-x border-mono-border select-none">
        {quantity}
      </span>

      <button
        onClick={onIncrement}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className={cn(
          'w-10 h-10 flex items-center justify-center',
          'text-mono-black hover:text-mono-gray',
          'transition-colors duration-300 cursor-pointer',
          'disabled:opacity-30 disabled:cursor-not-allowed'
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
          <line x1="7" y1="3" x2="7" y2="11" />
          <line x1="3" y1="7" x2="11" y2="7" />
        </svg>
      </button>
    </div>
  );
}
