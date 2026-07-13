'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type IconName =
  | 'profile'
  | 'search'
  | 'bag'
  | 'menu'
  | 'close'
  | 'heart'
  | 'heart-filled'
  | 'minus'
  | 'plus'
  | 'trash'
  | 'arrow-left'
  | 'arrow-right'
  | 'zoom'
  | 'filter';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string;
  badge?: number;
  href?: string;
}

const iconPaths: Record<IconName, React.ReactNode> = {
  profile: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="10" cy="7" r="3.5" />
      <path d="M3 18c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <line x1="13" y1="13" x2="18" y2="18" />
    </svg>
  ),
  bag: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="3" y="6" width="14" height="12" rx="1" />
      <path d="M7 6V5a3 3 0 0 1 6 0v1" />
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <line x1="3" y1="6" x2="17" y2="6" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="14" x2="17" y2="14" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <line x1="4" y1="4" x2="16" y2="16" />
      <line x1="16" y1="4" x2="4" y2="16" />
    </svg>
  ),
  heart: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M10 17s-7-4.35-7-8.5A3.5 3.5 0 0 1 10 5.97 3.5 3.5 0 0 1 17 8.5C17 12.65 10 17 10 17z" />
    </svg>
  ),
  'heart-filled': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1.3">
      <path d="M10 17s-7-4.35-7-8.5A3.5 3.5 0 0 1 10 5.97 3.5 3.5 0 0 1 17 8.5C17 12.65 10 17 10 17z" />
    </svg>
  ),
  minus: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <line x1="5" y1="10" x2="15" y2="10" />
    </svg>
  ),
  plus: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <line x1="10" y1="5" x2="10" y2="15" />
      <line x1="5" y1="10" x2="15" y2="10" />
    </svg>
  ),
  trash: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M3 5h14" />
      <path d="M8 5V3h4v2" />
      <path d="M5 5l1 12h8l1-12" />
      <line x1="8" y1="8" x2="8" y2="14" />
      <line x1="12" y1="8" x2="12" y2="14" />
    </svg>
  ),
  'arrow-left': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <line x1="17" y1="10" x2="3" y2="10" />
      <polyline points="8,5 3,10 8,15" />
    </svg>
  ),
  'arrow-right': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <line x1="3" y1="10" x2="17" y2="10" />
      <polyline points="12,5 17,10 12,15" />
    </svg>
  ),
  zoom: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <line x1="13" y1="13" x2="18" y2="18" />
      <line x1="6" y1="8.5" x2="11" y2="8.5" />
      <line x1="8.5" y1="6" x2="8.5" y2="11" />
    </svg>
  ),
  filter: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <line x1="3" y1="5" x2="17" y2="5" />
      <line x1="5" y1="10" x2="15" y2="10" />
      <line x1="7" y1="15" x2="13" y2="15" />
    </svg>
  ),
};

export function IconButton({
  icon,
  label,
  badge,
  href,
  className,
  ...props
}: IconButtonProps) {
  const buttonContent = (
    <>
      {iconPaths[icon]}

      {/* Badge count */}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-mono-black text-white text-[9px] font-nav font-bold rounded-full">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </>
  );

  const sharedClassName = cn(
    'relative w-10 h-10 flex items-center justify-center',
    'text-mono-black hover:text-mono-gray',
    'transition-colors duration-300',
    'cursor-pointer',
    className
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className={sharedClassName}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      aria-label={label}
      className={sharedClassName}
      {...props}
    >
      {buttonContent}
    </button>
  );
}
