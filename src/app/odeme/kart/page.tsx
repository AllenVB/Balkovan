import type { Metadata } from "next";
import { CheckoutPaymentStep } from "@/components/checkout/checkout-payment-step";

export const metadata: Metadata = {
  title: "Ödeme",
  robots: { index: false, follow: false },
};

export default function CheckoutPaymentPage() {
  return <CheckoutPaymentStep />;
}
