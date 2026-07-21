'use client';

/**
 * MONO — Shopping Cart (Bag)
 *
 * UX Purpose:
 * Minimal, premium cart experience. Beautiful product summary,
 * quantity controls, order summary, and luxury checkout CTA.
 *
 * Components Reused:
 * Navbar, Footer, Container, Section, Typography, Button, Divider,
 * QuantitySelector, ProductPlaceholder
 *
 * Animation Strategy:
 * fadeUp entry, item removal with smooth transition
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
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { ProductPlaceholder } from '@/components/placeholders/ProductPlaceholder';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { gsap } from '@/animations/gsap.config';
import { LUXURY_EASE, STAGGER_TIGHT } from '@/animations/constants';
import { CartItemImage } from '@/components/ui/CartItemImage';

export default function BagPage() {
  const { items, removeItem, updateQuantity, getTotal, getCount } = useCartStore();
  const contentRef = useRef<HTMLDivElement>(null);

  const subtotal = getTotal();
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  // Animate items on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = contentRef.current?.querySelectorAll('.bag-reveal');
      if (elements) {
        gsap.fromTo(
          elements,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: LUXURY_EASE, stagger: STAGGER_TIGHT, delay: 0.2 }
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />

      <main ref={contentRef}>
        <Section spacing="none" className="pt-[100px] sm:pt-[120px]">
          <Container>
            <div className="bag-reveal flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <Typography variant="label" muted className="mb-4">
                  Your Bag
                </Typography>
                <Typography variant="h1">
                  Shopping <span className="italic">Bag</span>
                </Typography>
              </div>
              {items.length > 0 && (
                <Typography variant="caption" muted>
                  {getCount()} item{getCount() !== 1 ? 's' : ''}
                </Typography>
              )}
            </div>
            <Divider className="bag-reveal mb-12 sm:mb-16" />
          </Container>
        </Section>

        <Section spacing="default">
          <Container>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* Cart Items */}
                <div className="lg:col-span-7">
                  <div className="flex flex-col">
                    {items.map((item, index) => {
                      return (
                      <div key={`${item.productId}-${item.color}-${item.size}`} className="bag-reveal">
                        {index === 0 && <Divider className="mb-0" />}
                        <div className="py-6 sm:py-8 flex gap-5 sm:gap-8">
                          {/* Product Image */}
                          <div className="w-[100px] sm:w-[120px] flex-shrink-0">
                            <CartItemImage item={item} />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <Typography variant="caption" className="font-medium !text-mono-black mb-1">
                                {item.name}
                              </Typography>
                              <div className="flex items-center gap-3 mb-1">
                                <Typography variant="caption" muted>
                                  {item.color}
                                </Typography>
                                <span className="w-1 h-1 rounded-full bg-mono-border" />
                                <Typography variant="caption" muted>
                                  Size {item.size}
                                </Typography>
                              </div>
                              <Typography variant="caption" className="!text-mono-black">
                                {formatPrice(item.price, 'EUR')}
                              </Typography>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <QuantitySelector
                                quantity={item.quantity}
                                onIncrement={() =>
                                  updateQuantity(item.productId, item.color, item.size, item.quantity + 1)
                                }
                                onDecrement={() =>
                                  updateQuantity(item.productId, item.color, item.size, item.quantity - 1)
                                }
                              />

                              <button
                                onClick={() => removeItem(item.productId, item.color, item.size)}
                                className="font-nav text-[10px] uppercase tracking-[0.12em] font-bold text-mono-muted hover:text-mono-black transition-colors duration-300 cursor-pointer underline underline-offset-2"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        <Divider />
                      </div>
                    )})}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-5">
                  <div className="bag-reveal lg:sticky lg:top-[100px]">
                    <Typography variant="label" muted className="mb-6">
                      Order Summary
                    </Typography>

                    <div className="flex flex-col gap-4 mb-6">
                      <div className="flex items-center justify-between">
                        <Typography variant="body" muted className="!text-[14px]">
                          Subtotal
                        </Typography>
                        <Typography variant="body" className="!text-[14px]">
                          {formatPrice(subtotal, 'EUR')}
                        </Typography>
                      </div>
                      <div className="flex items-center justify-between">
                        <Typography variant="body" muted className="!text-[14px]">
                          Shipping
                        </Typography>
                        <Typography variant="body" className="!text-[14px]">
                          {shipping === 0 ? 'Complimentary' : formatPrice(shipping, 'EUR')}
                        </Typography>
                      </div>
                      {shipping > 0 && (
                        <Typography variant="caption" muted>
                          Free shipping on orders over €200
                        </Typography>
                      )}
                    </div>

                    <Divider className="mb-6" />

                    <div className="flex items-center justify-between mb-8">
                      <Typography variant="label" className="!text-mono-black">
                        Total
                      </Typography>
                      <Typography variant="h4">
                        {formatPrice(total, 'EUR')}
                      </Typography>
                    </div>

                    <Link href="/checkout">
                      <Button variant="primary" size="lg" fullWidth className="mb-3">
                        Proceed to Checkout
                      </Button>
                    </Link>

                    <Typography variant="caption" muted className="text-center block">
                      Taxes calculated at checkout
                    </Typography>

                    <Divider className="my-6" />

                    <div className="flex flex-col gap-3">
                      {[
                        'Free returns within 30 days',
                        'Secure payment processing',
                        'Premium packaging included',
                      ].map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-mono-gold rounded-full flex-shrink-0" />
                          <Typography variant="caption" muted>
                            {benefit}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20 sm:py-32">
                <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center border border-mono-border rounded-full">
                  <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-mono-muted">
                    <rect x="3" y="6" width="14" height="12" rx="1" />
                    <path d="M7 6V5a3 3 0 0 1 6 0v1" />
                  </svg>
                </div>
                <Typography variant="h3" className="mb-3">
                  Your bag is <span className="italic">empty</span>
                </Typography>
                <Typography variant="body" muted className="mb-8 max-w-[360px] mx-auto">
                  Discover our curated collections and find pieces that speak
                  to your personal sense of style.
                </Typography>
                <Link href="/men">
                  <Button variant="primary" size="lg">
                    Continue Shopping
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
