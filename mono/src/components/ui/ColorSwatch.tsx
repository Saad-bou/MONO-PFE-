'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface ColorSwatchProps {
  color: string;
  name: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ColorSwatch({
  color,
  name,
  isActive = false,
  onClick,
}: ColorSwatchProps) {
  return (
    <button
      aria-label={`Select color: ${name}`}
      title={name}
      onClick={onClick}
      className={cn(
        'w-4 h-4 rounded-full transition-all duration-300 cursor-pointer',
        'ring-offset-2 ring-offset-white',
        isActive ? 'ring-1 ring-mono-black' : 'ring-0 hover:ring-1 hover:ring-mono-border'
      )}
      style={{ backgroundColor: color }}
    />
  );
}
