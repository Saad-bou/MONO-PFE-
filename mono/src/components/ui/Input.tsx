'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'minimal';
  label?: string;
  error?: string;
}

export function Input({
  variant = 'default',
  label,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="font-nav text-[11px] uppercase tracking-[0.12em] font-bold text-mono-gray"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'font-body text-[15px] text-mono-black placeholder:text-mono-muted',
          'outline-none transition-all duration-300',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variant === 'default' && [
            'px-4 py-3',
            'border border-mono-border',
            'bg-white',
            'focus:border-mono-black',
          ],
          variant === 'minimal' && [
            'px-0 py-3',
            'border-0 border-b border-mono-border',
            'bg-transparent',
            'focus:border-mono-black',
          ],
          error && 'border-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <span className="font-body text-[12px] text-red-500">{error}</span>
      )}
    </div>
  );
}
