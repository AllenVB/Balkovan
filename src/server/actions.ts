"use server";

import {
  createOrder,
  orderRequestSchema,
  type OrderResult,
} from "@/server/orders";
import { refreshCartLines } from "@/server/catalog";

/**
 * Odeme adiminin cagirdigi sunucu eylemi.
 *
 * Istemci yalnizca urun/varyant/adet, adres ve kargo secimi gonderir.
 * Fiyat hesabi tamamen sunucuda yapilir (bkz. server/orders.ts).
 */
export async function placeOrderAction(input: unknown): Promise<OrderResult> {
  const parsed = orderRequestSchema.safeParse(input);

  if (!parsed.success) {
    // Dogrulama mesajlari kullaniciya gosterilecek kadar anlasilir; ilkini ver.
    const first = parsed.error.issues[0];
    return {
      ok: false,
      code: "BEKLENMEYEN_HATA",
      error: first?.message ?? "Sipariş bilgileri geçersiz.",
    };
  }

  // Uyelik geldiginde oturumdaki kullanici kimligi buraya gecirilecek;
  // o zaman bal puani bakiyesi ve "ilk siparise ozel" kupon kurali islenir.
  return createOrder(parsed.data, { userId: null });
}

/**
 * Sepeti veritabanindaki guncel fiyatlarla tazeler.
 * Sepet sayfasi acilinca cagrilir; fiyat degistiyse musteriye bildirilir.
 */
export async function refreshCartAction(
  items: { productSlug: string; variantWeightGrams: number }[],
) {
  return refreshCartLines(items);
}
