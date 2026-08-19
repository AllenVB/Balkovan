"use client";

import { Icon } from "@/components/ui/icon";
import { useCart } from "@/components/cart/cart-provider";
import { formatNumber, formatPrice } from "@/lib/format";
import {
  calculatePointsUsage,
  MAX_POINTS_SHARE,
  POINTS_PER_LIRA,
  pointsToKurus,
} from "@/lib/loyalty";

/** Sepette bal puani kullanim kutusu. */
export function LoyaltyPointsBox() {
  const {
    totals,
    availablePoints,
    useLoyaltyPoints,
    setUseLoyaltyPoints,
  } = useCart();

  if (availablePoints <= 0) return null;

  const applied = totals.discounts.find((d) => d.id === "loyalty-points");

  // Kutu kapaliyken de "ne kazanacagini" gosterebilmek icin olasi indirim
  // ayrica hesaplanir; acikken zaten toplamlarin icinde.
  const otherDiscounts = totals.discounts
    .filter((d) => d.id !== "loyalty-points")
    .reduce((sum, d) => sum + d.amountInKurus, 0);
  const potential = calculatePointsUsage(
    availablePoints,
    Math.max(0, totals.subtotalInKurus - otherDiscounts),
    totals.subtotalInKurus,
  );

  const usable = applied
    ? { points: 0, discountInKurus: applied.amountInKurus }
    : potential;

  return (
    <div className="bg-comb rounded-xl p-6 border border-honey-100 warm-shadow flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name="stars" filled className="text-primary" />
          <div>
            <p className="font-label-md text-label-md text-on-background font-semibold">
              Bal Puanlarım
            </p>
            <p className="font-body-md text-xs text-ink-muted">
              {formatNumber(availablePoints)} puan ={" "}
              {formatPrice(pointsToKurus(availablePoints))}
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer shrink-0">
          <span className="sr-only">Bal puanlarımı bu siparişte kullan</span>
          <input
            type="checkbox"
            checked={useLoyaltyPoints}
            onChange={(event) => setUseLoyaltyPoints(event.target.checked)}
            disabled={usable.discountInKurus <= 0 && !useLoyaltyPoints}
            className="w-5 h-5 rounded border-2 border-honey-200 text-primary focus:ring-primary accent-[color:var(--color-primary)] disabled:opacity-40"
          />
        </label>
      </div>

      {usable.discountInKurus > 0 ? (
        <p className="font-body-md text-sm text-on-surface-variant">
          {useLoyaltyPoints ? (
            <>
              Bu siparişte{" "}
              <strong className="text-primary">
                {formatPrice(usable.discountInKurus)}
              </strong>{" "}
              puan indirimi uygulandı.
            </>
          ) : (
            <>
              Bu siparişte{" "}
              <strong className="text-primary">
                {formatPrice(potential.discountInKurus)}
              </strong>{" "}
              indirim için kullanabilirsiniz.
            </>
          )}
        </p>
      ) : (
        <p className="font-body-md text-sm text-on-surface-variant">
          Puanlarınız bu sepette kullanılamıyor.
        </p>
      )}

      <p className="font-body-md text-xs text-ink-muted border-t border-honey-200 pt-3">
        {POINTS_PER_LIRA} puan = 1 ₺ · Sepetin en fazla %
        {Math.round(MAX_POINTS_SHARE * 100)}&apos;i puanla ödenebilir
      </p>
    </div>
  );
}
