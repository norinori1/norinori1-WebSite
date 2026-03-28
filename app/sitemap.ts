import type { MetadataRoute } from "next";
import { listWorkSlugs } from "@/lib/notion/works";
import { listNewsSlugs } from "@/lib/notion/news";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://norinori1.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/works`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/news`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];

  let workEntries: MetadataRoute.Sitemap = [];
  let newsEntries: MetadataRoute.Sitemap = [];

  try {
    const workSlugs = await listWorkSlugs();
    workEntries = workSlugs.map((slug) => ({
      url: `${siteUrl}/works/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Notion unreachable at build time — skip dynamic entries
  }

  try {
    const newsSlugs = await listNewsSlugs();
    newsEntries = newsSlugs.map((slug) => ({
      url: `${siteUrl}/news/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Notion unreachable at build time — skip dynamic entries
  }

  return [...staticPages, ...workEntries, ...newsEntries];
}
