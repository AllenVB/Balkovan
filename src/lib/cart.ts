import type { Product, ProductVariant } from "@/lib/products";
import {
  calculateDiscounts,
  type AppliedDiscount,
  type DiscountOptions,
} from "@/lib/promotions";
import { calculateEarnedPoints } from "@/lib/loyalty";

/**
 * Kargo kurallari.
 *
 * NOT: Tasarimda esik iki farkli yerde farkli geciyor - ust serit ve anasayfa
 * kampanya karti "1.500 ₺", sepet sayfasi "1.000,00 ₺" diyor. Iki yerde gecen
 * 1.500 ₺ dogru kabul edildi ve tek kaynak buraya alindi. Gercek deger
 * netlestiginde yalnizca burasi degisecek.
 */
export const FREE_SHIPPING_THRESHOLD_KURUS = 150000;
export const SHIPPING_FEE_KURUS = 4500;

/** Bir satirda izin verilen en fazla adet. */
export const MAX_LINE_QUANTITY = 99;

export type CartLine = {
  /** Urun + varyant birlesimi. Ayni urunun 450g ve 850g'i ayri satirdir. */
  id: string;
  productSlug: string;
  variantWeightGrams: number;
  name: string;
  /** "Kavanoz, 450g" gibi varyant ozeti. */
  variantLabel: string;
  tag?: string;
  image: string;
  unitPriceInKurus: number;
  quantity: number;
  /** Urun "3 Al 2 Ode" kampanyasina dahil mi (bkz. lib/promotions.ts). */
  threeForTwo?: boolean;
};

/** Satir kimligi urun ve varyanttan uretilir; ayni birlesim tek satirda toplanir. */
export function buildLineId(
  productSlug: string,
  variantWeightGrams: number,
): string {
  return `${productSlug}--${variantWeightGrams}`;
}

/** Urun ve secilen varyanttan sepet satiri olusturur. */
export function createCartLine(
  product: Product,
  variant: ProductVariant,
  quantity = 1,
): CartLine {
  return {
    id: buildLineId(product.slug, variant.weightGrams),
    productSlug: product.slug,
    variantWeightGrams: variant.weightGrams,
    name: product.name,
    variantLabel: `${variant.label}, ${variant.weightGrams}g`,
    tag: product.badge,
    image: product.image,
    unitPriceInKurus: variant.priceInKurus,
    quantity,
    threeForTwo: product.threeForTwo,
  };
}

/**
 * Satiri sepete ekler. Ayni urun+varyant zaten varsa adedini artirir,
 * yoksa sona ekler. Adet ust sinirda kirpilir.
 */
export function addLine(lines: CartLine[], newLine: CartLine): CartLine[] {
  const existing = lines.find((line) => line.id === newLine.id);
  if (!existing) {
    return [...lines, { ...newLine, quantity: clampQuantity(newLine.quantity) }];
  }
  return lines.map((line) =>
    line.id === newLine.id
      ? { ...line, quantity: clampQuantity(line.quantity + newLine.quantity) }
      : line,
  );
}

/** Adedi dogrudan ayarlar. 1'in altina inerse satir silinir. */
export function setLineQuantity(
  lines: CartLine[],
  lineId: string,
  quantity: number,
): CartLine[] {
  if (quantity < 1) return removeLine(lines, lineId);
  return lines.map((line) =>
    line.id === lineId ? { ...line, quantity: clampQuantity(quantity) } : line,
  );
}

export function removeLine(lines: CartLine[], lineId: string): CartLine[] {
  return lines.filter((line) => line.id !== lineId);
}

function clampQuantity(quantity: number): number {
  return Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.floor(quantity)));
}

export type CartTotals = {
  itemCount: number;
  subtotalInKurus: number;
  /** Uygulanan kampanyalar; sepet ozetinde satir satir gosterilir. */
  discounts: AppliedDiscount[];
  discountTotalInKurus: number;
  /** Indirimler dusuldukten sonraki urun tutari. */
  discountedSubtotalInKurus: number;
  shippingInKurus: number;
  /** Ucretsiz kargoya kalan tutar; esik asildiysa 0. */
  remainingForFreeShippingInKurus: number;
  /** Esige ne kadar yaklasildigi, 0-100 arasi. Ilerleme cubugu icin. */
  freeShippingProgressPercent: number;
  totalInKurus: number;
  /** Bu siparisten kazanilacak bal puani. */
  earnedPoints: number;
};

/**
 * Sepet toplamlarini hesaplar. Saf fonksiyon: backend geldiginde ayni kural
 * sunucuda da kullanilabilsin diye bilesenlerden bagimsiz tutuldu.
 */
export function calculateCartTotals(
  lines: CartLine[],
  options?: DiscountOptions | null,
): CartTotals {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalInKurus = lines.reduce(
    (sum, line) => sum + line.unitPriceInKurus * line.quantity,
    0,
  );

  const discounts = calculateDiscounts(lines, options);
  const discountTotalInKurus = discounts.reduce(
    (sum, discount) => sum + discount.amountInKurus,
    0,
  );
  // Indirimler urun tutarini asamaz; sepet eksiye dusmez.
  const discountedSubtotalInKurus = Math.max(
    0,
    subtotalInKurus - discountTotalInKurus,
  );

  // Kargo esigi indirim SONRASI tutara bakar; musteri gercekte ne odeyecekse
  // esik ona gore degerlendirilir.
  const qualifiesForFreeShipping =
    discountedSubtotalInKurus >= FREE_SHIPPING_THRESHOLD_KURUS;

  // Bos sepete kargo yazilmaz.
  const shippingInKurus =
    subtotalInKurus === 0 || qualifiesForFreeShipping ? 0 : SHIPPING_FEE_KURUS;

  const remainingForFreeShippingInKurus = qualifiesForFreeShipping
    ? 0
    : FREE_SHIPPING_THRESHOLD_KURUS - discountedSubtotalInKurus;

  const freeShippingProgressPercent = Math.min(
    100,
    Math.round((discountedSubtotalInKurus / FREE_SHIPPING_THRESHOLD_KURUS) * 100),
  );

  return {
    itemCount,
    subtotalInKurus,
    discounts,
    discountTotalInKurus,
    discountedSubtotalInKurus,
    shippingInKurus,
    remainingForFreeShippingInKurus,
    freeShippingProgressPercent,
    totalInKurus: discountedSubtotalInKurus + shippingInKurus,
    // Puan yalnizca urun tutari uzerinden kazanilir; kargo bedeli sayilmaz.
    earnedPoints: calculateEarnedPoints(discountedSubtotalInKurus),
  };
}
