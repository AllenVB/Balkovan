import type { Metadata } from "next";
import { CheckoutAddressStep } from "@/components/checkout/checkout-address-step";

export const metadata: Metadata = {
  title: "Adres ve Kargo",
  robots: { index: false, follow: false },
};

export default function CheckoutAddressPage() {
  return <CheckoutAddressStep />;
}
