/**
 * Musteri yorumlari.
 *
 * NOT: Bunlar ornek veridir, gercek musteri yorumu degildir. Yayina cikmadan
 * once gercek yorumlarla degistirilmeli; aksi halde tuketiciyi yaniltici
 * beyan sayilir. Anasayfa ve Hakkimizda ayni kaynagi kullanir.
 */
export type Testimonial = {
  id: string;
  author: string;
  /** 1-5 arasi puan. */
  rating: number;
  quote: string;
  /** Yorumun ilgili oldugu urun; gosterimde kucuk etiket olarak cikar. */
  product?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "ahmet-yilmaz",
    author: "Ahmet Yılmaz",
    rating: 5,
    quote:
      "Balların tadı harika, gerçekten doğal olduğunu hissedebiliyorsunuz. Kargo da çok hızlıydı.",
    product: "Ham Çiçek Balı",
  },
  {
    id: "zeynep-kaya",
    author: "Zeynep Kaya",
    rating: 5,
    quote:
      "Kestane balı favorim oldu. Yoğun aroması ve kıvamı tam istediğim gibi. Teşekkürler Balkovan!",
    product: "Kestane Balı",
  },
  {
    id: "caner-demir",
    author: "Caner Demir",
    rating: 5,
    quote:
      "Hediye setlerinden aldım, paketleme çok özenliydi. Arkadaşım da çok beğendi.",
    product: "Premium Hediye Seti",
  },
  {
    id: "elif-sahin",
    author: "Elif Şahin",
    rating: 5,
    quote:
      "Kavanozu açar açmaz gelen kokudan anlıyorsunuz. Market balıyla arasında dağlar kadar fark var.",
    product: "Karakovan Petek Balı",
  },
  {
    id: "murat-ozdemir",
    author: "Murat Özdemir",
    rating: 4,
    quote:
      "Ürün gerçekten kaliteli, çocuklar çok sevdi. Tek eksik kargonun bir gün gecikmesiydi.",
    product: "Çam Balı",
  },
  {
    id: "seda-arslan",
    author: "Seda Arslan",
    rating: 5,
    quote:
      "Hasat yılının ve yörenin yazması güven veriyor. Nereden geldiğini bilmek çok kıymetli.",
    product: "Kekik Balı",
  },
  {
    id: "burak-celik",
    author: "Burak Çelik",
    rating: 5,
    quote:
      "Kışın düzenli kullanıyoruz. Kristalleşmesi doğal olduğunun kanıtı, hiç rahatsız etmiyor.",
    product: "Ham Çiçek Balı",
  },
  {
    id: "gamze-korkmaz",
    author: "Gamze Korkmaz",
    rating: 4,
    quote:
      "Arı sütünü soğuk zincirle gönderdiler, kutu buz gibi geldi. Bu özen güven veriyor.",
    product: "Arı Sütü",
  },
];

/** Ortalama puan, bir ondalik basamakla (orn. 4.8). */
export function calculateAverageRating(items: Testimonial[]): number {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + item.rating, 0);
  return Math.round((total / items.length) * 10) / 10;
}

/** Puan dagilimi: 5'ten 1'e dogru her puandan kac yorum var. */
export function calculateRatingBreakdown(
  items: Testimonial[],
): { rating: number; count: number; percent: number }[] {
  return [5, 4, 3, 2, 1].map((rating) => {
    const count = items.filter((item) => item.rating === rating).length;
    return {
      rating,
      count,
      percent: items.length === 0 ? 0 : Math.round((count / items.length) * 100),
    };
  });
}

export const averageRating = calculateAverageRating(testimonials);
export const reviewCount = testimonials.length;
