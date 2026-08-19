import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatPriceCompact } from "@/lib/format";
import type { Product } from "@/lib/products";

/**
 * Tasarimda urun karti iki farkli bicimde geciyor:
 * - "featured": anasayfa "One Cikanlar" seridi (yuksek gorsel, yumusak koseler,
 *   rozet gorselin altinda chip olarak).
 * - "grid": urunler sayfasi katalogu (kare gorsel, rozet gorsel uzerinde).
 * Ikisi de ayni veriyi kullandigi icin tek bilesende varyant olarak tutuldu.
 */
type ProductCardProps = {
  product: Product;
  variant?: "featured" | "grid";
};

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const href = `/urunler/${product.slug}`;

  if (variant === "featured") {
    return (
      <article className="bg-surface border border-honey-100 rounded-3xl overflow-hidden warm-shadow-hover transition-all duration-300 transform hover:-translate-y-1 flex flex-col group">
        <Link
          href={href}
          className="h-72 bg-surface-container-low relative block overflow-hidden"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="p-6 flex-grow flex flex-col justify-between bg-surface">
          <div>
            {product.badge ? (
              <span className="inline-block bg-honey-100 text-honey-900 text-[12px] font-bold px-3 py-1 rounded-full mb-3">
                {product.badge}
              </span>
            ) : null}
            <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">
              <Link href={href} className="hover:text-primary transition-colors">
                {product.name}
              </Link>
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-sm line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-honey-100">
            <span className="font-price-display text-price-display text-on-background">
              {formatPriceCompact(product.priceInKurus)}
            </span>
            <AddToCartButton
              product={product}
              icon="add"
              className="w-12 h-12 rounded-full bg-surface-container-highest text-amber-deep flex items-center justify-center hover:bg-amber-deep hover:text-on-primary transition-colors"
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-surface-container rounded-xl overflow-hidden warm-shadow border border-outline-variant hover:shadow-[0_8px_30px_rgba(70,25,3,0.12)] hover:scale-[1.01] transition-all duration-300 flex flex-col group">
      <Link
        href={href}
        className="relative w-full aspect-square overflow-hidden bg-white block"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge ? (
          <span className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-md text-label-md shadow-sm">
            {product.badge}
          </span>
        ) : null}
      </Link>
      <div className="p-6 flex flex-col flex-grow gap-2">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          <Link href={href} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant flex-grow line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="font-price-display text-price-display text-primary">
            {formatPriceCompact(product.priceInKurus)}
          </span>
          <AddToCartButton
            product={product}
            icon="add_shopping_cart"
            className="bg-primary hover:bg-surface-tint text-on-primary p-3 rounded-full flex items-center justify-center transition-colors shadow-md active:scale-95"
          />
        </div>
      </div>
    </article>
  );
}
