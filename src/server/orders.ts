import "server-only";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { addressSchema, getShippingOption, buildDeliveryEstimate, createOrderNumber } from "@/lib/checkout";
import { calculateCartTotals, type CartLine } from "@/lib/cart";
import { calculateEarnedPoints, kurusToPoints } from "@/lib/loyalty";

/**
 * Siparis olusturma.
 *
 * ⚠️ EN ONEMLI KURAL: Tarayicidan gelen FIYATA GUVENILMEZ. Sepet
 * localStorage'da tutuldugu icin kullanici birim fiyati degistirebilir.
 * Burada yalnizca "hangi urun, hangi varyant, kac adet" bilgisi alinir;
 * fiyatlar veritabanindan okunur ve tum indirimler sunucuda YENIDEN
 * hesaplanir. Istemcinin hesapladigi tutar sadece karsilastirma icin kullanilir.
 */

/** Istemciden kabul edilen tek sey: urun/varyant kimligi ve adet. */
export const orderRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productSlug: z.string().min(1),
        variantWeightGrams: z.number().int().positive(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1, "Sepetiniz boş."),
  address: addressSchema,
  shippingOptionId: z.string().min(1),
  couponCode: z.string().nullish(),
  useLoyaltyPoints: z.boolean().default(false),
  /** Yalnizca dogrulama icin; eslesmezse siparis reddedilir. */
  expectedTotalInKurus: z.number().int().nonnegative().optional(),
});

export type OrderRequest = z.infer<typeof orderRequestSchema>;

export type OrderResult =
  | { ok: true; orderNumber: string; totalInKurus: number; earnedPoints: number; deliveryEstimate: string }
  | { ok: false; error: string; code: OrderErrorCode };

export type OrderErrorCode =
  | "URUN_BULUNAMADI"
  | "STOK_YETERSIZ"
  | "TUTAR_UYUSMUYOR"
  | "KUPON_GECERSIZ"
  | "BEKLENMEYEN_HATA";

export async function createOrder(
  request: OrderRequest,
  options: { userId?: string | null } = {},
): Promise<OrderResult> {
  const { items, address, shippingOptionId, couponCode, useLoyaltyPoints } =
    request;

  // 1) Urun ve varyantlari veritabanindan cek - fiyatin tek dogru kaynagi.
  const slugs = [...new Set(items.map((item) => item.productSlug))];
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, isActive: true },
    include: { variants: { where: { isActive: true } } },
  });

  const lines: CartLine[] = [];
  for (const item of items) {
    const product = products.find((p) => p.slug === item.productSlug);
    const variant = product?.variants.find(
      (v) => v.weightGrams === item.variantWeightGrams,
    );

    if (!product || !variant) {
      return {
        ok: false,
        code: "URUN_BULUNAMADI",
        error: `Ürün artık satışta değil: ${item.productSlug}`,
      };
    }

    if (variant.stock < item.quantity) {
      return {
        ok: false,
        code: "STOK_YETERSIZ",
        error: `${product.name} için yeterli stok yok (kalan: ${variant.stock}).`,
      };
    }

    lines.push({
      id: `${product.slug}--${variant.weightGrams}`,
      productSlug: product.slug,
      variantWeightGrams: variant.weightGrams,
      name: product.name,
      variantLabel: `${variant.label}, ${variant.weightGrams}g`,
      tag: product.badge ?? undefined,
      image: product.image,
      // FIYAT VERITABANINDAN - istemciden gelen deger yok sayilir.
      unitPriceInKurus: variant.priceInKurus,
      quantity: item.quantity,
      threeForTwo: product.threeForTwo,
    });
  }

  // 2) Kuponu dogrula (varsa).
  let validCouponCode: string | null = null;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.trim().toUpperCase() },
    });
    const now = new Date();
    const usable =
      coupon &&
      coupon.isActive &&
      (!coupon.startsAt || coupon.startsAt <= now) &&
      (!coupon.endsAt || coupon.endsAt >= now) &&
      (coupon.maxRedemptions === null ||
        coupon.redemptionCount < coupon.maxRedemptions);

    if (!usable) {
      return {
        ok: false,
        code: "KUPON_GECERSIZ",
        error: "İndirim kodu geçerli değil ya da süresi dolmuş.",
      };
    }

    // "Ilk siparise ozel" kuponlar yalnizca uye olan ve daha once siparis
    // vermemis musteriler icin gecerli.
    if (coupon.firstOrderOnly) {
      if (!options.userId) {
        return {
          ok: false,
          code: "KUPON_GECERSIZ",
          error: "Bu kod yalnızca üyelere özel. Giriş yapıp tekrar deneyin.",
        };
      }
      const previousOrders = await prisma.order.count({
        where: { userId: options.userId },
      });
      if (previousOrders > 0) {
        return {
          ok: false,
          code: "KUPON_GECERSIZ",
          error: "Bu kod yalnızca ilk siparişte kullanılabilir.",
        };
      }
    }

    validCouponCode = coupon.code;
  }

  // 3) Kullanicinin gercek puan bakiyesi - istemciden gelen degil.
  const user = options.userId
    ? await prisma.user.findUnique({ where: { id: options.userId } })
    : null;
  const availablePoints = user?.loyaltyPoints ?? 0;

  // 4) Tum tutarlari sunucuda yeniden hesapla.
  const totals = calculateCartTotals(lines, {
    couponCode: validCouponCode,
    loyaltyPoints: availablePoints,
    useLoyaltyPoints: useLoyaltyPoints && availablePoints > 0,
    shippingOptionId,
  });

  // 5) Istemcinin gosterdigi tutarla karsilastir. Uyusmuyorsa siparis alma:
  //    musteri ekranda gordugunden farkli bir tutar odememeli.
  if (
    request.expectedTotalInKurus !== undefined &&
    request.expectedTotalInKurus !== totals.totalInKurus
  ) {
    return {
      ok: false,
      code: "TUTAR_UYUSMUYOR",
      error:
        "Sepetinizdeki fiyatlar güncellendi. Lütfen sepeti kontrol edip tekrar deneyin.",
    };
  }

  const shipping = getShippingOption(shippingOptionId);
  const now = new Date();
  const pointsDiscount = totals.discounts.find((d) => d.id === "loyalty-points");
  const spentPoints = pointsDiscount
    ? kurusToPoints(pointsDiscount.amountInKurus)
    : 0;
  const earnedPoints = calculateEarnedPoints(totals.discountedSubtotalInKurus);

  // 6) Stok dusme, siparis kaydi ve puan guncellemesi tek islemde.
  //    Biri basarisiz olursa hicbiri uygulanmaz.
  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const line of lines) {
        // Kosullu guncelleme: araya baska bir siparis girip stogu tuketmisse
        // count 0 doner ve islem geri alinir.
        const updated = await tx.productVariant.updateMany({
          where: {
            product: { slug: line.productSlug },
            weightGrams: line.variantWeightGrams,
            stock: { gte: line.quantity },
          },
          data: { stock: { decrement: line.quantity } },
        });
        if (updated.count === 0) {
          throw new StockError(line.name);
        }
      }

      const created = await tx.order.create({
        data: {
          orderNumber: createOrderNumber(now),
          userId: options.userId ?? null,
          firstName: address.firstName,
          lastName: address.lastName,
          phone: address.phone,
          city: address.city,
          district: address.district,
          fullAddress: address.fullAddress,
          addressTitle: address.addressTitle || null,
          shippingOptionId: shipping.id,
          shippingName: shipping.name,
          shippingInKurus: totals.shippingInKurus,
          subtotalInKurus: totals.subtotalInKurus,
          discountTotalInKurus: totals.discountTotalInKurus,
          totalInKurus: totals.totalInKurus,
          earnedPoints,
          spentPoints,
          deliveryEstimate: buildDeliveryEstimate(shipping, now),
          couponCode: validCouponCode,
          items: {
            create: lines.map((line) => ({
              productSlug: line.productSlug,
              name: line.name,
              variantLabel: line.variantLabel,
              variantWeightGrams: line.variantWeightGrams,
              image: line.image,
              unitPriceInKurus: line.unitPriceInKurus,
              quantity: line.quantity,
              threeForTwo: line.threeForTwo ?? false,
            })),
          },
          discounts: {
            create: totals.discounts.map((discount) => ({
              code: discount.id,
              label: discount.label,
              amountInKurus: discount.amountInKurus,
            })),
          },
        },
      });

      if (validCouponCode) {
        await tx.coupon.update({
          where: { code: validCouponCode },
          data: { redemptionCount: { increment: 1 } },
        });
      }

      if (options.userId) {
        await tx.user.update({
          where: { id: options.userId },
          data: { loyaltyPoints: { increment: earnedPoints - spentPoints } },
        });
      }

      return created;
    });

    return {
      ok: true,
      orderNumber: order.orderNumber,
      totalInKurus: order.totalInKurus,
      earnedPoints: order.earnedPoints,
      deliveryEstimate: order.deliveryEstimate,
    };
  } catch (error) {
    if (error instanceof StockError) {
      return {
        ok: false,
        code: "STOK_YETERSIZ",
        error: `${error.productName} için yeterli stok kalmadı.`,
      };
    }
    console.error("Sipariş oluşturulamadı:", error);
    return {
      ok: false,
      code: "BEKLENMEYEN_HATA",
      error: "Sipariş oluşturulamadı. Lütfen tekrar deneyin.",
    };
  }
}

class StockError extends Error {
  constructor(public productName: string) {
    super(`Stok yetersiz: ${productName}`);
    this.name = "StockError";
  }
}
