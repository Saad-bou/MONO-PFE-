'use client';

import React from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'ghost' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-mono-black text-white hover:bg-[#2a2a2a] active:bg-[#000000]',
  ghost:
    'bg-transparent text-mono-black border border-mono-border hover:border-mono-black active:bg-mono-black active:text-white',
  gold:
    'bg-mono-gold text-white hover:bg-[#c9a432] active:bg-[#b8962d] shadow-[0_0_0_0_rgba(212,175,55,0)] hover:shadow-[0_0_20px_0_rgba(212,175,55,0.25)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-[11px]',
  md: 'px-8 py-3 text-[12px]',
  lg: 'px-10 py-4 text-[13px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-nav uppercase tracking-[0.14em] font-bold',
        'inline-flex items-center justify-center',
        'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:-translate-y-[1px]',
        'active:translate-y-0',
        'disabled:opacity-40 disabled:pointer-events-none',
        'cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
