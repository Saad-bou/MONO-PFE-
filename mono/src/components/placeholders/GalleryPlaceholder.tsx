import React from 'react';
import { PlaceholderBase } from './PlaceholderBase';

interface GalleryPlaceholderProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'large' | 'thumbnail';
}

export function GalleryPlaceholder({
  className,
  variant = 'light',
  size = 'large',
}: GalleryPlaceholderProps) {
  return (
    <PlaceholderBase
      label={size === 'large' ? 'Gallery' : ''}
      aspectRatio={size === 'large' ? '3/4' : '1/1'}
      variant={variant}
      className={className}
    />
  );
}
