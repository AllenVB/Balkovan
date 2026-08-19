import { describe, expect, it } from "vitest";
import {
  calculateDiscounts,
  calculateThreeForTwoDiscount,
  findBulkTier,
  findCoupon,
  nextBulkTier,
} from "@/lib/promotions";
import { calculateCartTotals, type CartLine } from "@/lib/cart";

function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    id: "kestane-bali--450",
    productSlug: "kestane-bali",
    variantWeightGrams: 450,
    name: "Kestane Balı",
    variantLabel: "Kavanoz, 450g",
    image: "https://example.test/x.jpg",
    unitPriceInKurus: 10000,
    quantity: 1,
    ...overrides,
  };
}

/** Kampanyali (3 al 2 ode) hediye seti satiri. */
function gift(overrides: Partial<CartLine> = {}): CartLine {
  return line({
    id: "premium-hediye-seti--1350",
    productSlug: "premium-hediye-seti",
    name: "Premium Hediye Seti",
    unitPriceInKurus: 84990,
    threeForTwo: true,
    ...overrides,
  });
}

describe("calculateThreeForTwoDiscount", () => {
  it("uc adedin altinda indirim yok", () => {
    expect(calculateThreeForTwoDiscount([gift({ quantity: 2 })])).toBe(0);
  });

  it("uc adette bir tanesi bedava", () => {
    expect(calculateThreeForTwoDiscount([gift({ quantity: 3 })])).toBe(84990);
  });

  it("alti adette iki tanesi bedava", () => {
    expect(calculateThreeForTwoDiscount([gift({ quantity: 6 })])).toBe(2 * 84990);
  });

  it("bes adette yalnizca bir tanesi bedava (artan sayilmaz)", () => {
    expect(calculateThreeForTwoDiscount([gift({ quantity: 5 })])).toBe(84990);
  });

  it("farkli kampanyali urunler birlikte sayilir ve en ucuzu bedava olur", () => {
    const discount = calculateThreeForTwoDiscount([
      gift({ quantity: 2, unitPriceInKurus: 84990 }),
      gift({ id: "b", productSlug: "b", quantity: 1, unitPriceInKurus: 40000 }),
    ]);
    // 3 adet -> 1 bedava, bedava olan en ucuz olan
    expect(discount).toBe(40000);
  });

  it("kampanyasiz urunler sayilmaz", () => {
    expect(calculateThreeForTwoDiscount([line({ quantity: 9 })])).toBe(0);
  });
});

describe("findBulkTier", () => {
  it("alti altinda kademe yok", () => {
    expect(findBulkTier(5)).toBeUndefined();
  });

  it("alti ve uzeri %5", () => {
    expect(findBulkTier(6)?.discountPercent).toBe(5);
    expect(findBulkTier(11)?.discountPercent).toBe(5);
  });

  it("on iki ve uzeri %10", () => {
    expect(findBulkTier(12)?.discountPercent).toBe(10);
    expect(findBulkTier(50)?.discountPercent).toBe(10);
  });
});

describe("nextBulkTier", () => {
  it("bir sonraki kademeye kalan adedi soyler", () => {
    expect(nextBulkTier(4)).toMatchObject({ remaining: 2, discountPercent: 5 });
    expect(nextBulkTier(7)).toMatchObject({ remaining: 5, discountPercent: 10 });
  });

  it("en ust kademede null doner", () => {
    expect(nextBulkTier(12)).toBeNull();
  });
});

describe("calculateDiscounts", () => {
  it("esigin altinda indirim yok", () => {
    expect(calculateDiscounts([line({ quantity: 5 })])).toEqual([]);
  });

  it("alti adette tum sepete %5 uygular (urunler farkli olabilir)", () => {
    const discounts = calculateDiscounts([
      line({ quantity: 3, unitPriceInKurus: 10000 }),
      line({ id: "b", productSlug: "b", quantity: 3, unitPriceInKurus: 20000 }),
    ]);

    expect(discounts).toHaveLength(1);
    // (3*10000 + 3*20000) = 90000 -> %5 = 4500
    expect(discounts[0]?.amountInKurus).toBe(4500);
  });

  it("on iki adette %10 uygular", () => {
    const discounts = calculateDiscounts([
      line({ quantity: 12, unitPriceInKurus: 10000 }),
    ]);
    expect(discounts[0]?.amountInKurus).toBe(12000);
  });

  it("3 al 2 ode alan urun toplu alim yuzdesine girmez", () => {
    // 3 hediye seti + 3 normal urun = 6 adet -> %5 esigi asilir
    const discounts = calculateDiscounts([
      gift({ quantity: 3 }),
      line({ quantity: 3, unitPriceInKurus: 10000 }),
    ]);

    const threeForTwo = discounts.find((d) => d.id === "three-for-two");
    const bulk = discounts.find((d) => d.id === "bulk");

    expect(threeForTwo?.amountInKurus).toBe(84990);
    // %5 yalnizca kampanyasiz 30000 uzerinden = 1500
    expect(bulk?.amountInKurus).toBe(1500);
  });

  it("sepette yalnizca kampanyali urun varsa toplu alim satiri olusmaz", () => {
    const discounts = calculateDiscounts([gift({ quantity: 6 })]);
    expect(discounts.find((d) => d.id === "bulk")).toBeUndefined();
  });

  it("kupon, onceki indirimler dusuldukten sonraki tutara uygulanir", () => {
    const discounts = calculateDiscounts(
      [line({ quantity: 12, unitPriceInKurus: 10000 })],
      "MERHABA15",
    );

    const bulk = discounts.find((d) => d.id === "bulk");
    const coupon = discounts.find((d) => d.id === "coupon-MERHABA15");

    expect(bulk?.amountInKurus).toBe(12000);
    // (120000 - 12000) * %15 = 16200
    expect(coupon?.amountInKurus).toBe(16200);
  });

  it("gecersiz kupon yok sayilir", () => {
    const discounts = calculateDiscounts([line({ quantity: 1 })], "GECERSIZ");
    expect(discounts).toEqual([]);
  });
});

describe("findCoupon", () => {
  it("kucuk harf ve bosluklari tolere eder", () => {
    expect(findCoupon("  merhaba15 ")?.code).toBe("MERHABA15");
  });

  it("bilinmeyen kodu bulmaz", () => {
    expect(findCoupon("YOK")).toBeUndefined();
  });
});

describe("calculateCartTotals indirimlerle", () => {
  it("genel toplam indirimler dusulerek hesaplanir", () => {
    const totals = calculateCartTotals([
      line({ quantity: 12, unitPriceInKurus: 10000 }),
    ]);

    expect(totals.subtotalInKurus).toBe(120000);
    expect(totals.discountTotalInKurus).toBe(12000);
    expect(totals.discountedSubtotalInKurus).toBe(108000);
    // 108000 < 150000 esigi -> kargo ucretli
    expect(totals.totalInKurus).toBe(108000 + totals.shippingInKurus);
  });

  it("kargo esigi indirim SONRASI tutara bakar", () => {
    // Ara toplam esigin uzerinde ama indirim sonrasi altina duser.
    const totals = calculateCartTotals([
      line({ quantity: 6, unitPriceInKurus: 25500 }),
    ]);

    expect(totals.subtotalInKurus).toBe(153000);
    expect(totals.discountedSubtotalInKurus).toBeLessThan(150000);
    expect(totals.shippingInKurus).toBeGreaterThan(0);
  });

  it("indirim urun tutarini asamaz, toplam eksiye dusmez", () => {
    const totals = calculateCartTotals([gift({ quantity: 3 })], "MERHABA15");
    expect(totals.discountedSubtotalInKurus).toBeGreaterThanOrEqual(0);
    expect(totals.totalInKurus).toBeGreaterThanOrEqual(0);
  });
});
