"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/components/cart/cart-provider";

/**
 * Indirim kodu kutusu.
 *
 * DIKKAT: Kod dogrulamasi su an tarayicida yapiliyor (bkz. lib/promotions.ts).
 * Yani gecerli kodlar herkese acik ve "ilk siparise ozel" gibi kurallar
 * uygulanamiyor. Gercek dogrulama backend fazinda sunucuya tasinacak.
 */
export function CouponForm() {
  const { couponCode, applyCoupon, removeCoupon } = useCart();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Lütfen bir indirim kodu girin.");
      return;
    }
    if (!applyCoupon(trimmed)) {
      setError("Bu kod geçerli değil ya da süresi dolmuş.");
      return;
    }
    setError(null);
    setValue("");
  };

  if (couponCode) {
    return (
      <div className="bg-comb rounded-xl p-6 border border-honey-100 warm-shadow flex flex-col gap-3">
        <span className="font-label-md text-label-md text-on-background">
          İndirim Kodu / Hediye Çeki
        </span>
        <div className="flex items-center justify-between gap-2 bg-surface-container-high rounded-lg px-4 py-3">
          <span className="flex items-center gap-2 font-label-md text-label-md font-bold text-primary">
            <Icon name="check_circle" filled className="text-sm" />
            {couponCode}
          </span>
          <button
            type="button"
            onClick={removeCoupon}
            className="font-label-md text-label-md text-error font-semibold hover:underline"
          >
            Kaldır
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-comb rounded-xl p-6 border border-honey-100 warm-shadow flex flex-col gap-4"
      noValidate
    >
      <label
        className="font-label-md text-label-md text-on-background"
        htmlFor="coupon_code"
      >
        İndirim Kodu / Hediye Çeki
      </label>
      <div className="flex gap-2">
        <input
          id="coupon_code"
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          placeholder="Kod giriniz"
          autoComplete="off"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "coupon_error" : undefined}
          className="flex-grow min-w-0 border-2 border-honey-200 rounded-lg px-4 py-2 bg-background focus:border-honey-500 focus:ring-0 focus:outline-none font-body-md text-on-background uppercase"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-surface-variant text-on-surface-variant rounded-lg font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors border border-honey-200 whitespace-nowrap"
        >
          Uygula
        </button>
      </div>
      {error ? (
        <p
          id="coupon_error"
          role="alert"
          className="font-label-md text-label-md text-error"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
