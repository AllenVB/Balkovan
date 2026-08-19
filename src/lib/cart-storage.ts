import type { CartLine } from "@/lib/cart";

/**
 * Sepetin tarayici deposundaki hali.
 *
 * Backend olmadigi icin sepet localStorage'da tutuluyor. Burasi React'ten
 * bagimsiz kucuk bir store: useSyncExternalStore ile okunur, boylece sunucu
 * render'i ile ilk boyama tutarli kalir ve ayni sekmedeki tum bilesenler
 * (rozet, sepet sayfasi) ayni veriyi gorur.
 *
 * Backend geldiginde yalnizca bu dosya sunucu cagrilariyla degistirilecek.
 */
const STORAGE_KEY = "balkovan.cart.v1";
const COUPON_KEY = "balkovan.coupon.v1";

const EMPTY: CartLine[] = [];

const listeners = new Set<() => void>();

/**
 * getSnapshot her cagrildiginda yeni dizi dondurursa React sonsuz donguye
 * girer; bu yuzden ham metin degismedikce ayni referans dondurulur.
 */
let cachedRaw: string | null = null;
let cachedLines: CartLine[] = EMPTY;

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.id === "string" &&
    typeof line.productSlug === "string" &&
    typeof line.variantWeightGrams === "number" &&
    typeof line.name === "string" &&
    typeof line.variantLabel === "string" &&
    typeof line.image === "string" &&
    typeof line.unitPriceInKurus === "number" &&
    typeof line.quantity === "number" &&
    line.quantity > 0
  );
}

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    // Depodaki veri elle degistirilmis ya da eski surumden kalmis olabilir;
    // yalnizca bekledigimiz sekle uyan satirlar alinir.
    const lines = parsed.filter(isCartLine);
    return lines.length > 0 ? lines : EMPTY;
  } catch {
    return EMPTY;
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Depolama kapali olabilir (gizli mod, katı gizlilik ayarlari).
    return null;
  }
}

export function getCartSnapshot(): CartLine[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parse(raw);
  }
  return cachedLines;
}

/** Sunucuda ve hydration sirasinda sepet her zaman bos gorunur. */
export function getCartServerSnapshot(): CartLine[] {
  return EMPTY;
}

export function subscribeToCart(onChange: () => void): () => void {
  listeners.add(onChange);
  // Ayni site baska sekmede aciksa sepet orada da guncellensin.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === COUPON_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function writeCart(lines: CartLine[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Depolama dolu ya da kapali; sepet o oturum icin bellekte kalir.
  }
  // Depoya yazsak da yazamasak da abonelere yeni degeri bildir.
  cachedRaw = JSON.stringify(lines);
  cachedLines = lines;
  for (const listener of listeners) listener();
}


/* --- Kupon kodu ---------------------------------------------------------- */

let cachedCoupon: string | null = null;
let couponRead = false;

export function getCouponSnapshot(): string | null {
  try {
    const value = window.localStorage.getItem(COUPON_KEY);
    if (!couponRead || value !== cachedCoupon) {
      cachedCoupon = value;
      couponRead = true;
    }
  } catch {
    cachedCoupon = null;
  }
  return cachedCoupon;
}

export function getCouponServerSnapshot(): string | null {
  return null;
}

export function writeCoupon(code: string | null): void {
  try {
    if (code) window.localStorage.setItem(COUPON_KEY, code);
    else window.localStorage.removeItem(COUPON_KEY);
  } catch {
    // Depolama kapali olabilir; kupon o oturum icin bellekte kalir.
  }
  cachedCoupon = code;
  couponRead = true;
  for (const listener of listeners) listener();
}
