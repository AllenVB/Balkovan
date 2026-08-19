import { stitchImages } from "@/lib/images";

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

export type CartLine = {
  id: string;
  productSlug: string;
  name: string;
  /** "Cam Kavanoz, 850g" gibi varyant ozeti. */
  variantLabel: string;
  tag?: string;
  image: string;
  unitPriceInKurus: number;
  quantity: number;
};

/**
 * Ornek sepet icerigi. Sepet kalicilik ve gercek urun baglantisi backend
 * fazinda gelecek; simdilik tasarimin dolu halini gosterebilmek icin duruyor.
 */
export const demoCartLines: CartLine[] = [
  {
    id: "line-1",
    productSlug: "kestane-bali",
    name: "Organik Kestane Balı",
    variantLabel: "Cam Kavanoz, 850g",
    tag: "Ham Bal",
    image: stitchImages.sepet.kestaneBali,
    unitPriceInKurus: 42000,
    quantity: 1,
  },
  {
    id: "line-2",
    productSlug: "ham-cicek-bali",
    name: "Çiçek Balı Harmanı",
    variantLabel: "Petekli, 450g",
    image: stitchImages.sepet.cicekBali,
    unitPriceInKurus: 24000,
    quantity: 1,
  },
];

export type CartTotals = {
  itemCount: number;
  subtotalInKurus: number;
  shippingInKurus: number;
  /** Ucretsiz kargoya kalan tutar; esik asildiysa 0. */
  remainingForFreeShippingInKurus: number;
  /** Esige ne kadar yaklasildigi, 0-100 arasi. Ilerleme cubugu icin. */
  freeShippingProgressPercent: number;
  totalInKurus: number;
};

/**
 * Sepet toplamlarini hesaplar. Saf fonksiyon: backend geldiginde ayni kural
 * sunucuda da kullanilabilsin diye bilesenlerden bagimsiz tutuldu.
 */
export function calculateCartTotals(lines: CartLine[]): CartTotals {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalInKurus = lines.reduce(
    (sum, line) => sum + line.unitPriceInKurus * line.quantity,
    0,
  );

  const qualifiesForFreeShipping =
    subtotalInKurus >= FREE_SHIPPING_THRESHOLD_KURUS;

  // Bos sepete kargo yazilmaz.
  const shippingInKurus =
    subtotalInKurus === 0 || qualifiesForFreeShipping ? 0 : SHIPPING_FEE_KURUS;

  const remainingForFreeShippingInKurus = qualifiesForFreeShipping
    ? 0
    : FREE_SHIPPING_THRESHOLD_KURUS - subtotalInKurus;

  const freeShippingProgressPercent = Math.min(
    100,
    Math.round((subtotalInKurus / FREE_SHIPPING_THRESHOLD_KURUS) * 100),
  );

  return {
    itemCount,
    subtotalInKurus,
    shippingInKurus,
    remainingForFreeShippingInKurus,
    freeShippingProgressPercent,
    totalInKurus: subtotalInKurus + shippingInKurus,
  };
}
