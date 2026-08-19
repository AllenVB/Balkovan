import Link from "next/link";
import { Icon } from "@/components/ui/icon";

/** Sepet bosken odeme akisina girilirse gosterilir. */
export function EmptyCartNotice() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-stack-lg text-center flex flex-col items-center gap-stack-md">
      <Icon name="shopping_basket" size={64} className="text-outline-variant" />
      <h1 className="font-headline-md text-headline-md text-primary">
        Sepetiniz boş
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
        Ödeme adımına geçebilmek için sepetinizde ürün olması gerekiyor.
      </p>
      <Link
        href="/urunler"
        className="bg-amber-deep text-on-primary font-label-md text-label-md font-bold px-8 py-4 rounded-full hover:bg-primary-container transition-colors warm-shadow"
      >
        Ürünleri Keşfet
      </Link>
    </div>
  );
}
