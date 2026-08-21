"use client";

import { ProductImage } from "@/components/ui/product-image";
import { useState } from "react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/icon";

type ProductGalleryProps = {
  productName: string;
  mainImage: string;
  gallery: string[];
  /** Gorsel uzerindeki "Organik" rozeti; tasarimda yalnizca dolu oldugunda var. */
  badge?: string;
};

/** Urun detayindaki gorsel alani: buyuk gorsel + altinda kucuk resim seridi. */
export function ProductGallery({
  productName,
  mainImage,
  gallery,
  badge,
}: ProductGalleryProps) {
  // Tasarimda ilk kucuk resim ana gorselin kendisi; ayni adres iki kez
  // gecince hem tekrar eden bir kare hem de React key catismasi olusuyor.
  const images = [...new Set([mainImage, ...gallery])];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? mainImage;

  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden bg-surface-container relative warm-shadow group">
        <ProductImage
          src={activeImage}
          alt={productName}
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          placeholderIconSize={72}
        />
        {badge ? (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-surface/90 backdrop-blur-sm text-primary font-label-md text-label-md px-3 py-1 rounded-full border border-outline-variant flex items-center gap-1 shadow-sm">
              <Icon name="verified" filled className="text-sm text-primary-container" />
              {badge}
            </span>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${index}-${image}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${productName} görsel ${index + 1}`}
                aria-pressed={isActive}
                className={clsx(
                  "aspect-square rounded-lg overflow-hidden relative transition-opacity cursor-pointer",
                  isActive
                    ? "border-2 border-primary opacity-100"
                    : "border border-outline-variant opacity-70 hover:opacity-100",
                )}
              >
                <ProductImage
                  src={image}
                  alt=""
                  sizes="15vw"
                  className="object-cover"
                  placeholderIconSize={24}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
