'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'relative font-nav text-[12px] uppercase tracking-[0.12em] font-bold',
        'text-mono-black hover:text-mono-gray',
        'transition-colors duration-300',
        'group',
        className
      )}
    >
      {children}
      {/* Elegant underline animation */}
      <span className="absolute bottom-[-2px] left-0 w-0 h-[1px] bg-mono-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
    </Link>
  );
}
