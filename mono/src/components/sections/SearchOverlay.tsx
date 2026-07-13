'use client';

/**
 * MONO — Search Overlay
 *
 * UX Purpose:
 * Premium fullscreen search experience with instant search,
 * recent searches, popular products, and suggested collections.
 *
 * Components Reused:
 * Container, Typography, ProductCard, Divider, IconButton
 *
 * Animation Strategy:
 * Overlay opens with fadeIn, content elements staggerUp. Close with fadeOut.
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Typography } from '@/components/ui/Typography';
import { Divider } from '@/components/ui/Divider';
import { ProductCard } from '@/components/cards/ProductCard';
import { useUIStore } from '@/store/useUIStore';
import { products } from '@/data/products';
import { collections } from '@/data/collections';
import { gsap } from '@/animations/gsap.config';
import { LUXURY_EASE } from '@/animations/constants';

const recentSearches = ['Oversized tee', 'Black trousers', 'Linen shirt', 'Wool blazer'];
const popularProducts = products.filter((p) => p.isFeatured).slice(0, 4);

export function SearchOverlay() {
  const { isSearchOpen, searchQuery, setSearchQuery, closeSearch } = useUIStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  // Animate in
  useEffect(() => {
    if (!isSearchOpen) return;

    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (overlay && content) {
      document.body.style.overflow = 'hidden';

      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      const elements = content.querySelectorAll('.search-reveal');
      gsap.fromTo(
        elements,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: LUXURY_EASE, stagger: 0.04, delay: 0.15 }
      );

      // Focus input
      setTimeout(() => inputRef.current?.focus(), 200);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  const handleClose = useCallback(() => {
    const overlay = overlayRef.current;
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          closeSearch();
        },
      });
    } else {
      closeSearch();
    }
  }, [closeSearch]);

  // ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) handleClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isSearchOpen, handleClose]);

  if (!isSearchOpen) return null;

  const showResults = searchQuery.length >= 2;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] bg-white overflow-y-auto"
    >
      <Container size="wide">
        {/* Header */}
        <div className="flex items-center justify-between h-[72px] lg:h-[80px]">
          <Typography variant="label" muted>
            Search
          </Typography>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center text-mono-black hover:text-mono-gray transition-colors duration-300 cursor-pointer"
            aria-label="Close search"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>
      </Container>

      <Container size="wide" ref={contentRef}>
        {/* Search Input */}
        <div className="search-reveal py-8 sm:py-12">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full font-display text-[28px] sm:text-[40px] lg:text-[52px] font-bold tracking-[-0.02em] text-mono-black placeholder:text-mono-border bg-transparent border-0 outline-none"
            aria-label="Search products"
          />
          <Divider className="mt-4" />
        </div>

        {showResults && searchResults.length > 0 ? (
          /* Search Results */
          <div className="search-reveal pb-16">
            <Typography variant="label" muted className="mb-6">
              {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''}
            </Typography>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {searchResults.map((product) => (
                <div key={product.id} onClick={handleClose}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : showResults && searchResults.length === 0 ? (
          /* No Results */
          <div className="search-reveal text-center py-16">
            <Typography variant="h3" className="mb-3">
              No results for &ldquo;<span className="italic">{searchQuery}</span>&rdquo;
            </Typography>
            <Typography variant="body" muted>
              Try a different search term or explore our collections below.
            </Typography>
          </div>
        ) : (
          /* Default State: Recent + Popular + Collections */
          <>
            {/* Recent Searches */}
            <div className="search-reveal mb-12 sm:mb-16">
              <Typography variant="label" muted className="mb-5">
                Recent Searches
              </Typography>
              <div className="flex flex-wrap gap-3">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-5 py-2.5 border border-mono-border font-body text-[13px] text-mono-gray hover:text-mono-black hover:border-mono-black transition-all duration-300 cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Collections */}
            <div className="search-reveal mb-12 sm:mb-16">
              <Typography variant="label" muted className="mb-5">
                Collections
              </Typography>
              <div className="flex flex-col gap-3">
                {collections.slice(0, 4).map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/men/${collection.slug}`}
                    onClick={handleClose}
                    className="group flex items-center justify-between py-2"
                  >
                    <Typography variant="h4" className="group-hover:text-mono-gray transition-colors duration-300">
                      {collection.name}
                    </Typography>
                    <Typography variant="caption" muted>
                      {collection.productCount} pieces
                    </Typography>
                  </Link>
                ))}
              </div>
            </div>

            <Divider className="search-reveal mb-12 sm:mb-16" />

            {/* Popular Products */}
            <div className="search-reveal pb-16">
              <Typography variant="label" muted className="mb-8">
                Popular Right Now
              </Typography>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
                {popularProducts.map((product) => (
                  <div key={product.id} onClick={handleClose}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
