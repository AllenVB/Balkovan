"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/components/cart/cart-provider";
import { useCheckout } from "@/components/checkout/use-checkout";
import { formatPrice } from "@/lib/format";
import {
  buildDeliveryEstimate,
  createOrderNumber,
  getShippingOption,
  type Address,
} from "@/lib/checkout";

/**
 * Kart formu.
 *
 * ÖNEMLİ - GERÇEK ÖDEMEYE GEÇERKEN: Bu form yalnizca tasarimin karsiligidir,
 * kart verisi hicbir yere gonderilmez ve saklanmaz. Gercek entegrasyonda kart
 * bilgisi KENDI sunucumuzdan GECMEMELI; iyzico'nun barindirdigi odeme formu
 * (Checkout Form / iframe) kullanilmali. Aksi halde PCI-DSS yukumlulugu bize
 * gecer. Buradaki alanlar o zaman iyzico bileseniyle degistirilecek.
 */
const paymentSchema = z.object({
  cardName: z.string().trim().min(5, "Kart üzerindeki adı yazın."),
  cardNumber: z
    .string()
    .refine((value) => value.replace(/\D/g, "").length === 16, {
      message: "Kart numarası 16 hane olmalı.",
    }),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Son kullanma tarihini AA/YY yazın."),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC 3 haneli olmalı."),
  use3dSecure: z.boolean(),
});

type PaymentValues = z.infer<typeof paymentSchema>;

const inputClassName =
  "w-full bg-surface-bright border-2 border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-0 focus:outline-none transition-colors";

export function PaymentForm({ address }: { address: Address }) {
  const router = useRouter();
  const { totals, clear } = useCart();
  const { shippingOptionId, setLastOrder } = useCheckout();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      use3dSecure: true,
    },
  });

  const onSubmit = () => {
    setIsSubmitting(true);

    // Siparis su an yalnizca tarayicida olusturuluyor. Backend geldiginde
    // burasi sunucuya istek atacak; sunucu fiyati ve indirimleri YENIDEN
    // hesaplamali, tarayicidan gelen tutara guvenilmemeli.
    const now = new Date();
    const shipping = getShippingOption(shippingOptionId);

    setLastOrder({
      orderNumber: createOrderNumber(now),
      createdAt: now.toISOString().slice(0, 10),
      address,
      shippingOptionId: shipping.id,
      totalInKurus: totals.totalInKurus,
      earnedPoints: totals.earnedPoints,
      deliveryEstimate: buildDeliveryEstimate(shipping, now),
    });

    clear();
    router.push("/odeme/onay");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-stack-md"
      noValidate
    >
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 warm-shadow p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-sm text-headline-sm text-primary">
            Güvenli Ödeme
          </h2>
          <Icon name="lock" className="text-on-surface-variant" />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="cardName"
              className="block font-label-md text-label-md text-on-surface-variant mb-2"
            >
              Kart Üzerindeki İsim
            </label>
            <input
              id="cardName"
              type="text"
              placeholder="Ad Soyad"
              autoComplete="off"
              className={inputClassName}
              aria-invalid={errors.cardName ? "true" : undefined}
              {...register("cardName")}
            />
            <FieldError message={errors.cardName?.message} />
          </div>

          <div>
            <label
              htmlFor="cardNumber"
              className="block font-label-md text-label-md text-on-surface-variant mb-2"
            >
              Kart Numarası
            </label>
            <div className="relative">
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                maxLength={19}
                placeholder="0000 0000 0000 0000"
                autoComplete="off"
                className={`${inputClassName} pr-12`}
                aria-invalid={errors.cardNumber ? "true" : undefined}
                {...register("cardNumber", {
                  onChange: (event) => {
                    // Dortlu gruplar halinde okunakli hale getir.
                    const digits = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16);
                    const grouped = digits.replace(/(.{4})/g, "$1 ").trim();
                    setValue("cardNumber", grouped, { shouldValidate: false });
                  },
                })}
              />
              <Icon
                name="credit_card"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
            </div>
            <FieldError message={errors.cardNumber?.message} />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="expiry"
                className="block font-label-md text-label-md text-on-surface-variant mb-2"
              >
                Son Kullanma Tarihi
              </label>
              <input
                id="expiry"
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="AA/YY"
                autoComplete="off"
                className={inputClassName}
                aria-invalid={errors.expiry ? "true" : undefined}
                {...register("expiry", {
                  onChange: (event) => {
                    const digits = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4);
                    const masked =
                      digits.length > 2
                        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                        : digits;
                    setValue("expiry", masked, { shouldValidate: false });
                  },
                })}
              />
              <FieldError message={errors.expiry?.message} />
            </div>

            <div>
              <label
                htmlFor="cvc"
                className="block font-label-md text-label-md text-on-surface-variant mb-2"
              >
                CVC
              </label>
              <input
                id="cvc"
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="123"
                autoComplete="off"
                className={inputClassName}
                aria-invalid={errors.cvc ? "true" : undefined}
                {...register("cvc")}
              />
              <FieldError message={errors.cvc?.message} />
            </div>
          </div>

          <label className="flex items-start gap-3 bg-surface-container-low rounded-lg p-4 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 mt-0.5 accent-[color:var(--color-primary)]"
              {...register("use3dSecure")}
            />
            <span>
              <span className="block font-label-md text-label-md font-bold text-on-background">
                3D Secure ile Güvenli Öde
              </span>
              <span className="block font-body-md text-sm text-on-surface-variant">
                Telefonunuza gelecek SMS kodu ile işleminizi güvenle onaylayın.
              </span>
            </span>
          </label>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-outline-variant/40">
          <span className="font-label-md text-xs text-on-surface-variant tracking-widest">
            SSL SECURE
          </span>
          <span className="w-px h-4 bg-outline-variant" aria-hidden="true" />
          <span className="font-label-md text-xs text-on-surface-variant tracking-widest">
            256-BIT ŞİFRELEME
          </span>
        </div>
      </section>

      {/* Odeme saglayicisi henuz bagli degil; musteriye acikca soyleniyor. */}
      <p className="flex items-start gap-2 bg-primary-fixed border-2 border-primary rounded-lg p-4 font-body-md text-sm text-on-primary-fixed">
        <Icon name="info" className="text-primary shrink-0" />
        <span>
          Ödeme altyapısı henüz bağlanmadı. Bu adımı tamamladığınızda kart
          bilgileriniz hiçbir yere gönderilmez; sipariş yalnızca bu tarayıcıda
          örnek olarak oluşturulur.
        </span>
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-deep text-on-primary rounded-xl font-label-md text-lg font-bold py-4 flex items-center justify-center gap-2 hover:bg-primary transition-colors warm-shadow disabled:opacity-60"
      >
        {isSubmitting ? "Sipariş oluşturuluyor..." : "Siparişi Tamamla"}
        <span className="font-price-display">
          ({formatPrice(totals.totalInKurus)})
        </span>
      </button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 font-label-md text-label-md text-error">{message}</p>;
}
