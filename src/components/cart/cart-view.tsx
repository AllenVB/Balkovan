"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/components/cart/cart-provider";
import { CouponForm } from "@/components/cart/coupon-form";
import { LoyaltyPointsBox } from "@/components/cart/loyalty-points-box";
import { formatNumber, formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD_KURUS, MAX_LINE_QUANTITY } from "@/lib/cart";
import { nextBulkTier, THREE_FOR_TWO_GROUP_SIZE } from "@/lib/promotions";

/** Sepet ekrani. Satirlar CartProvider'dan gelir; adet ve silme oraya yazar. */
export function CartView() {
  const { lines, totals, isReady, setQuantity, removeLine } = useCart();
  const upcomingTier = nextBulkTier(totals.itemCount);
  const threeForTwoQuantity = lines
    .filter((line) => line.threeForTwo)
    .reduce((sum, line) => sum + line.quantity, 0);
  const untilNextFreeItem =
    threeForTwoQuantity > 0
      ? THREE_FOR_TWO_GROUP_SIZE -
        (threeForTwoQuantity % THREE_FOR_TWO_GROUP_SIZE)
      : 0;

  // Sepet tarayici deposundan okunana kadar bos/dolu karari verilemez;
  // aksi halde dolu sepette bir an "sepetiniz bos" yaniyor.
  if (!isReady) {
    return (
      <div className="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-stack-lg">
        <div className="h-64 rounded-xl bg-surface-container-low animate-pulse" />
        <span className="sr-only">Sepet yükleniyor</span>
      </div>
    );
  }

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
                <span className="font-bold text-primary">Kargonuz ücretsiz!</span>
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
            Sepet Tutarı: {formatPrice(totals.discountedSubtotalInKurus)} /{" "}
            {formatPrice(FREE_SHIPPING_THRESHOLD_KURUS)}
          </p>
        </div>

        {/* Kampanya ilerlemesi: bir sonraki kademeye ne kaldigini soyler. */}
        {upcomingTier || untilNextFreeItem > 0 ? (
          <div className="bg-primary-fixed border-2 border-primary rounded-xl p-4 flex flex-col gap-2">
            {upcomingTier ? (
              <p className="flex items-center gap-2 font-label-md text-label-md text-on-primary-fixed">
                <Icon name="local_offer" className="text-primary text-sm" />
                <span>
                  <strong>{upcomingTier.remaining} ürün</strong> daha ekleyin,
                  tüm sepette <strong>%{upcomingTier.discountPercent}</strong>{" "}
                  indirim kazanın.
                </span>
              </p>
            ) : null}
            {untilNextFreeItem > 0 && untilNextFreeItem < THREE_FOR_TWO_GROUP_SIZE ? (
              <p className="flex items-center gap-2 font-label-md text-label-md text-on-primary-fixed">
                <Icon name="card_giftcard" className="text-primary text-sm" />
                <span>
                  <strong>{untilNextFreeItem} hediye seti</strong> daha ekleyin,
                  biri <strong>bedava</strong> olsun.
                </span>
              </p>
            ) : null}
          </div>
        ) : null}

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
                    <div className="mt-2 flex flex-wrap gap-2">
                      {line.tag ? (
                        <span className="inline-block px-2 py-1 bg-honey-50 text-honey-800 rounded-md font-label-md text-xs border border-honey-200">
                          {line.tag}
                        </span>
                      ) : null}
                      {line.threeForTwo ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-container text-on-primary-container rounded-md font-label-md text-xs font-bold">
                          <Icon name="card_giftcard" className="text-xs" />
                          3 Al 2 Öde
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    aria-label={`${line.name} ürününü sepetten çıkar`}
                    className="text-on-surface-variant hover:text-error transition-colors min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 sm:p-1 flex items-center justify-center rounded-full hover:bg-error-container shrink-0"
                  >
                    <Icon name="delete" className="text-lg" />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-4 sm:mt-0">
                  <div className="flex items-center border border-honey-200 rounded-lg bg-background">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.id, line.quantity - 1)}
                      disabled={line.quantity <= 1}
                      aria-label={`${line.name} adedini azalt`}
                      className="min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 sm:px-3 sm:py-1 flex items-center justify-center text-primary hover:bg-honey-100 rounded-l-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-label-md text-label-md font-semibold w-10 text-center">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.id, line.quantity + 1)}
                      disabled={line.quantity >= MAX_LINE_QUANTITY}
                      aria-label={`${line.name} adedini artır`}
                      className="min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 sm:px-3 sm:py-1 flex items-center justify-center text-primary hover:bg-honey-100 rounded-r-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
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
              <dt>Kargo</dt>
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
            {totals.discountTotalInKurus > 0 ? (
              <p className="text-right font-label-md text-label-md text-primary">
                Bu siparişte {formatPrice(totals.discountTotalInKurus)} kazandınız
              </p>
            ) : null}
            <p className="text-right font-body-md text-xs text-ink-muted">
              Tüm fiyatlara KDV dahildir.
            </p>
            {totals.earnedPoints > 0 ? (
              <p className="flex items-center justify-end gap-1 font-label-md text-label-md text-on-surface-variant">
                <Icon name="stars" filled className="text-primary text-sm" />
                {formatNumber(totals.earnedPoints)} bal puanı kazanacaksınız
              </p>
            ) : null}
          </div>

          <Link
            href="/odeme"
            className="w-full py-4 bg-amber-deep text-on-primary rounded-xl font-label-md text-lg font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2"
          >
            Ödemeye Geç <Icon name="arrow_forward" />
          </Link>
        </div>

        <LoyaltyPointsBox />
        <CouponForm />
      </aside>
    </div>
  );
}
