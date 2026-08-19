"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { useCheckout } from "@/components/checkout/use-checkout";
import { CheckoutShell } from "@/components/checkout/checkout-shell";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CheckoutSkeleton } from "@/components/checkout/checkout-skeleton";
import { PaymentForm } from "@/components/checkout/payment-form";
import { EmptyCartNotice } from "@/components/checkout/empty-cart-notice";
import { Icon } from "@/components/ui/icon";
import { formatPhone, getShippingOption } from "@/lib/checkout";

/** Odeme adim 2. Adres girilmeden bu adima gelinemez. */
export function CheckoutPaymentStep() {
  const router = useRouter();
  const { lines, isReady: isCartReady } = useCart();
  const { address, shippingOptionId, isReady: isCheckoutReady } = useCheckout();

  const ready = isCartReady && isCheckoutReady;
  const hasItems = lines.length > 0;
  const needsAddress = ready && hasItems && !address;

  // Adres yoksa akisin basina don. Render sirasinda yonlendirme yapilamadigi
  // icin efekt kullaniliyor.
  useEffect(() => {
    if (needsAddress) router.replace("/odeme");
  }, [needsAddress, router]);

  if (!ready) return <CheckoutSkeleton />;
  if (!hasItems) return <EmptyCartNotice />;
  if (!address) return <CheckoutSkeleton />;

  const shipping = getShippingOption(shippingOptionId);

  return (
    <CheckoutShell
      step={2}
      backHref="/odeme"
      backLabel="Adrese dön"
      aside={<CheckoutSummary shippingOptionId={shippingOptionId} />}
    >
      {/* Girilen adresin ozeti */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 warm-shadow p-6 mb-stack-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Icon name="location_on" filled className="text-primary shrink-0" />
            <div>
              <p className="font-label-md text-label-md font-bold text-on-background">
                {address.firstName} {address.lastName}
                {address.addressTitle ? (
                  <span className="ml-2 font-normal text-xs bg-surface-container-high text-on-surface-variant rounded-md px-2 py-0.5">
                    {address.addressTitle}
                  </span>
                ) : null}
              </p>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                {address.fullAddress}
              </p>
              <p className="font-body-md text-sm text-on-surface-variant">
                {address.district} / {address.city} · {formatPhone(address.phone)}
              </p>
              <p className="font-body-md text-sm text-on-surface-variant mt-2 flex items-center gap-1">
                <Icon name={shipping.icon} className="text-sm" />
                {shipping.name} · {shipping.estimate}
              </p>
            </div>
          </div>
        </div>
      </section>

      <PaymentForm address={address} />
    </CheckoutShell>
  );
}
