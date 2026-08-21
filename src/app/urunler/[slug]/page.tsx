import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import {
  getAllProductSlugs,
  getProductBySlug,
  getVariantStock,
} from "@/server/catalog";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

// Urun sayfalari onceden uretilir; fiyat/stok degisiklikleri icin tazelenir.
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/urunler/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/urunler/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      url: absoluteUrl(`/urunler/${product.slug}`),
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/urunler/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const stockByWeight = await getVariantStock(slug);

  const cheapest = product.variants.reduce(
    (min, variant) => Math.min(min, variant.priceInKurus),
    product.variants[0]?.priceInKurus ?? product.priceInKurus,
  );

  // Arama motorlarina urun bilgisi: fiyat, para birimi, stok durumu.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image, ...product.gallery],
    sku: product.slug,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "TRY",
      lowPrice: (cheapest / 100).toFixed(2),
      highPrice: (
        Math.max(...product.variants.map((v) => v.priceInKurus)) / 100
      ).toFixed(2),
      offerCount: product.variants.length,
      availability: Object.values(stockByWeight).some((stock) => stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/urunler/${product.slug}`),
    },
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <script
        type="application/ld+json"
        // Icerik kendi urettigimiz veriden geliyor, kullanici girdisi degil.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex text-sm text-outline mb-stack-md font-label-md">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link
              href="/urunler"
              className="inline-flex items-center hover:text-primary transition-colors"
            >
              Mağaza
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <Icon name="chevron_right" className="text-sm mx-1" />
              <Link
                href={`/urunler?kategori=${product.category}`}
                className="hover:text-primary transition-colors"
              >
                {product.breadcrumb}
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <Icon name="chevron_right" className="text-sm mx-1" />
              <span className="text-on-surface">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <ProductGallery
          productName={product.name}
          mainImage={product.image}
          gallery={product.gallery}
          badge={product.badge}
        />
        <ProductPurchase product={product} stockByWeight={stockByWeight} />
      </div>
    </div>
  );
}
