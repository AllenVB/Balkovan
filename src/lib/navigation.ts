/** Tasarimdaki TopNavBar ve BottomNavBar baglantilarinin tek kaynagi. */
export const mainNavLinks = [
  { href: "/urunler", label: "Ürünler" },
  { href: "/kampanyalar", label: "Kampanyalar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const bottomNavLinks = [
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
    title: "Sosyal Medya",
    links: [
      { href: "https://instagram.com", label: "Instagram" },
      { href: "https://facebook.com", label: "Facebook" },
    ],
  },
] as const;
