import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AppChrome } from "@/components/layout/app-chrome";
import { CartProvider } from "@/components/cart/cart-provider";
import { materialSymbolsHref } from "@/lib/icons";
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
        {/* next/font Material Symbols'u barindirmadigi icin stylesheet olarak
            yukleniyor. URL yalnizca kullandigimiz ikonlari ister
            (bkz. lib/icons.ts): tam font ~3.9 MB, alt kume ~48 KB. */}
        <link rel="stylesheet" href={materialSymbolsHref} />
      </head>
      <body className="bg-background text-on-background font-body-md min-h-full flex flex-col">
        <CartProvider>
          <AppChrome>{children}</AppChrome>
        </CartProvider>
      </body>
    </html>
  );
}
