import type { MetadataRoute } from "next";

import { articles } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const routes = [
    "",
    "/presentation",
    "/galerie",
    "/evenements",
    "/actualites",
    "/adhesion",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-06-22"),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${base}/actualites/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...routes, ...articleRoutes];
}
