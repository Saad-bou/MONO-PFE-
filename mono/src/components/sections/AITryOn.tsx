'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { TryOnModal } from '@/components/ai/TryOnModal';
import { EditorialPlaceholder } from '@/components/placeholders/EditorialPlaceholder';
import { gsap, ScrollTrigger } from '@/animations/gsap.config';
import { SCROLL_START, LUXURY_EASE, REVEAL_EASE, DURATION_SLOW } from '@/animations/constants';

export function AITryOn() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gold accent line animation
      const goldLine = sectionRef.current?.querySelector('.gold-accent');
      if (goldLine) {
        gsap.fromTo(
          goldLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: REVEAL_EASE,
            scrollTrigger: { trigger: goldLine, start: SCROLL_START },
          }
        );
      }

      // Title and content reveal
      const revealEls = sectionRef.current?.querySelectorAll('.ai-reveal');
      revealEls?.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: LUXURY_EASE,
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: SCROLL_START },
          }
        );
      });

      // Image mask reveal
      const image = sectionRef.current?.querySelector('.ai-image');
      if (image) {
        gsap.fromTo(
          image,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: DURATION_SLOW,
            ease: REVEAL_EASE,
            scrollTrigger: { trigger: image, start: SCROLL_START },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Section id="ai-tryon" spacing="large" ref={sectionRef}>
        <Container>
          {/* Gold accent line */}
          <Divider gold className="gold-accent mb-16 sm:mb-20 origin-left" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Content */}
            <div className="flex flex-col gap-6">
              <div className="ai-reveal">
                <Typography variant="label" gold className="mb-4">
                  Exclusive Technology
                </Typography>
              </div>

              <div className="ai-reveal">
                <Typography variant="display" className="!text-[36px] !leading-[42px] sm:!text-[48px] sm:!leading-[54px] lg:!text-[64px] lg:!leading-[70px]">
                  Try Before <br />
                  You <span className="italic">Buy</span>
                </Typography>
              </div>

              <div className="ai-reveal">
                <Typography variant="bodyLarge" muted className="max-w-[440px]">
                  Upload your photo and let our AI show you how each piece fits your unique style. 
                  A new way to experience fashion — personal, instant, precise.
                </Typography>
              </div>

              {/* Feature list */}
              <div className="ai-reveal flex flex-col gap-4 mt-4">
                {[
                  'AI-powered virtual fitting',
                  'Instant visualization',
                  'Works with any photo',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-mono-gold rounded-full flex-shrink-0" />
                    <Typography variant="body" className="!text-[14px]">
                      {feature}
                    </Typography>
                  </div>
                ))}
              </div>

              <div className="ai-reveal mt-4">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                >
                  Try AI Fitting
                </Button>
              </div>
            </div>

            {/* Right — Visual */}
            <div className="ai-image relative aspect-[3/4] w-full overflow-hidden bg-mono-light">
              <Image
                src="/assets/ai/ai-editorial.webp"
                alt="Artificial intelligence fashion editorial"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </Section>

      <TryOnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
