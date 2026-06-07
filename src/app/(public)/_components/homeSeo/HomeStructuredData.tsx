import type { IMatch } from "@/types/match/MatchManagementTypes";
import type { INews } from "@/types/settings/news/newsManagementTypes";
import type { IGameCategoryData } from "@/types/game/gamecategory/gameCategorytypes";
import { siteConfig } from "@/shared/seo/site";
import JsonLdScript from "@/shared/seo/json-ld";
import {
  createBreadcrumbJsonLd,
  createCollectionPageJsonLd,
  createOrganizationJsonLd,
  createWebsiteJsonLd,
} from "@/shared/seo/structured-data";

type HomeStructuredDataProps = {
  matches: IMatch[];
  newsItems: INews[];
  categories: IGameCategoryData[];
};

const getMatchLabel = (match: IMatch) => {
  const playerOne = match.player_one?.name?.trim() || "Player One";
  const playerTwo = match.player_two?.name?.trim() || "Player Two";

  return `${playerOne} vs ${playerTwo}`;
};

export default function HomeStructuredData({
  matches,
  newsItems,
  categories,
}: HomeStructuredDataProps) {
  const featuredMatches = matches.slice(0, 4);
  const featuredCategories = categories.slice(0, 4);
  const featuredNews = newsItems.slice(0, 3);

  const itemListElement: Array<Record<string, unknown>> = [
    ...featuredMatches.map((match, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: getMatchLabel(match),
        description: match.game?.name
          ? `${match.game.name} ${match.type} match on ${siteConfig.name}`
          : `${match.type} match on ${siteConfig.name}`,
      },
    })),
    ...featuredCategories.map((category, index) => ({
      "@type": "ListItem",
      position: featuredMatches.length + index + 1,
      item: {
        "@type": "Thing",
        name: category.name,
      },
    })),
    ...featuredNews.map((newsItem, index) => ({
      "@type": "ListItem",
      position: featuredMatches.length + featuredCategories.length + index + 1,
      item: {
        "@type": "CreativeWork",
        headline: newsItem.title,
        datePublished: newsItem.created_at,
      },
    })),
  ];

  const structuredData: Array<Record<string, unknown>> = [
    createOrganizationJsonLd(),
    createWebsiteJsonLd(),
    createCollectionPageJsonLd({
      path: "/",
      name: `${siteConfig.name} Home`,
      description:
        "Explore live 1v1 gaming tournaments, supporter-driven battles, featured categories, and fresh match updates on Model Boss Offers.",
      about: [
        "Live gaming tournaments",
        "Supporter battles",
        "Featured match updates",
      ],
      mainEntity: {
        "@type": "ItemList",
        itemListElement,
      },
    }),
    createBreadcrumbJsonLd([{ name: "Home", path: "/" }]),
  ];

  return <JsonLdScript data={structuredData} />;
}
