'use client';

/**
 * MONO — Product Details
 *
 * UX Purpose:
 * The strongest conversion page. Must feel premium and complete.
 * Large gallery, detailed product info, AI Try-On integration,
 * related products, and sticky purchase panel.
 *
 * Components Reused:
 * Navbar, Footer, Container, Section, Typography, Button, Badge,
 * ColorSwatch, SizeSelector, ProductCard, Divider, Breadcrumb, Modal,
 * GalleryPlaceholder, ProductPlaceholder
 *
 * New Components: None (GalleryPlaceholder already created)
 *
 * Animation Strategy:
 * Image fadeIn, content fadeUp with stagger, related products staggerUp
 */

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { SizeSelector } from '@/components/ui/SizeSelector';
import { Divider } from '@/components/ui/Divider';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProductCard } from '@/components/cards/ProductCard';
import { GalleryPlaceholder } from '@/components/placeholders/GalleryPlaceholder';
import Image from 'next/image';
import { TryOnModal } from '@/components/ai/TryOnModal';
import { getProductBySlug, getProducts } from '@/services/product.service';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTryOnStore } from '@/store/useTryOnStore';
import { formatPrice } from '@/lib/utils';
import { gsap } from '@/animations/gsap.config';
import {
  SCROLL_START,
  LUXURY_EASE,
  STAGGER_TIGHT,
} from '@/animations/constants';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeColor, setActiveColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToBag, setAddedToBag] = useState(false);

  const productImages = React.useMemo(() => {
    if (!product || !product.colors || product.colors.length === 0) return [];
    
    const basePath = `/assets/products/${product.slug}-${product.category}/${product.slug}-${product.category}`;
    const mainColorObj = product.colors.find((c: any) => ['onyx', 'olive'].includes(c.name.toLowerCase())) || product.colors[0];
    const mainColor = mainColorObj.name.toLowerCase();
    
    const otherColors = product.colors
      .filter((c: any) => c.name.toLowerCase() !== mainColor)
      .map((c: any) => c.name.toLowerCase());
    
    const images = [
      `${basePath}-main-${mainColor}.webp`,
      `${basePath}-hover-${mainColor}.webp`,
      ...otherColors.map((color: string) => `${basePath}-gallery-${color}.webp`),
      `${basePath}-gallery-back-${mainColor}.webp`,
      `${basePath}-gallery-closeup-${mainColor}.webp`
    ];
    
    return images.slice(0, 6);
  }, [product]);

  const stylingNoteImageIndex = React.useMemo(
    () => Math.floor(Math.random() * 6),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product?.slug]
  );

  useEffect(() => {
    if (product && product.colors && product.colors[activeColor]) {
      const colorName = product.colors[activeColor].name.toLowerCase();
      const mainColorObj = product.colors.find((c: any) => ['onyx', 'olive'].includes(c.name.toLowerCase())) || product.colors[0];
      const mainColor = mainColorObj.name.toLowerCase();
      
      if (colorName === mainColor) {
        setActiveImage(0);
      } else {
        const otherColors = product.colors
          .filter((c: any) => c.name.toLowerCase() !== mainColor)
          .map((c: any) => c.name.toLowerCase());
        const colorIndex = otherColors.indexOf(colorName);
        if (colorIndex !== -1) {
          setActiveImage(2 + colorIndex);
        }
      }
    }
  }, [activeColor, product]);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getProductBySlug(slug);
        // transformSingleResponse mutates res.data.data in-place;
        // axios response shape: { data: { success, data: <product> } }
        const fetchedProduct = (response as any).data?.data || (response as any).data;
        if (!fetchedProduct || !fetchedProduct.id) throw new Error('Not found');
        setProduct(fetchedProduct);
        
        try {
          // category is already normalized to a slug string by transformProduct
          const categorySlug = typeof fetchedProduct.category === 'string'
            ? fetchedProduct.category
            : fetchedProduct.category?.slug || '';
          const relatedRes = await getProducts({ category: categorySlug, limit: 5 });
          let related = (relatedRes as any).data?.data || (relatedRes as any).data || [];
          related = related.filter((p: any) => p.id !== fetchedProduct.id).slice(0, 4);
          setRelatedProducts(related);
        } catch (e) {
          // silently fail related products
        }
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [slug]);

  const contentRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const selectProduct = useTryOnStore((state) => state.selectProduct);

  // Content fade up
  useEffect(() => {
    if (isLoading || error || !product) return;
    const ctx = gsap.context(() => {
      const elements = contentRef.current?.querySelectorAll('.product-reveal');
      if (elements) {
        gsap.fromTo(
          elements,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: LUXURY_EASE, stagger: 0.06, delay: 0.3 }
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, [slug, isLoading, error, product]);

  // Related products stagger
  useEffect(() => {
    if (isLoading || error || !product) return;
    const ctx = gsap.context(() => {
      const cards = relatedRef.current?.querySelectorAll('.related-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: LUXURY_EASE, stagger: STAGGER_TIGHT, scrollTrigger: { trigger: cards[0], start: SCROLL_START } }
        );
      }
    }, relatedRef);

    return () => ctx.revert();
  }, [slug, isLoading, error, product]);

  const handleAddToBag = () => {
    if (!product || !selectedSize) return;

    // Resolve variantId by matching the selected color+size in product.variants
    const selectedColorName = product.colors?.[activeColor]?.name || '';
    const matchedVariant = product.variants?.find(
      (v: any) =>
        v.color?.name?.toLowerCase() === selectedColorName.toLowerCase() &&
        v.size?.name?.toLowerCase() === selectedSize.toLowerCase()
    );

    addItem({
      variantId: matchedVariant?.id || undefined,
      productId: product.id,
      name: product.name,
      color: selectedColorName,
      size: selectedSize,
      price: product.price,
      quantity: 1,
    });
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000);
  };

  const handleTryOn = () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/product/${slug}`);
      return;
    }
    if (product?.id) {
      selectProduct(product.id);
      setIsTryOnOpen(true);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main>
          <Section spacing="large" className="pt-[120px]">
            <Container>
              <div className="text-center py-20">
                <Typography variant="body" muted>Loading product details...</Typography>
              </div>
            </Container>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <main>
          <Section spacing="large" className="pt-[120px]">
            <Container>
              <div className="text-center py-20">
                <Typography variant="h2" className="mb-4">{error ? 'Error' : 'Product not found'}</Typography>
                <Typography variant="body" muted>{error || "The product you're looking for doesn't exist."}</Typography>
              </div>
            </Container>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <>
      <Navbar />

      <main ref={contentRef}>
        {/* Breadcrumb */}
        <div className="pt-[96px] sm:pt-[100px]">
          <Container>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: product.category === 'men' ? 'Men' : 'Women', href: `/${product.category}` },
                { label: product.name },
              ]}
            />
          </Container>
        </div>

        {/* ══════════════════════════════════════════
            Product Hero
            ══════════════════════════════════════════ */}
        <Section spacing="compact">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Gallery */}
              <div className="product-reveal">
                {/* Main Image */}
                <div className="mb-4">
                  {productImages.length > 0 ? (
                    <div className="relative aspect-[3/4] w-full bg-mono-light overflow-hidden">
                      <Image 
                        src={productImages[activeImage]} 
                        alt={`${product.name} - View ${activeImage + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <GalleryPlaceholder size="large" />
                  )}
                </div>

                {/* Thumbnail Strip */}
                <div className="grid grid-cols-6 gap-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`cursor-pointer transition-all duration-300 relative aspect-[3/4] ${
                        activeImage === index
                          ? 'ring-1 ring-mono-black ring-offset-2'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {productImages.length > 0 ? (
                        <div className="relative w-full h-full bg-mono-light overflow-hidden">
                          <Image 
                            src={productImages[index]} 
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <GalleryPlaceholder size="thumbnail" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-6 lg:sticky lg:top-[100px] lg:self-start">
                {/* Badges */}
                <div className="product-reveal flex items-center gap-2">
                  {product.isNew && <Badge variant="new">New</Badge>}
                  {product.originalPrice && <Badge variant="sale">Sale</Badge>}
                </div>

                {/* Name & Price */}
                <div className="product-reveal">
                  <Typography variant="h2" className="mb-3">
                    {product.name}
                  </Typography>
                  <div className="flex items-center gap-3">
                    <Typography variant="h4" className={product.originalPrice ? '!text-mono-gold' : ''}>
                      {formatPrice(product.price, product.currency)}
                    </Typography>
                    {product.originalPrice && (
                      <Typography variant="h4" muted className="line-through">
                        {formatPrice(product.originalPrice, product.currency)}
                      </Typography>
                    )}
                  </div>
                </div>

                <Divider className="product-reveal" />

                {/* Color Selector */}
                <div className="product-reveal">
                  <Typography variant="label" muted className="mb-3">
                    Color — {product.colors && product.colors[activeColor] ? product.colors[activeColor].name : ''}
                  </Typography>
                  <div className="flex items-center gap-3">
                    {product.colors && product.colors.map((color: any, index: number) => (
                      <ColorSwatch
                        key={color.name}
                        color={color.hex}
                        name={color.name}
                        isActive={activeColor === index}
                        onClick={() => setActiveColor(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="product-reveal">
                  <div className="flex items-center justify-between mb-3">
                    <Typography variant="label" muted>
                      Size {selectedSize ? `— ${selectedSize}` : ''}
                    </Typography>
                    <button className="font-nav text-[10px] uppercase tracking-[0.12em] font-bold text-mono-muted hover:text-mono-black transition-colors duration-300 cursor-pointer underline underline-offset-2">
                      Size Guide
                    </button>
                  </div>
                  <SizeSelector
                    sizes={product.sizes || []}
                    selectedSize={selectedSize}
                    onSelect={setSelectedSize}
                  />
                </div>

                <Divider className="product-reveal" />

                {/* CTAs */}
                <div className="product-reveal flex flex-col gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAddToBag}
                    disabled={!selectedSize}
                  >
                    {addedToBag ? 'Added to Bag ✓' : selectedSize ? 'Add to Bag' : 'Select a Size'}
                  </Button>

                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="lg"
                      fullWidth
                      onClick={() => toggleItem(product.id)}
                    >
                      {inWishlist ? '♥ Saved' : '♡ Save to Wishlist'}
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      className="flex-shrink-0"
                      onClick={handleTryOn}
                    >
                      AI Try-On
                    </Button>
                  </div>
                </div>

                <Divider className="product-reveal" />

                {/* Description */}
                <div className="product-reveal">
                  <Typography variant="label" muted className="mb-3">
                    Description
                  </Typography>
                  <Typography variant="body" muted>
                    {product.description}
                  </Typography>
                </div>

                {/* Details */}
                <div className="product-reveal">
                  <Typography variant="label" muted className="mb-3">
                    Details & Care
                  </Typography>
                  <div className="flex flex-col gap-2">
                    {[
                      'Premium quality materials',
                      'Designed in our European studio',
                      'Machine wash cold, tumble dry low',
                      'Imported',
                    ].map((detail) => (
                      <div key={detail} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-mono-muted rounded-full flex-shrink-0" />
                        <Typography variant="caption" muted>{detail}</Typography>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Editorial Recommendation
            ══════════════════════════════════════════ */}
        <Section spacing="large">
          <Container size="wide">
            <Divider className="mb-16 sm:mb-20" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="story-text">
                <Typography variant="label" muted className="mb-4">
                  Styling Notes
                </Typography>
                <Typography variant="h3" className="mb-4">
                  How to wear <span className="italic">{product.name}</span>
                </Typography>
                <Typography variant="body" muted>
                  This piece pairs effortlessly with other items from our collection.
                  Layer it with complementary tones for a tonal look, or let it
                  stand alone as a statement of restrained elegance. Designed to
                  work across seasons and occasions.
                </Typography>
              </div>
              <div>
                {productImages.length > 0 ? (
                  <div className="relative aspect-[3/4] w-full bg-mono-light overflow-hidden">
                    <Image
                      src={productImages[stylingNoteImageIndex % productImages.length]}
                      alt={`${product.name} — Styling`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <GalleryPlaceholder size="large" variant="dark" />
                )}
              </div>
            </div>
          </Container>
        </Section>

        {/* ══════════════════════════════════════════
            Related Products
            ══════════════════════════════════════════ */}
        <Section spacing="large" ref={relatedRef}>
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
              <div>
                <Typography variant="label" muted className="mb-4">
                  You May Also Like
                </Typography>
                <Typography variant="h2">
                  Related <span className="italic">Pieces</span>
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {relatedProducts.map((p) => (
                <div key={p.id} className="related-card">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <Footer />

      {/* AI Try-On Modal */}
      <TryOnModal isOpen={isTryOnOpen} onClose={() => setIsTryOnOpen(false)} />
    </>
  );
}
