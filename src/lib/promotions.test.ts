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

  it("3 al 2 ode ve toplu alim ust uste biner", () => {
    // 3 hediye seti + 3 normal urun = 6 adet -> %5 esigi asilir
    const discounts = calculateDiscounts([
      gift({ quantity: 3 }),
      line({ quantity: 3, unitPriceInKurus: 10000 }),
    ]);

    const threeForTwo = discounts.find((d) => d.id === "three-for-two");
    const bulk = discounts.find((d) => d.id === "bulk");

    expect(threeForTwo?.amountInKurus).toBe(84990);
    // Ara toplam 284970; 3 al 2 ode dusunce 199980; %5 = 9999
    expect(bulk?.amountInKurus).toBe(9999);
  });

  it("yalnizca kampanyali urun varsa da toplu alim uygulanir", () => {
    const discounts = calculateDiscounts([gift({ quantity: 6 })]);
    const bulk = discounts.find((d) => d.id === "bulk");
    // 6 * 84990 = 509940; iki adet bedava -> 339960; %5 = 16998
    expect(bulk?.amountInKurus).toBe(16998);
  });

  it("kupon, onceki indirimler dusuldukten sonraki tutara uygulanir", () => {
    const discounts = calculateDiscounts(
      [line({ quantity: 12, unitPriceInKurus: 10000 })],
      { couponCode: "MERHABA15" },
    );

    const bulk = discounts.find((d) => d.id === "bulk");
    const coupon = discounts.find((d) => d.id === "coupon-MERHABA15");

    expect(bulk?.amountInKurus).toBe(12000);
    // (120000 - 12000) * %15 = 16200
    expect(coupon?.amountInKurus).toBe(16200);
  });

  it("options null gelse de patlamaz", () => {
    expect(calculateDiscounts([line({ quantity: 1 })], null)).toEqual([]);
    expect(() => calculateCartTotals([line({ quantity: 1 })], null)).not.toThrow();
  });

  it("gecersiz kupon yok sayilir", () => {
    const discounts = calculateDiscounts([line({ quantity: 1 })], { couponCode: "GECERSIZ" });
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
    const totals = calculateCartTotals([gift({ quantity: 3 })], { couponCode: "MERHABA15" });
    expect(totals.discountedSubtotalInKurus).toBeGreaterThanOrEqual(0);
    expect(totals.totalInKurus).toBeGreaterThanOrEqual(0);
  });
});


describe("bal puani", () => {
  it("kapali oldugunda puan indirimi uygulanmaz", () => {
    const discounts = calculateDiscounts([line({ quantity: 1 })], {
      loyaltyPoints: 5000,
    });
    expect(discounts.find((d) => d.id === "loyalty-points")).toBeUndefined();
  });

  it("10 puan 1 ₺ olarak dusulur", () => {
    // 100 ₺'lik sepet, 200 puan -> 20 ₺ ama %25 siniri 25 ₺ oldugu icin 20 ₺ gecer
    const discounts = calculateDiscounts([line({ quantity: 1, unitPriceInKurus: 10000 })], {
      loyaltyPoints: 200,
      useLoyaltyPoints: true,
    });
    const points = discounts.find((d) => d.id === "loyalty-points");
    expect(points?.amountInKurus).toBe(2000);
  });

  it("sepetin %25'inden fazlasi puanla odenemez", () => {
    // 100 ₺ sepet, 10.000 puan (1000 ₺) -> en fazla 25 ₺
    const discounts = calculateDiscounts([line({ quantity: 1, unitPriceInKurus: 10000 })], {
      loyaltyPoints: 10000,
      useLoyaltyPoints: true,
    });
    const points = discounts.find((d) => d.id === "loyalty-points");
    expect(points?.amountInKurus).toBe(2500);
  });

  it("yalnizca gercekten kullanilan puan dusulur", () => {
    const discounts = calculateDiscounts([line({ quantity: 1, unitPriceInKurus: 10000 })], {
      loyaltyPoints: 10000,
      useLoyaltyPoints: true,
    });
    const points = discounts.find((d) => d.id === "loyalty-points");
    // 25 ₺ = 250 puan; kalan 9750 puan kullanicida kalir
    expect(points?.label).toContain("250 puan");
  });

  it("tum indirimler ust uste binince toplam eksiye dusmez", () => {
    const totals = calculateCartTotals([gift({ quantity: 12 })], {
      couponCode: "MERHABA15",
      loyaltyPoints: 100000,
      useLoyaltyPoints: true,
    });
    expect(totals.discountedSubtotalInKurus).toBeGreaterThanOrEqual(0);
    expect(totals.discountTotalInKurus).toBeLessThanOrEqual(totals.subtotalInKurus);
  });
});

describe("kazanilan puan", () => {
  it("odenen urun tutarinin yarisi kadar puan verilir", () => {
    // 100 ₺ odenirse 50 puan
    const totals = calculateCartTotals([line({ quantity: 1, unitPriceInKurus: 10000 })]);
    expect(totals.earnedPoints).toBe(50);
  });

  it("indirim sonrasi tutar uzerinden hesaplanir", () => {
    const withoutCoupon = calculateCartTotals([
      line({ quantity: 1, unitPriceInKurus: 10000 }),
    ]);
    const withCoupon = calculateCartTotals(
      [line({ quantity: 1, unitPriceInKurus: 10000 })],
      { couponCode: "MERHABA15" },
    );
    expect(withCoupon.earnedPoints).toBeLessThan(withoutCoupon.earnedPoints);
  });
});
