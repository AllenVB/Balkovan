"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/components/cart/cart-provider";
import type { IconName } from "@/lib/icons";
import type { Product, ProductVariant } from "@/lib/products";

type AddToCartButtonProps = {
  product: Product;
  /** Verilmezse urunun ilk varyanti eklenir (urun kartlarindaki davranis). */
  variant?: ProductVariant;
  quantity?: number;
  className?: string;
  /** Ikon + metin mi, yalnizca ikon mu. Kart varyantlari ikon kullaniyor. */
  icon: IconName;
  label?: string;
};

/**
 * Sepete ekleme. Eklendikten sonra kisa sure onay gosterir; boylece sayfa
 * degismeden islemin gerceklestigi anlasilir.
 */
export function AddToCartButton({
  product,
  variant,
  quantity = 1,
  className,
  icon,
  label,
}: AddToCartButtonProps) {
  const { addProduct } = useCart();
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  // Onay gostergesi acikken bilesen sokulurse zamanlayici bosta kalmasin.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const selectedVariant = variant ?? product.variants[0];
  if (!selectedVariant) return null;

  const handleClick = () => {
    addProduct(product, selectedVariant, quantity);
    setAdded(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label ? undefined : `${product.name} ürününü sepete ekle`}
      className={className}
    >
      <Icon name={added ? "check" : icon} />
      {label ? <span>{added ? "Sepete Eklendi" : label}</span> : null}
      <span aria-live="polite" className="sr-only">
        {added ? `${product.name} sepete eklendi` : ""}
      </span>
    </button>
  );
}
