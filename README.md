# Balkovan

Bal e-ticaret sitesi. Şu an **yalnızca frontend** kurulu: Google Stitch ile üretilen
tasarımlar Next.js bileşenlerine çevrildi. Backend (veritabanı, sipariş, ödeme)
henüz başlamadı.

## Çalıştırma

```bash
npm install
npm run dev
```

http://localhost:3000

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production derlemesi |
| `npm run lint` | ESLint |
| `npm test` | Vitest (tek seferlik) |
| `npm run test:watch` | Vitest izleme modu |

## Teknolojiler

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
react-hook-form + zod · Vitest

## Tasarım kaynağı

Tasarımlar `design/stitch/` altında ekran ekran duruyor; her klasörde Stitch'in
ürettiği `code.html`, `DESIGN.md` ve `screen.png` var. Bunlar **referans**;
uygulanan hâli `src/` içindedir.

Tasarım sistemi (renkler, tipografi, spacing) `src/app/globals.css` içinde
Tailwind v4 `@theme` bloğuna çevrildi. Stitch v3 config üretir, v4 karşılıkları
oraya elle taşındı — yeni ekran geldiğinde class isimleri birebir kullanılabilir.

## Sayfalar

| Yol | Açıklama |
|---|---|
| `/` | Anasayfa |
| `/urunler` | Ürün listesi (`?kategori=` ile filtre) |
| `/urunler/[slug]` | Ürün detayı |
| `/sepet` | Sepet |
| `/kampanyalar` | Kampanyalar |
| `/hakkimizda` | Hakkımızda |
| `/iletisim` | İletişim |

## Backend gelmeden önce bilinmesi gerekenler

- **Ürün verisi** `src/lib/products.ts` içinde sabit. Prisma modeli bu tipe göre
  kurulunca sayfalarda değişiklik gerekmeyecek.
- **Görseller** Stitch'in geçici CDN adreslerinden geliyor (`src/lib/images.ts`).
  Gerçek ürün fotoğrafları hazır olunca tek dosyadan değiştirilecek.
- **Sepet** örnek veriyle çalışıyor; adet/silme sayfa içinde çalışır ama
  kalıcı değil.
- **İletişim formu** doğrulama yapar, gönderim henüz bir servise bağlı değil.
- **Ödeme** hiç başlamadı (iyzico planlandı).
- `/hesabim` ve `/favorilerim` bağlantıları menüde var ama sayfaları yok;
  üyelik fazında gelecek.
