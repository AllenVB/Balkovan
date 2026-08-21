import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: true },
};

/** Var olmayan adreslerde gosterilir; kullaniciyi bos birakmadan yonlendirir. */
export default function NotFound() {
  return (
    <Container as="section" className="py-stack-lg">
      <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-stack-sm py-stack-lg">
        <span className="w-20 h-20 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
          <Icon name="hive" size={44} />
        </span>

        <p className="font-display-lg text-display-lg text-primary">404</p>
        <h1 className="font-headline-md text-headline-md text-on-background">
          Aradığınız sayfa bulunamadı
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Bağlantı eskimiş olabilir ya da sayfa taşınmış olabilir. Aşağıdan
          devam edebilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto">
          <Link
            href="/urunler"
            className="flex items-center justify-center gap-2 bg-amber-deep text-on-primary font-label-md text-label-md font-bold px-8 py-4 rounded-full hover:bg-primary-container transition-colors warm-shadow"
          >
            <Icon name="storefront" />
            Ürünleri Keşfet
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-surface-container-high text-on-background font-label-md text-label-md font-bold px-8 py-4 rounded-full hover:bg-surface-variant transition-colors"
          >
            <Icon name="arrow_back" />
            Anasayfa
          </Link>
        </div>
      </div>
    </Container>
  );
}
