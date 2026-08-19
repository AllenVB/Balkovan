import { describe, expect, it } from "vitest";
import { iconNames, materialSymbolsHref } from "@/lib/icons";

describe("iconNames", () => {
  /**
   * Bu testin varlik sebebi: Google Fonts `icon_names` parametresini alfabetik
   * sirali bekliyor. Sira bozulunca istek 400 donuyor ve HICBIR ikon
   * yuklenmiyor - butun ikonlar ligature metni olarak ("shopping_cart" gibi)
   * ekranda yaziya donuyor. Bir kere basimiza geldi.
   */
  it("alfabetik sirali olmali", () => {
    expect([...iconNames]).toEqual([...iconNames].sort());
  });

  it("tekrar eden ikon olmamali", () => {
    expect(new Set(iconNames).size).toBe(iconNames.length);
  });

  it("yalnizca gecerli ligature adlari icermeli", () => {
    for (const name of iconNames) {
      expect(name).toMatch(/^[a-z0-9_]+$/);
    }
  });

  it("stylesheet adresi tum ikonlari istemeli", () => {
    const url = new URL(materialSymbolsHref);
    const requested = url.searchParams.get("icon_names")?.split(",") ?? [];

    expect(requested).toEqual([...iconNames]);
    expect(url.searchParams.get("display")).toBe("swap");
  });
});
