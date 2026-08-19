import { describe, expect, it } from "vitest";
import {
  addLine,
  buildLineId,
  calculateCartTotals,
  createCartLine,
  FREE_SHIPPING_THRESHOLD_KURUS,
  MAX_LINE_QUANTITY,
  removeLine,
  setLineQuantity,
  type CartLine,
} from "@/lib/cart";
import type { Product, ProductVariant } from "@/lib/products";
import { getShippingOption, shippingOptions } from "@/lib/checkout";

const defaultShippingFee = getShippingOption().feeInKurus;

function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    id: "kestane-bali--450",
    productSlug: "kestane-bali",
    variantWeightGrams: 450,
    name: "Kestane Balı",
    variantLabel: "Kavanoz, 450g",
    image: "https://example.test/kestane.jpg",
    unitPriceInKurus: 45990,
    quantity: 1,
    ...overrides,
  };
}

const variant450: ProductVariant = {
  weightGrams: 450,
  label: "Kavanoz",
  priceInKurus: 45990,
};
const variant850: ProductVariant = {
  weightGrams: 850,
  label: "Büyük Boy",
  priceInKurus: 82990,
};

const product = {
  slug: "kestane-bali",
  name: "Kestane Balı",
  description: "",
  priceInKurus: 45990,
  image: "https://example.test/kestane.jpg",
  category: "ballar",
  badge: "Sınırlı Stok",
  tags: [],
  variants: [variant450, variant850],
  specs: { region: "Karadeniz", harvest: "2024" },
  longDescription: [],
  gallery: [],
  breadcrumb: "Süzme Ballar",
} satisfies Product;

describe("createCartLine", () => {
  it("urun ve varyanttan satir uretir", () => {
    const created = createCartLine(product, variant850, 2);

    expect(created.id).toBe(buildLineId("kestane-bali", 850));
    expect(created.variantLabel).toBe("Büyük Boy, 850g");
    expect(created.unitPriceInKurus).toBe(82990);
    expect(created.quantity).toBe(2);
  });
});

describe("addLine", () => {
  it("yeni urunu sona ekler", () => {
    const result = addLine([], createCartLine(product, variant450));
    expect(result).toHaveLength(1);
  });

  it("ayni urun+varyant tekrar eklenince adet artar, satir cogalmaz", () => {
    const first = addLine([], createCartLine(product, variant450, 2));
    const second = addLine(first, createCartLine(product, variant450, 3));

    expect(second).toHaveLength(1);
    expect(second[0]?.quantity).toBe(5);
  });

  it("ayni urunun farkli gramaji ayri satir olur", () => {
    const first = addLine([], createCartLine(product, variant450));
    const second = addLine(first, createCartLine(product, variant850));

    expect(second).toHaveLength(2);
  });

  it("adet ust siniri asamaz", () => {
    const result = addLine(
      [],
      createCartLine(product, variant450, MAX_LINE_QUANTITY + 50),
    );
    expect(result[0]?.quantity).toBe(MAX_LINE_QUANTITY);
  });
});

describe("setLineQuantity", () => {
  it("adedi gunceller", () => {
    const result = setLineQuantity([line()], "kestane-bali--450", 4);
    expect(result[0]?.quantity).toBe(4);
  });

  it("adet 1'in altina inerse satiri siler", () => {
    const result = setLineQuantity([line()], "kestane-bali--450", 0);
    expect(result).toHaveLength(0);
  });

  it("bilinmeyen satiri degistirmez", () => {
    const lines = [line()];
    expect(setLineQuantity(lines, "yok", 5)).toEqual(lines);
  });
});

describe("removeLine", () => {
  it("yalnizca hedef satiri siler", () => {
    const lines = [line(), line({ id: "cam-bali--450", productSlug: "cam-bali" })];
    const result = removeLine(lines, "kestane-bali--450");

    expect(result).toHaveLength(1);
    expect(result[0]?.productSlug).toBe("cam-bali");
  });
});

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
      line({ id: "cam-bali--450", unitPriceInKurus: 5000, quantity: 3 }),
    ]);

    expect(totals.itemCount).toBe(5);
    expect(totals.subtotalInKurus).toBe(35000);
  });

  it("esigin altinda kargo ucreti ekler", () => {
    const totals = calculateCartTotals([
      line({ unitPriceInKurus: FREE_SHIPPING_THRESHOLD_KURUS - 1, quantity: 1 }),
    ]);

    expect(totals.shippingInKurus).toBe(defaultShippingFee);
    expect(totals.totalInKurus).toBe(
      FREE_SHIPPING_THRESHOLD_KURUS - 1 + defaultShippingFee,
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

  it("esik adet artisiyla asilinca kargo bedavaya doner", () => {
    const lines = [line({ unitPriceInKurus: 80000, quantity: 1 })];
    expect(calculateCartTotals(lines).shippingInKurus).toBe(defaultShippingFee);

    const increased = setLineQuantity(lines, "kestane-bali--450", 2);
    expect(calculateCartTotals(increased).shippingInKurus).toBe(0);
  });
});

describe("kargo secenekleri", () => {
  it("secilen kargonun ucreti uygulanir", () => {
    const yurtici = shippingOptions.find((o) => o.id === "yurtici")!;
    const totals = calculateCartTotals([line({ unitPriceInKurus: 10000 })], {
      shippingOptionId: "yurtici",
    });

    expect(totals.shippingInKurus).toBe(yurtici.feeInKurus);
    expect(totals.shippingOptionId).toBe("yurtici");
  });

  it("bilinmeyen kargo kimligi varsayilana duser", () => {
    const totals = calculateCartTotals([line({ unitPriceInKurus: 10000 })], {
      shippingOptionId: "yok-boyle-kargo",
    });
    expect(totals.shippingInKurus).toBe(defaultShippingFee);
  });

  it("ucretsiz kargo esigi asilinca secilen kargo da bedava olur", () => {
    const totals = calculateCartTotals(
      [line({ unitPriceInKurus: FREE_SHIPPING_THRESHOLD_KURUS })],
      { shippingOptionId: "yurtici" },
    );
    expect(totals.shippingInKurus).toBe(0);
  });
});
