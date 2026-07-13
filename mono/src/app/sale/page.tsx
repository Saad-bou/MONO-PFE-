'use client';

/**
 * MONO — Sale Page
 *
 * UX Purpose:
 * Maintain luxury feeling — never look like a discount website.
 * Editorial curation of sale items with elegant price presentation.
 * Language: "Curated Selection" not "SALE" or "DISCOUNT".
 *
 * Components Reused:
 * Navbar, Footer, Container, Section, Typography, ProductCard, Badge,
 * EditorialPlaceholder, Button, Divider
 *
 * New Components: None
 *
 * Animation Strategy:
 * Hero fadeUp, editorial image maskReveal, products staggerUp
 */

import React, { useRef, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Divider } from '@/components/ui/Divider';
import { ProductCard } from '@/components/cards/ProductCard';
import Image from 'next/image';
import { products } from '@/data/products';
import { gsap } from '@/animations/gsap.config';
import {
  SCROLL_START,
  LUXURY_EASE,
  REVEAL_EASE,
  DURATION_SLOW,
  STAGGER_TIGHT,
} from '@/animations/constants';

export default function SalePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const saleProducts = products.filter((p) => p.originalPrice);

  // Hero animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      const title = heroRef.current?.querySelector('.hero-title');
      if (title) {
        gsap.set(title, { y: 60, opacity: 0 });
        tl.to(title, { y: 0, opacity: 1, duration: 1, ease: LUXURY_EASE });
      }

      const desc = heroRef.current?.querySelector('.hero-desc');
      if (desc) {
        gsap.set(desc, { y: 30, opacity: 0 });
        tl.to(desc, { y: 0, opacity: 1, duration: 0.8, ease: LUXURY_EASE }, '-=0.5');
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
      const sectionTitle = gridRef.current?.querySelector('.section-title');
      if (sectionTitle) {
        gsap.fromTo(
          sectionTitle,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: LUXURY_EASE, scrollTrigger: { trigger: sectionTitle, start: SCROLL_START } }
        );
      }

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
  }, []);

  return (
    <>
      <Navbar />

      <main>
        {/* ══════════════════════════════════════════
            Hero Section
            ══════════════════════════════════════════ */}
        <Section spacing="none" className="pt-[100px] sm:pt-[120px]" ref={heroRef}>
          <Container>
            <div className="hero-title text-center mb-6 sm:mb-8">
              <Typography variant="label" gold className="mb-4">
                Curated Selection
              </Typography>
              <Typography variant="display" className="!text-[36px] !leading-[42px] sm:!text-[52px] sm:!leading-[58px] lg:!text-[72px] lg:!leading-[78px] mb-4">
                Selected <span className="italic">Pieces</span>
              </Typography>
            </div>
            <div className="hero-desc text-center mb-12 sm:mb-16">
              <Typography variant="bodyLarge" muted className="max-w-[520px] mx-auto">
                A thoughtfully curated edit of seasonal favorites at considered
                prices. Each piece carries the same standard of craftsmanship
                that defines every MONO creation.
              </Typography>
            </div>
          </Container>

          <Container size="wide">
            <div className="hero-image">
              <div className="relative w-full overflow-hidden min-h-[250px] sm:min-h-[380px]" style={{ aspectRatio: '21/9' }}>
                <Image src="/assets/newsletter/newsletter-bg.webp" alt="MONO luxury fashion editorial hero" fill sizes="100vw" className="object-cover object-center" />
              </div>
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Products Grid
            ══════════════════════════════════════════ */}
        <Section spacing="large" ref={gridRef}>
          <Container>
            <Divider className="mb-12 sm:mb-16" />

            <div className="section-title flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
              <div>
                <Typography variant="label" muted className="mb-4">
                  Selected Edit
                </Typography>
                <Typography variant="h2">
                  {saleProducts.length} Curated <span className="italic">Pieces</span>
                </Typography>
              </div>
              <Typography variant="caption" muted>
                Seasonal selection at considered prices
              </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-y-12">
              {saleProducts.map((product) => (
                <div key={product.id} className="product-card-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Seasonal Statement
            ══════════════════════════════════════════ */}
        <Section spacing="large">
          <Container size="narrow">
            <div className="text-center">
              <Divider gold className="mb-12 sm:mb-16 max-w-[120px] mx-auto" />
              <Typography variant="h2" className="mb-6">
                Fewer, better <span className="italic">things</span>
              </Typography>
              <Typography variant="body" muted className="max-w-[460px] mx-auto">
                Our approach to value is the same as our approach to design —
                intentional, considered, never excessive. These pieces represent
                the enduring quality that defines MONO.
              </Typography>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
