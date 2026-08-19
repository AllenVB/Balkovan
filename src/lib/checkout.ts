import { z } from "zod";
import type { IconName } from "@/lib/icons";

/**
 * Odeme akisi: adres & kargo -> odeme -> onay.
 *
 * Kurallar burada, ekranlar buradan besleniyor. Backend geldiginde siparis
 * olusturma sunucuya tasinacak; tipler ayni kalacak.
 */

export type ShippingOption = {
  id: string;
  name: string;
  /** Tasarimdaki teslim suresi metni. */
  estimate: string;
  feeInKurus: number;
  /** Kargonun kac is gununde teslim edildigi; tahmini tarih icin. */
  maxBusinessDays: number;
  icon: IconName;
};

/**
 * Kargo secenekleri.
 *
 * NOT: Tasarim ucretleri 49,90 ve 59,90 olarak veriyor. Daha once sepette tek
 * bir 45,00 ₺ sabiti vardi; tasarimdaki secenekler kaynak alindi ve tek
 * yerden yonetiliyor. Ucretsiz kargo esigi asilirsa secilen kargo bedava olur.
 */
export const shippingOptions: ShippingOption[] = [
  {
    id: "aras",
    name: "Aras Kargo",
    estimate: "1-3 iş günü içinde teslimat",
    feeInKurus: 4990,
    maxBusinessDays: 3,
    icon: "local_shipping",
  },
  {
    id: "yurtici",
    name: "Yurtiçi Kargo",
    estimate: "2-4 iş günü içinde teslimat",
    feeInKurus: 5990,
    maxBusinessDays: 4,
    icon: "inventory_2",
  },
];

export const defaultShippingOptionId = shippingOptions[0]!.id;

export function getShippingOption(id?: string | null): ShippingOption {
  return (
    shippingOptions.find((option) => option.id === id) ?? shippingOptions[0]!
  );
}

/** Iller. Gercek liste backend'den gelecek; simdilik en cok sevkiyat yapilanlar. */
export const cities = [
  "Adana",
  "Ankara",
  "Antalya",
  "Bursa",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "İstanbul",
  "İzmir",
  "Kayseri",
  "Kocaeli",
  "Konya",
  "Mersin",
  "Samsun",
  "Trabzon",
] as const;

/**
 * Adres dogrulamasi. Ayni sema hem formda hem siparis olusturulurken
 * kullanilir; backend geldiginde sunucu tarafinda da bu sema calisacak.
 */
export const addressSchema = z.object({
  firstName: z.string().trim().min(2, "Adınızı yazın."),
  lastName: z.string().trim().min(2, "Soyadınızı yazın."),
  phone: z
    .string()
    .trim()
    // Kullanici bosluk/parantez ile yazabiliyor; yalnizca rakamlar sayilir.
    .refine((value) => value.replace(/\D/g, "").length === 10, {
      message: "Telefonu 10 hane olarak yazın (5XX XXX XX XX).",
    }),
  city: z.string().min(1, "İl seçin."),
  district: z.string().trim().min(2, "İlçe yazın."),
  fullAddress: z
    .string()
    .trim()
    .min(15, "Adresi mahalle, sokak ve numara ile birlikte yazın."),
  // Istege bagli: bos birakilabilir. .optional() yalnizca undefined'i kapsar,
  // form bos stringle geldigi icin bos deger acikca kabul ediliyor.
  addressTitle: z
    .string()
    .trim()
    .max(30, "Adres başlığı en fazla 30 karakter olabilir.")
    .optional(),
});

export type Address = z.infer<typeof addressSchema>;

export type Order = {
  orderNumber: string;
  /** ISO tarih; gosterim lib/format.ts > formatDate ile. */
  createdAt: string;
  address: Address;
  shippingOptionId: string;
  totalInKurus: number;
  earnedPoints: number;
  /** Tahmini teslimat araligi, "12 - 14 Kasım" gibi hazir metin. */
  deliveryEstimate: string;
};

/** Siparis numarasi: BLK-2026-4821 bicimi (tasarimdaki gibi). */
export function buildOrderNumber(now: Date, randomSeed: number): string {
  const year = now.getFullYear();
  // 1000-9999 arasi dort haneli; backend gelince sirali numaraya donecek.
  const sequence = 1000 + Math.floor(randomSeed * 9000);
  return `BLK-${year}-${sequence}`;
}

/**
 * Siparis numarasini uretir. Rastgelelik burada, bilesen icinde degil:
 * numara uretimi domain isi ve backend gelince sirali numarayla degisecek.
 */
export function createOrderNumber(now: Date): string {
  return buildOrderNumber(now, Math.random());
}

const trMonths = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

/** Verilen gun sayisi kadar sonrasini, hafta sonlarini atlayarak bulur. */
function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return result;
}

/**
 * "12 - 14 Kasım" gibi tahmini teslimat araligi.
 * Alt sinir kargonun en hizli, ust sinir en yavas gunudur.
 */
export function buildDeliveryEstimate(
  option: ShippingOption,
  from: Date,
): string {
  const earliest = addBusinessDays(from, Math.max(1, option.maxBusinessDays - 1));
  const latest = addBusinessDays(from, option.maxBusinessDays);

  const latestLabel = `${latest.getDate()} ${trMonths[latest.getMonth()]}`;
  if (earliest.getMonth() === latest.getMonth()) {
    return `${earliest.getDate()} - ${latestLabel}`;
  }
  return `${earliest.getDate()} ${trMonths[earliest.getMonth()]} - ${latestLabel}`;
}

/** Telefonu "+90 5XX XXX XX XX" olarak bicimler. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return raw;
  return `+90 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
}
