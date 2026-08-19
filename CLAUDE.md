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
