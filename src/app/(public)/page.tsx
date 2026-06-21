import type { Metadata } from "next";
import HeroSection from "./_components/heroSection/HeroSection";
import MatchesSection from "@/shared/components/home/MatchesSection";
import RankingSection from "./_components/rankingSection/RankingSection";
import WatchLivestreamSection from "@/shared/components/home/WatchLivestreamSection";
import GamesSection from "./_components/gamesSection/GamesSection";
import ChooseCategorySection from "@/shared/components/home/ChooseCategorySection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";
import VideosSection from "@/shared/components/home/VideosSection";
import HomeStructuredData from "./_components/homeSeo/HomeStructuredData";
import { createMetadata } from "@/shared/seo/metadata";
import { getHomeSeoContent } from "@/shared/seo/public-content";

const homeDescription =
  "Watch live 1v1 gaming tournaments, follow supporter battles, explore featured matchups, and discover fresh updates on Model Boss Offers.";

export const metadata: Metadata = createMetadata({
  title: "Live Gaming Tournaments and Supporter Battles",
  description: homeDescription,
  path: "/",
  keywords: [
    "home page gaming platform",
    "watch live tournaments",
    "support your player live",
    "featured gaming matches",
  ],
});

const Public = async () => {
  const seoContent = await getHomeSeoContent();

  return (
    <main id="top" >
      <HomeStructuredData
        matches={seoContent.matches}
        newsItems={seoContent.newsItems}
        categories={seoContent.categories}
      />
      <HeroSection />
      <MatchesSection />
      <RankingSection />
      <WatchLivestreamSection />
      <VideosSection />
      <GamesSection />
      <ChooseCategorySection />
      <LatestNewsSection />
      <TakeGameSection />
    </main>
  );
};

export default Public;
