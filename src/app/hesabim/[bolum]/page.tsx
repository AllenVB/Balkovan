import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { allAccountSections, getAccountSection } from "@/lib/account";

export function generateStaticParams() {
  return allAccountSections.map((section) => ({ bolum: section.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/hesabim/[bolum]">): Promise<Metadata> {
  const { bolum } = await params;
  const section = getAccountSection(bolum);
  if (!section) return { title: "Sayfa bulunamadı" };

  return { title: section.label };
}

/**
 * Hesap alt bolumleri icin ortak sayfa.
 *
 * Bu bolumlerin (siparislerim, profil, adreslerim ...) tasarimi henuz gelmedi.
 * Menudeki baglantilarin 404'e dusmemesi icin durumu acikca soyleyen bir ekran
 * gosteriliyor; tasarim geldikce her bolum kendi sayfasina tasinacak.
 */
export default async function AccountSectionPage({
  params,
}: PageProps<"/hesabim/[bolum]">) {
  const { bolum } = await params;
  const section = getAccountSection(bolum);
  if (!section) notFound();

  return (
    <section className="bg-surface-container-low rounded-xl p-6 md:p-10 warm-shadow border border-outline-variant/30 flex flex-col items-center text-center gap-stack-sm py-stack-lg">
      <span className="w-16 h-16 rounded-full bg-surface-container-highest text-primary flex items-center justify-center">
        <Icon name={section.icon} size={32} />
      </span>
      <h1 className="font-headline-md text-headline-md text-primary">
        {section.label}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
        Bu bölüm hazırlanıyor. Çok yakında burada olacak.
      </p>
      <Link
        href="/hesabim"
        className="mt-2 inline-flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md font-bold px-6 py-3 rounded-lg hover:bg-primary-container transition-colors"
      >
        <Icon name="arrow_back" className="text-sm" />
        Hesabıma Dön
      </Link>
    </section>
  );
}
