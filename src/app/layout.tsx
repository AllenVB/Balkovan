import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Balkovan - Orijinal bal, doğrudan arıcıdan",
    template: "%s | Balkovan",
  },
  description:
    "Yaylalardan süzülen ham ve katkısız bal. Isıl işlem görmemiş, doğrudan üreticiden sofranıza.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Tasarim ikonlari Material Symbols ile geliyor. next/font degisken
            ikon fontlarini desteklemedigi icin stylesheet olarak yukleniyor. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font --
            Kural Pages Router icin; App Router'da root layout'taki link zaten
            her sayfada yuklenir. next/font Material Symbols'u barindirmadigi
            icin stylesheet tek secenek. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background text-on-background font-body-md min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-grow">{children}</main>
        <SiteFooter />
        <BottomNav />
        {/* Mobil alt navigasyon sabit konumlu; icerigin altinda kalmamasi icin bosluk */}
        <div className="h-20 md:hidden" aria-hidden="true" />
      </body>
    </html>
  );
}
