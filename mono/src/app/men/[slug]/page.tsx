'use client';

/**
 * MONO — Men's Collection Detail
 *
 * UX Purpose:
 * Browse products within a specific collection. Editorial banner introduces
 * the collection narrative, then products are displayed in a curated grid.
 *
 * Components Reused:
 * Navbar, Footer, Container, Section, Typography, ProductCard, Button,
 * Breadcrumb, EditorialPlaceholder, Divider
 *
 * Animation Strategy:
 * Hero maskReveal, product cards staggerUp on scroll
 */

import React, { useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Divider } from '@/components/ui/Divider';
import { ProductCard } from '@/components/cards/ProductCard';
import Image from 'next/image';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { gsap } from '@/animations/gsap.config';
import {
  SCROLL_START,
  LUXURY_EASE,
  REVEAL_EASE,
  DURATION_SLOW,
  STAGGER_TIGHT,
} from '@/animations/constants';

export default function MenCollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const collection = collections.find((c) => c.slug === slug);
  const collectionProducts = products.filter(
    (p) => p.collection === slug && p.category === 'men'
  );

  // If no men-specific products, show all products for this collection
  const displayProducts = collectionProducts.length > 0
    ? collectionProducts
    : products.filter((p) => p.collection === slug);

  // Hero animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      const title = heroRef.current?.querySelector('.collection-title');
      if (title) {
        gsap.set(title, { y: 60, opacity: 0 });
        tl.to(title, { y: 0, opacity: 1, duration: 1, ease: LUXURY_EASE });
      }

      const heroImage = heroRef.current?.querySelector('.hero-image');
      if (heroImage) {
        gsap.set(heroImage, { clipPath: 'inset(100% 0% 0% 0%)' });
        tl.to(
          heroImage,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: DURATION_SLOW, ease: REVEAL_EASE },
          '-=0.6'
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Product cards stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.product-card-item');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: LUXURY_EASE,
            stagger: STAGGER_TIGHT,
            scrollTrigger: { trigger: cards[0], start: SCROLL_START },
          }
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, [slug]);

  if (!collection) {
    return (
      <>
        <Navbar />
        <main>
          <Section spacing="large" className="pt-[120px]">
            <Container>
              <div className="text-center py-20">
                <Typography variant="h2" className="mb-4">
                  Collection not found
                </Typography>
                <Typography variant="body" muted>
                  The collection you're looking for doesn't exist.
                </Typography>
              </div>
            </Container>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main>
        {/* Breadcrumb */}
        <div className="pt-[96px] sm:pt-[100px]">
          <Container>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Men', href: '/men' },
                { label: collection.name },
              ]}
            />
          </Container>
        </div>

        {/* Hero Banner */}
        <Section spacing="compact" ref={heroRef}>
          <Container size="wide">
            <div className="collection-title mb-8 sm:mb-12">
              <Typography variant="label" muted className="mb-4">
                {collection.season} Collection
              </Typography>
              <Typography variant="display" className="!text-[36px] !leading-[42px] sm:!text-[52px] sm:!leading-[58px] lg:!text-[72px] lg:!leading-[78px] mb-4">
                {collection.name}
              </Typography>
              <Typography variant="bodyLarge" muted className="max-w-[560px]">
                {collection.description}
              </Typography>
            </div>

            <div className="hero-image">
              <div className="relative w-full overflow-hidden min-h-[240px] sm:min-h-[360px]" style={{ aspectRatio: '21/9' }}>
                <Image src="/assets/lookbook/cover.webp" alt={`${collection.name} editorial campaign`} fill sizes="100vw" className="object-cover object-[50%_25%]" />
              </div>
            </div>
          </Container>
        </Section>

        {/* Products Grid */}
        <Section spacing="large" ref={gridRef}>
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
              <Typography variant="h3">
                {displayProducts.length} Piece{displayProducts.length !== 1 ? 's' : ''}
              </Typography>
            </div>

            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-y-12">
                {displayProducts.map((product) => (
                  <div key={product.id} className="product-card-item">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Typography variant="body" muted>
                  Products are being curated for this collection.
                </Typography>
              </div>
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
