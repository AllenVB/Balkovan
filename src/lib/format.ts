/**
 * Fiyat bicimleme.
 *
 * DESIGN.md > Typography acikca "1.234,56 ₺" istiyor: simge tutarin SONUNDA.
 * Intl.NumberFormat("tr-TR", { style: "currency" }) simgeyi basa koydugu icin
 * sayi ayri bicimlenip simge elle ekleniyor.
 *
 * Tutarlar kurus (integer) olarak tasinir; para float ile tutulmaz.
 */
const CURRENCY_SYMBOL = "₺";

const decimalFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const wholeFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Kurus cinsinden tutari "1.234,56 ₺" olarak bicimler. */
export function formatPrice(amountInKurus: number): string {
  return `${decimalFormatter.format(amountInKurus / 100)} ${CURRENCY_SYMBOL}`;
}

/**
 * Tam sayiya oturan tutarlarda kurus gostermez: "350 ₺", "249,90 ₺".
 * Tasarimdaki urun karti fiyat etiketleri bu sade halde.
 */
export function formatPriceCompact(amountInKurus: number): string {
  // Kurus varsa iki basamak gosterilir; "249,9 ₺" gibi tek basamakli bir
  // kurus fiyat etiketi olarak yanlis okunur.
  const formatter = amountInKurus % 100 === 0 ? wholeFormatter : decimalFormatter;
  return `${formatter.format(amountInKurus / 100)} ${CURRENCY_SYMBOL}`;
}
