import Image from "next/image";
import type { IconName } from "@/lib/icons";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/container";
import { Newsletter } from "@/components/layout/newsletter";
import { ProductCard } from "@/components/product/product-card";
import { featuredProducts } from "@/lib/products";
import { stitchImages } from "@/lib/images";

const campaigns: {
  icon: IconName;
  iconBg: string;
  title: string;
  description: string;
  cta: string;
}[] = [
  {
    icon: "redeem",
    iconBg: "bg-primary-container",
    title: "Hoşgeldin İndirimi",
    description: "Yeni üyelere özel ilk alışverişte %15 indirim fırsatı.",
    cta: "Kodu Al",
  },
  {
    icon: "local_shipping",
    iconBg: "bg-secondary",
    title: "Kargo Bedava",
    description: "1500 TL ve üzeri tüm siparişlerinizde ücretsiz teslimat.",
    cta: "Detaylar",
  },
  {
    icon: "card_giftcard",
    iconBg: "bg-tertiary",
    title: "Hediye Setleri",
    description: "Sevdiklerinize özel hazırlanan setlerde 3 al 2 öde.",
    cta: "Setleri İncele",
  },
];

const categories = [
  {
    title: "Ham Ballar",
    subtitle: "Filtre edilmemiş saflık",
    image: stitchImages.anasayfa.kategoriHamBallar,
    href: "/urunler?kategori=ballar",
    className: "",
  },
  {
    title: "Propolis & Polen",
    subtitle: "Doğal savunma kalkanı",
    image: stitchImages.anasayfa.kategoriPropolisPolen,
    href: "/urunler?kategori=ari-urunleri",
    className: "",
  },
  {
    title: "Hediye Setleri",
    subtitle: "Sevdiklerinize özel anlar",
    image: stitchImages.anasayfa.kategoriHediyeSetleri,
    href: "/urunler?kategori=setler",
    className: "md:col-span-2 lg:col-span-1",
  },
];

const testimonials = [
  {
    quote:
      "Balların tadı harika, gerçekten doğal olduğunu hissedebiliyorsunuz. Kargo da çok hızlıydı.",
    author: "Ahmet Yılmaz",
  },
  {
    quote:
      "Kestane balı favorim oldu. Yoğun aroması ve kıvamı tam istediğim gibi. Teşekkürler Balkovan!",
    author: "Zeynep Kaya",
  },
  {
    quote:
      "Hediye setlerinden aldım, paketleme çok özenliydi. Arkadaşım da çok beğendi.",
    author: "Caner Demir",
  },
];

const productionSteps: {
  icon: IconName;
  title: string;
  description: string;
}[] = [
  {
    icon: "eco",
    title: "Doğal Çevre",
    description:
      "Kovanlarımızı, sanayiden ve tarımsal ilaçlamadan uzak, yüksek rakımlı bakir doğada konumlandırıyoruz.",
  },
  {
    icon: "hive",
    title: "Saygılı Hasat",
    description:
      "Arıların ihtiyacı olan balı onlara bırakıyor, sadece fazlasını alarak döngüye saygı gösteriyoruz.",
  },
  {
    icon: "water_drop",
    title: "Isı İşlemsiz",
    description:
      "Balı pastörize etmiyor, faydalı enzimlerini koruyarak doğrudan kavanozluyoruz.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Container as="section" className="py-stack-lg mt-4 md:mt-8">
        <div className="rounded-3xl overflow-hidden relative min-h-[500px] lg:min-h-[600px] warm-shadow flex items-center justify-center">
          <Image
            src={stitchImages.anasayfa.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-on-background/40" />
          <div className="relative z-10 text-center px-8 py-12 max-w-3xl flex flex-col items-center">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-6">
              Orijinal bal, doğrudan arıcıdan.
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary/90 mb-10 max-w-xl">
              Yaylalardan süzülen ham ve katkısız lezzet. Doğanın saf halini
              sofralarınıza taşıyoruz.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/urunler"
                className="bg-amber-deep text-on-primary font-label-md text-label-md font-bold px-8 py-4 rounded-full hover:bg-primary-container transition-colors warm-shadow"
              >
                Ürünleri Keşfet
              </Link>
              <Link
                href="/hakkimizda"
                className="bg-surface/20 backdrop-blur-md border border-surface/30 text-on-primary font-label-md text-label-md font-bold px-8 py-4 rounded-full hover:bg-surface/30 transition-colors"
              >
                Hikayemiz
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Kampanyalar */}
      <Container as="section" className="py-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-background mb-8 text-center">
          Kampanyalar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {campaigns.map((campaign) => (
            <div
              key={campaign.title}
              className="bg-surface-container-highest p-8 rounded-3xl warm-shadow warm-shadow-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`mb-6 ${campaign.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center text-on-primary`}
              >
                <Icon name={campaign.icon} className="text-3xl" />
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-3 text-on-background">
                {campaign.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                {campaign.description}
              </p>
              <Link
                href="/kampanyalar"
                className="font-label-md text-label-md text-primary font-bold hover:text-amber-deep flex items-center gap-2"
              >
                {campaign.cta} <Icon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
          ))}
        </div>
      </Container>

      {/* Öne Çıkanlar */}
      <section className="bg-surface-container-lowest py-stack-lg border-t border-b border-honey-100">
        <Container>
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-headline-md text-headline-md text-on-background">
              Öne Çıkanlar
            </h2>
            <Link
              href="/urunler"
              className="font-label-md text-label-md text-primary font-bold hover:text-amber-deep hidden sm:flex items-center gap-2"
            >
              Tümünü Gör <Icon name="arrow_forward" className="text-sm" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                variant="featured"
              />
            ))}
          </div>
          <Link
            href="/urunler"
            className="font-label-md text-label-md text-primary font-bold hover:underline block text-center mt-8 sm:hidden"
          >
            Tümünü Gör
          </Link>
        </Container>
      </section>

      {/* Kategoriler */}
      <Container as="section" className="py-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-background mb-8">
          Kategoriler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className={`relative h-80 rounded-3xl overflow-hidden group block warm-shadow ${category.className}`}
            >
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/90 via-on-background/40 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="font-headline-md text-headline-md text-on-primary mb-2">
                  {category.title}
                </h3>
                <p className="font-body-md text-body-md text-on-primary/90">
                  {category.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* Müşteri Yorumları */}
      <section className="py-stack-lg bg-surface-container-lowest border-t border-honey-100">
        <Container>
          <h2 className="font-headline-md text-headline-md text-on-background mb-8 text-center">
            Müşteri Yorumları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.author}
                className="bg-surface p-8 rounded-3xl warm-shadow border border-honey-100"
              >
                <div
                  className="flex text-amber-deep mb-4"
                  aria-label="5 üzerinden 5 yıldız"
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icon key={index} name="star" filled />
                  ))}
                </div>
                <blockquote className="font-body-md text-body-md text-on-surface-variant mb-6 italic">
                  {`"${testimonial.quote}"`}
                </blockquote>
                <figcaption className="font-label-md text-label-md font-bold text-on-background">
                  {testimonial.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Yolculuğumuz */}
      <Container as="section" className="py-stack-lg">
        <div className="rounded-3xl overflow-hidden relative h-[400px] lg:h-[500px] warm-shadow flex items-center justify-center">
          <Image
            src={stitchImages.anasayfa.yolculugumuz}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-on-background/40" />
          <div className="relative z-10 text-center px-4 max-w-2xl">
            <h2 className="font-headline-md text-headline-md text-on-primary mb-6">
              Yolculuğumuz
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary/90">
              Doğanın kalbinde, arılarla iç içe başlayan hikayemiz, her geçen gün
              daha saf, daha doğal bir lezzet arayışıyla devam ediyor.
            </p>
          </div>
        </div>
      </Container>

      {/* Nasıl Üretiyoruz */}
      <section className="bg-surface-container-low py-stack-lg zig-zag-bg">
        <Container className="text-center">
          <h2 className="font-headline-md text-headline-md text-on-background mb-16">
            Nasıl Üretiyoruz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {productionSteps.map((step) => (
              <div
                key={step.title}
                className="flex flex-col items-center bg-background/60 backdrop-blur-sm p-8 rounded-3xl"
              >
                <div className="w-24 h-24 rounded-full bg-honey-100 flex items-center justify-center mb-8 text-amber-deep">
                  <Icon name={step.icon} size={48} weight={300} />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">
                  {step.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
