'use client';

import React, { useRef, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import Image from 'next/image';

import { gsap, ScrollTrigger } from '@/animations/gsap.config';
import { SCROLL_START, DURATION_SLOW, REVEAL_EASE, LUXURY_EASE } from '@/animations/constants';

export function Lookbook() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      const title = sectionRef.current?.querySelector('.lookbook-title');
      if (title) {
        gsap.fromTo(
          title,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: LUXURY_EASE,
            scrollTrigger: { trigger: title, start: SCROLL_START },
          }
        );
      }

      // Image reveals with mask
      const images = sectionRef.current?.querySelectorAll('.lookbook-image');
      images?.forEach((img) => {
        gsap.fromTo(
          img,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: DURATION_SLOW,
            ease: REVEAL_EASE,
            scrollTrigger: { trigger: img, start: SCROLL_START },
          }
        );
      });

      // Captions fade up
      const captions = sectionRef.current?.querySelectorAll('.lookbook-caption');
      captions?.forEach((cap) => {
        gsap.fromTo(
          cap,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: LUXURY_EASE,
            scrollTrigger: { trigger: cap, start: SCROLL_START },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="lookbook" spacing="large" ref={sectionRef}>
      <Container size="wide">
        {/* Section header */}
        <div className="lookbook-title mb-12 sm:mb-16 lg:mb-20">
          <Typography variant="label" muted className="mb-4">
            SS26 Lookbook
          </Typography>
          <Typography variant="h1" className="max-w-[600px]">
            Crafted for
            <span className="italic"> Purpose</span>
          </Typography>
        </div>

        {/* Cinematic lookbook image */}
        <div className="lookbook-image mb-8 sm:mb-12">
          <Image 
            src="/assets/lookbook/cover.webp" 
            alt="MONO luxury fashion editorial hero" 
            width={2560} 
            height={1080} 
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Caption */}
        <div className="lookbook-caption flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-20 sm:mb-28 lg:mb-36">
          <Typography variant="body" muted className="max-w-[480px]">
            Every piece in our collection is designed with intention — 
            where premium materials meet minimal design philosophy.
          </Typography>
          <Typography variant="label" muted>
            01 / 03
          </Typography>
        </div>

        {/* Two-column editorial grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="lookbook-image">
            <Image 
              src="/assets/lookbook/editorial-01.webp" 
              alt="Editorial fashion photography" 
              width={1200} 
              height={1600} 
              className="w-full h-auto object-cover aspect-[4/5]"
            />
          </div>
          <div className="lookbook-image flex flex-col justify-end">
            <Image 
              src="/assets/lookbook/editorial-02.webp" 
              alt="Editorial fashion photography" 
              width={1200} 
              height={1600} 
              className="w-full h-auto object-cover aspect-[3/4]"
            />
          </div>
        </div>

        <div className="lookbook-caption">
          <Typography variant="body" muted className="max-w-[480px]">
            Silhouettes that speak through simplicity. Each garment is a 
            study in restrained elegance.
          </Typography>
        </div>

        {/* Video section */}
        <div className="mt-20 sm:mt-28 lg:mt-36">
          <div className="lookbook-title mb-8 sm:mb-12">
            <Typography variant="label" muted className="mb-4">
              Campaign Film
            </Typography>
            <Typography variant="h2">
              Behind the <span className="italic">Collection</span>
            </Typography>
          </div>
          <div className="lookbook-image aspect-video w-full">
            <video
              src="/assets/videos/lookbook-film.mp4"
              preload="auto"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
