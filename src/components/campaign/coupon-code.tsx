"use client";

import { useState } from "react";

/** Kampanya kartindaki kod kutusu; koda tiklayinca panoya kopyalar. */
export function CouponCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Pano izni yoksa sessizce gec; kod zaten ekranda okunabilir durumda.
    }
  };

  return (
    <div className="mt-auto bg-surface-container rounded-lg p-4 flex justify-between items-center border border-outline-variant border-dashed">
      <span className="font-label-md text-label-md font-bold tracking-widest text-on-background uppercase">
        {code}
      </span>
      <button
        type="button"
        onClick={copy}
        className="bg-primary text-on-primary hover:bg-surface-tint px-4 py-2 rounded-lg font-label-md text-label-md transition-colors font-bold"
      >
        {copied ? "Kopyalandı" : "Kopyala"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? `${code} kodu panoya kopyalandı` : ""}
      </span>
    </div>
  );
}
