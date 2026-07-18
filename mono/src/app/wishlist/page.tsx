'use client';

/**
 * MONO — Wishlist
 *
 * UX Purpose:
 * Elegant saved items page with premium empty state.
 *
 * Components Reused:
 * Navbar, Footer, Container, Section, Typography, ProductCard, Button, Divider
 *
 * Animation Strategy:
 * Cards staggerUp on load
 */

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { ProductCard } from '@/components/cards/ProductCard';
import { useWishlistStore } from '@/store/useWishlistStore';
import { getProducts } from '@/services/product.service';
import { gsap } from '@/animations/gsap.config';
import { LUXURY_EASE, STAGGER_TIGHT } from '@/animations/constants';

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const gridRef = useRef<HTMLDivElement>(null);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all products once; wishlist filter is client-side
  useEffect(() => {
    getProducts({ limit: 100 })
      .then((res) => {
        const data: any[] = (res as any).data?.data || [];
        setAllProducts(data);
      })
      .catch(() => setAllProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  const wishlistProducts = allProducts.filter((p: any) => productIds.includes(p.id));

  // Stagger cards when wishlist data changes
  useEffect(() => {
    if (isLoading || wishlistProducts.length === 0) return;
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.wishlist-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: LUXURY_EASE, stagger: STAGGER_TIGHT, delay: 0.2 }
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, [productIds, isLoading, wishlistProducts.length]);

  return (
    <>
      <Navbar />

      <main>
        <Section spacing="none" className="pt-[100px] sm:pt-[120px]">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <Typography variant="label" muted className="mb-4">
                  Your Wishlist
                </Typography>
                <Typography variant="h1">
                  Saved <span className="italic">Pieces</span>
                </Typography>
              </div>
              {wishlistProducts.length > 0 && (
                <Typography variant="caption" muted>
                  {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''}
                </Typography>
              )}
            </div>
            <Divider className="mb-12 sm:mb-16" />
          </Container>
        </Section>

        <Section spacing="default" ref={gridRef}>
          <Container>
            {wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-y-12">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="wishlist-card">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20 sm:py-32">
                <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center border border-mono-border rounded-full">
                  <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-mono-muted">
                    <path d="M10 17s-7-4.35-7-8.5A3.5 3.5 0 0 1 10 5.97 3.5 3.5 0 0 1 17 8.5C17 12.65 10 17 10 17z" />
                  </svg>
                </div>
                <Typography variant="h3" className="mb-3">
                  Your wishlist is <span className="italic">empty</span>
                </Typography>
                <Typography variant="body" muted className="mb-8 max-w-[360px] mx-auto">
                  Save pieces you love and they'll appear here. Start exploring
                  our collections to find your next favorite.
                </Typography>
                <Link href="/men">
                  <Button variant="primary" size="lg">
                    Explore Collections
                  </Button>
                </Link>
              </div>
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
