"use client";

import Link from "next/link";
import { useSyncExternalStore, useCallback } from "react";
import { Icon } from "@/components/ui/icon";

/**
 * Cerez bilgilendirme seridi.
 *
 * Site su an yalnizca calismasi icin zorunlu depolama kullaniyor (sepet,
 * adres, kupon - hepsi kendi tarayicinizda). Olcumleme veya reklam cerezi
 * eklenirse bu serit "kabul et / reddet" secimi sunan gercek bir riza
 * mekanizmasina donusmeli; su haliyle bilgilendirme niteligindedir.
 */
const STORAGE_KEY = "balkovan.cookieNotice.v1";

const listeners = new Set<() => void>();

function getSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Depolama kapaliysa serit her acilista gosterilir.
    return false;
  }
}

const getServerSnapshot = () => true;

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function dismiss(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Yazamazsak da seridi kapat; oturum boyunca kapali kalir.
  }
  for (const listener of listeners) listener();
}

export function CookieNotice() {
  // Sunucu ciktisinda gizli: hydration'dan once yanip sonmesin.
  const isDismissed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const onDismiss = useCallback(() => dismiss(), []);

  if (isDismissed) return null;

  return (
    <div
      role="region"
      aria-label="Çerez bilgilendirmesi"
      className="fixed bottom-0 left-0 right-0 z-50 p-margin-mobile md:p-4 pointer-events-none"
    >
      <div className="pointer-events-auto max-w-3xl mx-auto bg-surface-container-lowest border border-outline-variant rounded-xl warm-shadow p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 mb-20 md:mb-0">
        <Icon name="info" className="text-primary shrink-0" />
        <p className="flex-grow font-body-md text-sm text-on-surface-variant">
          Sepetiniz ve adres bilgileriniz gibi verileri sitenin çalışması için
          tarayıcınızda saklıyoruz.{" "}
          <Link
            href="/gizlilik-ve-cerez-politikasi"
            className="text-primary font-semibold hover:underline"
          >
            Ayrıntılar
          </Link>
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 bg-primary text-on-primary font-label-md text-label-md font-bold px-6 py-3 rounded-lg hover:bg-primary-container transition-colors"
        >
          Anladım
        </button>
      </div>
    </div>
  );
}
