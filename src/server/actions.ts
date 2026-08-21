"use server";

import {
  createOrder,
  orderRequestSchema,
  type OrderResult,
} from "@/server/orders";
import { refreshCartLines } from "@/server/catalog";
import { auth } from "@/auth";

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

  // Oturum varsa siparis kullaniciya baglanir: bal puani bakiyesi guncellenir
  // ve siparis gecmisinde gorunur. Oturum yoksa misafir siparisi olusur.
  const session = await auth();
  return createOrder(parsed.data, { userId: session?.user?.id ?? null });
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
