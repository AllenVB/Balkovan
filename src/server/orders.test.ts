import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/db";
import { createOrder } from "@/server/orders";

/**
 * Siparis olusturma testleri - gercek veritabanina karsi calisir.
 * Calistirmadan once: docker compose up -d && npx prisma migrate deploy && npx prisma db seed
 *
 * En kritik senaryo: istemci fiyat gondermez, gonderdigi tutar tutmuyorsa
 * siparis reddedilir. Bu test o korumanin canli kanitidir.
 */
const address = {
  firstName: "Ayşe",
  lastName: "Yılmaz",
  phone: "5321234567",
  city: "İstanbul",
  district: "Kadıköy",
  fullAddress: "Caferağa Mah. Moda Cad. No:12 D:3",
};

/** Testlerin olusturdugu siparisler; sonunda temizlenir. */
const createdOrderNumbers: string[] = [];

async function order(overrides: Parameters<typeof createOrder>[0]) {
  const result = await createOrder(overrides);
  if (result.ok) createdOrderNumbers.push(result.orderNumber);
  return result;
}

let camBaliPrice = 0;

beforeAll(async () => {
  const variant = await prisma.productVariant.findFirst({
    where: { product: { slug: "cam-bali" }, weightGrams: 450 },
  });
  if (!variant) throw new Error("Seed calistirilmamis: cam-bali bulunamadi");
  camBaliPrice = variant.priceInKurus;
});

afterAll(async () => {
  if (createdOrderNumbers.length > 0) {
    await prisma.order.deleteMany({
      where: { orderNumber: { in: createdOrderNumbers } },
    });
  }
  await prisma.$disconnect();
});

describe("createOrder - fiyat guvenligi", () => {
  it("gecerli siparisi olusturur ve fiyati veritabanindan alir", async () => {
    const result = await order({
      items: [
        { productSlug: "cam-bali", variantWeightGrams: 450, quantity: 2 },
      ],
      address,
      shippingOptionId: "aras",
      useLoyaltyPoints: false,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    // 2 adet urun + kargo; fiyat veritabanindaki degerden hesaplanmali
    expect(result.totalInKurus).toBe(camBaliPrice * 2 + 4990);
    expect(result.orderNumber).toMatch(/^BLK-\d{4}-\d{4}$/);
  });

  it("istemci dusuk tutar gonderirse siparisi REDDEDER", async () => {
    const result = await order({
      items: [
        { productSlug: "cam-bali", variantWeightGrams: 450, quantity: 1 },
      ],
      address,
      shippingOptionId: "aras",
      useLoyaltyPoints: false,
      // Saldirgan senaryosu: sepeti kurcalayip 1 ₺ toplam gonderiyor
      expectedTotalInKurus: 100,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("TUTAR_UYUSMUYOR");
  });

  it("olmayan urun icin siparis olusturmaz", async () => {
    const result = await order({
      items: [
        { productSlug: "olmayan-urun", variantWeightGrams: 450, quantity: 1 },
      ],
      address,
      shippingOptionId: "aras",
      useLoyaltyPoints: false,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("URUN_BULUNAMADI");
  });

  it("olmayan varyant icin siparis olusturmaz", async () => {
    const result = await order({
      items: [
        { productSlug: "cam-bali", variantWeightGrams: 9999, quantity: 1 },
      ],
      address,
      shippingOptionId: "aras",
      useLoyaltyPoints: false,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("URUN_BULUNAMADI");
  });

  it("stoktan fazla adet istenirse reddeder", async () => {
    const result = await order({
      items: [
        { productSlug: "cam-bali", variantWeightGrams: 450, quantity: 99 },
      ],
      address,
      shippingOptionId: "aras",
      useLoyaltyPoints: false,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("STOK_YETERSIZ");
  });

  it("gecersiz kuponu reddeder", async () => {
    const result = await order({
      items: [
        { productSlug: "cam-bali", variantWeightGrams: 450, quantity: 1 },
      ],
      address,
      shippingOptionId: "aras",
      couponCode: "SAHTE_KOD",
      useLoyaltyPoints: false,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("KUPON_GECERSIZ");
  });

  it("gecerli kuponu uygular ve tutari dusurur", async () => {
    const indirimsiz = await order({
      items: [
        { productSlug: "cam-bali", variantWeightGrams: 450, quantity: 1 },
      ],
      address,
      shippingOptionId: "aras",
      useLoyaltyPoints: false,
    });
    const kuponlu = await order({
      items: [
        { productSlug: "cam-bali", variantWeightGrams: 450, quantity: 1 },
      ],
      address,
      shippingOptionId: "aras",
      couponCode: "merhaba15",
      useLoyaltyPoints: false,
    });

    expect(indirimsiz.ok && kuponlu.ok).toBe(true);
    if (!indirimsiz.ok || !kuponlu.ok) return;
    expect(kuponlu.totalInKurus).toBeLessThan(indirimsiz.totalInKurus);
  });
});

describe("createOrder - stok", () => {
  it("basarili siparis stogu dusurur", async () => {
    const before = await prisma.productVariant.findFirstOrThrow({
      where: { product: { slug: "kekik-bali" }, weightGrams: 450 },
    });

    const result = await order({
      items: [
        { productSlug: "kekik-bali", variantWeightGrams: 450, quantity: 3 },
      ],
      address,
      shippingOptionId: "aras",
      useLoyaltyPoints: false,
    });
    expect(result.ok).toBe(true);

    const after = await prisma.productVariant.findFirstOrThrow({
      where: { product: { slug: "kekik-bali" }, weightGrams: 450 },
    });
    expect(after.stock).toBe(before.stock - 3);
  });

  it("reddedilen siparis stogu degistirmez", async () => {
    const before = await prisma.productVariant.findFirstOrThrow({
      where: { product: { slug: "kestane-bali" }, weightGrams: 450 },
    });

    await order({
      items: [
        { productSlug: "kestane-bali", variantWeightGrams: 450, quantity: 1 },
      ],
      address,
      shippingOptionId: "aras",
      useLoyaltyPoints: false,
      expectedTotalInKurus: 1, // uyusmayacak
    });

    const after = await prisma.productVariant.findFirstOrThrow({
      where: { product: { slug: "kestane-bali" }, weightGrams: 450 },
    });
    expect(after.stock).toBe(before.stock);
  });
});
