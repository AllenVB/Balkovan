import Image from "next/image";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { stitchImages } from "@/lib/images";
import { RatingStars } from "@/components/review/rating-stars";
import {
  averageRating,
  calculateRatingBreakdown,
  reviewCount,
  testimonials,
} from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Kovandan kavanoza uzanan, hiçbir ısıl işlem görmemiş, saf ve doğal yolculuğumuz.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative bg-surface-container py-stack-lg px-margin-mobile md:px-margin-desktop bg-honeycomb-pattern">
        <div className="max-w-container-max mx-auto text-center relative z-10">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-stack-md">
            Dürüst Üretici
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Kovandan kavanoza uzanan, hiçbir ısıl işlem görmemiş, saf ve doğal
            yolculuğumuz.
          </p>
        </div>
      </section>

      {/* Doğanın Kalbinden */}
      <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-headline-md text-headline-md text-primary mb-stack-sm">
              Doğanın Kalbinden
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
              Arılarımız, yüksek rakımlı yaylalarda, endüstriyel tarımdan uzak,
              binbir çeşit kır çiçeğinin bulunduğu tertemiz bir doğada nektar
              toplar. Doğaya saygı duyarak, arıların hakkını arılara bırakıp,
              sadece fazlasını sizin için özenle alıyoruz.
            </p>
            <div className="flex items-center space-x-2 text-secondary">
              <Icon name="park" />
              <span className="font-label-md text-label-md">
                El Değmemiş Doğal Yaşam Alanı
              </span>
            </div>
          </div>
          <div className="order-1 md:order-2 rounded-xl overflow-hidden warm-shadow relative aspect-[4/3]">
            <Image
              src={stitchImages.hakkimizda.kovanlar}
              alt="Yaylada sıralanmış ahşap arı kovanları"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Isıl İşlemsiz, Filtresiz */}
      <section className="bg-surface py-stack-lg px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
          <div className="rounded-xl overflow-hidden warm-shadow relative aspect-[4/3]">
            <Image
              src={stitchImages.hakkimizda.camBaliKavanozu}
              alt="Saf çam balı kavanozu"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-primary mb-stack-sm">
              Isıl İşlemsiz, Filtresiz
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
              Balımızı kavanozlarken pastörizasyon veya yüksek ısı uygulamıyoruz.
              Doğal enzimlerini, polenlerini ve besin değerlerini korumak için
              filtresiz süzüyoruz. Kavanozladığımız bal, kovandaki ile birebir aynı
              saflıktadır.
            </p>
            <div className="flex items-center space-x-2 text-secondary mb-2">
              <Icon name="thermostat" />
              <span className="font-label-md text-label-md">
                Isıl İşlem Görmemiş
              </span>
            </div>
            <div className="flex items-center space-x-2 text-secondary">
              <Icon name="filter_alt_off" />
              <span className="font-label-md text-label-md">Filtresiz Saf Bal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Musteri yorumlari ve ortalama puan */}
      <section className="bg-surface-container-low py-stack-lg px-margin-mobile md:px-margin-desktop bg-honeycomb-pattern">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-md text-headline-md text-primary mb-stack-md text-center">
            Müşterilerimiz Ne Diyor?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
            <div className="bg-surface-container-lowest rounded-xl p-8 warm-shadow border border-outline-variant/30 flex flex-col items-center text-center lg:sticky lg:top-28">
              <span className="font-display-lg text-display-lg text-primary">
                {averageRating.toLocaleString("tr-TR", {
                  minimumFractionDigits: 1,
                })}
              </span>
              <RatingStars rating={averageRating} className="my-3" />
              <p className="font-body-md text-body-md text-on-surface-variant">
                {reviewCount} değerlendirme
              </p>

              <dl className="w-full mt-6 space-y-2">
                {calculateRatingBreakdown(testimonials).map((row) => (
                  <div key={row.rating} className="flex items-center gap-3">
                    <dt className="font-label-md text-label-md text-on-surface-variant w-6 shrink-0 text-right">
                      {row.rating}
                    </dt>
                    <dd className="flex-grow flex items-center gap-2">
                      <span className="flex-grow h-2 rounded-full bg-surface-variant overflow-hidden">
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{ width: `${row.percent}%` }}
                        />
                      </span>
                      <span className="font-body-md text-xs text-ink-muted w-6 text-right">
                        {row.count}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <ul className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {testimonials.map((testimonial) => (
                <li
                  key={testimonial.id}
                  className="bg-surface rounded-xl p-6 warm-shadow border border-honey-100 flex flex-col"
                >
                  <RatingStars rating={testimonial.rating} className="mb-3" />
                  <blockquote className="font-body-md text-body-md text-on-surface-variant italic flex-grow">
                    {`"${testimonial.quote}"`}
                  </blockquote>
                  <div className="mt-4 pt-4 border-t border-honey-100 flex items-center justify-between gap-2">
                    <span className="font-label-md text-label-md font-bold text-on-background">
                      {testimonial.author}
                    </span>
                    {testimonial.product ? (
                      <span className="font-label-md text-xs text-honey-800 bg-honey-50 border border-honey-200 rounded-md px-2 py-1">
                        {testimonial.product}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
