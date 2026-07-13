'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2', className)}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && (
            <span className="font-body text-[12px] text-mono-muted select-none">/</span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="font-nav text-[11px] uppercase tracking-[0.12em] font-bold text-mono-muted hover:text-mono-black transition-colors duration-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-nav text-[11px] uppercase tracking-[0.12em] font-bold text-mono-black">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
