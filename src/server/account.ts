import "server-only";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import type { Account, Order, OrderStatus } from "@/lib/account";
import { pointsToKurus } from "@/lib/loyalty";
import { stitchImages } from "@/lib/images";

/**
 * Hesap verisi.
 *
 * Oturum varsa gercek kullanici ve siparisleri okunur. Oturum yoksa null
 * doner; sayfa ziyaretciyi girise yonlendirir.
 */

const statusMap: Record<string, OrderStatus> = {
  BEKLEMEDE: "hazirlaniyor",
  HAZIRLANIYOR: "hazirlaniyor",
  KARGODA: "kargoda",
  TESLIM_EDILDI: "teslim-edildi",
  IPTAL: "teslim-edildi",
};

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getAccount(): Promise<Account | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { items: true },
      },
    },
  });
  if (!user) return null;

  const latest = user.orders[0];
  const firstName = user.firstName ?? "";

  return {
    firstName,
    // Tasarimdaki hitap bicimi: "Ahmet Bey". Cinsiyet bilgisi tutulmadigi
    // icin unvan eklenmiyor; yalnizca ad kullaniliyor.
    salutation: firstName || (user.email.split("@")[0] ?? "Değerli müşterimiz"),
    memberTitle: "Dürüst Üretici Üyesi",
    heroImage: stitchImages.hesabim.hero,
    loyaltyPoints: user.loyaltyPoints,
    loyaltyTier:
      user.loyaltyPoints >= 1000
        ? "altin"
        : user.loyaltyPoints >= 300
          ? "gumus"
          : "standart",
    loyaltyDiscountInKurus: pointsToKurus(user.loyaltyPoints),
    latestOrder: latest
      ? {
          orderNumber: latest.orderNumber,
          title:
            latest.items.length === 1
              ? (latest.items[0]?.name ?? "Sipariş")
              : `${latest.items[0]?.name ?? "Sipariş"} ve ${latest.items.length - 1} ürün daha`,
          itemCount: latest.items.reduce((sum, item) => sum + item.quantity, 0),
          totalInKurus: latest.totalInKurus,
          status: statusMap[latest.status] ?? "hazirlaniyor",
          orderedAt: latest.createdAt.toISOString().slice(0, 10),
        }
      : null,
  };
}

export type OrderSummary = Order & {
  items: { name: string; variantLabel: string; quantity: number; image: string }[];
  totalInKurus: number;
  earnedPoints: number;
  deliveryEstimate: string;
};

export async function getOrders(): Promise<OrderSummary[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const rows = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return rows.map((row) => ({
    orderNumber: row.orderNumber,
    title:
      row.items.length === 1
        ? (row.items[0]?.name ?? "Sipariş")
        : `${row.items[0]?.name ?? "Sipariş"} ve ${row.items.length - 1} ürün daha`,
    itemCount: row.items.reduce((sum, item) => sum + item.quantity, 0),
    totalInKurus: row.totalInKurus,
    status: statusMap[row.status] ?? "hazirlaniyor",
    orderedAt: row.createdAt.toISOString().slice(0, 10),
    earnedPoints: row.earnedPoints,
    deliveryEstimate: row.deliveryEstimate,
    items: row.items.map((item) => ({
      name: item.name,
      variantLabel: item.variantLabel,
      quantity: item.quantity,
      image: item.image,
    })),
  }));
}
