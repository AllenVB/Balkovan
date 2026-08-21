/**
 * SEO yardimcilari.
 *
 * Site adresi ortam degiskeninden gelir; alan adi belli olunca .env dosyasina
 * NEXT_PUBLIC_SITE_URL yazilmasi yeterli, kod degismez.
 */
export const SITE_NAME = "Balkovan";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_DESCRIPTION =
  "Yaylalardan süzülen ham ve katkısız bal. Isıl işlem görmemiş, doğrudan üreticiden sofranıza.";

/** Mutlak adres uretir; OG ve JSON-LD mutlak URL istiyor. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
