import React from 'react';
import { cn } from '@/lib/cn';

interface PlaceholderBaseProps {
  label: string;
  aspectRatio?: string;
  variant?: 'light' | 'dark';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Base placeholder component used by all specific placeholders.
 * Creates a premium-feeling placeholder box with label and optional children.
 */
export function PlaceholderBase({
  label,
  aspectRatio,
  variant = 'light',
  className,
  children,
}: PlaceholderBaseProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        'border border-mono-border',
        'flex items-center justify-center',
        variant === 'light' ? 'bg-[#F5F5F5]' : 'bg-[#1A1A1A]',
        className
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Subtle grid pattern */}
      <div
        className={cn(
          'absolute inset-0 opacity-[0.04]',
          variant === 'dark' && 'opacity-[0.08]'
        )}
        style={{
          backgroundImage: `linear-gradient(${variant === 'light' ? '#111' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${variant === 'light' ? '#111' : '#fff'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Center label */}
      <span
        className={cn(
          'font-nav text-[11px] uppercase tracking-[0.2em] font-bold select-none',
          variant === 'light' ? 'text-[#CCCCCC]' : 'text-[#444444]'
        )}
      >
        {label}
      </span>

      {/* Optional children overlay */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
