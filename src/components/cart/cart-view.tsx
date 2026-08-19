"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { formatPrice } from "@/lib/format";
import {
  calculateCartTotals,
  type CartLine,
  FREE_SHIPPING_THRESHOLD_KURUS,
} from "@/lib/cart";

/**
 * Sepet ekrani. Adet degistirme ve satir silme bu bilesende yasiyor;
 * kalicilik (sunucuya yazma) backend fazinda eklenecek.
 */
export function CartView({ initialLines }: { initialLines: CartLine[] }) {
  const [lines, setLines] = useState(initialLines);
  const totals = calculateCartTotals(lines);

  const changeQuantity = (id: string, delta: number) => {
    setLines((current) =>
      current.map((line) =>
        line.id === id
          ? { ...line, quantity: Math.max(1, line.quantity + delta) }
          : line,
      ),
    );
  };

  const removeLine = (id: string) => {
    setLines((current) => current.filter((line) => line.id !== id));
  };

  if (lines.length === 0) {
    return (
      <div className="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-stack-lg text-center flex flex-col items-center gap-stack-md">
        <Icon name="shopping_basket" size={64} className="text-outline-variant" />
        <h1 className="font-headline-md text-headline-md text-primary">
          Sepetiniz boş
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
          Yaylalardan gelen ballarımıza göz atıp sepetinizi doldurabilirsiniz.
        </p>
        <Link
          href="/urunler"
          className="bg-amber-deep text-on-primary font-label-md text-label-md font-bold px-8 py-4 rounded-full hover:bg-primary-container transition-colors warm-shadow"
        >
          Ürünleri Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-stack-md md:py-stack-lg flex flex-col lg:flex-row gap-gutter">
      <section className="flex-1 flex flex-col gap-stack-md">
        <h1 className="font-headline-md text-headline-md text-primary mb-2 hidden md:block">
          Sepetim ({totals.itemCount} Ürün)
        </h1>

        {/* Ucretsiz kargo ilerlemesi */}
        <div className="bg-comb rounded-xl p-4 md:p-6 border border-honey-100 warm-shadow">
          <div className="flex justify-between items-end mb-2">
            <div className="font-label-md text-label-md text-on-surface-variant">
              {totals.remainingForFreeShippingInKurus > 0 ? (
                <>
                  Ücretsiz kargoya{" "}
                  <span className="font-bold text-primary">
                    {formatPrice(totals.remainingForFreeShippingInKurus)}
                  </span>{" "}
                  kaldı
                </>
              ) : (
                <span className="font-bold text-primary">
                  Kargonuz ücretsiz!
                </span>
              )}
            </div>
            <Icon name="local_shipping" className="text-primary" />
          </div>
          <div className="w-full bg-surface-variant rounded-full h-3 border border-honey-200 shadow-inner overflow-hidden">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${totals.freeShippingProgressPercent}%` }}
            />
          </div>
          <p className="font-body-md text-xs text-ink-muted mt-2 text-right">
            Sepet Tutarı: {formatPrice(totals.subtotalInKurus)} /{" "}
            {formatPrice(FREE_SHIPPING_THRESHOLD_KURUS)}
          </p>
        </div>

        {/* Urun listesi */}
        <ul className="bg-comb rounded-xl border border-honey-100 warm-shadow overflow-hidden">
          {lines.map((line, index) => (
            <li
              key={line.id}
              className={`flex flex-col sm:flex-row p-4 md:p-6 gap-4 hover:bg-surface-container-low transition-colors duration-200 ${
                index < lines.length - 1 ? "border-b border-honey-100" : ""
              }`}
            >
              <Link
                href={`/urunler/${line.productSlug}`}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-surface-container-high overflow-hidden shrink-0 relative block"
              >
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-col flex-grow justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="font-label-md text-lg text-on-background font-semibold">
                      <Link
                        href={`/urunler/${line.productSlug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {line.name}
                      </Link>
                    </h2>
                    <p className="font-body-md text-sm text-ink-muted">
                      {line.variantLabel}
                    </p>
                    {line.tag ? (
                      <div className="mt-2 inline-block px-2 py-1 bg-honey-50 text-honey-800 rounded-md font-label-md text-xs border border-honey-200">
                        {line.tag}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    aria-label={`${line.name} ürününü sepetten çıkar`}
                    className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-error-container"
                  >
                    <Icon name="delete" className="text-lg" />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-4 sm:mt-0">
                  <div className="flex items-center border border-honey-200 rounded-lg bg-background">
                    <button
                      type="button"
                      onClick={() => changeQuantity(line.id, -1)}
                      disabled={line.quantity <= 1}
                      aria-label="Azalt"
                      className="px-3 py-1 text-primary hover:bg-honey-100 rounded-l-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-label-md text-label-md font-semibold w-10 text-center">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(line.id, 1)}
                      aria-label="Artır"
                      className="px-3 py-1 text-primary hover:bg-honey-100 rounded-r-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-price-display text-price-display text-on-background">
                    {formatPrice(line.unitPriceInKurus * line.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Siparis ozeti */}
      <aside className="w-full lg:w-96 flex flex-col gap-stack-md mt-stack-md lg:mt-0 lg:sticky lg:top-28 self-start">
        <div className="bg-comb rounded-xl p-6 border border-honey-100 shadow-[0_8px_30px_rgba(140,80,0,0.12)] flex flex-col gap-6">
          <h2 className="font-headline-sm text-headline-sm text-primary border-b border-honey-200 pb-4">
            Sipariş Özeti
          </h2>

          <dl className="flex flex-col gap-3 font-body-md text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <dt>Ara Toplam ({totals.itemCount} Ürün)</dt>
              <dd>{formatPrice(totals.subtotalInKurus)}</dd>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <dt>Kargo</dt>
              <dd>
                {totals.shippingInKurus === 0
                  ? "Ücretsiz"
                  : formatPrice(totals.shippingInKurus)}
              </dd>
            </div>
          </dl>

          <div className="border-t border-honey-200 pt-4 flex justify-between items-center">
            <span className="font-label-md text-label-md text-on-background">
              Genel Toplam
            </span>
            <span className="font-price-display text-2xl text-amber-deep font-semibold">
              {formatPrice(totals.totalInKurus)}
            </span>
          </div>

          <button
            type="button"
            className="w-full py-4 bg-amber-deep text-on-primary rounded-xl font-label-md text-lg font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2"
          >
            Ödemeye Geç <Icon name="arrow_forward" />
          </button>
        </div>

        {/* Indirim kodu */}
        <div className="bg-comb rounded-xl p-6 border border-honey-100 warm-shadow flex flex-col gap-4">
          <label
            className="font-label-md text-label-md text-on-background"
            htmlFor="coupon_code"
          >
            İndirim Kodu / Hediye Çeki
          </label>
          <div className="flex gap-2">
            <input
              id="coupon_code"
              type="text"
              placeholder="Kod giriniz"
              className="flex-grow border-2 border-honey-200 rounded-lg px-4 py-2 bg-background focus:border-honey-500 focus:ring-0 focus:outline-none font-body-md text-on-background"
            />
            <button
              type="button"
              className="px-4 py-2 bg-surface-variant text-on-surface-variant rounded-lg font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors border border-honey-200"
            >
              Uygula
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
