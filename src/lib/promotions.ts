import type { CartLine } from "@/lib/cart";
import type { IconName } from "@/lib/icons";

/**
 * Sepet kampanyalari.
 *
 * Uc kampanya var ve su sirayla uygulanir:
 *   1. 3 Al 2 Ode  - yalnizca isaretli urunlerde (products.ts > threeForTwo)
 *   2. Toplu alim  - sepetteki toplam adede gore %5 / %10
 *   3. Kupon kodu  - kalan tutara
 *
 * KURAL: 3 Al 2 Ode uygulanan urunler toplu alim yuzdesine GIRMEZ. Ayni urune
 * iki indirim birden binmez. Toplu alim esigi yine sepetteki toplam adetten
 * hesaplanir; yalnizca indirimin uygulandigi tutar kampanyasiz satirlarla
 * sinirlidir.
 *
 * Hepsi saf fonksiyon: backend geldiginde ayni kurallar sunucuda calisacak.
 */

/** Tasarimdaki kademeler: "1 Adet / 6 al %5 / 12 al %10". Buyukten kucuge. */
export const bulkTiers = [
  { minQuantity: 12, discountPercent: 10, label: "12 al %10" },
  { minQuantity: 6, discountPercent: 5, label: "6 al %5" },
] as const;

/** Ilerleme cubugunun sonu; en yuksek kademenin esigi. */
export const maxBulkQuantity = 12;

export const THREE_FOR_TWO_GROUP_SIZE = 3;

export type Coupon = {
  code: string;
  label: string;
  discountPercent: number;
};

/**
 * Gecerli kupon kodlari.
 *
 * DIKKAT: Dogrulama su an tarayicida yapiliyor, yani kodlar herkese acik ve
 * kullanim sayisi sinirlanamiyor. "Ilk siparise ozel" kurali ancak backend
 * geldiginde gercekten uygulanabilir.
 */
export const coupons: Record<string, Coupon> = {
  MERHABA15: {
    code: "MERHABA15",
    label: "Hoş Geldin İndirimi",
    discountPercent: 15,
  },
};

export function findCoupon(code: string): Coupon | undefined {
  return coupons[code.trim().toUpperCase()];
}

export type AppliedDiscount = {
  /** Ayirt edici anahtar; liste render'inda key olarak kullanilir. */
  id: string;
  label: string;
  icon: IconName;
  amountInKurus: number;
};

/** Bir satirin tek bir adedini temsil eder; 3 al 2 ode adet bazinda calisir. */
function expandToUnits(lines: CartLine[]): number[] {
  const units: number[] = [];
  for (const line of lines) {
    for (let i = 0; i < line.quantity; i += 1) {
      units.push(line.unitPriceInKurus);
    }
  }
  return units;
}

/**
 * 3 Al 2 Ode: kampanyali urunlerin her uc adedinden en ucuzu bedava.
 * Farkli kampanyali urunler birlikte sayilir (3 hediye seti sart degil).
 */
export function calculateThreeForTwoDiscount(lines: CartLine[]): number {
  const units = expandToUnits(lines.filter((line) => line.threeForTwo));
  const freeCount = Math.floor(units.length / THREE_FOR_TWO_GROUP_SIZE);
  if (freeCount === 0) return 0;

  // Musteri lehine degil, isletme lehine: bedava olanlar en ucuz adetlerdir.
  const ascending = [...units].sort((a, b) => a - b);
  return ascending
    .slice(0, freeCount)
    .reduce((sum, price) => sum + price, 0);
}

/** Sepetteki toplam adede karsilik gelen toplu alim kademesi. */
export function findBulkTier(totalQuantity: number) {
  return bulkTiers.find((tier) => totalQuantity >= tier.minQuantity);
}

/**
 * Sepete uygulanan tum indirimleri sirayla hesaplar.
 * Donen tutarlar pozitiftir; ara toplamdan dusulur.
 */
export function calculateDiscounts(
  lines: CartLine[],
  couponCode?: string | null,
): AppliedDiscount[] {
  const discounts: AppliedDiscount[] = [];

  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPriceInKurus * line.quantity,
    0,
  );
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);

  // 1) 3 Al 2 Ode
  const threeForTwo = calculateThreeForTwoDiscount(lines);
  if (threeForTwo > 0) {
    discounts.push({
      id: "three-for-two",
      label: "3 Al 2 Öde",
      icon: "card_giftcard",
      amountInKurus: threeForTwo,
    });
  }

  // 2) Toplu alim - yalnizca kampanyasiz satirlarin tutarina
  const tier = findBulkTier(totalQuantity);
  if (tier) {
    const regularSubtotal = lines
      .filter((line) => !line.threeForTwo)
      .reduce((sum, line) => sum + line.unitPriceInKurus * line.quantity, 0);
    const bulkAmount = Math.round(
      (regularSubtotal * tier.discountPercent) / 100,
    );
    if (bulkAmount > 0) {
      discounts.push({
        id: "bulk",
        label: `Toplu Alım (%${tier.discountPercent})`,
        icon: "local_offer",
        amountInKurus: bulkAmount,
      });
    }
  }

  // 3) Kupon - onceki indirimler dusuldukten sonraki tutara
  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  if (coupon) {
    const alreadyDiscounted = discounts.reduce(
      (sum, discount) => sum + discount.amountInKurus,
      0,
    );
    const base = Math.max(0, subtotal - alreadyDiscounted);
    const couponAmount = Math.round((base * coupon.discountPercent) / 100);
    if (couponAmount > 0) {
      discounts.push({
        id: `coupon-${coupon.code}`,
        label: `Kupon: ${coupon.code}`,
        icon: "local_offer",
        amountInKurus: couponAmount,
      });
    }
  }

  return discounts;
}

/**
 * Bir sonraki kademeye kac adet kaldigi. Sepette ve urun detayinda
 * "N adet daha ekle, %X kazan" mesajini beslemek icin.
 */
export function nextBulkTier(totalQuantity: number) {
  // Kucukten buyuge bakip henuz ulasilmayan ilk kademeyi bul.
  const ascending = [...bulkTiers].sort(
    (a, b) => a.minQuantity - b.minQuantity,
  );
  const next = ascending.find((tier) => totalQuantity < tier.minQuantity);
  if (!next) return null;
  return { ...next, remaining: next.minQuantity - totalQuantity };
}
