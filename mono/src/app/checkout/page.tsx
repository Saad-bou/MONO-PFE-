'use client';

/**
 * MONO — Checkout Page
 *
 * Left column  : Contact info · Shipping address (textarea) · Payment method
 * Right column : Order summary from useCartStore · Totals · Place Order CTA
 *
 * No API calls. No backend. Pure UI + Zustand cart read.
 * Mirrors the exact typography, spacing and component conventions of bag/page.tsx.
 */

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Divider } from '@/components/ui/Divider';
import { ProductPlaceholder } from '@/components/placeholders/ProductPlaceholder';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { gsap } from '@/animations/gsap.config';
import { LUXURY_EASE, STAGGER_TIGHT } from '@/animations/constants';
import { checkout as checkoutOrder } from '@/services/order.service';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CheckoutForm {
  email: string;
  fullName: string;
  phone: string;
  address: string;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart, syncFromBackend } = useCartStore();
  const contentRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<CheckoutForm>({
    email: '',
    fullName: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = getTotal();
  const shipping = subtotal > 200 ? 0 : subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;
  const isEmpty = items.length === 0;

  // ── GSAP entrance (mirrors bag page) ──────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = contentRef.current?.querySelectorAll('.co-reveal');
      if (els) {
        gsap.fromTo(
          els,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: LUXURY_EASE,
            stagger: STAGGER_TIGHT,
            delay: 0.15,
          }
        );
      }
    }, contentRef);
    return () => ctx.revert();
  }, []);

  // ── Form helpers ──────────────────────────────────────────────────────────
  const handleField =
    (field: keyof CheckoutForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
    };

  const validate = (): boolean => {
    const next: Partial<CheckoutForm> = {};
    if (!form.email.trim())    next.email    = 'Email is required.';
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.phone.trim())    next.phone    = 'Phone number is required.';
    if (!form.address.trim())  next.address  = 'Shipping address is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setApiError(null);
    setIsSubmitting(true);
    try {
      await checkoutOrder({
        shippingAddress: form.address.trim(),
        paymentMethod: 'CASH_ON_DELIVERY',
      });
      // Success — clear local cart, re-sync backend, show confirmation
      clearCart();
      syncFromBackend().catch(() => {/* non-critical */});
      setOrderPlaced(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Something went wrong. Please try again.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Image resolver (mirrors bag page logic) ────────────────────────────────
  const resolveImage = (
    name: string,
    color: string,
    image?: string | null
  ): string | null => {
    if (name.toLowerCase().includes('essential oversized tee')) {
      const c = color.toLowerCase();
      return `/assets/products/essential-oversized-tee-men/essential-oversized-tee-men-${
        c === 'onyx' ? 'main-onyx' : 'gallery-' + c
      }.webp`;
    }
    return image ?? null;
  };

  // ── Order confirmed screen ─────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <main>
          <Section spacing="none" className="pt-[100px] sm:pt-[120px]">
            <Container>
              <div className="text-center py-24 sm:py-40 max-w-[480px] mx-auto">
                <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center border border-mono-border rounded-full">
                  <svg
                    width="28" height="28" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.2"
                    className="text-mono-gold"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <Typography variant="label" muted className="mb-4 block">
                  Order Received
                </Typography>
                <Typography variant="h2" className="mb-4">
                  Thank you,{' '}
                  <span className="italic">{form.fullName.split(' ')[0]}</span>
                </Typography>
                <Typography variant="body" muted className="mb-10 max-w-[360px] mx-auto">
                  Your order has been placed and will be processed shortly.
                  We will contact you to confirm delivery details.
                </Typography>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/men">
                    <Button variant="primary" size="lg">Continue Shopping</Button>
                  </Link>
                  <Link href="/bag">
                    <Button variant="ghost" size="lg">View Bag</Button>
                  </Link>
                </div>
              </div>
            </Container>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  // ── Main checkout ──────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main ref={contentRef}>

        {/* Page header */}
        <Section spacing="none" className="pt-[100px] sm:pt-[120px]">
          <Container>
            <div className="co-reveal flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <Typography variant="label" muted className="mb-4">
                  Secure Checkout
                </Typography>
                <Typography variant="h1">
                  Check<span className="italic">out</span>
                </Typography>
              </div>
            </div>
            <Divider className="co-reveal mb-12 sm:mb-16" />
          </Container>
        </Section>

        <Section spacing="default">
          <Container>

            {/* ── Empty state ──────────────────────────────────────────────── */}
            {isEmpty ? (
              <div className="text-center py-20 sm:py-32">
                <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center border border-mono-border rounded-full">
                  <svg
                    width="28" height="28" viewBox="0 0 20 20"
                    fill="none" stroke="currentColor" strokeWidth="1"
                    className="text-mono-muted"
                  >
                    <rect x="3" y="6" width="14" height="12" rx="1" />
                    <path d="M7 6V5a3 3 0 0 1 6 0v1" />
                  </svg>
                </div>
                <Typography variant="h3" className="mb-3">
                  Your bag is <span className="italic">empty</span>
                </Typography>
                <Typography variant="body" muted className="mb-8 max-w-[360px] mx-auto">
                  Explore our collections and add pieces to your bag before
                  checking out.
                </Typography>
                <Link href="/">
                  <Button variant="primary" size="lg">Discover Collections</Button>
                </Link>
              </div>

            ) : (

              /* ── Two-column layout ───────────────────────────────────────── */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                {/* ───────────────── LEFT COLUMN ──────────────────────── */}
                <div className="lg:col-span-7 flex flex-col gap-12">

                  {/* STEP 1 — Contact Information */}
                  <div className="co-reveal">
                    <div className="flex items-center gap-4 mb-8">
                      <StepBadge n="1" />
                      <Typography variant="label" className="!text-mono-black">
                        Contact Information
                      </Typography>
                    </div>
                    <div className="flex flex-col gap-6">
                      <Input
                        variant="minimal"
                        label="Email Address"
                        id="co-email"
                        type="email"
                        placeholder="jean@example.com"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleField('email')}
                        error={errors.email}
                      />
                      <Input
                        variant="minimal"
                        label="Full Name"
                        id="co-full-name"
                        placeholder="Jean Dupont"
                        autoComplete="name"
                        value={form.fullName}
                        onChange={handleField('fullName')}
                        error={errors.fullName}
                      />
                      <Input
                        variant="minimal"
                        label="Phone Number"
                        id="co-phone"
                        type="tel"
                        placeholder="+212 6 00 00 00 00"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={handleField('phone')}
                        error={errors.phone}
                      />
                    </div>
                  </div>

                  <Divider className="co-reveal" />

                  {/* STEP 2 — Shipping Address */}
                  <div className="co-reveal">
                    <div className="flex items-center gap-4 mb-8">
                      <StepBadge n="2" />
                      <Typography variant="label" className="!text-mono-black">
                        Shipping Address
                      </Typography>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="co-address"
                        className="font-nav text-[11px] uppercase tracking-[0.12em] font-bold text-mono-gray"
                      >
                        Full Address
                      </label>
                      <textarea
                        id="co-address"
                        rows={4}
                        placeholder="Street, City, Postal Code, Country"
                        autoComplete="street-address"
                        value={form.address}
                        onChange={handleField('address')}
                        className={[
                          'font-body text-[15px] text-mono-black placeholder:text-mono-muted',
                          'outline-none transition-all duration-300 resize-none w-full',
                          'px-0 py-3 border-0 border-b bg-transparent',
                          errors.address
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-mono-border focus:border-mono-black',
                        ].join(' ')}
                      />
                      {errors.address && (
                        <span className="font-body text-[12px] text-red-500">
                          {errors.address}
                        </span>
                      )}
                    </div>
                  </div>

                  <Divider className="co-reveal" />

                  {/* STEP 3 — Payment Method */}
                  <div className="co-reveal">
                    <div className="flex items-center gap-4 mb-8">
                      <StepBadge n="3" />
                      <Typography variant="label" className="!text-mono-black">
                        Payment Method
                      </Typography>
                    </div>

                    {/* Cash on Delivery — selected */}
                    <label
                      htmlFor="pay-cod"
                      className="flex items-center gap-5 p-5 border border-mono-black cursor-pointer mb-3"
                    >
                      <RadioDot checked />
                      <div className="flex-1">
                        <Typography variant="caption" className="!text-mono-black font-medium">
                          Cash on Delivery
                        </Typography>
                        <Typography variant="caption" muted className="mt-0.5">
                          Pay when your order arrives at your door.
                        </Typography>
                      </div>
                      <CodIcon />
                      <input
                        id="pay-cod"
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        defaultChecked
                        className="sr-only"
                      />
                    </label>

                    {/* Credit card — UI prepared, disabled */}
                    <label
                      htmlFor="pay-card"
                      className="flex items-center gap-5 p-5 border border-mono-border cursor-not-allowed opacity-40 mb-3"
                    >
                      <RadioDot checked={false} />
                      <div className="flex-1">
                        <Typography variant="caption" className="!text-mono-black font-medium">
                          Credit / Debit Card
                        </Typography>
                        <Typography variant="caption" muted className="mt-0.5">
                          Coming soon.
                        </Typography>
                      </div>
                      <CardIcon />
                      <input
                        id="pay-card"
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        disabled
                        className="sr-only"
                      />
                    </label>

                    <Typography variant="caption" muted className="mt-2 block">
                      More payment options are on the way.
                    </Typography>
                  </div>

                </div>

                {/* ───────────────── RIGHT COLUMN ─────────────────────── */}
                <div className="lg:col-span-5">
                  <div className="co-reveal lg:sticky lg:top-[100px]">

                    <Typography variant="label" muted className="mb-6">
                      Order Summary
                    </Typography>

                    {/* Product list */}
                    <div className="flex flex-col mb-6">
                      {items.map((item, idx) => {
                        const src = resolveImage(item.name, item.color, item.image);
                        return (
                          <div key={`${item.productId}-${item.color}-${item.size}`}>
                            {idx === 0 && <Divider className="mb-0" />}
                            <div className="py-5 flex gap-4">

                              {/* Thumbnail */}
                              <div className="w-[72px] flex-shrink-0">
                                {src ? (
                                  <div className="relative aspect-[3/4] w-full bg-mono-light overflow-hidden">
                                    <Image src={src} alt={item.name} fill className="object-cover" />
                                  </div>
                                ) : (
                                  <ProductPlaceholder />
                                )}
                              </div>

                              {/* Meta */}
                              <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                  <Typography
                                    variant="caption"
                                    className="font-medium !text-mono-black mb-1 leading-snug"
                                  >
                                    {item.name}
                                  </Typography>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Typography variant="caption" muted>{item.color}</Typography>
                                    <span className="w-0.5 h-0.5 rounded-full bg-mono-border" />
                                    <Typography variant="caption" muted>Size {item.size}</Typography>
                                    <span className="w-0.5 h-0.5 rounded-full bg-mono-border" />
                                    <Typography variant="caption" muted>Qty {item.quantity}</Typography>
                                  </div>
                                </div>
                                <Typography variant="caption" className="!text-mono-black mt-2">
                                  {formatPrice(item.price * item.quantity, 'EUR')}
                                </Typography>
                              </div>
                            </div>
                            <Divider />
                          </div>
                        );
                      })}
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-col gap-4 mb-6">
                      <div className="flex items-center justify-between">
                        <Typography variant="body" muted className="!text-[14px]">Subtotal</Typography>
                        <Typography variant="body" className="!text-[14px]">
                          {formatPrice(subtotal, 'EUR')}
                        </Typography>
                      </div>
                      <div className="flex items-center justify-between">
                        <Typography variant="body" muted className="!text-[14px]">Shipping</Typography>
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
                      <Typography variant="label" className="!text-mono-black">Total</Typography>
                      <Typography variant="h4">{formatPrice(total, 'EUR')}</Typography>
                    </div>

                    <Button
                      id="place-order-btn"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={isEmpty || isSubmitting}
                      onClick={handlePlaceOrder}
                      className="mb-3"
                    >
                      {isSubmitting ? 'Placing Order…' : 'Place Order'}
                    </Button>

                    {apiError && (
                      <Typography variant="caption" className="!text-red-500 text-center block mb-2">
                        {apiError}
                      </Typography>
                    )}

                    <Typography variant="caption" muted className="text-center block">
                      Cash on delivery · No payment required now
                    </Typography>

                    <Divider className="my-6" />

                    {/* Trust signals */}
                    <div className="flex flex-col gap-3">
                      {[
                        'Free returns within 30 days',
                        'Secure & discreet packaging',
                        'Premium quality guaranteed',
                      ].map((b) => (
                        <div key={b} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-mono-gold rounded-full flex-shrink-0" />
                          <Typography variant="caption" muted>{b}</Typography>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

              </div>
            )}

          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}

// ── Micro-components ──────────────────────────────────────────────────────────

function StepBadge({ n }: { n: string }) {
  return (
    <span className="w-6 h-6 rounded-full border border-mono-border flex items-center justify-center flex-shrink-0">
      <span className="font-nav text-[10px] font-bold text-mono-black leading-none">{n}</span>
    </span>
  );
}

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <div className="w-4 h-4 rounded-full border border-mono-black flex items-center justify-center flex-shrink-0">
      {checked && <div className="w-2 h-2 rounded-full bg-mono-black" />}
    </div>
  );
}

function CodIcon() {
  return (
    <div className="flex-shrink-0 opacity-40">
      <svg width="32" height="22" viewBox="0 0 32 22" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="1" y="1" width="30" height="20" rx="2" />
        <circle cx="16" cy="11" r="5" />
        <line x1="1" y1="6" x2="31" y2="6" />
      </svg>
    </div>
  );
}

function CardIcon() {
  return (
    <div className="flex-shrink-0 opacity-40">
      <svg width="32" height="22" viewBox="0 0 32 22" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="1" y="1" width="30" height="20" rx="2" />
        <line x1="1" y1="8" x2="31" y2="8" />
        <rect x="4" y="12" width="6" height="3" rx="0.5" />
      </svg>
    </div>
  );
}
