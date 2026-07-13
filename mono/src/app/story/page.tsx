'use client';

/**
 * MONO — Our Story
 *
 * UX Purpose:
 * Long-form editorial page — feels like reading a luxury fashion magazine.
 * Generous white space, alternating image/text layouts, beautiful typography.
 *
 * Components Reused:
 * Navbar, Footer, Container, Section, Typography, Divider,
 * EditorialPlaceholder, Button
 *
 * New Components: None
 *
 * Animation Strategy:
 * Each section reveals independently with fadeUp.
 * Images use maskReveal. Timeline uses staggerUp.
 */

import React, { useRef, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Divider } from '@/components/ui/Divider';
import Image from 'next/image';
import { gsap } from '@/animations/gsap.config';
import {
  SCROLL_START,
  LUXURY_EASE,
  REVEAL_EASE,
  DURATION_SLOW,
  STAGGER_LOOSE,
} from '@/animations/constants';

const timeline = [
  { year: '2024', title: 'The Beginning', description: 'MONO was born from a simple question — what if fashion prioritized intention over trend?' },
  { year: '2025', title: 'AI Integration', description: 'We pioneered AI-powered virtual try-on, bringing technology into the luxury fashion experience.' },
  { year: '2025', title: 'First Collection', description: 'Our debut capsule of 12 pieces sold out within 48 hours, confirming that the market craved restraint.' },
  { year: '2026', title: 'Global Expansion', description: 'MONO extends its reach across Europe and Asia, maintaining the same obsessive attention to detail.' },
  { year: '2026', title: 'The Future', description: 'Exploring sustainable fabrications, advanced AI styling, and a vision for fashion that serves the individual.' },
];

const values = [
  { number: '01', title: 'Intention', description: 'Every design decision serves a purpose. Nothing is decorative. Everything is deliberate.' },
  { number: '02', title: 'Quality', description: 'We source the finest materials and partner with artisan manufacturers who share our obsession with perfection.' },
  { number: '03', title: 'Restraint', description: 'We believe the most powerful statement in fashion is knowing when to stop. Less, but exponentially better.' },
  { number: '04', title: 'Innovation', description: 'From AI-powered fitting to intelligent design systems, we use technology to enhance the human experience of clothing.' },
];

export default function StoryPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

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
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Section animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveals
      const images = sectionsRef.current?.querySelectorAll('.story-image');
      images?.forEach((img) => {
        gsap.fromTo(
          img,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: DURATION_SLOW, ease: REVEAL_EASE, scrollTrigger: { trigger: img, start: SCROLL_START } }
        );
      });

      // Text reveals
      const texts = sectionsRef.current?.querySelectorAll('.story-text');
      texts?.forEach((txt) => {
        gsap.fromTo(
          txt,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: LUXURY_EASE, scrollTrigger: { trigger: txt, start: SCROLL_START } }
        );
      });

      // Timeline items stagger
      const timelineItems = sectionsRef.current?.querySelectorAll('.timeline-item');
      if (timelineItems && timelineItems.length > 0) {
        gsap.fromTo(
          timelineItems,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: LUXURY_EASE,
            stagger: STAGGER_LOOSE,
            scrollTrigger: { trigger: timelineItems[0], start: SCROLL_START },
          }
        );
      }

      // Values stagger
      const valueItems = sectionsRef.current?.querySelectorAll('.value-item');
      if (valueItems && valueItems.length > 0) {
        gsap.fromTo(
          valueItems,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: LUXURY_EASE,
            stagger: STAGGER_LOOSE,
            scrollTrigger: { trigger: valueItems[0], start: SCROLL_START },
          }
        );
      }
    }, sectionsRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />

      <main ref={sectionsRef}>
        {/* ══════════════════════════════════════════
            Hero
            ══════════════════════════════════════════ */}
        <Section spacing="none" className="min-h-[70vh] flex items-center pt-[100px] sm:pt-[120px]">
          <Container size="narrow" ref={heroRef}>
            <div className="text-center">
              <Typography variant="label" muted className="mb-6">
                Our Story
              </Typography>
              <div className="flex flex-col items-center mb-8">
                <div className="overflow-hidden">
                  <span className="hero-line block font-display text-[36px] leading-[42px] sm:text-[52px] sm:leading-[58px] lg:text-[72px] lg:leading-[78px] font-bold tracking-[-0.03em] text-mono-black">
                    The MONO
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="hero-line block font-display text-[36px] leading-[42px] sm:text-[52px] sm:leading-[58px] lg:text-[72px] lg:leading-[78px] font-bold tracking-[-0.03em] italic text-mono-black">
                    Philosophy
                  </span>
                </div>
              </div>
              <p className="hero-desc font-body text-[16px] sm:text-[18px] lg:text-[20px] leading-[28px] sm:leading-[32px] text-mono-gray max-w-[520px] mx-auto">
                We exist at the intersection of luxury and restraint. Every
                decision we make serves a single purpose — to create the most
                refined essentials for the modern individual.
              </p>
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Our Philosophy — Image Left, Text Right
            ══════════════════════════════════════════ */}
        <Section spacing="large">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="story-image relative aspect-[4/5]">
                <Image src="/assets/story/story-hero.webp" alt="MONO brand story" fill unoptimized className="object-contain object-center" />
              </div>
              <div className="story-text">
                <Typography variant="label" muted className="mb-5">
                  01 — Our Philosophy
                </Typography>
                <Typography variant="h2" className="mb-6">
                  Less is the ultimate <span className="italic">luxury</span>
                </Typography>
                <Typography variant="body" muted className="mb-4">
                  In a world of excess, we chose subtraction. MONO was founded on
                  the belief that the most powerful garments are those that say
                  nothing — and everything — at once.
                </Typography>
                <Typography variant="body" muted>
                  Our design philosophy is rooted in the Japanese concept of
                  "Ma" — the power of negative space. We design what isn't there
                  as carefully as what is.
                </Typography>
              </div>
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Craftsmanship — Text Left, Image Right
            ══════════════════════════════════════════ */}
        <Section spacing="large">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="story-text order-2 lg:order-1">
                <Typography variant="label" muted className="mb-5">
                  02 — Craftsmanship
                </Typography>
                <Typography variant="h2" className="mb-6">
                  Obsessive <span className="italic">attention</span> to detail
                </Typography>
                <Typography variant="body" muted className="mb-4">
                  Every stitch, every seam, every thread tension is considered.
                  We partner with artisan manufacturers across Italy, Portugal,
                  and Japan — workshops that share our obsession with perfection.
                </Typography>
                <Typography variant="body" muted>
                  Our fabrics are sourced from the finest mills in the world.
                  Each material is tested for hand-feel, drape, durability, and
                  its ability to age beautifully over time.
                </Typography>
              </div>
              <div className="story-image order-1 lg:order-2 relative aspect-[4/5]">
                <Image src="/assets/story/craftsmanship.webp" alt="MONO brand story" fill loading="lazy" sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Minimal Design — Full Width
            ══════════════════════════════════════════ */}
        <Section spacing="large">
          <Container size="wide">
            <div className="story-image mb-12 sm:mb-16 relative aspect-[3/2] sm:aspect-[21/9] sm:min-h-[450px]">
              <Image src="/assets/story/minimal-design.webp" alt="MONO brand story" fill loading="lazy" sizes="100vw" className="object-cover object-center" />
            </div>
            <Container size="narrow">
              <div className="story-text text-center">
                <Typography variant="label" muted className="mb-5">
                  03 — Minimal Design
                </Typography>
                <Typography variant="h2" className="mb-6">
                  The architecture of <span className="italic">simplicity</span>
                </Typography>
                <Typography variant="body" muted className="max-w-[520px] mx-auto">
                  Our design process is reductive. We begin with a concept and
                  systematically remove everything that doesn't serve the garment's
                  essential purpose. What remains is pure — a distilled expression
                  of form, fabric, and function.
                </Typography>
              </div>
            </Container>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Artificial Intelligence — Image Left, Text Right
            ══════════════════════════════════════════ */}
        <Section spacing="large">
          <Container size="wide">
            <Divider gold className="mb-16 sm:mb-20" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="story-image relative aspect-[3/4]">
                <Image src="/assets/story/ai-philosophy.webp" alt="MONO brand story" fill loading="lazy" sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="story-text">
                <Typography variant="label" gold className="mb-5">
                  04 — Artificial Intelligence
                </Typography>
                <Typography variant="h2" className="mb-6">
                  Technology that serves <span className="italic">you</span>
                </Typography>
                <Typography variant="body" muted className="mb-4">
                  MONO pioneers the use of AI in luxury fashion — not to replace
                  human creativity, but to amplify it. Our AI-powered virtual
                  try-on lets you experience garments before they arrive.
                </Typography>
                <Typography variant="body" muted>
                  From intelligent size recommendations to personalized styling
                  suggestions, our technology learns your preferences and evolves
                  with your wardrobe — making every interaction more intuitive
                  than the last.
                </Typography>
              </div>
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Future of Fashion — Statement Quote
            ══════════════════════════════════════════ */}
        <Section spacing="large">
          <Container size="narrow">
            <div className="story-text text-center py-8 sm:py-16">
              <Typography variant="label" muted className="mb-8">
                05 — Future of Fashion
              </Typography>
              <Typography variant="display" className="!text-[28px] !leading-[36px] sm:!text-[40px] sm:!leading-[50px] lg:!text-[52px] lg:!leading-[62px] mb-8">
                "The future of fashion is not more —
                <br className="hidden sm:block" />
                {' '}it is <span className="italic">precisely enough.</span>"
              </Typography>
              <Divider gold className="max-w-[60px] mx-auto mb-6" />
              <Typography variant="caption" muted>
                MONO Manifesto, 2024
              </Typography>
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Timeline
            ══════════════════════════════════════════ */}
        <Section spacing="large">
          <Container size="narrow">
            <div className="story-text text-center mb-16 sm:mb-20">
              <Typography variant="label" muted className="mb-4">
                Our Journey
              </Typography>
              <Typography variant="h1">
                The <span className="italic">Timeline</span>
              </Typography>
            </div>

            <div className="flex flex-col">
              {timeline.map((item, index) => (
                <div key={`${item.year}-${index}`} className="timeline-item">
                  {index === 0 && <Divider className="mb-0" />}
                  <div className="py-8 sm:py-10 grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-3 sm:col-span-2">
                      <Typography variant="label" gold>
                        {item.year}
                      </Typography>
                    </div>
                    <div className="col-span-9 sm:col-span-3">
                      <Typography variant="h4">{item.title}</Typography>
                    </div>
                    <div className="col-span-12 sm:col-span-7">
                      <Typography variant="body" muted>
                        {item.description}
                      </Typography>
                    </div>
                  </div>
                  <Divider />
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Brand Values
            ══════════════════════════════════════════ */}
        <Section spacing="large">
          <Container size="narrow">
            <div className="story-text text-center mb-16 sm:mb-20">
              <Typography variant="label" muted className="mb-4">
                What We Stand For
              </Typography>
              <Typography variant="h1">
                Our <span className="italic">Values</span>
              </Typography>
            </div>

            <div className="flex flex-col">
              {values.map((value, index) => (
                <div key={value.number} className="value-item">
                  {index === 0 && <Divider className="mb-0" />}
                  <div className="py-8 sm:py-10 grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-2 sm:col-span-1">
                      <Typography variant="caption" muted>
                        {value.number}
                      </Typography>
                    </div>
                    <div className="col-span-10 sm:col-span-3">
                      <Typography variant="h4">{value.title}</Typography>
                    </div>
                    <div className="col-span-12 sm:col-span-8">
                      <Typography variant="body" muted>
                        {value.description}
                      </Typography>
                    </div>
                  </div>
                  <Divider />
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Studio Images
            ══════════════════════════════════════════ */}
        <Section spacing="large">
          <Container size="wide">
            <div className="story-image relative aspect-[3/2] sm:aspect-[21/9] sm:min-h-[450px]">
              <Image src="/assets/story/studio-editorial.webp" alt="MONO brand story" fill loading="lazy" sizes="100vw" className="object-cover object-center" />
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
