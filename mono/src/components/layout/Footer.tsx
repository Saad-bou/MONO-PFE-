'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { footerColumns } from '@/data/footer';
import { Container } from './Container';
import { Divider } from '@/components/ui/Divider';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-16 sm:pt-24 lg:pt-32 pb-8">
      <Container>
        {/* Top divider */}
        <Divider className="mb-16 sm:mb-20" />

        {/* Logo */}
        <div className="mb-12 sm:mb-16">
          <Logo size="lg" />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-16 sm:mb-24">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="font-nav text-[11px] uppercase tracking-[0.14em] font-bold text-mono-black mb-5">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        'font-body text-[14px] text-mono-gray',
                        'hover:text-mono-black transition-colors duration-300'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <Divider className="mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-[12px] text-mono-muted">
            © {currentYear} MONO. All rights reserved.
          </p>
          <p className="font-body text-[12px] text-mono-muted">
            Minimalist Luxury Streetwear — Powered by AI
          </p>
        </div>
      </Container>
    </footer>
  );
}
