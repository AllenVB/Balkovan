import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { demoCartLines } from "@/lib/cart";

export const metadata: Metadata = {
  title: "Sepetim",
  description: "Sepetinizdeki ürünler ve sipariş özeti.",
};

export default function CartPage() {
  // Sepet su an ornek veriyle besleniyor; backend geldiginde burasi
  // gercek sepet kaydini okuyacak (bkz. lib/cart.ts).
  return <CartView initialLines={demoCartLines} />;
}
