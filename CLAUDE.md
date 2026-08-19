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
`src/lib/cart.ts`. Bileşenlerin içine sabit ürün/görsel/fiyat gömme — bu dosyalar
backend gelince tek noktadan değişecek.

Kargo eşiği ve ücreti `src/lib/cart.ts` içindeki sabitlerdir; başka yerde
tekrarlanmaz.

## Bileşenler

- Varsayılan Server Component. `"use client"` yalnızca gerçekten durum/olay
  gerektiren yerlerde (galeri, sepet, form, kupon kopyalama, aktif menü).
- Ortak yerleşim `src/components/layout/`, ürün `src/components/product/`.
- İkonlar `src/components/ui/icon.tsx` (Material Symbols) üzerinden; ham
  `<span className="material-symbols-outlined">` yazma.
- Genişlik/kenar boşluğu için `src/components/ui/container.tsx`.

## Test

Saf mantık (fiyat, sepet toplamı, kargo) için Vitest birim testi zorunlu.
Test dosyası kodun yanında: `src/lib/cart.test.ts`.
