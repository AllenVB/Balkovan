"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/icon";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";

/**
 * Tasarimdaki toplu alim kademeleri. Backend geldiginde bu kurallar
 * sunucudan gelecek; simdilik gosterim tasarimdaki degerlerle sabit.
 */
const bulkTiers = [
  { minQuantity: 1, discountPercent: 0, label: "1 Adet" },
  { minQuantity: 6, discountPercent: 5, label: "6 al %5" },
  { minQuantity: 12, discountPercent: 10, label: "12 al %10" },
] as const;

const maxTierQuantity = bulkTiers[bulkTiers.length - 1].minQuantity;

/** Urun detayinin sag sutunu: fiyat, gramaj secimi, adet ve sepete ekle. */
export function ProductPurchase({ product }: { product: Product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants[variantIndex] ?? product.variants[0];
  const unitPrice = selectedVariant?.priceInKurus ?? product.priceInKurus;

  // Ilk varyantin fiyatindan sapmayi eski fiyata da yansit ki indirim orani bozulmasin.
  const compareAtPrice =
    product.compareAtPriceInKurus && product.variants[0]
      ? Math.round(
          (product.compareAtPriceInKurus * unitPrice) /
            product.variants[0].priceInKurus,
        )
      : undefined;

  const progressPercent = Math.min(100, (quantity / maxTierQuantity) * 100);

  return (
    <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-0 lg:sticky lg:top-28">
      {/* Baslik ve fiyat */}
      <div className="mb-stack-sm border-b border-surface-container-high pb-stack-sm">
        <div className="flex flex-wrap gap-2 mb-3">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="bg-surface-container-high text-on-surface-variant font-label-md px-2.5 py-0.5 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">
          {product.name}
        </h1>
        <div className="flex items-end gap-3 mt-4">
          <span className="font-price-display text-primary text-3xl font-semibold">
            {formatPrice(unitPrice)}
          </span>
          {compareAtPrice ? (
            <span className="text-outline line-through text-lg mb-1">
              {formatPrice(compareAtPrice)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Toplu alim indirimi */}
      <div className="bg-primary-fixed border-2 border-primary rounded-lg p-4 mb-stack-md relative overflow-hidden shadow-sm">
        <div className="flex justify-between items-center mb-2 font-label-md text-on-surface">
          <span className="flex items-center gap-1 font-bold text-primary">
            <Icon name="local_offer" className="text-sm" /> Toplu Alım İndirimi
          </span>
          <span className="text-primary font-bold">%10&apos;a varan avantaj</span>
        </div>
        <div className="w-full bg-surface-variant rounded-full h-2.5 mb-1 relative border border-primary/20">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
          <div className="absolute top-1/2 -translate-y-1/2 left-[50%] w-1.5 h-4 bg-background rounded-full z-10" />
          <div className="absolute top-1/2 -translate-y-1/2 right-[5%] w-1.5 h-4 bg-background rounded-full z-10" />
        </div>
        <div className="flex justify-between text-xs mt-1 font-body-md">
          {bulkTiers.map((tier) => (
            <span
              key={tier.label}
              className={clsx(
                "font-medium",
                quantity >= tier.minQuantity ? "text-primary" : "text-outline",
              )}
            >
              {tier.label}
            </span>
          ))}
        </div>
      </div>

      {/* Gramaj secimi */}
      {product.variants.length > 1 ? (
        <fieldset className="mb-stack-md">
          <legend className="block text-sm font-label-md text-on-surface mb-2">
            Gramaj Seçimi
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {product.variants.map((variant, index) => {
              const isActive = index === variantIndex;
              return (
                <button
                  key={variant.weightGrams}
                  type="button"
                  onClick={() => setVariantIndex(index)}
                  aria-pressed={isActive}
                  className={clsx(
                    "rounded-lg py-3 px-4 flex flex-col items-center justify-center relative overflow-hidden bg-surface-container-lowest transition-colors",
                    isActive
                      ? "border-2 border-primary text-on-surface shadow-sm"
                      : "border border-outline-variant text-on-surface-variant hover:border-primary/50 hover:bg-surface-container-low",
                  )}
                >
                  <span className="font-bold text-lg">{variant.weightGrams}g</span>
                  <span className="text-xs text-outline mt-1">{variant.label}</span>
                  {isActive ? (
                    <Icon
                      name="check_circle"
                      filled
                      className="absolute top-1 right-1 text-primary text-sm"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Adet ve sepete ekle */}
      <div className="flex gap-4 mb-stack-md">
        <div className="flex items-center border border-outline-variant rounded-lg bg-surface-container-lowest h-14">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1}
            aria-label="Adedi azalt"
            className="w-12 h-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40 disabled:hover:text-on-surface-variant"
          >
            <Icon name="remove" />
          </button>
          <input
            type="number"
            min={1}
            readOnly
            value={quantity}
            aria-label="Adet"
            className="w-12 h-full text-center border-none bg-transparent font-bold text-lg focus:ring-0 p-0 text-on-surface"
          />
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            aria-label="Adedi artır"
            className="w-12 h-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <Icon name="add" />
          </button>
        </div>

        <button
          type="button"
          className="flex-grow bg-primary hover:bg-primary-container text-on-primary font-bold rounded-lg h-14 flex items-center justify-center gap-2 shadow-md warm-shadow-hover hover:scale-[1.01] transition-all duration-200"
        >
          <Icon name="shopping_bag" />
          Sepete Ekle
        </button>
      </div>

      {/* Ozellikler */}
      <div className="bg-surface-container-low rounded-xl p-5 mb-stack-md border border-surface-variant shadow-sm">
        <h2 className="font-headline-sm text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="info" className="text-primary" />
          Özellikler
        </h2>
        <dl className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
          <SpecItem icon="map" label="Yöre" value={product.specs.region} />
          <SpecItem
            icon="calendar_today"
            label="Hasat Yılı"
            value={product.specs.harvest}
          />
          {product.specs.totalActivity ? (
            <SpecItem
              icon="science"
              label="TA (Toplam Aktivite)"
              value={product.specs.totalActivity}
            />
          ) : null}
          <SpecItem
            icon="scale"
            label="Net Ağırlık"
            value={`${selectedVariant?.weightGrams ?? 0} Gram`}
          />
        </dl>
      </div>

      {/* Uzun aciklama */}
      <div>
        <h2 className="font-headline-sm text-lg font-bold text-on-surface mb-2">
          Ürün Hakkında
        </h2>
        <div className="text-on-surface-variant space-y-3 font-body-md leading-relaxed text-sm">
          {product.longDescription.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="block text-outline font-label-md mb-1 text-xs">{label}</dt>
      <dd className="font-medium text-on-surface flex items-center gap-1">
        <Icon name={icon} className="text-[16px] text-tertiary" />
        {value}
      </dd>
    </div>
  );
}
