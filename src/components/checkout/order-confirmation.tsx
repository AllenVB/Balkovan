"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useCheckout } from "@/components/checkout/use-checkout";
import { CheckoutSkeleton } from "@/components/checkout/checkout-skeleton";
import { formatNumber, formatPrice } from "@/lib/format";
import { formatPhone, getShippingOption } from "@/lib/checkout";
import { stitchImages } from "@/lib/images";

/** Siparis onay ekrani. Tamamlanmis siparis yoksa anasayfaya doner. */
export function OrderConfirmation() {
  const router = useRouter();
  const { lastOrder, isReady } = useCheckout();

  const missing = isReady && !lastOrder;
  useEffect(() => {
    if (missing) router.replace("/");
  }, [missing, router]);

  if (!isReady || !lastOrder) return <CheckoutSkeleton />;

  const shipping = getShippingOption(lastOrder.shippingOptionId);
  const { address } = lastOrder;

  return (
    <div className="relative min-h-full flex items-center justify-center px-margin-mobile py-stack-lg">
      <Image
        src={stitchImages.anasayfa.yolculugumuz}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-on-background/60" />

      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest rounded-3xl warm-shadow p-8 md:p-10 text-center flex flex-col items-center">
        <span className="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
          <Icon name="check_circle" filled size={48} />
        </span>

        <h1 className="font-headline-md text-headline-md text-primary mb-3">
          Siparişiniz Alındı!
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">
          Doğanın en saf hali sofranıza doğru yola çıkmaya hazırlanıyor.
          Siparişinizi özenle hazırlıyoruz.
        </p>

        <dl className="w-full bg-surface-container-low rounded-xl border border-outline-variant/40 divide-y divide-outline-variant/40 text-left">
          <Row label="Sipariş Numarası">
            <span className="font-price-display font-bold text-primary">
              #{lastOrder.orderNumber}
            </span>
          </Row>
          <Row label="Tahmini Teslimat">{lastOrder.deliveryEstimate}</Row>
          <Row label="Kargo">{shipping.name}</Row>
          <Row label="Teslimat Adresi">
            <span className="block text-right">
              {address.firstName} {address.lastName}
              <span className="block text-sm text-on-surface-variant">
                {address.district} / {address.city}
              </span>
              <span className="block text-sm text-on-surface-variant">
                {formatPhone(address.phone)}
              </span>
            </span>
          </Row>
          <Row label="Ödenen Tutar">
            <span className="font-price-display font-bold text-amber-deep">
              {formatPrice(lastOrder.totalInKurus)}
            </span>
          </Row>
          {lastOrder.earnedPoints > 0 ? (
            <Row label="Kazanılan Bal Puanı">
              <span className="flex items-center justify-end gap-1 text-primary font-bold">
                <Icon name="stars" filled className="text-sm" />
                {formatNumber(lastOrder.earnedPoints)}
              </span>
            </Row>
          ) : null}
        </dl>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-8">
          <Link
            href="/hesabim/siparislerim"
            className="flex-1 flex items-center justify-center gap-2 bg-surface-container-highest text-on-background font-label-md text-label-md font-bold py-4 rounded-xl border border-outline-variant/50 hover:bg-surface-variant transition-colors"
          >
            <Icon name="receipt_long" />
            Sipariş Detayları
          </Link>
          <Link
            href="/urunler"
            className="flex-1 flex items-center justify-center gap-2 bg-amber-deep text-on-primary font-label-md text-label-md font-bold py-4 rounded-xl hover:bg-primary transition-colors"
          >
            <Icon name="storefront" />
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <dt className="font-label-md text-label-md text-on-surface-variant shrink-0">
        {label}
      </dt>
      <dd className="font-label-md text-label-md text-on-background text-right">
        {children}
      </dd>
    </div>
  );
}
