"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";

/**
 * Odeme adimlarinin ortak cercevesi: sade ust bar, adim gostergesi ve
 * iki sutunlu yerlesim. Tasarimda site navigasyonu bu ekranlarda gizli
 * oldugu icin cikis yolu buradaki geri baglantisidir.
 */
export function CheckoutShell({
  step,
  backHref,
  backLabel,
  children,
  aside,
}: {
  step: 1 | 2;
  backHref: string;
  backLabel: string;
  children: ReactNode;
  aside: ReactNode;
}) {
  return (
    <div className="min-h-full bg-background">
      <header className="bg-surface-container-lowest border-b border-outline-variant/40 sticky top-0 z-30">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop h-20 flex items-center justify-between gap-4">
          <Link
            href={backHref}
            className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors shrink-0"
          >
            <Icon name="arrow_back" className="text-sm" />
            <span className="hidden sm:inline">{backLabel}</span>
          </Link>

          <Link
            href="/"
            className="font-headline-sm text-headline-sm font-bold text-primary"
          >
            Balkovan
          </Link>

          <span className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant shrink-0">
            <Icon name="lock" className="text-sm" />
            <span className="hidden sm:inline">Güvenli Ödeme</span>
          </span>
        </div>

        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-5">
          <CheckoutSteps current={step} />
        </div>
      </header>

      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-stack-md md:py-stack-lg grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
        <div className="lg:col-span-2">{children}</div>
        <div className="lg:col-span-1">{aside}</div>
      </div>
    </div>
  );
}
