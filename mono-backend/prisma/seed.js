const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const collections = [
  {
    name: 'Minimal Essentials',
    slug: 'minimal-essentials',
    description: 'Distilled to the purest form. Every piece in this collection represents the essential building blocks of a considered wardrobe — elevated basics that transcend seasons and trends.',
    isFeatured: true,
  },
  {
    name: 'Summer Drop',
    slug: 'summer-drop',
    description: 'Lightweight fabrications and relaxed silhouettes designed for effortless warm-weather dressing. Linen, organic cotton, and fluid drapes define the SS26 mood.',
    isFeatured: true,
  },
  {
    name: 'Black Edition',
    slug: 'black-edition',
    description: 'An exercise in tonal precision. The Black Edition explores depth through texture, cut, and proportion — proving that black is never just black.',
    isFeatured: true,
  },
  {
    name: 'Oversized',
    slug: 'oversized',
    description: 'Generous proportions, meticulous construction. Each oversized piece is engineered to drape with intention — creating effortless silhouettes that feel both bold and refined.',
    isFeatured: true,
  },
  {
    name: 'AI Curated',
    slug: 'ai-curated',
    description: 'A collection assembled by our artificial intelligence — analyzing global style data, fabric performance, and cultural movements to predict the pieces that define now.',
    isFeatured: true,
  },
];

const products = [
  {
    name: 'Essential Oversized Tee',
    slug: 'essential-oversized-tee',
    price: 89,
    description: 'Heavyweight cotton oversized tee with dropped shoulders and a relaxed silhouette.',
    category: 'men',
    collection: 'minimal-essentials',
    colors: [{ name: 'Onyx', hex: '#1A1A1A' }, { name: 'Ivory', hex: '#F5F0E8' }, { name: 'Slate', hex: '#6B7280' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }, { label: 'XL', available: false }],
  },
  {
    name: 'Minimal Cargo Trousers',
    slug: 'minimal-cargo-trousers',
    price: 145,
    description: 'Tailored cargo trousers with hidden pockets and a tapered leg.',
    category: 'men',
    collection: 'black-edition',
    colors: [{ name: 'Olive', hex: '#556B2F' }, { name: 'Black', hex: '#111111' }, { name: 'Green', hex: '#2E8B57' }],
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }, { label: 'XL', available: true }],
  },
  {
    name: 'Structured Bomber Jacket',
    slug: 'structured-bomber-jacket',
    price: 285,
    description: 'Premium nylon bomber jacket with ribbed cuffs and a clean minimal design.',
    category: 'men',
    collection: 'ai-curated',
    colors: [{ name: 'Noir', hex: '#0A0A0A' }, { name: 'Olive', hex: '#4B5320' }],
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: false }, { label: 'XL', available: true }],
  },
  {
    name: 'Heavyweight Hoodie',
    slug: 'heavyweight-hoodie',
    price: 165,
    description: 'Double-layered heavyweight fleece hoodie with kangaroo pocket and minimal branding.',
    category: 'men',
    collection: 'oversized',
    colors: [{ name: 'Obsidian', hex: '#1C1C1C' }, { name: 'Cement', hex: '#C4C4C4' }, { name: 'Fog', hex: '#E8E4DF' }],
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }, { label: 'XL', available: true }],
  },
  {
    name: 'Relaxed Linen Shirt',
    slug: 'relaxed-linen-shirt',
    price: 125,
    description: 'Premium linen camp collar shirt with a boxy, relaxed fit.',
    category: 'men',
    collection: 'summer-drop',
    colors: [{ name: 'Sand', hex: '#D4C5A9' }, { name: 'White', hex: '#FAFAFA' }],
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }, { label: 'XL', available: false }],
  },
  {
    name: 'Technical Track Pants',
    slug: 'technical-track-pants',
    price: 135,
    description: 'Technical fabric track pants with zip pockets and articulated knees.',
    category: 'men',
    collection: 'black-edition',
    colors: [{ name: 'Black', hex: '#111111' }],
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }, { label: 'XL', available: true }],
  },
  {
    name: 'Washed Cotton Shorts',
    slug: 'washed-cotton-shorts',
    price: 95,
    description: 'Garment-dyed organic cotton shorts with a relaxed mid-length cut and drawstring waist.',
    category: 'men',
    collection: 'summer-drop',
    colors: [{ name: 'Stone', hex: '#C4B9A8' }, { name: 'Black', hex: '#111111' }],
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }, { label: 'XL', available: true }],
  },
  {
    name: 'Oversized Wool Coat',
    slug: 'oversized-wool-coat',
    price: 420,
    description: 'Double-faced wool coat with exaggerated drop shoulders and a cocoon silhouette.',
    category: 'men',
    collection: 'oversized',
    colors: [{ name: 'Charcoal', hex: '#3D3D3D' }, { name: 'Camel', hex: '#C19A6B' }],
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: false }, { label: 'XL', available: true }],
  },
  {
    name: 'Merino Knit Polo',
    slug: 'merino-knit-polo',
    price: 155,
    description: 'Fine-gauge merino wool polo with mother-of-pearl buttons and a slim silhouette.',
    category: 'men',
    collection: 'ai-curated',
    colors: [{ name: 'Navy', hex: '#1B2A4A' }, { name: 'Cream', hex: '#F5F0E8' }, { name: 'Black', hex: '#111111' }],
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }, { label: 'XL', available: true }],
  },
  {
    name: 'Structured Sweatpants',
    slug: 'structured-sweatpants',
    price: 130,
    description: 'Heavyweight French terry sweatpants with pressed creases and ribbed cuffs.',
    category: 'men',
    collection: 'minimal-essentials',
    colors: [{ name: 'Heather Grey', hex: '#B0B0B0' }, { name: 'Black', hex: '#111111' }],
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }, { label: 'XL', available: false }],
  },
  {
    name: 'Sculpted Knit Dress',
    slug: 'sculpted-knit-dress',
    price: 195,
    description: 'Body-sculpting ribbed knit midi dress with a high neckline.',
    category: 'women',
    collection: 'black-edition',
    colors: [{ name: 'Noir', hex: '#0A0A0A' }, { name: 'Camel', hex: '#C19A6B' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: false }],
  },
  {
    name: 'Cropped Wool Blazer',
    slug: 'cropped-wool-blazer',
    price: 320,
    description: 'Italian wool cropped blazer with padded shoulders and a single-button closure.',
    category: 'women',
    collection: 'ai-curated',
    colors: [{ name: 'Black', hex: '#111111' }, { name: 'Ivory', hex: '#F5F0E8' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }],
  },
  {
    name: 'Wide Leg Trousers',
    slug: 'wide-leg-trousers',
    price: 155,
    description: 'High-waisted wide leg trousers with pressed creases and a flowing drape.',
    category: 'women',
    collection: 'summer-drop',
    colors: [{ name: 'Ecru', hex: '#E8E0D4' }, { name: 'Black', hex: '#111111' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }],
  },
  {
    name: 'Oversized Cotton Shirt',
    slug: 'oversized-cotton-shirt',
    price: 115,
    description: 'Crisp organic cotton oversized shirt with elongated cuffs.',
    category: 'women',
    collection: 'oversized',
    colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Powder', hex: '#E8DDD3' }, { name: 'Black', hex: '#111111' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }],
  },
  {
    name: 'Minimal Slip Skirt',
    slug: 'minimal-slip-skirt',
    price: 105,
    description: 'Satin-finish bias-cut slip skirt with a mid-length hemline.',
    category: 'women',
    collection: 'black-edition',
    colors: [{ name: 'Black', hex: '#111111' }, { name: 'Champagne', hex: '#D4C5A9' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: false }, { label: 'L', available: true }],
  },
  {
    name: 'Deconstructed Trench',
    slug: 'deconstructed-trench',
    price: 395,
    description: 'Deconstructed cotton trench coat with raw-edge details and an oversized belt.',
    category: 'women',
    collection: 'ai-curated',
    colors: [{ name: 'Trench', hex: '#C4A882' }, { name: 'Black', hex: '#111111' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }],
  },
  {
    name: 'Silk Camisole Top',
    slug: 'silk-camisole-top',
    price: 135,
    description: 'Washed silk camisole with delicate adjustable straps and a relaxed fit.',
    category: 'women',
    collection: 'summer-drop',
    colors: [{ name: 'Pearl', hex: '#F0EBE3' }, { name: 'Noir', hex: '#0A0A0A' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: false }],
  },
  {
    name: 'Tailored Wool Trousers',
    slug: 'tailored-wool-trousers',
    price: 185,
    description: 'High-waisted tailored trousers in Italian virgin wool with a straight leg.',
    category: 'women',
    collection: 'minimal-essentials',
    colors: [{ name: 'Charcoal', hex: '#3D3D3D' }, { name: 'Cream', hex: '#F5F0E8' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }],
  },
  {
    name: 'Cashmere Crew Sweater',
    slug: 'cashmere-crew-sweater',
    price: 245,
    description: 'Pure cashmere crew-neck sweater with rolled edges and a relaxed dropped shoulder.',
    category: 'women',
    collection: 'minimal-essentials',
    colors: [{ name: 'Oat', hex: '#D9CCBA' }, { name: 'Black', hex: '#111111' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: false }, { label: 'L', available: true }],
  },
  {
    name: 'Oversized Blazer Dress',
    slug: 'oversized-blazer-dress',
    price: 290,
    description: 'Double-breasted blazer dress with exaggerated shoulders and a belted waist.',
    category: 'women',
    collection: 'oversized',
    colors: [{ name: 'Black', hex: '#111111' }, { name: 'Taupe', hex: '#A89F91' }],
    sizes: [{ label: 'XS', available: true }, { label: 'S', available: true }, { label: 'M', available: true }, { label: 'L', available: true }],
  },
];

async function main() {
  console.log("Seeding MONO Luxury Catalog...");

  // Clear existing catalog data
  await prisma.aITryOnHistory.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();

  await prisma.productCollection.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.size.deleteMany();
  await prisma.color.deleteMany();

  // Create roles
  await prisma.role.upsert({ where: { name: "ADMIN" }, update: {}, create: { name: "ADMIN", description: "Administrator" } });
  await prisma.role.upsert({ where: { name: "CUSTOMER" }, update: {}, create: { name: "CUSTOMER", description: "Customer" } });

  // Create categories
  const catMen = await prisma.category.create({ data: { name: 'Men', slug: 'men', description: 'Men Collection' } });
  const catWomen = await prisma.category.create({ data: { name: 'Women', slug: 'women', description: 'Women Collection' } });
  const categoryMap = { 'men': catMen.id, 'women': catWomen.id };

  // Create collections
  const collectionMap = {};
  for (const coll of collections) {
    const created = await prisma.collection.create({
      data: {
        name: coll.name,
        slug: coll.slug,
        description: coll.description,
        isFeatured: coll.isFeatured,
      }
    });
    collectionMap[coll.slug] = created.id;
  }

  // Create products
  const ASSETS_BASE = path.join(__dirname, "../../mono/public/assets/products");

  for (const prod of products) {
    const isWool = prod.name.toLowerCase().includes('wool');
    const isCashmere = prod.name.toLowerCase().includes('cashmere');
    const isSilk = prod.name.toLowerCase().includes('silk');
    const isLinen = prod.name.toLowerCase().includes('linen');
    
    let material = '100% Cotton';
    if (isWool) material = '100% Wool';
    if (isCashmere) material = '100% Cashmere';
    if (isSilk) material = '100% Silk';
    if (isLinen) material = '100% Linen';

    const featuredSlugs = [
      'essential-oversized-tee',
      'minimal-cargo-trousers',
      'structured-bomber-jacket',
      'heavyweight-hoodie',
      'oversized-wool-coat',
      'sculpted-knit-dress',
      'cropped-wool-blazer',
      'deconstructed-trench',
      'tailored-wool-trousers',
      'oversized-blazer-dress'
    ];
    
    const dbProduct = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        sku: "PRD-" + prod.slug.toUpperCase(),
        description: prod.description,
        price: prod.price,
        categoryId: categoryMap[prod.category],
        brand: 'MONO',
        material: material,
        careInstructions: 'Dry clean only. Do not tumble dry.',
        isActive: true,
        isFeatured: featuredSlugs.includes(prod.slug),
      }
    });

    // Link collection
    if (collectionMap[prod.collection]) {
      await prisma.productCollection.create({
        data: {
          productId: dbProduct.id,
          collectionId: collectionMap[prod.collection]
        }
      });
    }

    // Process Images
    let imageFiles = [];
    
    let foundDir = null;
    let foundFiles = [];

    if (fs.existsSync(ASSETS_BASE)) {
      const allDirs = fs.readdirSync(ASSETS_BASE, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      const matchedDir = allDirs.find(d => d.startsWith(prod.slug));
      if (matchedDir) {
        const fullPath = path.join(ASSETS_BASE, matchedDir);
        const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'));
        if (files.length > 0) {
          foundDir = matchedDir;
          foundFiles = files;
        }
      }
    }

    if (foundDir && foundFiles.length > 0) {
      // If we find files but fewer than 6, or just in general, we use them
      // Sort logic to match the existing naming if possible
      const mainFile = foundFiles.find(f => f.includes('main'));
      const hoverFile = foundFiles.find(f => f.includes('hover'));
      const others = foundFiles
        .filter(f => f !== mainFile && f !== hoverFile)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

      const orderedFiles = [];
      if (mainFile) orderedFiles.push(mainFile);
      if (hoverFile) orderedFiles.push(hoverFile);
      orderedFiles.push(...others);

      orderedFiles.forEach((file, index) => {
        imageFiles.push({
          url: "/assets/products/" + foundDir + "/" + file,
          isMain: index === 0,
          displayOrder: index + 1
        });
      });
    } else {
      // Generate 6 standard names
      for (let i = 1; i <= 6; i++) {
        imageFiles.push({
          url: "/assets/products/" + prod.slug + "/" + prod.slug + "-0" + i + ".webp",
          isMain: i === 1,
          displayOrder: i
        });
      }
    }

    // Insert Images
    for (const img of imageFiles) {
      await prisma.productImage.create({
        data: {
          url: img.url,
          isMain: img.isMain,
          displayOrder: img.displayOrder,
          productId: dbProduct.id
        }
      });
    }

    // Variants
    for (const c of prod.colors) {
      const colorRecord = await prisma.color.upsert({
        where: { name: c.name },
        update: {},
        create: { name: c.name, hexCode: c.hex }
      });

      for (const s of prod.sizes) {
        const sizeRecord = await prisma.size.upsert({
          where: { name: s.label },
          update: {},
          create: { name: s.label }
        });

        await prisma.productVariant.create({
          data: {
            sku: dbProduct.sku + "-" + colorRecord.name.toUpperCase().substring(0,3) + "-" + sizeRecord.name,
            stock: s.available ? 50 : 0,
            productId: dbProduct.id,
            colorId: colorRecord.id,
            sizeId: sizeRecord.id,
          }
        });
      }
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });