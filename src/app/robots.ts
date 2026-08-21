import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Odeme adimlari ve hesap ekranlari aramada cikmamali.
      disallow: ["/odeme/", "/hesabim/", "/sepet"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
