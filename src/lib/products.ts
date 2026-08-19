import { stitchImages } from "@/lib/images";

/**
 * Katalog tipi. Backend gelene kadar veri bu dosyadan besleniyor;
 * Prisma modeli bu sekile gore kurulacak ki sayfalarda degisiklik gerekmesin.
 * Fiyatlar kurus cinsinden integer tutulur (bkz. lib/format.ts).
 */
export type ProductCategory = "ballar" | "ari-urunleri" | "setler";

/** Gramaj secenegi. Balda fiyat kavanoz boyuna bagli oldugu icin fiyat varyantta. */
export type ProductVariant = {
  weightGrams: number;
  /** Tasarimda gramajin altinda gorunen aciklama: "Kavanoz", "Buyuk Boy". */
  label: string;
  priceInKurus: number;
};

export type ProductSpecs = {
  /** Yore: balda guven unsuru, tasarimda ozellikler tablosunda ilk sirada. */
  region: string;
  harvest: string;
  /** Toplam Aktivite degeri. Yalnizca ham/petek ballarda anlamli. */
  totalActivity?: string;
};

export type Product = {
  slug: string;
  name: string;
  description: string;
  priceInKurus: number;
  /** Ustu cizili eski fiyat. Yalnizca indirimli urunlerde dolu. */
  compareAtPriceInKurus?: number;
  image: string;
  category: ProductCategory;
  /** Gorsel uzerinde gosterilen rozet. Tasarimda her urunde yok. */
  badge?: string;
  /** Urun detayinda basligin ustundeki kucuk etiketler. */
  tags: string[];
  variants: ProductVariant[];
  specs: ProductSpecs;
  /** Urun detayindaki "Urun Hakkinda" paragraflari. */
  longDescription: string[];
  /** Detay sayfasi kucuk resimleri. Bos ise yalnizca ana gorsel gosterilir. */
  gallery: string[];
  /** Breadcrumb'daki ara basamak. */
  breadcrumb: string;
};

export const categoryFilters = [
  { value: "tumu", label: "Tüm Ürünler" },
  { value: "ballar", label: "Ballar" },
  { value: "ari-urunleri", label: "Arı Ürünleri" },
  { value: "setler", label: "Setler" },
] as const;

/**
 * NOT: Gramaj, yore, hasat yili ve uzun aciklamalar su an tasarimdaki ornek
 * degerlerden turetildi. Karakovan Petek Bal disindaki urunlerde bu alanlar
 * yer tutucudur; gercek urun bilgileriyle degistirilmesi gerekiyor.
 */
export const products: Product[] = [
  {
    slug: "ham-cicek-bali",
    name: "Ham Çiçek Balı",
    description:
      "Anadolu'nun zengin florasından elde edilen, işlem görmemiş saf çiçek balı.",
    priceInKurus: 24990,
    image: stitchImages.urun.hamCicekBali,
    category: "ballar",
    badge: "%100 Doğal",
    tags: ["Ham Bal", "Süzme"],
    variants: [
      { weightGrams: 450, label: "Kavanoz", priceInKurus: 24990 },
      { weightGrams: 850, label: "Büyük Boy", priceInKurus: 42990 },
    ],
    specs: { region: "Erzurum / Şenkaya", harvest: "2024 Yaz" },
    longDescription: [
      "Yüksek rakımlı yaylalarda, binbir çeşit kır çiçeğinin nektarından toplanan saf çiçek balıdır.",
      "Hiçbir ısıl işlem görmediği için doğal enzimleri korunmuştur; zamanla kristalleşmesi doğallığının göstergesidir.",
    ],
    gallery: [],
    breadcrumb: "Süzme Ballar",
  },
  {
    slug: "karakovan-petek-bali",
    name: "Karakovan Petek Balı",
    description:
      "Geleneksel yöntemlerle üretilen, peteğiyle birlikte tüketilen eşsiz lezzet.",
    priceInKurus: 38990,
    image: stitchImages.urunDetay.ana,
    category: "ballar",
    tags: ["Ham Bal", "TA14+"],
    variants: [
      { weightGrams: 450, label: "Kavanoz", priceInKurus: 38990 },
      { weightGrams: 850, label: "Büyük Boy", priceInKurus: 69990 },
    ],
    specs: {
      region: "Erzurum / Şenkaya",
      harvest: "2023 Sonbahar",
      totalActivity: "14+ (Yüksek)",
    },
    longDescription: [
      "Kafkas arılarının yüksek rakımlı yaylalarda, insan elinin değmediği kovanlarda kendi ürettikleri balmumu ile ördüğü tamamen doğal petek baldır.",
      "İçerisinde temel petek (hazır mum) bulunmaz. Doğal olduğu için peteğiyle birlikte ağızda kolayca dağılır ve yenilebilir.",
      "Zengin bitki florasına sahip yöremizden özenle hasat edilmiş, hiçbir ısıl işlem görmemiş ham baldır.",
    ],
    gallery: [...stitchImages.urunDetay.galeri],
    breadcrumb: "Petek Ballar",
  },
  {
    slug: "kestane-bali",
    name: "Kestane Balı",
    description:
      "Karadeniz'in kestane ormanlarından gelen, yoğun aromalı ve şifa kaynağı bal.",
    priceInKurus: 45990,
    image: stitchImages.urun.kestaneBali,
    category: "ballar",
    badge: "Sınırlı Stok",
    tags: ["Ham Bal", "Yoğun Aroma"],
    variants: [
      { weightGrams: 450, label: "Kavanoz", priceInKurus: 45990 },
      { weightGrams: 850, label: "Büyük Boy", priceInKurus: 82990 },
    ],
    specs: { region: "Karadeniz", harvest: "2024 Yaz" },
    longDescription: [
      "Karadeniz'in kestane ormanlarından hasat edilen, kendine has hafif acımsı tadı ve koyu rengiyle bilinen özel bir baldır.",
      "Yüksek mineral içeriği ve yoğun aroması nedeniyle geleneksel olarak kuvvet balı diye anılır.",
    ],
    gallery: [],
    breadcrumb: "Süzme Ballar",
  },
  {
    slug: "cam-bali",
    name: "Çam Balı",
    description:
      "Ege yöresinin çam ormanlarından süzülen, kristalize olmayan özel salgı balı.",
    priceInKurus: 21990,
    image: stitchImages.urun.camBali,
    category: "ballar",
    tags: ["Salgı Balı"],
    variants: [
      { weightGrams: 450, label: "Kavanoz", priceInKurus: 21990 },
      { weightGrams: 850, label: "Büyük Boy", priceInKurus: 38990 },
    ],
    specs: { region: "Ege / Muğla", harvest: "2024 Sonbahar" },
    longDescription: [
      "Çam ağaçlarındaki basra böceğinin salgısından üretilen, çiçek balına göre daha az tatlı ve mineralce zengin bir salgı balıdır.",
      "Kristalleşme eğilimi düşüktür; kıvamını uzun süre korur.",
    ],
    gallery: [],
    breadcrumb: "Süzme Ballar",
  },
  {
    slug: "kekik-bali",
    name: "Kekik Balı",
    description: "Ferahlatıcı aromasıyla sofralarınızın vazgeçilmezi.",
    priceInKurus: 41000,
    image: stitchImages.urun.kekikBali,
    category: "ballar",
    tags: ["Ham Bal", "Aromatik"],
    variants: [
      { weightGrams: 450, label: "Kavanoz", priceInKurus: 41000 },
      { weightGrams: 850, label: "Büyük Boy", priceInKurus: 74000 },
    ],
    specs: { region: "Toroslar", harvest: "2024 Yaz" },
    longDescription: [
      "Dağ kekiği florasından toplanan, ferahlatıcı aroması ve açık ambere çalan rengiyle öne çıkan baldır.",
    ],
    gallery: [],
    breadcrumb: "Süzme Ballar",
  },
  {
    slug: "ari-sutu",
    name: "Arı Sütü",
    description: "Kraliçe arının besini, enerji ve zindelik kaynağı saf arı sütü.",
    priceInKurus: 59990,
    image: stitchImages.urun.ariSutu,
    category: "ari-urunleri",
    tags: ["Taze", "Soğuk Zincir"],
    variants: [{ weightGrams: 20, label: "Cam Şişe", priceInKurus: 59990 }],
    specs: { region: "Erzurum / Şenkaya", harvest: "2024 İlkbahar" },
    longDescription: [
      "İşçi arıların kraliçe arıyı beslemek için ürettiği, protein ve vitamin bakımından zengin taze arı sütüdür.",
      "Tazeliğini koruması için soğuk zincirle sevk edilir ve buzdolabında saklanmalıdır.",
    ],
    gallery: [],
    breadcrumb: "Arı Ürünleri",
  },
  {
    slug: "premium-hediye-seti",
    name: "Premium Hediye Seti",
    description:
      "Sevdiklerinize doğanın en tatlı hediyesi. Özel ahşap kutusunda tadım seti.",
    priceInKurus: 84990,
    image: stitchImages.urun.premiumHediyeSeti,
    category: "setler",
    badge: "Özel Seçim",
    tags: ["Hediyelik", "Ahşap Kutu"],
    variants: [{ weightGrams: 1350, label: "3'lü Tadım Seti", priceInKurus: 84990 }],
    specs: { region: "Karma", harvest: "2024" },
    longDescription: [
      "Üç farklı balımızın 450 gramlık kavanozlarından oluşan, özel ahşap kutusunda sunulan tadım setidir.",
      "Kurumsal ve özel gün hediyeleri için hazır paketlenmiş olarak gönderilir.",
    ],
    gallery: [],
    breadcrumb: "Hediye Setleri",
  },
];

/** Anasayfadaki "Öne Çıkanlar" bolumunde gosterilen dort urun. */
export const featuredSlugs = [
  "ham-cicek-bali",
  "kestane-bali",
  "kekik-bali",
  "cam-bali",
] as const;

export const featuredProducts = featuredSlugs.map((slug) => {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Öne çıkan ürün bulunamadı: ${slug}`);
  return product;
});

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
