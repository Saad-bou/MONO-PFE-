import React from 'react';
import { PlaceholderBase } from './PlaceholderBase';

interface EditorialPlaceholderProps {
  aspectRatio?: string;
  className?: string;
  variant?: 'light' | 'dark';
}

export function EditorialPlaceholder({
  aspectRatio = '3/2',
  className,
  variant = 'light',
}: EditorialPlaceholderProps) {
  return (
    <PlaceholderBase
      label="Editorial"
      aspectRatio={aspectRatio}
      variant={variant}
      className={className}
    />
  );
}
