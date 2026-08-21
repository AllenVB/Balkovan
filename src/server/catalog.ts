import "server-only";
import { prisma } from "@/lib/db";
import type { Product, ProductCategory } from "@/lib/products";
import { ProductCategory as DbCategory } from "@/generated/prisma/enums";

/**
 * Katalog okuma.
 *
 * Veritabanindaki kayitlari sayfalarin bekledigi `Product` tipine cevirir;
 * boylece ekranlar backend'e gecerken degismedi. Fiyat ve stok artik tek
 * dogru kaynak olan veritabanindan geliyor.
 */

const toAppCategory: Record<DbCategory, ProductCategory> = {
  [DbCategory.BALLAR]: "ballar",
  [DbCategory.ARI_URUNLERI]: "ari-urunleri",
  [DbCategory.SETLER]: "setler",
};

const toDbCategory: Record<ProductCategory, DbCategory> = {
  ballar: DbCategory.BALLAR,
  "ari-urunleri": DbCategory.ARI_URUNLERI,
  setler: DbCategory.SETLER,
};

type ProductRow = Awaited<ReturnType<typeof findProductRows>>[number];

function findProductRows(where: Parameters<typeof prisma.product.findMany>[0]) {
  return prisma.product.findMany({
    ...where,
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { weightGrams: "asc" },
      },
    },
  });
}

function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    // Liste fiyati en kucuk varyanttan; detayda varyant secimiyle degisir.
    priceInKurus: row.variants[0]?.priceInKurus ?? 0,
    image: row.image,
    category: toAppCategory[row.category],
    badge: row.badge ?? undefined,
    tags: row.tags,
    variants: row.variants.map((variant) => ({
      weightGrams: variant.weightGrams,
      label: variant.label,
      priceInKurus: variant.priceInKurus,
    })),
    specs: {
      region: row.region,
      harvest: row.harvest,
      totalActivity: row.totalActivity ?? undefined,
    },
    longDescription: row.longDescription,
    gallery: row.gallery,
    threeForTwo: row.threeForTwo,
    breadcrumb: row.breadcrumb,
  };
}

export async function getProducts(
  category?: ProductCategory,
): Promise<Product[]> {
  const rows = await findProductRows({
    where: {
      isActive: true,
      ...(category ? { category: toDbCategory[category] } : {}),
    },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await findProductRows({ where: { slug, isActive: true } });
  const row = rows[0];
  return row ? toProduct(row) : null;
}

/** Anasayfadaki "One Cikanlar"; siralama veritabanindaki featuredRank'ten. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await findProductRows({
    where: { isActive: true, featuredRank: { not: null } },
    orderBy: { featuredRank: "asc" },
  });
  return rows.map(toProduct);
}

/** Statik sayfa uretimi icin tum slug'lar. */
export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return rows.map((row) => row.slug);
}

/** Varyant bazinda stok; urun detayinda "son N adet" uyarisi icin. */
export async function getVariantStock(
  slug: string,
): Promise<Record<number, number>> {
  const rows = await prisma.productVariant.findMany({
    where: { product: { slug }, isActive: true },
    select: { weightGrams: true, stock: true },
  });
  return Object.fromEntries(rows.map((row) => [row.weightGrams, row.stock]));
}
