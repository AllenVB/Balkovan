import type { CartLine } from "@/lib/cart";
import type { IconName } from "@/lib/icons";
import { calculatePointsUsage } from "@/lib/loyalty";

/**
 * Sepet kampanyalari.
 *
 * Dort kampanya var ve su sirayla uygulanir:
 *   1. 3 Al 2 Ode  - yalnizca isaretli urunlerde (products.ts > threeForTwo)
 *   2. Toplu alim  - sepetteki toplam adede gore %5 / %10
 *   3. Kupon kodu  - kalan tutara
 *   4. Bal Puani   - kalan tutara, sepetin en fazla %25'i kadar
 *
 * KURAL: Indirimler UST USTE BINER. 3 Al 2 Ode alan urunler de toplu alim
 * yuzdesini alir; her kademe bir onceki indirim dusuldukten sonraki tutara
 * uygulanir. Amac musteride "daha da ucuza aliyorum" hissi yaratmak.
 *
 * DIKKAT: Hepsi ust uste binince toplam iskonto yuksek olabiliyor (12 hediye
 * seti + kupon + puan senaryosunda liste fiyatinin yarisina kadar inebilir).
 * Yeni kampanya eklerken bilesik etkiyi promotions.test.ts ile dogrula.
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
export type DiscountOptions = {
  couponCode?: string | null;
  /** Kullanicinin elindeki toplam bal puani. */
  loyaltyPoints?: number;
  /** Musteri puanlarini bu siparişte kullanmayi sectiyse true. */
  useLoyaltyPoints?: boolean;
};

export function calculateDiscounts(
  lines: CartLine[],
  options?: DiscountOptions | null,
): AppliedDiscount[] {
  // null da kabul edilir: varsayilan parametre yalnizca undefined'i karsilar,
  // cagiranin elinde cogu zaman "kupon yoksa null" gibi bir deger oluyor.
  const {
    couponCode,
    loyaltyPoints = 0,
    useLoyaltyPoints = false,
  } = options ?? {};
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

  // 2) Toplu alim - 3 Al 2 Ode dusuldukten sonraki tutara, TUM urunlere
  const tier = findBulkTier(totalQuantity);
  if (tier) {
    const afterGift = Math.max(0, subtotal - threeForTwo);
    const bulkAmount = Math.round((afterGift * tier.discountPercent) / 100);
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

  // 4) Bal Puani - en sonda, kalan tutarin en fazla %25'i
  if (useLoyaltyPoints && loyaltyPoints > 0) {
    const spent = discounts.reduce((sum, d) => sum + d.amountInKurus, 0);
    const remaining = Math.max(0, subtotal - spent);
    const usage = calculatePointsUsage(loyaltyPoints, remaining, subtotal);
    if (usage.discountInKurus > 0) {
      discounts.push({
        id: "loyalty-points",
        label: `Bal Puanı (${usage.points} puan)`,
        icon: "stars",
        amountInKurus: usage.discountInKurus,
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
