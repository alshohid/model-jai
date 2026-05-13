import type { MetadataRoute } from "next";
import { getPublicMatches } from "@/shared/seo/public-content";
import { absoluteUrl } from "@/shared/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/live-stream"),
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/point-store"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const matches = await getPublicMatches(50);

  const matchRoutes: MetadataRoute.Sitemap = matches.map((match) => ({
    url: absoluteUrl(`/live-stream/match/${match.id}`),
    lastModified: new Date(match.updated_at || match.created_at),
    changeFrequency: match.type === "live" ? "hourly" : "daily",
    priority: match.type === "live" ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...matchRoutes];
}

