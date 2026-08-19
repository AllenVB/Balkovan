/**
 * Bal Puani kurallari.
 *
 * Kazanim : Siparis tutarinin yarisi kadar puan verilir (100 ₺ -> 50 puan).
 * Harcama : 10 puan = 1 ₺ indirim.
 * Sinir   : Puan indirimi, sepetin urun tutarinin en fazla %25'ini kapatir.
 *
 * Net etki: her siparisten yaklasik %5 geri kazanim.
 *
 * Puan verme gercekte siparis tamamlandiginda backend'de olacak; burasi
 * hesabin tek kaynagi, sepet ekrani da ayni fonksiyonlari kullanir.
 */

/** Kac puan 1 ₺ ediyor. */
export const POINTS_PER_LIRA = 10;

/** Puanla kapatilabilecek azami oran. */
export const MAX_POINTS_SHARE = 0.25;

/** Siparis tutarinin ne kadari puan olarak geri veriliyor. */
export const POINTS_EARN_RATIO = 0.5;

/** Puani kurus cinsinden indirim tutarina cevirir. 10 puan = 100 kurus. */
export function pointsToKurus(points: number): number {
  return Math.floor(points) * (100 / POINTS_PER_LIRA);
}

/** Kurus cinsinden tutari, karsiligi olan puana cevirir. */
export function kurusToPoints(amountInKurus: number): number {
  return Math.floor(amountInKurus / (100 / POINTS_PER_LIRA));
}

/**
 * Bu sepette gercekten kullanilabilecek puan ve karsiligi.
 *
 * Uc sinir birlikte uygulanir: kullanicinin puani, sepetin %25'i ve
 * kalan odenecek tutar. Hangisi kucukse o gecerlidir.
 */
export function calculatePointsUsage(
  availablePoints: number,
  /** Diger indirimler dusuldukten sonraki urun tutari. */
  remainingAmountInKurus: number,
  /** Puan sinirinin hesaplandigi taban: indirimsiz urun tutari. */
  subtotalInKurus: number,
): { points: number; discountInKurus: number } {
  if (availablePoints <= 0 || remainingAmountInKurus <= 0) {
    return { points: 0, discountInKurus: 0 };
  }

  const shareCap = Math.floor(subtotalInKurus * MAX_POINTS_SHARE);
  const discountInKurus = Math.min(
    pointsToKurus(availablePoints),
    shareCap,
    remainingAmountInKurus,
  );

  if (discountInKurus <= 0) return { points: 0, discountInKurus: 0 };

  // Yalnizca gercekten kullanilan puan dusulur; ustu kullanicida kalir.
  return { points: kurusToPoints(discountInKurus), discountInKurus };
}

/** Bu siparisten kazanilacak puan. */
export function calculateEarnedPoints(paidAmountInKurus: number): number {
  return Math.floor((paidAmountInKurus / 100) * POINTS_EARN_RATIO);
}
