import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/server/catalog";
import { contentPages } from "@/lib/content-pages";
import { absoluteUrl } from "@/lib/seo";

/** Yalnizca herkese acik sayfalar; sepet/odeme/hesap disarida. */
const staticPaths = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/urunler", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/kampanyalar", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/hakkimizda", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/iletisim", priority: 0.5, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const productSlugs = await getAllProductSlugs();

  return [
    ...staticPaths.map((entry) => ({
      url: absoluteUrl(entry.path),
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...productSlugs.map((slug) => ({
      url: absoluteUrl(`/urunler/${slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...contentPages.map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
