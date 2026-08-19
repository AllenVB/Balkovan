import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { formatDate, formatNumber, formatPriceCompact } from "@/lib/format";
import {
  demoAccount,
  loyaltyTierLabels,
  orderStatusLabels,
  quickActions,
} from "@/lib/account";

export const metadata: Metadata = {
  title: "Hesabım",
  description: "Bal puanlarınız, son siparişiniz ve hesap işlemleriniz.",
};

export default function AccountPage() {
  const account = demoAccount;
  const order = account.latestOrder;

  return (
    <>
      {/* Karsilama */}
      <section className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden warm-shadow flex items-end">
        <Image
          src={account.heroImage}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 70vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 to-transparent" />
        <div className="relative z-10 p-6 md:p-8 w-full">
          <h1 className="font-headline-md text-headline-md text-surface-container-lowest mb-2">
            Hoş Geldiniz, {account.salutation}
          </h1>
          <p className="font-body-md text-body-md text-surface-container-lowest/90">
            Doğanın en saf haliyle buluştuğunuz için teşekkür ederiz.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Bal puanlari */}
        <section className="bg-surface-container-low rounded-xl p-6 warm-shadow border border-outline-variant/30 hover:scale-[1.01] transition-transform duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 text-primary">
              <Icon name="stars" filled className="text-3xl" />
              <h2 className="font-headline-sm text-headline-sm">Bal Puanlarım</h2>
            </div>
            <span className="bg-primary-container text-on-primary-container font-label-md text-label-md px-3 py-1 rounded-full">
              {loyaltyTierLabels[account.loyaltyTier]}
            </span>
          </div>

          <div className="flex flex-col mb-6">
            <span className="font-display-lg text-display-lg text-on-background">
              {formatNumber(account.loyaltyPoints)}{" "}
              <span className="font-body-lg text-body-lg text-on-surface-variant">
                Puan
              </span>
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Bir sonraki siparişinizde{" "}
              <span className="font-price-display text-price-display text-primary">
                {formatPriceCompact(account.loyaltyDiscountInKurus)}
              </span>{" "}
              indirim kazandınız.
            </p>
          </div>

          <Link
            href="/hesabim/bal-puanlarim"
            className="block w-full text-center bg-primary-container text-on-primary-container font-label-md text-label-md py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors duration-200"
          >
            Puanları Kullan
          </Link>
        </section>

        {/* Son siparis */}
        <section className="bg-surface-container-low rounded-xl p-6 warm-shadow border border-outline-variant/30 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
          {order ? (
            <>
              <div>
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="flex items-center gap-3 text-secondary">
                    <Icon name="local_shipping" className="text-3xl" />
                    <h2 className="font-headline-sm text-headline-sm">
                      Son Siparişim
                    </h2>
                  </div>
                  <span className="text-on-surface-variant font-label-md text-label-md bg-surface-variant px-3 py-1 rounded-full whitespace-nowrap">
                    Sipariş No: #{order.orderNumber}
                  </span>
                </div>

                <div className="flex items-center gap-4 py-4 border-b border-outline-variant/30">
                  <div className="w-16 h-16 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                    <Icon name="hive" className="text-primary text-3xl" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-label-md text-label-md text-on-background">
                      {order.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {order.itemCount} Adet Ürün
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-price-display text-price-display text-on-background">
                      {formatPriceCompact(order.totalInKurus)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${orderStatusLabels[order.status].dotClass}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`font-label-md text-label-md ${orderStatusLabels[order.status].textClass}`}
                    >
                      {orderStatusLabels[order.status].label}
                    </span>
                  </div>
                  <span className="font-body-md text-on-surface-variant text-sm">
                    {formatDate(order.orderedAt)}
                  </span>
                </div>
              </div>

              <Link
                href="/hesabim/siparislerim"
                className="block w-full text-center mt-6 bg-surface-container-highest text-on-background font-label-md text-label-md py-3 rounded-lg border border-outline-variant/50 hover:bg-surface-variant transition-colors duration-200"
              >
                Tekrar Sipariş Ver
              </Link>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
              <Icon name="local_shipping" size={48} className="text-outline-variant" />
              <p className="font-body-md text-body-md text-on-surface-variant">
                Henüz bir siparişiniz yok.
              </p>
              <Link
                href="/urunler"
                className="font-label-md text-label-md text-primary font-bold hover:text-amber-deep"
              >
                Ürünleri Keşfet
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Hizli islemler */}
      <section className="bg-surface-container-low rounded-xl p-6 warm-shadow border border-outline-variant/30 mt-4">
        <h2 className="font-headline-sm text-headline-sm text-on-background mb-4">
          Hızlı İşlemler
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const className =
              "flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-surface-bright hover:bg-surface-variant border border-outline-variant/30 transition-colors duration-200 text-on-surface-variant hover:text-primary group";
            const content = (
              <>
                <Icon
                  name={action.icon}
                  className="text-2xl group-hover:scale-110 transition-transform"
                />
                <span className="font-label-md text-label-md text-center">
                  {action.label}
                </span>
              </>
            );

            // WhatsApp site disina cikar; yeni sekmede acilir.
            return action.external ? (
              <a
                key={action.slug}
                href={action.href}
                target="_blank"
                rel="noreferrer noopener"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link key={action.slug} href={action.href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
