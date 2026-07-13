import React from 'react';
import { PlaceholderBase } from './PlaceholderBase';

interface ProductPlaceholderProps {
  className?: string;
}

export function ProductPlaceholder({ className }: ProductPlaceholderProps) {
  return (
    <PlaceholderBase
      label="Product"
      aspectRatio="3/4"
      className={className}
    />
  );
}
