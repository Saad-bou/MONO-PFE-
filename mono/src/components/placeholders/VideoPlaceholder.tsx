import React from 'react';
import { cn } from '@/lib/cn';
import { PlaceholderBase } from './PlaceholderBase';

interface VideoPlaceholderProps {
  className?: string;
}

export function VideoPlaceholder({ className }: VideoPlaceholderProps) {
  return (
    <PlaceholderBase label="" aspectRatio="16/9" variant="dark" className={className}>
      {/* Play button outline */}
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            'w-16 h-16 rounded-full border border-[#444444]',
            'flex items-center justify-center',
            'transition-all duration-500'
          )}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-[#444444] ml-1"
          >
            <polygon
              points="4,2 18,10 4,18"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="font-nav text-[10px] uppercase tracking-[0.2em] font-bold text-[#444444]">
          Campaign Film
        </span>
      </div>
    </PlaceholderBase>
  );
}
