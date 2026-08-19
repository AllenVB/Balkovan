import { clsx } from "clsx";
import type { IconName } from "@/lib/icons";

type IconProps = {
  /** Material Symbols ligature adi. Yeni ikon icin once lib/icons.ts listesine ekle. */
  name: IconName;
  className?: string;
  /** Dolu (filled) varyant. Tasarimda yildiz/konum ikonlarinda kullaniliyor. */
  filled?: boolean;
  /** Piksel cinsinden ikon boyutu. Verilmezse miras alinan font boyutu kullanilir. */
  size?: number;
  weight?: number;
};

/**
 * Material Symbols Outlined sarmalayicisi.
 * Ikon fontu layout.tsx icinde stylesheet olarak yukleniyor.
 * Ikonlar dekoratif oldugu icin varsayilan olarak ekran okuyuculardan gizlenir.
 */
export function Icon({ name, className, filled, size, weight }: IconProps) {
  const variationSettings = [
    `'FILL' ${filled ? 1 : 0}`,
    weight ? `'wght' ${weight}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <span
      aria-hidden="true"
      className={clsx("material-symbols-outlined select-none", className)}
      style={{
        fontVariationSettings: variationSettings,
        ...(size ? { fontSize: `${size}px` } : {}),
      }}
    >
      {name}
    </span>
  );
}
