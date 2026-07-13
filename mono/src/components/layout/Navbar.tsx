'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { navItems } from '@/data/navigation';
import { Logo } from '@/components/ui/Logo';
import { NavLink } from './NavLink';
import { IconButton } from '@/components/ui/IconButton';
import { gsap } from '@/animations/gsap.config';

export function Navbar() {
  const { isAtTop, scrollDirection } = useScrollDirection();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openSearch } = useUIStore();
  const cartCount = useCartStore((state) => state.getCount());
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isTransparent = isAtTop && !isMobileMenuOpen;
  const isHidden = scrollDirection === 'down' && !isAtTop && !isMobileMenuOpen;

  // Animate mobile menu
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (isMobileMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [isMobileMenuOpen]);

  const leftNavItems = navItems.filter((item) => item.position === 'left');
  const rightNavItems = navItems.filter((item) => item.position === 'right');

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/90 backdrop-blur-md border-b border-mono-border',
        isHidden && '-translate-y-full'
      )}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[72px] lg:h-[80px]">
          {/* Left navigation — Desktop */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            {leftNavItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <IconButton
              icon={isMobileMenuOpen ? 'close' : 'menu'}
              label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={toggleMobileMenu}
            />
          </div>

          {/* Center logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2"
            onClick={closeMobileMenu}
          >
            <Logo size="md" />
          </Link>

          {/* Right navigation — Desktop */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
            {rightNavItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}

            {/* Icon buttons */}
            <div className="flex items-center gap-1 ml-4">
              <IconButton
                icon="search"
                label="Search"
                onClick={openSearch}
              />
              <IconButton
                icon="heart"
                label="Wishlist"
                href="/wishlist"
                badge={wishlistCount}
              />
              <IconButton
                icon="bag"
                label="Bag"
                href="/bag"
                badge={cartCount}
              />
              <IconButton
                icon="profile"
                label="Profile"
                href="/profile"
              />
            </div>
          </div>

          {/* Mobile icon buttons */}
          <div className="flex lg:hidden items-center gap-0">
            <IconButton icon="search" label="Search" onClick={openSearch} />
            <IconButton
              icon="bag"
              label="Bag"
              href="/bag"
              badge={cartCount}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-mono-border"
        >
          <div className="px-5 py-8 flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="font-nav text-[14px] uppercase tracking-[0.12em] font-bold text-mono-black hover:text-mono-gray transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={closeMobileMenu}
              className="font-nav text-[14px] uppercase tracking-[0.12em] font-bold text-mono-black hover:text-mono-gray transition-colors duration-300"
            >
              Wishlist
            </Link>
            <Link
              href="/profile"
              onClick={closeMobileMenu}
              className="font-nav text-[14px] uppercase tracking-[0.12em] font-bold text-mono-black hover:text-mono-gray transition-colors duration-300"
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
