"use client";

import { useCart } from "@/components/cart/cart-provider";
import { useCheckout } from "@/components/checkout/use-checkout";
import { CheckoutShell } from "@/components/checkout/checkout-shell";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CheckoutSkeleton } from "@/components/checkout/checkout-skeleton";
import { AddressForm } from "@/components/checkout/address-form";
import { EmptyCartNotice } from "@/components/checkout/empty-cart-notice";
import { Icon } from "@/components/ui/icon";
import { formatPrice } from "@/lib/format";

/** Odeme adim 1: adres ve kargo. Sepet bossa akisa girilemez. */
export function CheckoutAddressStep() {
  const { lines, totals, isReady } = useCart();
  const { shippingOptionId } = useCheckout();

  if (!isReady) return <CheckoutSkeleton />;
  if (lines.length === 0) return <EmptyCartNotice />;

  return (
    <CheckoutShell
      step={1}
      backHref="/sepet"
      backLabel="Sepete dön"
      aside={<CheckoutSummary shippingOptionId={shippingOptionId} />}
    >
      <AddressForm />

      <button
        type="submit"
        form="adres-formu"
        className="mt-stack-md w-full bg-amber-deep text-on-primary rounded-xl font-label-md text-lg font-bold py-4 flex items-center justify-center gap-2 hover:bg-primary transition-colors warm-shadow"
      >
        Ödemeye Geç ({formatPrice(totals.totalInKurus)})
        <Icon name="arrow_forward" />
      </button>
    </CheckoutShell>
  );
}
