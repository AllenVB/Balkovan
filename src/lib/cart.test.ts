import { describe, expect, it } from "vitest";
import {
  calculateCartTotals,
  FREE_SHIPPING_THRESHOLD_KURUS,
  SHIPPING_FEE_KURUS,
  type CartLine,
} from "@/lib/cart";

function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    id: "line-1",
    productSlug: "kestane-bali",
    name: "Kestane Balı",
    variantLabel: "Cam Kavanoz, 450g",
    image: "https://example.test/kestane.jpg",
    unitPriceInKurus: 45990,
    quantity: 1,
    ...overrides,
  };
}

describe("calculateCartTotals", () => {
  it("bos sepette her sey sifirdir ve kargo yazilmaz", () => {
    const totals = calculateCartTotals([]);

    expect(totals.itemCount).toBe(0);
    expect(totals.subtotalInKurus).toBe(0);
    expect(totals.shippingInKurus).toBe(0);
    expect(totals.totalInKurus).toBe(0);
  });

  it("adetleri ve satir tutarlarini toplar", () => {
    const totals = calculateCartTotals([
      line({ unitPriceInKurus: 10000, quantity: 2 }),
      line({ id: "line-2", unitPriceInKurus: 5000, quantity: 3 }),
    ]);

    expect(totals.itemCount).toBe(5);
    expect(totals.subtotalInKurus).toBe(35000);
  });

  it("esigin altinda kargo ucreti ekler", () => {
    const totals = calculateCartTotals([
      line({ unitPriceInKurus: FREE_SHIPPING_THRESHOLD_KURUS - 1, quantity: 1 }),
    ]);

    expect(totals.shippingInKurus).toBe(SHIPPING_FEE_KURUS);
    expect(totals.totalInKurus).toBe(
      FREE_SHIPPING_THRESHOLD_KURUS - 1 + SHIPPING_FEE_KURUS,
    );
  });

  it("esige tam oturdugunda kargo bedavadir", () => {
    const totals = calculateCartTotals([
      line({ unitPriceInKurus: FREE_SHIPPING_THRESHOLD_KURUS, quantity: 1 }),
    ]);

    expect(totals.shippingInKurus).toBe(0);
    expect(totals.remainingForFreeShippingInKurus).toBe(0);
    expect(totals.freeShippingProgressPercent).toBe(100);
  });

  it("ucretsiz kargoya kalan tutari hesaplar", () => {
    const totals = calculateCartTotals([
      line({ unitPriceInKurus: 60000, quantity: 1 }),
    ]);

    expect(totals.remainingForFreeShippingInKurus).toBe(
      FREE_SHIPPING_THRESHOLD_KURUS - 60000,
    );
  });

  it("ilerleme yuzdesi 100'u asmaz", () => {
    const totals = calculateCartTotals([
      line({ unitPriceInKurus: FREE_SHIPPING_THRESHOLD_KURUS * 3, quantity: 2 }),
    ]);

    expect(totals.freeShippingProgressPercent).toBe(100);
  });
});
