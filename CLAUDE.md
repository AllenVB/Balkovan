@AGENTS.md

# Balkovan — proje kuralları

Bal e-ticaret sitesi. Türkçe arayüz, gerçek satış hedefli. Şu an yalnızca frontend var.

## Tasarım sadakati

Tasarım kaynağı `design/stitch/<ekran>/code.html` + `DESIGN.md`. Yeni ekran
geldiğinde **HTML'deki Tailwind class'ları birebir korunur** — kendi isimlendirmen
yerine tasarımın token'larını kullan (`bg-surface-container-high`, `px-margin-desktop`,
`text-headline-md`, `warm-shadow`).

Token'lar `src/app/globals.css` içinde Tailwind v4 `@theme` bloğunda tanımlı.
Yeni bir token gerekiyorsa önce oraya ekle, sonra kullan. Stitch v3 config üretir;
v4'te renk `--color-*`, yazı tipi `--font-*`, punto `--text-*` (+ `--text-*--line-height`
gibi ek nitelikler), boşluk `--spacing-*` olur.

`DESIGN.md` ile `code.html` çelişirse `DESIGN.md` tasarım sisteminin kaynağıdır
(örn. para birimi simgesi tutarın sonunda: `1.234,56 ₺`).

## Para

Tutarlar **kuruş cinsinden integer** tutulur, float kullanılmaz. Biçimleme yalnızca
`src/lib/format.ts` üzerinden yapılır (`formatPrice`, `formatPriceCompact`).

## Veri

Katalog `src/lib/products.ts`, görsel adresleri `src/lib/images.ts`, sepet kuralları
`src/lib/cart.ts`, sepetin tarayıcıdaki hâli `src/lib/cart-storage.ts`,
hesap/üyelik `src/lib/account.ts`.

Sepet mantığı (ekleme, adet, toplam) `lib/cart.ts` içinde **saf fonksiyon**;
bileşenler durumu `components/cart/cart-provider.tsx` üzerinden okur. Backend
gelince yalnızca `cart-storage.ts` sunucu çağrılarıyla değişecek. Bileşenlerin içine sabit ürün/görsel/fiyat gömme — bu dosyalar
backend gelince tek noktadan değişecek.

Kargo eşiği ve ücreti `src/lib/cart.ts` içindeki sabitlerdir; başka yerde
tekrarlanmaz.

## Kampanyalar

Tüm indirim kuralları `src/lib/promotions.ts` içinde, saf fonksiyon olarak.
Sıra ve öncelik şöyle:

1. **3 Al 2 Öde** — yalnızca `products.ts`'te `threeForTwo: true` işaretli
   ürünlerde. Her üç adetten **en ucuzu** bedava; farklı kampanyalı ürünler
   birlikte sayılır.
2. **Toplu alım** — sepetteki **toplam** adede göre 6+ ise %5, 12+ ise %10.
   Ürünlerin aynı olması gerekmez.
3. **Kupon** — önceki indirimler düşüldükten sonraki tutara.
4. **Bal Puanı** — en sonda; kuralları `src/lib/loyalty.ts`'te.

**İndirimler üst üste biner.** 3 Al 2 Öde alan ürünler toplu alım yüzdesini de
alır; her kademe bir öncekinden kalan tutara uygulanır. Bu bilinçli bir karar —
müşteride "daha da ucuza alıyorum" hissi yaratmak için. Bileşik etki yüksek
olabildiğinden yeni kampanya eklerken `promotions.test.ts`'e bileşik senaryo
testi de ekle.

Kargo eşiği **indirim sonrası** tutara bakar (müşterinin gerçekte ödeyeceği
tutar). Burası doğrudan para hesabı — her kural değişikliği testle birlikte gelir.

## Ödeme akışı

`/odeme` (adres & kargo) → `/odeme/kart` (ödeme) → `/odeme/onay`.

Kurallar `src/lib/checkout.ts`, tarayıcıdaki durum `src/lib/checkout-storage.ts`,
okuma `components/checkout/use-checkout.ts` üzerinden. Adres doğrulaması zod
şeması (`addressSchema`) ile; aynı şema backend gelince sunucuda da kullanılacak.

**Kargo ücreti tek kaynak:** `shippingOptions` (Aras 49,90 / Yurtiçi 59,90).
Sepet toplamları da bu seçimi okur — `CartProvider` kargo seçimini
`checkout-storage`'dan alır, böylece sepet ve ödeme özeti aynı tutarı gösterir.
Ücretsiz kargo eşiği aşılırsa seçilen kargo bedava olur.

**Akış korumaları:** sepet boşsa `/odeme`'ye girilemez, adres yoksa
`/odeme/kart`'a girilemez, tamamlanmış sipariş yoksa `/odeme/onay`'a girilemez.

**Navigasyon:** Tasarım ödeme adımlarında site menüsünü bilerek gizliyor.
`components/layout/app-chrome.tsx` `/odeme` altında header/footer/alt menüyü
render etmez; çıkış yolu adımların kendi geri bağlantısıdır.

### ⚠️ Kart verisi

`payment-form.tsx` yalnızca tasarımın karşılığı — kart bilgisi hiçbir yere
gönderilmiyor. **Gerçek ödemede kart verisi kendi sunucumuzdan geçmemeli;**
iyzico'nun barındırdığı ödeme formu (Checkout Form / iframe) kullanılmalı,
aksi halde PCI-DSS yükümlülüğü bize geçer. Sipariş oluşturulurken sunucu
fiyatı ve tüm indirimleri **yeniden hesaplamalı**; tarayıcıdan gelen tutara
güvenilmez.

## Bal Puanı

`src/lib/loyalty.ts` tek kaynak: 10 puan = 1 ₺, sipariş tutarının yarısı kadar
puan kazanılır, puanla sepetin en fazla **%25**'i ödenebilir. Üç sınır birlikte
uygulanır (kullanıcının puanı, %25 tavanı, kalan tutar) ve yalnızca gerçekten
kullanılan puan düşülür.

## Yorumlar

`src/lib/testimonials.ts` — anasayfa ve Hakkımızda aynı kaynağı kullanır.
**Bunlar örnek veridir**; yayına çıkmadan önce gerçek yorumlarla değiştirilmeli,
aksi halde tüketiciyi yanıltıcı beyan sayılır.

## Bileşenler

- Varsayılan Server Component. `"use client"` yalnızca gerçekten durum/olay
  gerektiren yerlerde (galeri, sepet, form, kupon kopyalama, aktif menü).
- Ortak yerleşim `src/components/layout/`, ürün `src/components/product/`.
- İkonlar `src/components/ui/icon.tsx` (Material Symbols) üzerinden; ham
  `<span className="material-symbols-outlined">` yazma.
- **Yeni ikon kullanmadan önce `src/lib/icons.ts` listesine ekle.** Tarayıcıya
  yalnızca listedeki ikonlar indiriliyor (tam font ~3.9 MB, alt küme ~48 KB).
  Liste `IconName` tipini de ürettiği için listede olmayan ad derleme hatası
  verir — ikon sessizce kaybolmaz.
- Genişlik/kenar boşluğu için `src/components/ui/container.tsx`.

## Test

Saf mantık (fiyat, sepet toplamı, kargo) için Vitest birim testi zorunlu.
Test dosyası kodun yanında: `src/lib/cart.test.ts`.

## Stitch çıktısındaki tutarsızlıklar

Stitch her ekranı ayrı ürettiği için ekranlar arası çelişki çıkıyor. Yeni ekran
gelince şunları karşılaştır ve **sistemdeki hâli kazanır**:

- **Dil:** bazı ekranlar İngilizce çıkıyor ("My Account", bottom nav "Home/Shop").
  Arayüz tamamen Türkçe.
- **Para birimi:** kimi ekranda `₺145`, kimi ekranda `145,00 ₺`. Doğrusu
  `DESIGN.md`'deki gibi simge sonda — her zaman `lib/format.ts` kullan.
- **Header/alt menü:** ekrandan ekrana değişiyor (logo ortada/solda, sekme sayısı).
  `components/layout/` altındaki tek sürüm geçerli.
- **Gölge sınıfı:** Stitch `ambient-shadow`/`shadow-ambient` de üretiyor;
  projede tek ad `warm-shadow`.
- **Palet dışı renk:** Tailwind default renkleri (`emerald-500` gibi) doğrudan
  kullanılmaz; önce `globals.css`'e token olarak eklenir (`--color-success`).

## Mobil

Tasarımlar mobil menü içermiyor: ana menü `md` altında gizleniyor ve yerine bir
şey gelmiyor. Bu yüzden `site-header.tsx` içinde açılır bir mobil menü, hesap
ekranlarında ise yan menünün yerine yatay kaydırılan bir şerit var. Yeni bir
bölüm eklerken mobilde nasıl ulaşılacağını da çöz — `md:hidden` ile gizleyip
bırakma.

## Bilgi ve yasal sayfalar

`src/lib/content-pages.ts` tek kaynak; hepsi `/[sayfa]` şablonuyla render edilir.
Yeni bilgi sayfası eklemek için diziye bir kayıt eklemek yeterli — route, sitemap
ve metadata otomatik gelir.

**Hukuki metin yazma.** Mesafeli Satış Sözleşmesi, Ön Bilgilendirme Formu, KVKK
Aydınlatma ve Gizlilik/Çerez Politikası `needsLegalReview: true` ile işaretli ve
içerik yerine "neler yer almalı" listesi taşıyor. Bunlar işletmenin gerçek
bilgileri ve hukuki inceleme ile doldurulmalı; örnek metin koymak yanıltıcı olur.

## SEO

`src/lib/seo.ts` site adresi ve açıklamanın tek kaynağı. Yeni herkese açık sayfa
eklerken `src/app/sitemap.ts` içine de ekle; ödeme/hesap/sepet gibi özel alanlar
`src/app/robots.ts` içinde aramaya kapalı tutulur.
