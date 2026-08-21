import "dotenv/config";
import { PrismaClient, ProductCategory } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { products, featuredSlugs } from "../src/lib/products";
import { coupons } from "../src/lib/promotions";

/**
 * Baslangic verisi.
 *
 * Katalog hala src/lib/products.ts'ten okunuyor; boylece tek kaynak korunuyor
 * ve veritabani ile ekranlar ayni veriyi gosteriyor. Gercek urun bilgileri
 * geldiginde once o dosya guncellenip seed tekrar calistirilabilir, ya da
 * yonetim paneli uzerinden dogrudan veritabani duzenlenebilir.
 *
 * Tekrar calistirilabilir (idempotent): upsert kullanildigi icin var olan
 * kayitlar guncellenir, yenileri eklenir. Stok bilerek EZILMEZ.
 */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categoryMap: Record<string, ProductCategory> = {
  ballar: ProductCategory.BALLAR,
  "ari-urunleri": ProductCategory.ARI_URUNLERI,
  setler: ProductCategory.SETLER,
};

/** Baslangic stogu; gercek sayimla degistirilecek. */
const INITIAL_STOCK = 25;

async function main() {
  console.log("Seed basliyor...");

  for (const product of products) {
    const featuredRank = featuredSlugs.indexOf(
      product.slug as (typeof featuredSlugs)[number],
    );

    const data = {
      name: product.name,
      description: product.description,
      category: categoryMap[product.category]!,
      badge: product.badge ?? null,
      tags: [...product.tags],
      image: product.image,
      gallery: [...product.gallery],
      longDescription: [...product.longDescription],
      breadcrumb: product.breadcrumb,
      threeForTwo: product.threeForTwo ?? false,
      featuredRank: featuredRank >= 0 ? featuredRank : null,
      region: product.specs.region,
      harvest: product.specs.harvest,
      totalActivity: product.specs.totalActivity ?? null,
      isActive: true,
    };

    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      create: { slug: product.slug, ...data },
      update: data,
    });

    for (const variant of product.variants) {
      await prisma.productVariant.upsert({
        where: {
          productId_weightGrams: {
            productId: saved.id,
            weightGrams: variant.weightGrams,
          },
        },
        create: {
          productId: saved.id,
          weightGrams: variant.weightGrams,
          label: variant.label,
          priceInKurus: variant.priceInKurus,
          stock: INITIAL_STOCK,
        },
        // Stok gercek sayimi yansitir; seed tekrar calisinca sifirlanmamali.
        update: {
          label: variant.label,
          priceInKurus: variant.priceInKurus,
          isActive: true,
        },
      });
    }

    console.log(`  urun: ${product.slug} (${product.variants.length} varyant)`);
  }

  for (const coupon of Object.values(coupons)) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      create: {
        code: coupon.code,
        label: coupon.label,
        discountPercent: coupon.discountPercent,
        // "Ilk siparise ozel" kurali uyelik gelince gercekten uygulanabilecek.
        firstOrderOnly: true,
      },
      update: {
        label: coupon.label,
        discountPercent: coupon.discountPercent,
      },
    });
    console.log(`  kupon: ${coupon.code}`);
  }

  const productCount = await prisma.product.count();
  const variantCount = await prisma.productVariant.count();
  console.log(`Seed bitti: ${productCount} urun, ${variantCount} varyant.`);
}

main()
  .catch((error) => {
    console.error("Seed basarisiz:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
