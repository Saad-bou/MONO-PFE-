import { Collection } from '@/types/collection';

export const collections: Collection[] = [
  // ── Shared Collections ──
  {
    id: 'c-001',
    name: 'Minimal Essentials',
    slug: 'minimal-essentials',
    tagline: 'The foundation of modern dressing',
    description:
      'Distilled to the purest form. Every piece in this collection represents the essential building blocks of a considered wardrobe — elevated basics that transcend seasons and trends.',
    season: 'SS26',
    productCount: 24,
    category: 'all',
    featuredProductIds: ['p-001', 'p-005', 'p-007', 'p-010'],
  },
  {
    id: 'c-002',
    name: 'Summer Drop',
    slug: 'summer-drop',
    tagline: 'Refined simplicity for warmer days',
    description:
      'Lightweight fabrications and relaxed silhouettes designed for effortless warm-weather dressing. Linen, organic cotton, and fluid drapes define the SS26 mood.',
    season: 'SS26',
    productCount: 18,
    category: 'all',
    featuredProductIds: ['p-005', 'p-009', 'p-013', 'p-016'],
  },
  {
    id: 'c-003',
    name: 'Black Edition',
    slug: 'black-edition',
    tagline: 'The power of monochrome',
    description:
      'An exercise in tonal precision. The Black Edition explores depth through texture, cut, and proportion — proving that black is never just black.',
    season: 'AW26',
    productCount: 16,
    category: 'all',
    featuredProductIds: ['p-002', 'p-006', 'p-007', 'p-011'],
  },
  {
    id: 'c-004',
    name: 'Oversized',
    slug: 'oversized',
    tagline: 'Volume meets precision',
    description:
      'Generous proportions, meticulous construction. Each oversized piece is engineered to drape with intention — creating effortless silhouettes that feel both bold and refined.',
    season: 'SS26',
    productCount: 14,
    category: 'all',
    featuredProductIds: ['p-001', 'p-004', 'p-010', 'p-014'],
  },
  {
    id: 'c-005',
    name: 'AI Curated',
    slug: 'ai-curated',
    tagline: 'Intelligence meets intuition',
    description:
      'A collection assembled by our artificial intelligence — analyzing global style data, fabric performance, and cultural movements to predict the pieces that define now.',
    season: 'SS26',
    productCount: 12,
    category: 'all',
    featuredProductIds: ['p-003', 'p-008', 'p-012', 'p-015'],
  },
];
