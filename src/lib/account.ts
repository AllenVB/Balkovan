import { stitchImages } from "@/lib/images";
import type { IconName } from "@/lib/icons";

/**
 * Hesap ekrani verisi.
 *
 * products.ts / cart.ts ile ayni duzende: tipler burada, veri backend gelene
 * kadar bu dosyadan besleniyor. Uyelik ve siparis kayitlari backend fazinda
 * gercek kaynaga baglanacak; sayfalarin degismesi gerekmeyecek.
 */

/** Hesap bolumleri. href degerleri route isimlendirmesiyle birebir. */
export type AccountSection = {
  slug: string;
  href: string;
  label: string;
  icon: IconName;
};

/** Yan menudeki ana bolumler (tasarimdaki SideNavBar). */
export const accountSections: AccountSection[] = [
  {
    slug: "siparislerim",
    href: "/hesabim/siparislerim",
    label: "Sipariş Geçmişi",
    icon: "history",
  },
  {
    slug: "profil",
    href: "/hesabim/profil",
    label: "Profil Ayarları",
    icon: "settings",
  },
  {
    slug: "bal-puanlarim",
    href: "/hesabim/bal-puanlarim",
    label: "Bal Puanlarım",
    icon: "stars",
  },
];

/** Tasarimdaki "Hizli Islemler" karolari. */
export const quickActions: AccountSection[] = [
  {
    slug: "favorilerim",
    href: "/hesabim/favorilerim",
    label: "Favorilerim",
    icon: "favorite",
  },
  {
    slug: "adreslerim",
    href: "/hesabim/adreslerim",
    label: "Adreslerim",
    icon: "location_on",
  },
  {
    slug: "odeme-yontemlerim",
    href: "/hesabim/odeme-yontemlerim",
    label: "Ödeme Yöntemleri",
    icon: "credit_card",
  },
  {
    slug: "destek",
    href: "/hesabim/destek",
    label: "Canlı Destek",
    icon: "support_agent",
  },
];

/** Yan menu + hizli islemlerin tamami; alt sayfa route'lari buradan uretilir. */
export const allAccountSections: AccountSection[] = [
  ...accountSections,
  ...quickActions,
];

export function getAccountSection(slug: string): AccountSection | undefined {
  return allAccountSections.find((section) => section.slug === slug);
}

export type OrderStatus = "hazirlaniyor" | "kargoda" | "teslim-edildi";

/** Durum rozetinin metni ve rengi tek yerden yonetilir. */
export const orderStatusLabels: Record<
  OrderStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  hazirlaniyor: {
    label: "Hazırlanıyor",
    dotClass: "bg-info",
    textClass: "text-on-info",
  },
  kargoda: {
    label: "Kargoda",
    dotClass: "bg-info",
    textClass: "text-on-info",
  },
  "teslim-edildi": {
    label: "Teslim Edildi",
    dotClass: "bg-success",
    textClass: "text-on-success",
  },
};

export type Order = {
  /** Tasarimdaki bicim: BLK-9082 */
  orderNumber: string;
  title: string;
  itemCount: number;
  totalInKurus: number;
  status: OrderStatus;
  /** ISO tarih (YYYY-MM-DD); gosterim lib/format.ts > formatDate ile yapilir. */
  orderedAt: string;
};

export type LoyaltyTier = "standart" | "gumus" | "altin";

export const loyaltyTierLabels: Record<LoyaltyTier, string> = {
  standart: "Standart Üye",
  gumus: "Gümüş Üye",
  altin: "Altın Üye",
};

export type Account = {
  firstName: string;
  /** Tasarimdaki hitap: "Hoş Geldiniz, Ahmet Bey" */
  salutation: string;
  memberTitle: string;
  heroImage: string;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  /** Puanlarin karsiligi olan indirim tutari, kurus cinsinden. */
  loyaltyDiscountInKurus: number;
  latestOrder: Order | null;
};

/**
 * Ornek hesap. Kimlik dogrulama henuz yok; ekranin dolu halini gosterebilmek
 * icin duruyor, backend fazinda oturumdaki kullaniciyla degistirilecek.
 */
export const demoAccount: Account = {
  firstName: "Ahmet",
  salutation: "Ahmet Bey",
  memberTitle: "Dürüst Üretici Üyesi",
  heroImage: stitchImages.hesabim.hero,
  loyaltyPoints: 1450,
  loyaltyTier: "altin",
  loyaltyDiscountInKurus: 14500,
  latestOrder: {
    orderNumber: "BLK-9082",
    title: "Organik Kestane Balı & Çiçek Balı Seti",
    itemCount: 2,
    totalInKurus: 85000,
    status: "teslim-edildi",
    orderedAt: "2023-10-12",
  },
};
