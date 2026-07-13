'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EditorialPlaceholder } from '@/components/placeholders/EditorialPlaceholder';
import { gsap } from '@/animations/gsap.config';
import { SCROLL_START, LUXURY_EASE, REVEAL_EASE, DURATION_SLOW } from '@/animations/constants';

export function Newsletter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background image reveal
      const bg = sectionRef.current?.querySelector('.newsletter-bg');
      if (bg) {
        gsap.fromTo(
          bg,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: DURATION_SLOW,
            ease: REVEAL_EASE,
            scrollTrigger: { trigger: bg, start: SCROLL_START },
          }
        );
      }

      // Content reveal
      const content = sectionRef.current?.querySelector('.newsletter-content');
      if (content) {
        gsap.fromTo(
          content,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: LUXURY_EASE,
            scrollTrigger: { trigger: content, start: SCROLL_START },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="newsletter" spacing="large" ref={sectionRef}>
      <Container>
        <div className="relative">
          {/* Background Image */}
          <div className="newsletter-bg absolute inset-0 overflow-hidden bg-mono-dark">
            <Image
              src="/assets/newsletter/newsletter-bg.webp"
              alt="Luxury fashion newsletter background"
              fill
              className="object-cover opacity-80 mix-blend-overlay"
              sizes="100vw"
            />
          </div>

          {/* Spacer to maintain height */}
          <div className="min-h-[400px] sm:min-h-[500px]" />

          {/* Overlay content */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="newsletter-content text-center px-6 max-w-[540px]">
              <Typography variant="label" className="!text-white/60 mb-4">
                Stay Connected
              </Typography>
              <Typography variant="h2" className="!text-white mb-4">
                Join the MONO <span className="italic">World</span>
              </Typography>
              <Typography
                variant="body"
                className="!text-white/60 !text-[14px] mb-8"
              >
                Be the first to know about new collections, exclusive drops,
                and AI-powered features.
              </Typography>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-[420px] mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 font-body text-[14px] outline-none focus:border-white/50 transition-all duration-300"
                  aria-label="Email address for newsletter"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="!bg-white !text-mono-black hover:!bg-white/90 sm:w-auto"
                >
                  {submitted ? 'Subscribed ✓' : 'Subscribe'}
                </Button>
              </form>

              {submitted && (
                <Typography
                  variant="caption"
                  className="!text-mono-gold mt-4"
                >
                  Welcome to the MONO world.
                </Typography>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
