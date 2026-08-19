import Image from "next/image";
import type { IconName } from "@/lib/icons";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { ContactForm } from "@/components/contact/contact-form";
import { Newsletter } from "@/components/layout/newsletter";
import { stitchImages } from "@/lib/images";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Sorularınız, önerileriniz ve toptan alım talepleriniz için Balkovan iletişim bilgileri.",
};

const contactDetails: {
  icon: IconName;
  title: string;
  lines: string[];
  note?: string;
}[] = [
  {
    icon: "location_on",
    title: "Adres",
    lines: ["Şenkaya Yaylaları, Balcılar Köyü Yolu Üzeri", "No: 42, Erzurum / Türkiye"],
  },
  {
    icon: "call",
    title: "Telefon",
    lines: ["+90 (555) 123 45 67"],
    note: "(Pzt-Cum, 09:00 - 18:00)",
  },
  {
    icon: "mail",
    title: "E-posta",
    lines: ["merhaba@balkovan.com.tr"],
  },
];

const socialLinks: { icon: IconName; label: string; href: string }[] = [
  { icon: "share", label: "Instagram", href: "https://instagram.com" },
  { icon: "photo_camera", label: "Facebook", href: "https://facebook.com" },
  { icon: "play_arrow", label: "YouTube", href: "https://youtube.com" },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[409px] min-h-[300px] md:h-[512px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={stitchImages.iletisim.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-on-background/40" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-4 drop-shadow-md">
            Bize Ulaşın
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-lowest opacity-90">
            Doğanın kalbinden sofranıza uzanan bu tatlı yolculukta her türlü soru,
            öneri ve siparişleriniz için buradayız.
          </p>
        </div>
      </section>

      {/* İçerik */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg relative z-20 -mt-12 md:-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* İletişim bilgileri */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl warm-shadow p-6 md:p-10 flex flex-col h-full border border-surface-variant">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">
              İletişim Bilgileri
            </h2>
            <div className="space-y-8 flex-grow">
              {contactDetails.map((detail) => (
                <div key={detail.title} className="flex items-start">
                  <Icon
                    name={detail.icon}
                    filled
                    className="text-secondary-container mt-1 mr-4"
                  />
                  <div>
                    <h3 className="font-label-md text-label-md font-semibold text-on-surface mb-1">
                      {detail.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {detail.lines.map((line, index) => (
                        <span key={line}>
                          {index > 0 ? <br /> : null}
                          {line}
                        </span>
                      ))}
                      {detail.note ? (
                        <>
                          <br />
                          <span className="text-sm opacity-80">{detail.note}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-surface-variant">
              <h3 className="font-label-md text-label-md font-semibold text-on-surface mb-4">
                Bizi Takip Edin
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
                  >
                    <Icon name={social.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl warm-shadow p-6 md:p-10 border border-surface-variant mt-8 lg:mt-0">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-2">
              Bize Mesaj Gönderin
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Arılarımız kadar çalışkanız; mesajlarınıza en kısa sürede dönüş
              yapacağız.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
