import { describe, expect, it } from "vitest";
import {
  addressSchema,
  buildDeliveryEstimate,
  buildOrderNumber,
  defaultShippingOptionId,
  formatPhone,
  getShippingOption,
  shippingOptions,
} from "@/lib/checkout";

describe("getShippingOption", () => {
  it("kimlige gore secenegi bulur", () => {
    expect(getShippingOption("yurtici").name).toBe("Yurtiçi Kargo");
  });

  it("bilinmeyen ya da bos kimlikte varsayilana duser", () => {
    expect(getShippingOption("yok").id).toBe(defaultShippingOptionId);
    expect(getShippingOption(null).id).toBe(defaultShippingOptionId);
    expect(getShippingOption().id).toBe(defaultShippingOptionId);
  });

  it("her secenegin ucreti ve teslim suresi tanimli", () => {
    for (const option of shippingOptions) {
      expect(option.feeInKurus).toBeGreaterThan(0);
      expect(option.maxBusinessDays).toBeGreaterThan(0);
    }
  });
});

describe("addressSchema", () => {
  const valid = {
    firstName: "Ayşe",
    lastName: "Yılmaz",
    phone: "5321234567",
    city: "İstanbul",
    district: "Kadıköy",
    fullAddress: "Caferağa Mah. Moda Cad. No:12 D:3",
  };

  it("gecerli adresi kabul eder", () => {
    expect(addressSchema.safeParse(valid).success).toBe(true);
  });

  it("telefonu bosluklu yazilsa da kabul eder", () => {
    const result = addressSchema.safeParse({
      ...valid,
      phone: "532 123 45 67",
    });
    expect(result.success).toBe(true);
  });

  it("eksik haneli telefonu reddeder", () => {
    expect(
      addressSchema.safeParse({ ...valid, phone: "532123456" }).success,
    ).toBe(false);
  });

  it("cok kisa adresi reddeder", () => {
    expect(
      addressSchema.safeParse({ ...valid, fullAddress: "Moda" }).success,
    ).toBe(false);
  });

  it("il secilmemisse reddeder", () => {
    expect(addressSchema.safeParse({ ...valid, city: "" }).success).toBe(false);
  });

  it("adres basligi istege bagli", () => {
    expect(addressSchema.safeParse(valid).success).toBe(true);
  });
});

describe("formatPhone", () => {
  it("on haneli numarayi bicimler", () => {
    expect(formatPhone("5321234567")).toBe("+90 532 123 45 67");
  });

  it("zaten bosluklu gelen numarayi da bicimler", () => {
    expect(formatPhone("532 123 45 67")).toBe("+90 532 123 45 67");
  });

  it("gecersiz uzunlukta girdiyi oldugu gibi birakir", () => {
    expect(formatPhone("123")).toBe("123");
  });
});

describe("buildOrderNumber", () => {
  it("BLK-YIL-NNNN bicimini uretir", () => {
    const number = buildOrderNumber(new Date("2026-03-05T10:00:00Z"), 0.5);
    expect(number).toMatch(/^BLK-2026-\d{4}$/);
  });

  it("sinir degerlerde de dort haneli kalir", () => {
    const date = new Date("2026-03-05T10:00:00Z");
    expect(buildOrderNumber(date, 0)).toBe("BLK-2026-1000");
    expect(buildOrderNumber(date, 0.999999)).toMatch(/^BLK-2026-99\d{2}$/);
  });
});

describe("buildDeliveryEstimate", () => {
  const aras = getShippingOption("aras");

  it("hafta ici siparişte tarih araligi verir", () => {
    // 2 Mart 2026 Pazartesi
    const estimate = buildDeliveryEstimate(aras, new Date("2026-03-02T09:00:00"));
    expect(estimate).toMatch(/^\d+ - \d+ \w+$/u);
  });

  it("hafta sonunu atlar", () => {
    // 6 Mart 2026 Cuma; 3 is gunu sonrasi 11 Mart Carsamba olmali
    const estimate = buildDeliveryEstimate(aras, new Date("2026-03-06T09:00:00"));
    expect(estimate).toContain("11");
  });

  it("ay degisiminde her iki ayi da yazar", () => {
    // 30 Mart 2026 Pazartesi -> 4 is gunu sonrasi Nisan'a tasar
    const yurtici = getShippingOption("yurtici");
    const estimate = buildDeliveryEstimate(
      yurtici,
      new Date("2026-03-30T09:00:00"),
    );
    expect(estimate).toContain("Nisan");
  });
});
