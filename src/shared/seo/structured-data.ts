import { absoluteUrl, siteConfig } from "./site";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

type CollectionPageOptions = {
  path: string;
  name: string;
  description: string;
  about: string[];
  mainEntity?: Record<string, unknown>;
};

export const createOrganizationJsonLd = () => ({
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
});

export const createWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}#website`,
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: siteConfig.language,
  publisher: {
    "@id": `${siteConfig.url}#organization`,
  },
});

export const createBreadcrumbJsonLd = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const createCollectionPageJsonLd = ({
  path,
  name,
  description,
  about,
  mainEntity,
}: CollectionPageOptions) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${absoluteUrl(path)}#collection`,
  name,
  url: absoluteUrl(path),
  description,
  inLanguage: siteConfig.language,
  isPartOf: {
    "@id": `${siteConfig.url}#website`,
  },
  publisher: {
    "@id": `${siteConfig.url}#organization`,
  },
  about: about.map((name) => ({
    "@type": "Thing",
    name,
  })),
  ...(mainEntity ? { mainEntity } : {}),
});
