import Link from "next/link";
import { footerSections } from "@/lib/navigation";

/** Tasarimdaki 4 sutunlu footer: marka + uc baglanti grubu. */
export function SiteFooter() {
  return (
    <footer className="bg-surface-container-low">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-gutter px-margin-mobile lg:px-margin-desktop py-stack-lg max-w-container-max mx-auto">
        <div className="col-span-1">
          <span className="font-headline-sm text-headline-sm font-bold text-primary mb-4 block">
            Balkovan
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            © {new Date().getFullYear()} Balkovan. Tüm Hakları Saklıdır.
          </p>
        </div>

        {footerSections.map((section) => (
          <div key={section.title} className="col-span-1">
            <h4 className="font-label-md text-label-md text-primary font-bold mb-4">
              {section.title}
            </h4>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
