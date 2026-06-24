import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/shared/seo/site";
// import { getSortedChallengeMatchOffers } from "@/features/challenge-match/data/challengeMatchMockData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
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
    {
      url: absoluteUrl("/challenge-dashboard"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // const offers = await getSortedChallengeMatchOffers();

  const challengePages: MetadataRoute.Sitemap = [];
  //   offers.map((offer) => ({
  //   url: absoluteUrl(`/challenge-dashboard/${offer.id}`),
  //   lastModified: new Date(),
  //   changeFrequency: "daily",
  //   priority: 0.6,
  // }));

  return [...staticPages, ...challengePages];
}
