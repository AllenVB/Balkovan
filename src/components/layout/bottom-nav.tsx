"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/icon";
import { bottomNavLinks } from "@/lib/navigation";

/** Tasarimdaki BottomNavBar; yalnizca mobilde gorunur, aktif sekmeyi vurgular. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-surface-container shadow-[0_-4px_20px_rgba(70,25,3,0.06)] rounded-t-2xl border-t border-honey-100">
      {bottomNavLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              "flex flex-col items-center justify-center rounded-xl px-4 py-1 scale-95 active:scale-90 transition-transform",
              isActive
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container-high",
            )}
          >
            <Icon name={link.icon} />
            <span className="font-label-md text-label-md mt-1">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
