import { describe, expect, it } from "vitest";
import { formatPrice, formatPriceCompact } from "@/lib/format";

describe("formatPrice", () => {
  it("simgeyi tutarin sonuna koyar", () => {
    // DESIGN.md > Typography: "1.234,56 ₺"
    expect(formatPrice(123456)).toBe("1.234,56 ₺");
  });

  it("binlik ayraci nokta, ondalik ayraci virgul kullanir", () => {
    expect(formatPrice(100000000)).toBe("1.000.000,00 ₺");
  });

  it("tam sayilarda da iki basamak kurus gosterir", () => {
    expect(formatPrice(35000)).toBe("350,00 ₺");
  });

  it("sifir tutari bicimler", () => {
    expect(formatPrice(0)).toBe("0,00 ₺");
  });
});

describe("formatPriceCompact", () => {
  it("tam sayiya oturan tutarda kurus gostermez", () => {
    expect(formatPriceCompact(35000)).toBe("350 ₺");
  });

  it("kurus varsa iki basamak gosterir", () => {
    expect(formatPriceCompact(24990)).toBe("249,90 ₺");
  });

  it("sondaki sifiri dusurmez, iki basamak korur", () => {
    expect(formatPriceCompact(24950)).toBe("249,50 ₺");
  });
});
