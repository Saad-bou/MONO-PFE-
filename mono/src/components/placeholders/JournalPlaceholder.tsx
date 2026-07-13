import React from 'react';
import { PlaceholderBase } from './PlaceholderBase';

interface JournalPlaceholderProps {
  height?: 'tall' | 'medium' | 'short';
  className?: string;
}

const heightRatios: Record<string, string> = {
  tall: '3/4',
  medium: '4/3',
  short: '16/9',
};

export function JournalPlaceholder({
  height = 'medium',
  className,
}: JournalPlaceholderProps) {
  return (
    <PlaceholderBase
      label="Journal"
      aspectRatio={heightRatios[height]}
      className={className}
    />
  );
}
