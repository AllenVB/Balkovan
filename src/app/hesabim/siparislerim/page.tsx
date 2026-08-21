import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { ProductImage } from "@/components/ui/product-image";
import { getOrders } from "@/server/account";
import { orderStatusLabels } from "@/lib/account";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sipariş Geçmişi",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const orders = await getOrders();

  if (orders.length === 0) {
    return (
      <section className="bg-surface-container-low rounded-xl p-6 md:p-10 warm-shadow border border-outline-variant/30 flex flex-col items-center text-center gap-stack-sm py-stack-lg">
        <span className="w-16 h-16 rounded-full bg-surface-container-highest text-primary flex items-center justify-center">
          <Icon name="history" size={32} />
        </span>
        <h1 className="font-headline-md text-headline-md text-primary">
          Henüz siparişiniz yok
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
          İlk siparişinizi verdiğinizde burada görünecek.
        </p>
        <Link
          href="/urunler"
          className="mt-2 inline-flex items-center gap-2 bg-amber-deep text-on-primary font-label-md text-label-md font-bold px-6 py-3 rounded-lg hover:bg-primary-container transition-colors"
        >
          <Icon name="storefront" />
          Ürünleri Keşfet
        </Link>
      </section>
    );
  }

  return (
    <>
      <h1 className="font-headline-md text-headline-md text-primary">
        Sipariş Geçmişi
      </h1>

      <ul className="flex flex-col gap-stack-md">
        {orders.map((order) => {
          const status = orderStatusLabels[order.status];
          return (
            <li
              key={order.orderNumber}
              className="bg-surface-container-low rounded-xl p-6 warm-shadow border border-outline-variant/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-4 border-b border-outline-variant/30">
                <div>
                  <p className="font-label-md text-label-md font-bold text-on-background">
                    #{order.orderNumber}
                  </p>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {formatDate(order.orderedAt)} · {order.itemCount} ürün
                  </p>
                </div>
                <span className="self-start flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${status.dotClass}`}
                    aria-hidden="true"
                  />
                  <span className={`font-label-md text-label-md ${status.textClass}`}>
                    {status.label}
                  </span>
                </span>
              </div>

              <ul className="flex flex-col gap-3 py-4">
                {order.items.map((item) => (
                  <li
                    key={`${order.orderNumber}-${item.name}-${item.variantLabel}`}
                    className="flex items-center gap-3"
                  >
                    <span className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden shrink-0 relative">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        sizes="48px"
                        className="object-cover"
                        placeholderIconSize={20}
                      />
                    </span>
                    <span className="flex-grow min-w-0">
                      <span className="block font-label-md text-label-md text-on-background truncate">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="block font-body-md text-xs text-ink-muted truncate">
                        {item.variantLabel}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-outline-variant/30">
                <span className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
                  <Icon name="local_shipping" className="text-sm" />
                  Tahmini teslimat: {order.deliveryEstimate}
                </span>
                <span className="flex items-center gap-3">
                  {order.earnedPoints > 0 ? (
                    <span className="flex items-center gap-1 font-label-md text-label-md text-primary">
                      <Icon name="stars" filled className="text-sm" />
                      {formatNumber(order.earnedPoints)}
                    </span>
                  ) : null}
                  <span className="font-price-display text-price-display text-amber-deep font-semibold">
                    {formatPrice(order.totalInKurus)}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
