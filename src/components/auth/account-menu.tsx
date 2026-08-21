"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { logoutAction } from "@/server/auth-actions";

/**
 * Basliktaki hesap baglantisi.
 * Oturum acikken hesaba goturur ve cikis dugmesi gosterir.
 */
export function AccountMenu({ isSignedIn }: { isSignedIn: boolean }) {
  if (!isSignedIn) {
    return (
      <Link
        href="/giris"
        aria-label="Giriş yap"
        className="scale-105 transition-transform duration-200 hover:text-primary-container p-2 rounded-full"
      >
        <Icon name="person" />
      </Link>
    );
  }

  return (
    <span className="flex items-center">
      <Link
        href="/hesabim"
        aria-label="Hesabım"
        className="scale-105 transition-transform duration-200 hover:text-primary-container p-2 rounded-full"
      >
        <Icon name="person" filled />
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          aria-label="Çıkış yap"
          className="scale-105 transition-transform duration-200 hover:text-primary-container p-2 rounded-full"
        >
          <Icon name="logout" />
        </button>
      </form>
    </span>
  );
}
