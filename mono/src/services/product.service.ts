import api from '@/lib/axios';
import type { ApiResponse, PaginatedApiResponse } from '@/types/api';

export type ProductSort =
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'oldest'
  | 'name_asc'
  | 'name_desc';

export interface ProductCatalogQuery {
  page?: number;
  limit?: number;
  sort?: ProductSort;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  category?: string;
  collection?: string;
}

export interface ProductPayload {
  sku: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  brand?: string;
  material?: string;
  careInstructions?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

const transformProduct = (product: any) => {
  if (!product) return product;

  // ── Price: Prisma Decimal arrives as a string; coerce to Number ──
  const price = product.price !== undefined ? Number(product.price) : 0;
  const originalPrice = product.originalPrice !== undefined ? Number(product.originalPrice) : undefined;

  // ── Category: backend sends an object { id, name, slug }, UI expects a plain string ──
  let category: string = 'men';
  if (typeof product.category === 'string') {
    category = product.category;
  } else if (product.category && typeof product.category === 'object') {
    // Map category slug to 'men' | 'women' | '' based on the slug value
    const catSlug: string = (product.category.slug || '').toLowerCase();
    if (catSlug.includes('women') || catSlug.includes('femme')) {
      category = 'women';
    } else if (catSlug.includes('men') || catSlug.includes('homme')) {
      category = 'men';
    } else {
      category = catSlug || 'men';
    }
  }

  // ── Collection slug: first collection relation ──
  let collection: string = '';
  if (Array.isArray(product.collections) && product.collections.length > 0) {
    const first = product.collections[0];
    collection = first?.collection?.slug || first?.slug || '';
  } else if (typeof product.collection === 'string') {
    collection = product.collection;
  }

  // ── Images: map backend images array into urls ──
  const images: string[] = [];
  let mainImage: string = '';
  if (Array.isArray(product.images) && product.images.length > 0) {
    // Sort: main image first, then by displayOrder
    const sorted = [...product.images].sort((a, b) => {
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });
    sorted.forEach((img: any) => {
      if (img.url) images.push(img.url);
    });
    mainImage = images[0] || '';
  }
  const thumbnail = mainImage;
  const hoverImage = images[1] || mainImage;
  const gallery = images.slice(1);

  // ── Colors: backend has color.hexCode; UI expects color.hex ──
  const colorMap = new Map<string, { name: string; hex: string; imageIndex: number }>();
  if (Array.isArray(product.variants)) {
    product.variants.forEach((v: any) => {
      if (v.color) {
        const colorName: string = typeof v.color === 'string' ? v.color : (v.color.name || '');
        if (colorName && !colorMap.has(colorName)) {
          const rawHex: string =
            typeof v.color === 'object'
              ? v.color.hexCode || v.color.hex || '#000000'
              : '#000000';
          colorMap.set(colorName, {
            name: colorName,
            hex: rawHex,
            imageIndex: colorMap.size, // sequential fallback index
          });
        }
      }
    });
  }
  const colors = Array.from(colorMap.values());

  // ── Sizes: backend has size.name + variant.stock; UI expects { label, available } ──
  const sizeMap = new Map<string, { label: string; available: boolean }>();
  if (Array.isArray(product.variants)) {
    product.variants.forEach((v: any) => {
      if (v.size) {
        const sizeLabel: string =
          typeof v.size === 'string'
            ? v.size
            : v.size.name || v.size.label || String(v.size);
        if (sizeLabel && !sizeMap.has(sizeLabel)) {
          sizeMap.set(sizeLabel, {
            label: sizeLabel,
            available: v.stock !== undefined ? v.stock > 0 : true,
          });
        }
      }
    });
  }
  const sizes = Array.from(sizeMap.values());

  // ── Fallback colors/sizes if no variants present ──
  const finalColors = colors.length > 0 ? colors : (product.colors || []);
  const finalSizes = sizes.length > 0 ? sizes : (product.sizes || []);

  // ── isNew: backend has no equivalent; derive from createdAt (≤ 30 days = new) ──
  let isNew = false;
  if (product.createdAt) {
    const createdMs = new Date(product.createdAt).getTime();
    const nowMs = Date.now();
    isNew = (nowMs - createdMs) < 30 * 24 * 60 * 60 * 1000;
  }

  // ── id: ensure it exists (UUID string already, no _id needed for Prisma) ──
  const id = product.id || product._id || '';

  return {
    // spread original to preserve any extra fields
    ...product,
    // normalized / coerced fields
    id,
    slug: product.slug || '',
    name: product.name || '',
    description: product.description || '',
    price,
    originalPrice,
    currency: 'EUR',
    category,
    collection,
    colors: finalColors,
    sizes: finalSizes,
    images,
    mainImage,
    thumbnail,
    hoverImage,
    gallery,
    isNew,
    isFeatured: product.isFeatured ?? false,
    isActive: product.isActive ?? true,
    tags: product.tags || [],
    brand: product.brand || 'MONO',
    material: product.material || '',
    careInstructions: product.careInstructions || '',
    variants: product.variants || [],
  };
};


const transformPaginatedResponse = (res: any) => {
  if (res.data?.data && Array.isArray(res.data.data)) {
    res.data.data = res.data.data.map(transformProduct);
  }
  return res;
};

const transformSingleResponse = (res: any) => {
  if (res.data?.data) {
    res.data.data = transformProduct(res.data.data);
  }
  return res;
};

export const getProducts = (params?: ProductCatalogQuery) =>
  api.get<PaginatedApiResponse<any[]>>('/products', { params }).then(transformPaginatedResponse);

export const getFeaturedProducts = (params?: ProductCatalogQuery) =>
  api.get<PaginatedApiResponse<any[]>>('/products/featured', { params }).then(transformPaginatedResponse);

export const searchProducts = (params: ProductCatalogQuery & { search: string }) =>
  api.get<PaginatedApiResponse<any[]>>('/products/search', { params }).then(transformPaginatedResponse);

export const getProductBySlug = (slug: string) =>
  api.get<ApiResponse<Record<string, unknown>>>(`/products/slug/${slug}`).then(transformSingleResponse);

export const getProductById = (id: string) =>
  api.get<ApiResponse<Record<string, unknown>>>(`/products/${id}`).then(transformSingleResponse);

export const createProduct = (payload: ProductPayload) =>
  api.post<ApiResponse<Record<string, unknown>>>('/products', payload).then(transformSingleResponse);

export const updateProduct = (id: string, payload: ProductPayload) =>
  api.put<ApiResponse<Record<string, unknown>>>(`/products/${id}`, payload).then(transformSingleResponse);

export const deleteProduct = (id: string) =>
  api.delete<ApiResponse<{ id: string }>>(`/products/${id}`);
