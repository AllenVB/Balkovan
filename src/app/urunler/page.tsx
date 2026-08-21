import Link from "next/link";
import type { Metadata } from "next";
import { clsx } from "clsx";
import { ProductCard } from "@/components/product/product-card";
import { categoryFilters, type ProductCategory } from "@/lib/products";
import { getProducts } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Ürünler",
  description:
    "En saf haliyle, özenle seçilmiş bal ve arı ürünlerimiz. Ham çiçek balı, kestane balı, karakovan petek balı ve daha fazlası.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/urunler">) {
  const params = await searchParams;
  const rawCategory = params.kategori;
  const selected =
    typeof rawCategory === "string" &&
    categoryFilters.some((f) => f.value === rawCategory)
      ? rawCategory
      : "tumu";

  const visibleProducts = await getProducts(
    selected === "tumu" ? undefined : (selected as ProductCategory),
  );

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
      <section className="flex flex-col gap-stack-md items-center text-center">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
          Doğadan Sofranıza
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          En saf haliyle, özenle seçilmiş arı ürünlerimiz.
        </p>

        {/* Kategori suzgeci. Sunucuda filtrelenebilmesi ve baglantilarin
            paylasilabilir olmasi icin buton yerine query parametreli link. */}
        <nav
          aria-label="Kategori filtresi"
          className="flex flex-wrap gap-base justify-center mt-4"
        >
          {categoryFilters.map((filter) => {
            const isActive = filter.value === selected;
            return (
              <Link
                key={filter.value}
                href={
                  filter.value === "tumu"
                    ? "/urunler"
                    : `/urunler?kategori=${filter.value}`
                }
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "px-4 py-2 rounded-full font-label-md text-label-md transition-colors",
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant border border-outline-variant",
                )}
              >
                {filter.label}
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {visibleProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </section>

      {visibleProducts.length === 0 ? (
        <p className="font-body-lg text-body-lg text-on-surface-variant text-center py-stack-lg">
          Bu kategoride henüz ürün bulunmuyor.
        </p>
      ) : null}
    </div>
  );
}
