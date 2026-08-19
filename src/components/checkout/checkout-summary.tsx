"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/components/cart/cart-provider";
import { formatNumber, formatPrice } from "@/lib/format";
import { getShippingOption } from "@/lib/checkout";

/**
 * Odeme adimlarinin sag sutunundaki sticky siparis ozeti.
 * Tutarlar sepetle ayni kaynaktan gelir; burada yeniden hesap yapilmaz.
 */
export function CheckoutSummary({ shippingOptionId }: { shippingOptionId?: string | null }) {
  const { lines, totals } = useCart();
  const shipping = getShippingOption(shippingOptionId ?? totals.shippingOptionId);

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 warm-shadow p-6 flex flex-col gap-5 lg:sticky lg:top-8">
      <h2 className="font-headline-sm text-headline-sm text-primary border-b border-honey-200 pb-4">
        Sipariş Özeti
      </h2>

      <ul className="flex flex-col gap-4 max-h-64 overflow-y-auto">
        {lines.map((line) => (
          <li key={line.id} className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden shrink-0 relative">
              <Image
                src={line.image}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            </span>
            <span className="flex-grow min-w-0">
              <span className="block font-label-md text-label-md text-on-background truncate">
                {line.name} x{line.quantity}
              </span>
              <span className="block font-body-md text-xs text-ink-muted truncate">
                {line.variantLabel}
              </span>
            </span>
            <span className="font-price-display text-label-md text-on-background shrink-0">
              {formatPrice(line.unitPriceInKurus * line.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="flex flex-col gap-3 font-body-md text-sm border-t border-honey-200 pt-4">
        <div className="flex justify-between text-on-surface-variant">
          <dt>Ara Toplam</dt>
          <dd>{formatPrice(totals.subtotalInKurus)}</dd>
        </div>

        {totals.discounts.map((discount) => (
          <div
            key={discount.id}
            className="flex justify-between text-primary font-medium bg-surface-container-high p-2 rounded-md"
          >
            <dt className="flex items-center gap-1">
              <Icon name={discount.icon} className="text-sm" />
              {discount.label}
            </dt>
            <dd>-{formatPrice(discount.amountInKurus)}</dd>
          </div>
        ))}

        <div className="flex justify-between text-on-surface-variant">
          <dt>Kargo ({shipping.name})</dt>
          <dd>
            {totals.shippingInKurus === 0
              ? "Ücretsiz"
              : formatPrice(totals.shippingInKurus)}
          </dd>
        </div>
      </dl>

      <div className="border-t border-honey-200 pt-4 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-background">
            Genel Toplam
          </span>
          <span className="font-price-display text-2xl text-amber-deep font-semibold">
            {formatPrice(totals.totalInKurus)}
          </span>
        </div>
        {totals.earnedPoints > 0 ? (
          <p className="flex items-center justify-end gap-1 font-label-md text-label-md text-on-surface-variant">
            <Icon name="stars" filled className="text-primary text-sm" />
            {formatNumber(totals.earnedPoints)} bal puanı kazanacaksınız
          </p>
        ) : null}
      </div>
    </section>
  );
}
