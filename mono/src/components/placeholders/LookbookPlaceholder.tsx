import React from 'react';
import { PlaceholderBase } from './PlaceholderBase';

interface LookbookPlaceholderProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function LookbookPlaceholder({
  className,
  variant = 'light',
}: LookbookPlaceholderProps) {
  return (
    <PlaceholderBase
      label="Lookbook"
      aspectRatio="21/9"
      variant={variant}
      className={className}
    />
  );
}
