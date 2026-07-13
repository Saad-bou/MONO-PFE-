'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Lookbook } from '@/components/sections/Lookbook';
import { FeaturedCollections } from '@/components/sections/FeaturedCollections';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { AITryOn } from '@/components/sections/AITryOn';
import { Journal } from '@/components/sections/Journal';
import { AboutMono } from '@/components/sections/AboutMono';
import { Press } from '@/components/sections/Press';
import { Newsletter } from '@/components/sections/Newsletter';

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Lookbook />
        <FeaturedCollections />
        <ProductGrid />
        <AITryOn />
        <Journal />
        <AboutMono />
        <Press />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}
