import { addressSchema, type Address, type Order } from "@/lib/checkout";

/**
 * Odeme akisinin tarayicidaki hali.
 *
 * Adres ve kargo secimi adimlar arasinda tasinmali, sayfa yenilenince
 * kaybolmamali. cart-storage.ts ile ayni desen: React'ten bagimsiz kucuk bir
 * store, useSyncExternalStore ile okunur.
 *
 * Backend geldiginde siparis olusturma sunucuya tasinacak; adres yine burada
 * tutulabilir ama siparis kaydi sunucudan gelecek.
 */
const ADDRESS_KEY = "balkovan.checkout.address.v1";
const SHIPPING_KEY = "balkovan.checkout.shipping.v1";
const LAST_ORDER_KEY = "balkovan.lastOrder.v1";

const listeners = new Set<() => void>();

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Depolama kapali olabilir; akis o oturum icin bellekte surer.
  }
  for (const listener of listeners) listener();
}

export function subscribeToCheckout(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (
      event.key === ADDRESS_KEY ||
      event.key === SHIPPING_KEY ||
      event.key === LAST_ORDER_KEY
    ) {
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/* --- Adres -------------------------------------------------------------- */

// getSnapshot ayni referansi dondurmezse React sonsuz donguye girer.
let cachedAddressRaw: string | null = null;
let cachedAddress: Address | null = null;

export function getAddressSnapshot(): Address | null {
  const raw = read(ADDRESS_KEY);
  if (raw !== cachedAddressRaw) {
    cachedAddressRaw = raw;
    cachedAddress = parseAddress(raw);
  }
  return cachedAddress;
}

export function getAddressServerSnapshot(): Address | null {
  return null;
}

function parseAddress(raw: string | null): Address | null {
  if (!raw) return null;
  try {
    // Depodaki veri elle degistirilmis ya da eski surumden kalmis olabilir;
    // yalnizca semaya uyan adres kabul edilir.
    const parsed = addressSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function writeAddress(address: Address | null): void {
  write(ADDRESS_KEY, address ? JSON.stringify(address) : null);
}

/* --- Kargo secimi ------------------------------------------------------- */

export function getShippingSnapshot(): string | null {
  return read(SHIPPING_KEY);
}

export function getShippingServerSnapshot(): string | null {
  return null;
}

export function writeShippingOption(id: string | null): void {
  write(SHIPPING_KEY, id);
}

/* --- Son siparis -------------------------------------------------------- */

let cachedOrderRaw: string | null = null;
let cachedOrder: Order | null = null;

export function getLastOrderSnapshot(): Order | null {
  const raw = read(LAST_ORDER_KEY);
  if (raw !== cachedOrderRaw) {
    cachedOrderRaw = raw;
    cachedOrder = parseOrder(raw);
  }
  return cachedOrder;
}

export function getLastOrderServerSnapshot(): Order | null {
  return null;
}

function parseOrder(raw: string | null): Order | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const order = value as Record<string, unknown>;
    if (
      typeof order.orderNumber !== "string" ||
      typeof order.totalInKurus !== "number" ||
      typeof order.deliveryEstimate !== "string"
    ) {
      return null;
    }
    return order as unknown as Order;
  } catch {
    return null;
  }
}

export function writeLastOrder(order: Order | null): void {
  write(LAST_ORDER_KEY, order ? JSON.stringify(order) : null);
}
