import { Icon } from "@/components/ui/icon";

/** Tasarimda anasayfa, urun detay ve iletisim sayfalarinin altinda tekrar eden bulten bolumu. */
export function Newsletter() {
  return (
    <section className="py-stack-lg border-b border-honey-100 bg-surface">
      <div className="max-w-3xl mx-auto px-margin-mobile text-center">
        <Icon name="mail" size={56} className="text-amber-deep mb-6 block" />
        <h2 className="font-headline-md text-headline-md text-on-background mb-4">
          Balkovan Ailesine Katılın
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
          Yeni hasatlardan, sınırlı üretim ballarımızdan ve özel indirimlerden ilk
          sizin haberiniz olsun.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <label htmlFor="newsletter-email" className="sr-only">
            E-posta adresiniz
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="E-posta adresiniz"
            className="flex-grow bg-surface-container-low border border-honey-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-deep focus:ring-1 focus:ring-amber-deep font-body-md text-on-background placeholder:text-ink-muted"
          />
          <button
            type="submit"
            className="bg-amber-deep text-on-primary font-label-md text-label-md font-bold px-8 py-4 rounded-2xl hover:bg-primary-container transition-colors whitespace-nowrap"
          >
            Kayıt Ol
          </button>
        </form>
      </div>
    </section>
  );
}
