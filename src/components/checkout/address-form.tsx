"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/components/cart/cart-provider";
import { useCheckout } from "@/components/checkout/use-checkout";
import { formatPrice } from "@/lib/format";
import {
  addressSchema,
  cities,
  defaultShippingOptionId,
  shippingOptions,
  type Address,
} from "@/lib/checkout";

const inputClassName =
  "w-full bg-surface-bright border-2 border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-0 focus:outline-none transition-colors";

/** Odeme adim 1: teslimat adresi ve kargo secimi. */
export function AddressForm() {
  const router = useRouter();
  const { totals } = useCart();
  const { address, shippingOptionId, setAddress, setShippingOptionId } =
    useCheckout();

  const selectedShipping = shippingOptionId ?? defaultShippingOptionId;
  const isFreeShipping = totals.remainingForFreeShippingInKurus === 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>({
    resolver: zodResolver(addressSchema),
    // Geri donup tekrar gelindiginde girilen adres kaybolmasin.
    defaultValues: address ?? {
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      district: "",
      fullAddress: "",
      addressTitle: "",
    },
  });

  const onSubmit = (values: Address) => {
    setAddress(values);
    setShippingOptionId(selectedShipping);
    router.push("/odeme/kart");
  };

  return (
    <form
      id="adres-formu"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-stack-md"
      noValidate
    >
      {/* Teslimat adresi */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 warm-shadow p-6 md:p-8">
        <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2 mb-6">
          <Icon name="location_on" filled />
          Teslimat Adresi
        </h2>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Adınız" htmlFor="firstName" error={errors.firstName?.message}>
              <input
                id="firstName"
                type="text"
                placeholder="Örn: Ayşe"
                autoComplete="given-name"
                className={inputClassName}
                aria-invalid={errors.firstName ? "true" : undefined}
                {...register("firstName")}
              />
            </Field>

            <Field label="Soyadınız" htmlFor="lastName" error={errors.lastName?.message}>
              <input
                id="lastName"
                type="text"
                placeholder="Örn: Yılmaz"
                autoComplete="family-name"
                className={inputClassName}
                aria-invalid={errors.lastName ? "true" : undefined}
                {...register("lastName")}
              />
            </Field>
          </div>

          <Field label="Telefon Numarası" htmlFor="phone" error={errors.phone?.message}>
            <div className="flex items-center">
              <span className="px-4 py-3 rounded-l-lg border-2 border-r-0 border-outline-variant bg-surface-container font-body-md text-on-surface-variant">
                +90
              </span>
              <input
                id="phone"
                type="tel"
                placeholder="5xx xxx xx xx"
                autoComplete="tel-national"
                className={`${inputClassName} rounded-l-none`}
                aria-invalid={errors.phone ? "true" : undefined}
                {...register("phone")}
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="İl" htmlFor="city" error={errors.city?.message}>
              <select
                id="city"
                className={`${inputClassName} appearance-none`}
                aria-invalid={errors.city ? "true" : undefined}
                {...register("city")}
              >
                <option value="">İl Seçiniz</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="İlçe" htmlFor="district" error={errors.district?.message}>
              <input
                id="district"
                type="text"
                placeholder="Örn: Kadıköy"
                autoComplete="address-level2"
                className={inputClassName}
                aria-invalid={errors.district ? "true" : undefined}
                {...register("district")}
              />
            </Field>
          </div>

          <Field
            label="Açık Adres"
            htmlFor="fullAddress"
            error={errors.fullAddress?.message}
          >
            <textarea
              id="fullAddress"
              rows={3}
              placeholder="Mahalle, sokak, bina ve daire numarası"
              autoComplete="street-address"
              className={`${inputClassName} resize-y`}
              aria-invalid={errors.fullAddress ? "true" : undefined}
              {...register("fullAddress")}
            />
          </Field>

          <Field
            label="Adres Başlığı"
            htmlFor="addressTitle"
            error={errors.addressTitle?.message}
            optional
          >
            <input
              id="addressTitle"
              type="text"
              placeholder="Örn: Ev, İş"
              className={inputClassName}
              {...register("addressTitle")}
            />
          </Field>
        </div>
      </section>

      {/* Kargo secimi */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 warm-shadow p-6 md:p-8">
        <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2 mb-4">
          <Icon name="local_shipping" />
          Kargo Seçimi
        </h2>

        <div className="flex items-start gap-3 bg-surface-container-low rounded-lg p-4 mb-5">
          <Icon name="verified" filled className="text-primary shrink-0" />
          <p className="font-body-md text-sm text-on-surface-variant">
            Tüm kargolarımız dürüst üreticiden doğrudan size ulaşmak üzere,
            korunaklı petek ambalajlarla özenle hazırlanır.
          </p>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Kargo firması</legend>
          {shippingOptions.map((option) => {
            const isActive = option.id === selectedShipping;
            return (
              <label
                key={option.id}
                className={clsx(
                  "flex items-center gap-4 rounded-lg border-2 p-4 cursor-pointer transition-colors",
                  isActive
                    ? "border-primary bg-surface-container-low"
                    : "border-outline-variant hover:border-primary/50",
                )}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={option.id}
                  checked={isActive}
                  onChange={() => setShippingOptionId(option.id)}
                  className="w-5 h-5 accent-[color:var(--color-primary)]"
                />
                <Icon
                  name={option.icon}
                  className={isActive ? "text-primary" : "text-on-surface-variant"}
                />
                <span className="flex-grow">
                  <span className="block font-label-md text-label-md font-bold text-on-background">
                    {option.name}
                  </span>
                  <span className="block font-body-md text-sm text-on-surface-variant">
                    {option.estimate}
                  </span>
                </span>
                <span className="font-price-display text-label-md text-on-background shrink-0">
                  {isFreeShipping ? (
                    <span className="text-primary font-bold">Ücretsiz</span>
                  ) : (
                    formatPrice(option.feeInKurus)
                  )}
                </span>
              </label>
            );
          })}
        </fieldset>

        {isFreeShipping ? (
          <p className="mt-4 font-label-md text-label-md text-primary flex items-center gap-2">
            <Icon name="check_circle" filled className="text-sm" />
            Sepet tutarınız ücretsiz kargo sınırını geçtiği için kargo bedeli
            alınmayacak.
          </p>
        ) : null}
      </section>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-label-md text-label-md text-on-surface-variant mb-2"
      >
        {label}
        {optional ? (
          <span className="text-ink-muted font-normal"> (isteğe bağlı)</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="mt-2 font-label-md text-label-md text-error">{error}</p>
      ) : null}
    </div>
  );
}
