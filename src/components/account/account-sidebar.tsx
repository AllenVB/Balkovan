"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/icon";
import { accountSections } from "@/lib/account";

/**
 * Hesap ekranlarinin yan menusu (tasarimdaki SideNavBar).
 * Aktif bolumu isaretlemek icin pathname okundugundan client bileseni.
 */
export function AccountSidebar({ memberTitle }: { memberTitle: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobilde yan menu gizlendigi icin bolumler arasi gecis kalmiyordu;
          telefonda yatay kaydirilan bir serit olarak gosteriliyor. */}
      <nav
        aria-label="Hesap bölümleri"
        className="md:hidden -mx-margin-mobile px-margin-mobile overflow-x-auto"
      >
        <ul className="flex gap-2 w-max pb-1">
          {accountSections.map((section) => {
            const isActive = pathname === section.href;
            return (
              <li key={section.href}>
                <Link
                  href={section.href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-label-md text-label-md transition-colors",
                    isActive
                      ? "bg-primary-container text-on-primary-container font-bold"
                      : "bg-surface-container-high text-on-surface-variant border border-outline-variant",
                  )}
                >
                  <Icon name={section.icon} filled={isActive} />
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <aside className="hidden md:flex w-64 flex-col p-6 space-y-4 bg-surface-container-low rounded-xl warm-shadow self-start sticky top-28">
        <div className="mb-8">
        <p className="font-display-lg-mobile text-display-lg-mobile text-primary mb-1">
          Hesabım
        </p>
        <p className="font-label-md text-label-md text-on-surface-variant">
          {memberTitle}
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {accountSections.map((section) => {
          const isActive = pathname === section.href;
          return (
            <Link
              key={section.href}
              href={section.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-variant",
              )}
            >
              <Icon name={section.icon} filled={isActive} />
              <span className="font-label-md text-label-md">{section.label}</span>
            </Link>
          );
        })}
        </nav>
      </aside>
    </>
  );
}
