"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/components/cart/cart-provider";
import { mainNavLinks } from "@/lib/navigation";

/**
 * Tasarimdaki TopNavBar. Her sayfada ayni; ustunde ince duyuru seridi var.
 *
 * Tasarimda mobil icin bir menu cozumu yoktu: ana menu md altinda gizleniyor,
 * yerine bir sey gelmiyordu. Mobil alt menude yalnizca Magaza/Sepetim/Hesabim
 * oldugu icin Kampanyalar, Hakkimizda ve Iletisim'e telefondan hic
 * ulasilamiyordu. Bu yuzden acilir bir mobil menu eklendi.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Menu acikken arka plan kaymasin ve Escape ile kapansin.
  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className="bg-primary text-on-primary text-center py-2 text-label-md font-label-md">
        1.500 ₺ üzeri kargo bedava
      </div>

      <header className="bg-background/90 backdrop-blur-md warm-shadow sticky top-0 z-40">
        <div className="flex justify-between items-center w-full px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto h-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Menüyü aç"
              aria-expanded={isMenuOpen}
              aria-controls="mobil-menu"
              className="md:hidden p-2 -ml-2 rounded-full text-primary hover:bg-surface-container transition-colors"
            >
              <Icon name="menu" />
            </button>

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
          </div>

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
            <CartLink />
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

/** Sepet baglantisi; icindeki urun adedini rozet olarak gosterir. */
function CartLink() {
  const { totals, isReady } = useCart();
  const count = totals.itemCount;

  return (
    <Link
      href="/sepet"
      aria-label={
        isReady && count > 0 ? `Sepetim, ${count} ürün` : "Sepetim"
      }
      className="relative scale-105 transition-transform duration-200 hover:text-primary-container p-2 rounded-full"
    >
      <Icon name="shopping_cart" />
      {isReady && count > 0 ? (
        <span className="absolute top-0 right-0 min-w-5 h-5 px-1 rounded-full bg-amber-deep text-on-primary text-[11px] font-bold flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}

function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        "md:hidden fixed inset-0 z-50 transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Menüyü kapat"
        tabIndex={isOpen ? 0 : -1}
        className="absolute inset-0 bg-on-background/50 backdrop-blur-sm w-full"
      />

      <div
        id="mobil-menu"
        className={clsx(
          "absolute inset-y-0 left-0 w-72 max-w-[85%] bg-background shadow-[4px_0_30px_rgba(70,25,3,0.12)] flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-20 px-margin-mobile border-b border-honey-100">
          <span className="font-headline-sm text-headline-sm font-bold text-primary">
            Balkovan
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            tabIndex={isOpen ? 0 : -1}
            className="p-2 -mr-2 rounded-full text-primary hover:bg-surface-container transition-colors"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="flex flex-col p-margin-mobile gap-1 overflow-y-auto">
          {mainNavLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                tabIndex={isOpen ? 0 : -1}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "px-4 py-3 rounded-lg font-label-md text-label-md transition-colors",
                  isActive
                    ? "bg-secondary-container text-on-secondary-container font-bold"
                    : "text-on-surface-variant hover:bg-surface-container",
                )}
              >
                {link.label}
              </Link>
            );
          })}

          <span className="border-t border-honey-100 my-2" />

          <Link
            href="/hesabim"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
            className="px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-3"
          >
            <Icon name="person" />
            Hesabım
          </Link>
          <Link
            href="/sepet"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
            className="px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-3"
          >
            <Icon name="shopping_cart" />
            Sepetim
          </Link>
        </nav>
      </div>
    </div>
  );
}
