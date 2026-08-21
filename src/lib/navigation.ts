import type { IconName } from "@/lib/icons";

/** Tasarimdaki TopNavBar ve BottomNavBar baglantilarinin tek kaynagi. */
export const mainNavLinks = [
  { href: "/urunler", label: "Ürünler" },
  { href: "/kampanyalar", label: "Kampanyalar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const bottomNavLinks: ReadonlyArray<{
  href: string;
  label: string;
  icon: IconName;
}> = [
  { href: "/urunler", label: "Mağaza", icon: "storefront" },
  { href: "/sepet", label: "Sepetim", icon: "shopping_basket" },
  { href: "/hesabim", label: "Hesabım", icon: "person" },
] as const;

export const footerSections = [
  {
    title: "Müşteri Hizmetleri",
    links: [
      { href: "/sikca-sorulan-sorular", label: "Sıkça Sorulan Sorular" },
      { href: "/kargo-ve-teslimat", label: "Kargo ve Teslimat" },
      { href: "/iade-kosullari", label: "İade Koşulları" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/kalite-belgelerimiz", label: "Kalite Belgelerimiz" },
      { href: "/iletisim", label: "İletişim" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
      { href: "/on-bilgilendirme-formu", label: "Ön Bilgilendirme Formu" },
      { href: "/kvkk-aydinlatma-metni", label: "KVKK Aydınlatma Metni" },
      { href: "/gizlilik-ve-cerez-politikasi", label: "Gizlilik ve Çerez Politikası" },
    ],
  },
  {
    title: "Sosyal Medya",
    links: [
      { href: "https://instagram.com", label: "Instagram" },
      { href: "https://facebook.com", label: "Facebook" },
    ],
  },
] as const;
