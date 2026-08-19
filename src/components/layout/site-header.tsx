"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/icon";
import { mainNavLinks } from "@/lib/navigation";

/**
 * Tasarimdaki TopNavBar. Her sayfada ayni; ustunde ince duyuru seridi var.
 * Aktif baglantiyi isaretlemek icin pathname okundugundan client bileseni.
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      <div className="bg-primary text-on-primary text-center py-2 text-label-md font-label-md">
        1.500 ₺ üzeri kargo bedava
      </div>

      <header className="bg-background/90 backdrop-blur-md warm-shadow sticky top-0 z-40">
        <div className="flex justify-between items-center w-full px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto h-20">
          <Link href="/" className="flex items-center gap-4">
            <span
              className="h-12 w-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <Icon name="hive" size={28} />
            </span>
            <span className="font-headline-md text-headline-md font-bold text-primary hidden sm:block">
              Balkovan
            </span>
          </Link>

          <nav className="hidden md:flex gap-gutter items-center">
            {mainNavLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "font-label-md text-label-md transition-colors duration-200 hover:text-primary",
                    isActive ? "text-primary font-bold" : "text-on-surface-variant",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex gap-4 items-center text-primary">
            <Link
              href="/hesabim"
              aria-label="Hesabım"
              className="scale-105 transition-transform duration-200 hover:text-primary-container p-2 rounded-full"
            >
              <Icon name="person" />
            </Link>
            <Link
              href="/sepet"
              aria-label="Sepetim"
              className="scale-105 transition-transform duration-200 hover:text-primary-container p-2 rounded-full"
            >
              <Icon name="shopping_cart" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
