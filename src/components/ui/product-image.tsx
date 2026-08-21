"use client";

import Image from "next/image";
import { useState } from "react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/icon";

/**
 * Urun gorseli.
 *
 * NEDEN VAR: Gorseller Stitch'in gecici CDN adreslerinden geliyor ve bu
 * adresler sureyle olebiliyor (403). Gorsel yuklenemezse sayfa kirik ikonla
 * kalmasin diye tasarim diline uygun bir yer tutucuya dusuyoruz.
 *
 * Gercek urun fotograflari public/images altina alindiginda bu bilesen
 * calismaya devam eder; yer tutucu yalnizca gercekten yuklenemeyen
 * gorsellerde devreye girer.
 */
type ProductImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Yer tutucudaki ikonun boyutu; kucuk kutularda kucultulur. */
  placeholderIconSize?: number;
};

export function ProductImage({
  src,
  alt,
  fill = true,
  sizes,
  className,
  priority,
  placeholderIconSize = 32,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <span
        className={clsx(
          "absolute inset-0 flex items-center justify-center bg-surface-container-high text-primary/40",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <Icon name="hive" size={placeholderIconSize} />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
