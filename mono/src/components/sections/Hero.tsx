'use client';

import React, { useEffect, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { gsap } from '@/animations/gsap.config';

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Headline reveal — line by line
      const lines = headlineRef.current?.querySelectorAll('.hero-line');
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

      // Description fade up
      if (descRef.current) {
        gsap.set(descRef.current, { y: 40, opacity: 0 });
        tl.to(
          descRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.6'
        );
      }

      // CTA fade in
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { y: 20, opacity: 0 });
        tl.to(
          ctaRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.4'
        );
      }

      // Image mask reveal
      if (imageRef.current) {
        gsap.set(imageRef.current, {
          clipPath: 'inset(100% 0% 0% 0%)',
        });
        tl.to(
          imageRef.current,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.4,
            ease: 'power4.inOut',
          },
          '-=1.0'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Subtle mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(imageRef.current, {
        x: xPercent * 15,
        y: yPercent * 10,
        duration: 1.2,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Section spacing="none" id="hero" className="min-h-screen flex items-center pt-[80px]">
      <Container size="wide" ref={sectionRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 sm:py-16 lg:py-0">
          {/* Left — Text Content */}
          <div className="flex flex-col gap-6 sm:gap-8 order-2 lg:order-1">
            {/* Headline with overflow hidden per line */}
            <div ref={headlineRef} className="flex flex-col">
              <div className="overflow-hidden">
                <span className="hero-line block font-display text-[42px] leading-[48px] sm:text-[58px] sm:leading-[64px] lg:text-[76px] lg:leading-[82px] font-bold tracking-[-0.03em] text-mono-black">
                  Redefining
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="hero-line block font-display text-[42px] leading-[48px] sm:text-[58px] sm:leading-[64px] lg:text-[76px] lg:leading-[82px] font-bold tracking-[-0.03em] text-mono-black">
                  Minimalist
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="hero-line block font-display text-[42px] leading-[48px] sm:text-[58px] sm:leading-[64px] lg:text-[76px] lg:leading-[82px] font-bold tracking-[-0.03em] italic text-mono-black">
                  Luxury
                </span>
              </div>
            </div>

            {/* Description */}
            <p ref={descRef} className="font-body text-[16px] sm:text-[18px] leading-[28px] sm:leading-[30px] text-mono-gray max-w-[440px]">
              Where artificial intelligence meets premium craftsmanship.
              Explore collections designed for the modern minimalist.
            </p>

            {/* CTA */}
            <div ref={ctaRef} className="flex items-center gap-4">
              <Button variant="primary" size="lg">
                Explore Collection
              </Button>
              <Button variant="ghost" size="lg">
                Our Story
              </Button>
            </div>
          </div>

          {/* Right — Hero Visual */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div ref={imageRef} className="w-full max-w-[520px] lg:max-w-none">
              <Image 
                src="/assets/hero/hero-main.webp" 
                alt="MONO luxury fashion editorial hero" 
                width={1600} 
                height={2000} 
                priority
                className="w-full h-auto object-cover" 
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
