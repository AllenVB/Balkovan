/**
 * Metin agirlikli bilgi sayfalari (SSS, kargo, iade, kalite belgeleri, yasal
 * metinler). Hepsi tek bir sablonla render edilir: /[sayfa]
 *
 * ⚠️ YASAL METINLER: Mesafeli Satis Sozlesmesi, On Bilgilendirme Formu, KVKK
 * Aydinlatma Metni, Gizlilik ve Cerez Politikasi hukuki belgelerdir ve buraya
 * uydurma metin yazilmaz. Bunlar `needsLegalReview: true` ile isaretli; icerigi
 * isletmenin kendi bilgileriyle ve hukuk danismaniyla doldurulmali.
 *
 * Diger sayfalarin (SSS, kargo, iade sureci) metinleri isletme bilgisidir;
 * mevcut kurallardan (lib/cart.ts, lib/checkout.ts) turetilmis taslak halde.
 */

export type ContentSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type ContentPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: ContentSection[];
  /** true ise sayfada "taslak, hukuki inceleme bekliyor" uyarisi gosterilir. */
  needsLegalReview?: boolean;
};

export const contentPages: ContentPage[] = [
  {
    slug: "sikca-sorulan-sorular",
    title: "Sıkça Sorulan Sorular",
    description:
      "Sipariş, kargo, ödeme ve ürünlerimiz hakkında en çok sorulan sorular.",
    intro:
      "Aradığınız cevabı bulamazsanız WhatsApp'tan ya da iletişim formundan bize yazabilirsiniz.",
    sections: [
      {
        heading: "Balınız gerçekten ham mı?",
        paragraphs: [
          "Balı kavanozlarken pastörizasyon veya yüksek ısı uygulamıyoruz, filtresiz süzüyoruz. Bu sayede doğal enzimleri, polenleri ve besin değerleri korunuyor.",
        ],
      },
      {
        heading: "Balım kristalleşti, bozuldu mu?",
        paragraphs: [
          "Hayır. Kristalleşme ham balın doğal bir davranışıdır ve bozulma belirtisi değildir. Kavanozu 40 dereceyi geçmeyen ılık suda bekleterek eski kıvamına döndürebilirsiniz.",
        ],
      },
      {
        heading: "Kargo ücreti ne kadar?",
        paragraphs: [
          "Kargo ücreti seçtiğiniz firmaya göre değişir; ödeme adımında iki seçenek sunulur. 1.500 ₺ ve üzeri siparişlerde kargo ücretsizdir.",
        ],
      },
      {
        heading: "Siparişim ne zaman elime ulaşır?",
        paragraphs: [
          "Siparişler hafta içi saat 14:00'e kadar hazırlanıp kargoya verilir. Teslimat süresi seçtiğiniz kargo firmasına göre 1-4 iş günü arasında değişir; tahmini teslim tarihi sipariş onayında yazılıdır.",
        ],
      },
      {
        heading: "Bal Puanı nasıl kazanılır ve kullanılır?",
        paragraphs: [
          "Her siparişte ödediğiniz ürün tutarının yarısı kadar Bal Puanı kazanırsınız. 10 Bal Puanı 1 ₺ değerindedir ve sepetinizin en fazla %25'ini puanla ödeyebilirsiniz.",
        ],
      },
      {
        heading: "İndirimler birleşiyor mu?",
        paragraphs: [
          "Evet. 3 Al 2 Öde, toplu alım indirimi, kupon ve Bal Puanı üst üste uygulanabilir. Her indirim bir öncekinden kalan tutara işlenir ve sepette ayrı ayrı gösterilir.",
        ],
      },
    ],
  },
  {
    slug: "kargo-ve-teslimat",
    title: "Kargo ve Teslimat",
    description:
      "Kargo firmaları, ücretler, hazırlık ve teslimat süreleri hakkında bilgi.",
    intro:
      "Ballarımız cam kavanozda gönderildiği için paketlemeye ayrı özen gösteriyoruz.",
    sections: [
      {
        heading: "Kargo firmaları ve ücretler",
        bullets: [
          "Aras Kargo — 49,90 ₺ · 1-3 iş günü içinde teslimat",
          "Yurtiçi Kargo — 59,90 ₺ · 2-4 iş günü içinde teslimat",
          "1.500 ₺ ve üzeri siparişlerde kargo ücretsizdir.",
        ],
      },
      {
        heading: "Hazırlık süresi",
        paragraphs: [
          "Hafta içi 14:00'e kadar verilen siparişler aynı gün, sonrasındakiler bir sonraki iş günü kargoya teslim edilir. Hafta sonu ve resmi tatillerde kargo çıkışı yapılmaz.",
        ],
      },
      {
        heading: "Paketleme",
        paragraphs: [
          "Cam kavanozlar korunaklı ambalajla, darbe emici dolgu malzemesiyle birlikte gönderilir. Kargoda kırılma yaşanırsa ürünü ücretsiz yeniliyoruz.",
        ],
      },
      {
        heading: "Teslimat sırasında hasar",
        paragraphs: [
          "Paketi kargo görevlisinin yanında kontrol edin. Hasar varsa teslim almayın ve tutanak tutturun; tutanakla birlikte bize ulaşın, ürün ücretsiz yenilenir.",
        ],
      },
    ],
  },
  {
    slug: "iade-kosullari",
    title: "İade Koşulları",
    description: "Cayma hakkı, iade süreci ve gıda ürünlerinde iade kuralları.",
    intro:
      "Aşağıdaki bilgiler süreci özetler; sözleşmeye esas hükümler Mesafeli Satış Sözleşmesi'nde yer alır.",
    needsLegalReview: true,
    sections: [
      {
        heading: "Cayma hakkı",
        paragraphs: [
          "Mesafeli Sözleşmeler Yönetmeliği uyarınca tüketici, teslim tarihinden itibaren 14 gün içinde cayma hakkına sahiptir.",
        ],
      },
      {
        heading: "Gıda ürünlerinde istisna",
        paragraphs: [
          "Yönetmelik, ambalajı açılmış gıda ürünlerini cayma hakkının istisnaları arasında sayar. Bu nedenle mührü/ambalajı açılmış bal ve arı ürünleri iade alınamaz.",
          "Ambalajı açılmamış, yeniden satılabilir durumdaki ürünler 14 gün içinde iade edilebilir.",
        ],
      },
      {
        heading: "Ayıplı veya hasarlı ürün",
        paragraphs: [
          "Ürün hasarlı, eksik ya da siparişinizden farklı geldiyse ambalaj durumuna bakılmaksızın ücretsiz değişim veya iade yapılır. Kargo bedeli tarafımıza aittir.",
        ],
      },
      {
        heading: "İade nasıl yapılır?",
        bullets: [
          "WhatsApp veya e-posta ile sipariş numaranızı belirterek talep oluşturun.",
          "Onay sonrası ürünü anlaşmalı kargo ile gönderin.",
          "Ürün tarafımıza ulaştıktan sonra 14 gün içinde ödeme iadesi yapılır.",
          "Ödeme, siparişte kullanılan yönteme iade edilir; kullanılan Bal Puanı hesabınıza geri yüklenir.",
        ],
      },
    ],
  },
  {
    slug: "gizlilik-ve-cerez-politikasi",
    title: "Gizlilik ve Çerez Politikası",
    description:
      "Kişisel verilerinizin nasıl işlendiği ve tarayıcınızda hangi verilerin saklandığı.",
    intro:
      "Bu metin, sitenin hangi verileri neden sakladığını açıklar.",
    needsLegalReview: true,
    sections: [
      {
        heading: "Tarayıcınızda sakladığımız veriler",
        paragraphs: [
          "Site şu an yalnızca çalışması için zorunlu olan verileri tarayıcınızda saklar. Bu veriler sunucularımıza gönderilmez.",
        ],
        bullets: [
          "Sepetinizdeki ürünler ve adetleri",
          "Uyguladığınız indirim kodu ve Bal Puanı tercihiniz",
          "Ödeme adımında girdiğiniz teslimat adresi",
          "Tamamlanan son siparişinizin özeti",
          "Çerez bilgilendirmesini kapattığınız bilgisi",
        ],
      },
      {
        heading: "Ölçümleme ve reklam çerezleri",
        paragraphs: [
          "Şu an ölçümleme (analytics) veya reklam çerezi kullanılmamaktadır. Eklendiğinde bu bölüm güncellenecek ve açık rıza mekanizması sunulacaktır.",
        ],
      },
      {
        heading: "Verilerinizi silme",
        paragraphs: [
          "Tarayıcınızın site verilerini temizleyerek yukarıdaki tüm kayıtları silebilirsiniz.",
        ],
      },
      {
        heading: "Doldurulması gerekenler",
        paragraphs: [
          "Veri sorumlusu unvanı, adresi ve iletişim bilgileri; verilerin saklama süresi; üçüncü taraf hizmet sağlayıcılar (ödeme, kargo, e-posta) ve yurt dışına aktarım durumu bu bölüme eklenmelidir.",
        ],
      },
    ],
  },
  {
    slug: "kvkk-aydinlatma-metni",
    title: "KVKK Aydınlatma Metni",
    description:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
    intro:
      "Bu sayfa, işletme bilgileri ve hukuki inceleme tamamlandıktan sonra yayına hazır olacaktır.",
    needsLegalReview: true,
    sections: [
      {
        heading: "Metinde yer alması gerekenler",
        bullets: [
          "Veri sorumlusunun kimliği (unvan, adres, vergi dairesi ve numarası)",
          "Kişisel verilerin hangi amaçla işleneceği",
          "İşlenen verilerin kimlere ve hangi amaçla aktarılabileceği",
          "Veri toplamanın yöntemi ve hukuki sebebi",
          "KVKK 11. madde kapsamındaki hakların sayılması",
          "Başvuru kanalı (e-posta, KEP adresi, posta)",
        ],
      },
      {
        heading: "Neden boş",
        paragraphs: [
          "Aydınlatma metni hukuki bir belgedir ve işletmenin gerçek bilgileriyle hazırlanmalıdır. Örnek metin yerleştirmek yanıltıcı olacağından bilerek boş bırakılmıştır.",
        ],
      },
    ],
  },
  {
    slug: "mesafeli-satis-sozlesmesi",
    title: "Mesafeli Satış Sözleşmesi",
    description:
      "Mesafeli Sözleşmeler Yönetmeliği kapsamında satıcı ve alıcı arasındaki sözleşme.",
    intro:
      "Sözleşme, sipariş onayı sırasında alıcının onayına sunulur.",
    needsLegalReview: true,
    sections: [
      {
        heading: "Sözleşmede yer alması gerekenler",
        bullets: [
          "Satıcı bilgileri: unvan, adres, telefon, e-posta, MERSİS/vergi numarası",
          "Alıcı ve teslimat bilgileri",
          "Sözleşme konusu ürün, adet, KDV dahil satış fiyatı ve kargo bedeli",
          "Ödeme şekli ve teslimat koşulları",
          "Cayma hakkı, süresi ve kullanım şekli",
          "Cayma hakkının kullanılamayacağı ürünler (ambalajı açılmış gıda)",
          "Uyuşmazlıklarda Tüketici Hakem Heyeti ve Tüketici Mahkemeleri yetkisi",
        ],
      },
      {
        heading: "Neden boş",
        paragraphs: [
          "Sözleşme hukuki bağlayıcılığı olan bir belgedir. İşletmenin gerçek bilgileri ve hukuki inceleme olmadan doldurulmamalıdır.",
        ],
      },
    ],
  },
  {
    slug: "on-bilgilendirme-formu",
    title: "Ön Bilgilendirme Formu",
    description:
      "Sipariş öncesinde tüketiciye sunulması zorunlu ön bilgilendirme.",
    intro:
      "Form, ödeme adımında sipariş özetiyle birlikte tüketiciye sunulur.",
    needsLegalReview: true,
    sections: [
      {
        heading: "Formda yer alması gerekenler",
        bullets: [
          "Satıcının unvanı, açık adresi ve iletişim bilgileri",
          "Ürünün temel nitelikleri ve KDV dahil toplam fiyatı",
          "Kargo bedeli ve teslimat süresi",
          "Ödeme yöntemi ve şikâyet başvuru kanalları",
          "Cayma hakkının kullanım koşulları ve süresi",
        ],
      },
      {
        heading: "Neden boş",
        paragraphs: [
          "Ön bilgilendirme formu mevzuat gereği zorunlu içerik taşır ve işletme bilgileriyle doldurulmalıdır.",
        ],
      },
    ],
  },
  {
    slug: "kalite-belgelerimiz",
    title: "Kalite Belgelerimiz",
    description:
      "Analiz raporları, üretim izinleri ve kalite süreçlerimiz hakkında bilgi.",
    intro:
      "Bu sayfa, belgelerin görselleri ve numaraları eklendikten sonra yayına hazır olacak.",
    needsLegalReview: true,
    sections: [
      {
        heading: "Analiz raporları",
        paragraphs: [
          "Her hasat partisi akredite laboratuvarlarda analiz edilir. Rapor numaraları ve tarihleri bu bölüme eklenecek.",
        ],
      },
      {
        heading: "Gıda işletmesi kayıt belgesi",
        paragraphs: [
          "Tarım ve Orman Bakanlığı işletme kayıt numarası bu bölümde yayımlanacak.",
        ],
      },
      {
        heading: "Üretim ve dolum süreci",
        paragraphs: [
          "Bal, hasattan kavanozlamaya kadar ısıl işlem görmeden, filtresiz olarak işlenir. Dolum hijyen kurallarına uygun ortamda yapılır.",
        ],
      },
    ],
  },
];

export function getContentPage(slug: string): ContentPage | undefined {
  return contentPages.find((page) => page.slug === slug);
}
