'use client';

/**
 * MONO — Women's Collection
 *
 * UX Purpose:
 * Identical structure to Men page — only content changes.
 * Luxury editorial landing introducing women's collections through storytelling.
 *
 * Components Reused:
 * Same as Men page — Navbar, Footer, Container, Section, Typography, Button,
 * Divider, EditorialPlaceholder
 *
 * New Components: None
 *
 * Animation Strategy:
 * Identical to Men page — textReveal, maskReveal, staggerUp
 */

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import Image from 'next/image';
import { collections } from '@/data/collections';
import { gsap } from '@/animations/gsap.config';
import {
  SCROLL_START,
  LUXURY_EASE,
  REVEAL_EASE,
  DURATION_SLOW,
  STAGGER_BASE,
} from '@/animations/constants';

const womenCollections = collections;

export default function WomenPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);
  const editorialRef = useRef<HTMLDivElement>(null);

  // Hero animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      const lines = heroRef.current?.querySelectorAll('.hero-line');
      if (lines) {
        gsap.set(lines, { y: '110%', opacity: 0 });
        tl.to(lines, {
          y: '0%',
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.08,
        });
      }

      const desc = heroRef.current?.querySelector('.hero-desc');
      if (desc) {
        gsap.set(desc, { y: 40, opacity: 0 });
        tl.to(desc, { y: 0, opacity: 1, duration: 0.8, ease: LUXURY_EASE }, '-=0.6');
      }

      const cta = heroRef.current?.querySelector('.hero-cta');
      if (cta) {
        gsap.set(cta, { y: 20, opacity: 0 });
        tl.to(cta, { y: 0, opacity: 1, duration: 0.6, ease: LUXURY_EASE }, '-=0.4');
      }

      const heroImage = heroRef.current?.querySelector('.hero-image');
      if (heroImage) {
        gsap.set(heroImage, { clipPath: 'inset(100% 0% 0% 0%)' });
        tl.to(
          heroImage,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: REVEAL_EASE },
          '-=1.0'
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Collection cards stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = collectionsRef.current?.querySelector('.section-title');
      if (title) {
        gsap.fromTo(
          title,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: LUXURY_EASE, scrollTrigger: { trigger: title, start: SCROLL_START } }
        );
      }

      const cards = collectionsRef.current?.querySelectorAll('.collection-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: LUXURY_EASE, stagger: STAGGER_BASE, scrollTrigger: { trigger: cards[0], start: SCROLL_START } }
        );
      }
    }, collectionsRef);

    return () => ctx.revert();
  }, []);

  // Editorial section animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const images = editorialRef.current?.querySelectorAll('.editorial-image');
      images?.forEach((img) => {
        gsap.fromTo(
          img,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: DURATION_SLOW, ease: REVEAL_EASE, scrollTrigger: { trigger: img, start: SCROLL_START } }
        );
      });

      const texts = editorialRef.current?.querySelectorAll('.editorial-text');
      texts?.forEach((txt) => {
        gsap.fromTo(
          txt,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: LUXURY_EASE, scrollTrigger: { trigger: txt, start: SCROLL_START } }
        );
      });
    }, editorialRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />

      <main>
        {/* ══════════════════════════════════════════
            Hero Section
            ══════════════════════════════════════════ */}
        <Section spacing="none" className="min-h-screen flex items-center pt-[80px]">
          <Container size="wide" ref={heroRef}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-12 sm:py-16 lg:py-0">
              {/* Text */}
              <div className="flex flex-col gap-6 sm:gap-8 order-2 lg:order-1">
                <div>
                  <Typography variant="label" muted className="mb-5">
                    Women's Collection — SS26
                  </Typography>
                  <div className="flex flex-col">
                    <div className="overflow-hidden">
                      <span className="hero-line block font-display text-[38px] leading-[44px] sm:text-[52px] sm:leading-[58px] lg:text-[68px] lg:leading-[74px] font-bold tracking-[-0.03em] text-mono-black">
                        Effortless
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="hero-line block font-display text-[38px] leading-[44px] sm:text-[52px] sm:leading-[58px] lg:text-[68px] lg:leading-[74px] font-bold tracking-[-0.03em] text-mono-black">
                        Feminine
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="hero-line block font-display text-[38px] leading-[44px] sm:text-[52px] sm:leading-[58px] lg:text-[68px] lg:leading-[74px] font-bold tracking-[-0.03em] italic text-mono-black">
                        Precision
                      </span>
                    </div>
                  </div>
                </div>

                <p className="hero-desc font-body text-[16px] sm:text-[18px] leading-[28px] sm:leading-[30px] text-mono-gray max-w-[420px]">
                  Fluid silhouettes and architectural precision. Explore collections
                  designed for women who choose intention over impulse, quality over
                  quantity.
                </p>

                <div className="hero-cta flex items-center gap-4">
                  <Button variant="primary" size="lg">
                    Explore Collections
                  </Button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="hero-image w-full max-w-[520px] lg:max-w-none">
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    <Image src="/assets/collections/oversized.webp" alt="MONO luxury fashion editorial hero" fill loading="lazy" sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[50%_25%]" />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Collections Grid
            ══════════════════════════════════════════ */}
        <Section spacing="large" ref={collectionsRef}>
          <Container>
            <div className="section-title flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 lg:mb-20">
              <div>
                <Typography variant="label" muted className="mb-4">
                  Editorial Collections
                </Typography>
                <Typography variant="h1">
                  Discover the <span className="italic">Vision</span>
                </Typography>
              </div>
              <Typography variant="caption" muted className="sm:mb-2">
                {womenCollections.length} Collections
              </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {womenCollections.slice(0, 2).map((collection) => (
                <Link key={collection.id} href={`/women/${collection.slug}`} className="collection-card group cursor-pointer">
                  <div className="relative overflow-hidden mb-5">
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
                      <Image src={`/assets/collections/${collection.slug}.webp`} alt={`${collection.name} editorial campaign`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6 sm:p-8">
                      <div>
                        <Typography variant="label" className="!text-white/70 mb-2">
                          {collection.season} — {collection.productCount} Pieces
                        </Typography>
                        <Typography variant="h3" className="!text-white !font-display">
                          {collection.name}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <Typography variant="caption" muted>
                    {collection.tagline}
                  </Typography>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {womenCollections.slice(2).map((collection) => (
                <Link key={collection.id} href={`/women/${collection.slug}`} className="collection-card group cursor-pointer">
                  <div className="relative overflow-hidden mb-5">
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
                      <Image src={`/assets/collections/${collection.slug}.webp`} alt={`${collection.name} editorial campaign`} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover object-center" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-5 sm:p-6">
                      <div>
                        <Typography variant="label" className="!text-white/70 mb-1">
                          {collection.season}
                        </Typography>
                        <Typography variant="h4" className="!text-white !font-display">
                          {collection.name}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <Typography variant="caption" muted>
                    {collection.tagline}
                  </Typography>
                </Link>
              ))}
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Editorial Feature
            ══════════════════════════════════════════ */}
        <Section spacing="large" ref={editorialRef}>
          <Container size="wide">
            <Divider className="mb-16 sm:mb-20" />

            <div className="editorial-image mb-8 sm:mb-12">
              <div className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[400px]" style={{ aspectRatio: '21/9' }}>
                <Image src="/assets/story/studio-editorial.webp" alt="MONO luxury fashion editorial hero" fill sizes="100vw" className="object-cover object-[50%_30%]" />
              </div>
            </div>

            <div className="editorial-text flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-20 sm:mb-28 lg:mb-36">
              <div className="max-w-[520px]">
                <Typography variant="h3" className="mb-4">
                  Where fluidity meets <span className="italic">structure</span>
                </Typography>
                <Typography variant="body" muted>
                  Our women's collections explore the tension between softness
                  and precision. Every drape, every seam, every proportion is
                  calibrated to move with the body, not against it.
                </Typography>
              </div>
              <Typography variant="label" muted>
                SS26 Campaign
              </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="editorial-image">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
                  <Image src="/assets/journal/inside-the-studio.webp" alt="Editorial fashion photography" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
                </div>
              </div>
              <div className="editorial-image flex flex-col justify-end">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  <Image src="/assets/journal/monochrome-living.webp" alt="Editorial fashion photography" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
                </div>
              </div>
            </div>

            <div className="editorial-text mt-8 sm:mt-12">
              <Typography variant="body" muted className="max-w-[480px]">
                Garments designed for the woman who understands that true luxury
                lies in restraint — in the confidence of wearing less, but better.
              </Typography>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
