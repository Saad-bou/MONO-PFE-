'use client';

import React from 'react';
import { cn } from '@/lib/cn';

type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodyLarge'
  | 'caption'
  | 'label';

type TypographyAs =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div';

interface TypographyProps {
  variant?: TypographyVariant;
  as?: TypographyAs;
  italic?: boolean;
  muted?: boolean;
  gold?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<TypographyVariant, string> = {
  display:
    'font-display text-[40px] leading-[48px] sm:text-[56px] sm:leading-[64px] lg:text-[80px] lg:leading-[88px] font-bold tracking-[-0.02em]',
  h1: 'font-display text-[32px] leading-[40px] sm:text-[44px] sm:leading-[52px] lg:text-[56px] lg:leading-[64px] font-bold tracking-[-0.02em]',
  h2: 'font-display text-[28px] leading-[36px] sm:text-[32px] sm:leading-[40px] lg:text-[40px] lg:leading-[48px] font-bold tracking-[-0.01em]',
  h3: 'font-display text-[22px] leading-[28px] sm:text-[24px] sm:leading-[32px] lg:text-[28px] lg:leading-[36px] font-semibold',
  h4: 'font-display text-[18px] leading-[24px] lg:text-[22px] lg:leading-[28px] font-semibold',
  body: 'font-body text-[16px] leading-[28px]',
  bodyLarge: 'font-body text-[18px] leading-[30px] lg:text-[20px] lg:leading-[32px]',
  caption: 'font-body text-[12px] leading-[18px] sm:text-[13px] sm:leading-[20px]',
  label:
    'font-nav text-[11px] leading-[16px] uppercase tracking-[0.12em] font-bold',
};

const defaultTag: Record<TypographyVariant, TypographyAs> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  bodyLarge: 'p',
  caption: 'p',
  label: 'span',
};

export function Typography({
  variant = 'body',
  as,
  italic = false,
  muted = false,
  gold = false,
  className,
  children,
}: TypographyProps) {
  const Component = as || defaultTag[variant];

  return (
    <Component
      className={cn(
        variantStyles[variant],
        italic && 'italic',
        muted && 'text-mono-muted',
        gold && 'text-mono-gold',
        !muted && !gold && 'text-mono-black',
        className
      )}
    >
      {children}
    </Component>
  );
}
