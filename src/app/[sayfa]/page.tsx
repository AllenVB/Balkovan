import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/container";
import { contentPages, getContentPage } from "@/lib/content-pages";
import { whatsappHref, CONTACT_EMAIL } from "@/lib/site";

export function generateStaticParams() {
  return contentPages.map((page) => ({ sayfa: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[sayfa]">): Promise<Metadata> {
  const { sayfa } = await params;
  const page = getContentPage(sayfa);
  if (!page) return { title: "Sayfa bulunamadı" };

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
  };
}

/** Metin agirlikli bilgi sayfalari icin ortak sablon (bkz. lib/content-pages.ts). */
export default async function ContentPageRoute({
  params,
}: PageProps<"/[sayfa]">) {
  const { sayfa } = await params;
  const page = getContentPage(sayfa);
  if (!page) notFound();

  return (
    <>
      <section className="bg-surface-container py-stack-lg px-margin-mobile md:px-margin-desktop bg-honeycomb-pattern">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-stack-sm">
            {page.title}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {page.intro}
          </p>
        </div>
      </section>

      <Container as="section" className="py-stack-lg">
        <div className="max-w-3xl mx-auto flex flex-col gap-stack-md">
          {page.needsLegalReview ? (
            <p className="flex items-start gap-3 bg-primary-fixed border-2 border-primary rounded-xl p-4 font-body-md text-sm text-on-primary-fixed">
              <Icon name="info" className="text-primary shrink-0" />
              <span>
                Bu sayfa taslak halindedir. Yayına çıkmadan önce işletme
                bilgileri ve hukuki inceleme ile tamamlanması gerekir.
              </span>
            </p>
          ) : null}

          {page.sections.map((section) => (
            <section
              key={section.heading}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 warm-shadow p-6 md:p-8"
            >
              <h2 className="font-headline-sm text-headline-sm text-primary mb-3">
                {section.heading}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="font-body-md text-body-md text-on-surface-variant mb-3 last:mb-0 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets ? (
                <ul className="flex flex-col gap-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 font-body-md text-body-md text-on-surface-variant"
                    >
                      <Icon name="check_circle" filled className="text-primary text-sm mt-1 shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <div className="bg-comb rounded-xl border border-honey-100 warm-shadow p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-label-md text-label-md font-bold text-on-background">
                Sorunuz mu var?
              </p>
              <p className="font-body-md text-sm text-on-surface-variant">
                WhatsApp&apos;tan yazın ya da {CONTACT_EMAIL} adresine e-posta gönderin.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md font-bold px-5 py-3 rounded-lg hover:bg-primary-container transition-colors"
              >
                <Icon name="chat" />
                WhatsApp
              </a>
              <Link
                href="/iletisim"
                className="flex items-center gap-2 bg-surface-container-high text-on-background font-label-md text-label-md font-bold px-5 py-3 rounded-lg hover:bg-surface-variant transition-colors"
              >
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
