"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BottomNav } from "@/components/layout/bottom-nav";

/**
 * Site kabugu: baslik, alt bilgi ve mobil alt menu.
 *
 * Odeme adimlarinda tasarim navigasyonu bilerek gizliyor ("Navigation Shell
 * Suppressed") - musteri akistan cikmasin diye. Bu yuzden /odeme altinda
 * yalnizca icerik render edilir; cikis yolu adimlarin kendi "geri" baglantisi.
 */
export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/odeme");

  if (isCheckout) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-grow">{children}</main>
      <SiteFooter />
      <BottomNav />
      {/* Mobil alt navigasyon sabit konumlu; icerigin altinda kalmamasi icin bosluk */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
