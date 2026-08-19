import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Sepetim",
  description: "Sepetinizdeki ürünler ve sipariş özeti.",
};

export default function CartPage() {
  return <CartView />;
}
