import Image from "next/image";
import type { IconName } from "@/lib/icons";
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { CouponCode } from "@/components/campaign/coupon-code";
import { getProductBySlug } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Kampanyalar",
  description:
    "Hoş geldin indirimi, ücretsiz kargo ve hediye seti fırsatları. Balkovan'ın güncel kampanyaları.",
};

const campaigns: {
  icon: IconName;
  iconBg: string;
  decorationHover: string;
  title: string;
  description: string;
  code: string | null;
  note?: string;
}[] = [
  {
    icon: "redeem",
    iconBg: "bg-primary-container text-on-primary-container",
    decorationHover: "group-hover:rotate-45",
    title: "Hoş Geldin İndirimi",
    description:
      "İlk siparişinize özel %15 indirim fırsatı. Balkovan ailesine hoş geldiniz.",
    code: "MERHABA15",
  },
  {
    icon: "local_shipping",
    iconBg: "bg-secondary-container text-on-secondary-container",
    decorationHover: "group-hover:-translate-x-4",
    title: "Ücretsiz Kargo",
    description:
      "1500 TL ve üzeri tüm alışverişlerinizde kargo bizden. Sepetinizi hemen doldurun.",
    code: null,
    note: "Otomatik Uygulanır",
  },
  {
    icon: "inventory_2",
    iconBg: "bg-tertiary-container text-on-tertiary-container",
    decorationHover: "group-hover:scale-110",
    title: "3 Al 2 Öde",
    description:
      "Sevdiklerinize tatlı bir sürpriz yapın. Seçili hediye setlerinde sepette anında indirim.",
    code: "HEDIYE3",
  },
];

const teaserSlugs = ["cam-bali", "ham-cicek-bali", "premium-hediye-seti"];

export const revalidate = 300;

export default async function CampaignsPage() {
  const teasers = (
    await Promise.all(teaserSlugs.map((slug) => getProductBySlug(slug)))
  ).filter((product) => product !== null);

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max mx-auto w-full">
      <div className="text-center mb-stack-lg">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-stack-md">
          Kampanyalarımız
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Doğal lezzetlere daha kolay ulaşmanız için hazırladığımız özel teklifler
          ve size özel fırsatlar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-stack-lg">
        {campaigns.map((campaign) => (
          <section
            key={campaign.title}
            className="bg-surface-container-low rounded-xl p-8 border border-outline-variant shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] flex flex-col group relative overflow-hidden min-h-[400px] h-full"
          >
            <div
              className={`absolute -right-8 -top-8 opacity-5 text-primary rotate-12 transition-transform duration-700 ${campaign.decorationHover}`}
            >
              <Icon name={campaign.icon} size={140} />
            </div>

            <div className="mb-6 relative z-10">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm ${campaign.iconBg}`}
              >
                <Icon name={campaign.icon} className="text-3xl" />
              </div>
              <h2 className="font-headline-sm text-headline-sm text-primary mb-2">
                {campaign.title}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {campaign.description}
              </p>
            </div>

            {campaign.code ? (
              <CouponCode code={campaign.code} />
            ) : (
              <div className="mt-auto">
                <div className="bg-surface-container-high rounded-lg p-4 text-center font-label-md text-label-md text-on-surface-variant border border-outline-variant border-dashed font-bold">
                  {campaign.note}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Indirimleri degerlendirin */}
      <div className="mt-stack-lg text-center py-8">
        <h2 className="font-headline-sm text-headline-sm text-primary mb-stack-md">
          İndirimleri Değerlendirin
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter max-w-4xl mx-auto mb-stack-lg">
          {teasers.map((product) => (
            <Link
              key={product.slug}
              href={`/urunler/${product.slug}`}
              className="group"
            >
              <div className="aspect-square rounded-2xl mb-3 shadow-sm group-hover:shadow-md transition-all duration-300 w-full overflow-hidden relative">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                {product.name}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/urunler"
          className="inline-block bg-primary text-on-primary font-label-md text-label-md px-10 py-4 rounded-full hover:bg-surface-tint transition-all shadow-md hover:shadow-lg font-bold active:scale-95"
        >
          Tüm Ürünleri Gör
        </Link>
      </div>
    </div>
  );
}
