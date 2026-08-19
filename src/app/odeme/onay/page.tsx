import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";

export const metadata: Metadata = {
  title: "Siparişiniz Alındı",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return <OrderConfirmation />;
}
