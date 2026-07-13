import React from 'react';
import { PlaceholderBase } from './PlaceholderBase';

interface HeroPlaceholderProps {
  className?: string;
}

export function HeroPlaceholder({ className }: HeroPlaceholderProps) {
  return (
    <PlaceholderBase
      label="Hero Visual"
      aspectRatio="4/5"
      className={className}
    />
  );
}
