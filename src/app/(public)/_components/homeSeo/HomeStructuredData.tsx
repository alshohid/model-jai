import type { IMatch } from "@/types/match/MatchManagementTypes";
import type { INews } from "@/types/settings/news/newsManagementTypes";
import type { IGameCategoryData } from "@/types/game/gamecategory/gameCategorytypes";
import { absoluteUrl, siteConfig } from "@/shared/seo/site";

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
  const itemListElement: Array<Record<string, unknown>> = [
    ...matches.slice(0, 4).map((match, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/live-stream/match/${match.id}`),
      name: getMatchLabel(match),
      description: match.game?.name
        ? `${match.game.name} ${match.type} match on ${siteConfig.name}`
        : `${match.type} match on ${siteConfig.name}`,
    })),
    ...categories.slice(0, 4).map((category, index) => ({
      "@type": "ListItem",
      position: matches.slice(0, 4).length + index + 1,
      item: {
        "@type": "Thing",
        name: category.name,
      },
    })),
    ...newsItems.slice(0, 3).map((newsItem, index) => ({
      "@type": "ListItem",
      position: matches.slice(0, 4).length + categories.slice(0, 4).length + index + 1,
      item: {
        "@type": "CreativeWork",
        headline: newsItem.title,
        datePublished: newsItem.created_at,
      },
    })),
  ];

  const structuredData: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteConfig.url}#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logo),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteConfig.url}#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: {
        "@id": `${siteConfig.url}#organization`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${siteConfig.url}#home`,
      name: `${siteConfig.name} Home`,
      url: siteConfig.url,
      description:
        "Explore live 1v1 gaming tournaments, supporter-driven battles, featured categories, and fresh match updates on Model Boss Offers.",
      isPartOf: {
        "@id": `${siteConfig.url}#website`,
      },
      about: [
        { "@type": "Thing", name: "Live gaming tournaments" },
        { "@type": "Thing", name: "Supporter battles" },
        { "@type": "Thing", name: "Featured match updates" },
      ],
      mainEntity: {
        "@type": "ItemList",
        itemListElement,
      },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

