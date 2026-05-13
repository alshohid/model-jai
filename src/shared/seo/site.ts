const FALLBACK_SITE_URL = "https://modelbossoffers.com";

const normalizeUrl = (value: string) => value.replace(/\/+$/, "");

export const siteConfig = {
  name: "Model Boss Offers",
  shortName: "Model Boss",
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL),
  defaultTitle: "Model Boss Offers",
  description:
    "Model Boss Offers is a live competitive gaming platform for 1v1 tournaments, supporter battles, featured matches, and real-time streaming updates.",
  ogImage: "/images/home/modaljai_hero.jpg",
  logo: "/images/home/brand-logo.png",
  keywords: [
    "Model Boss Offers",
    "live gaming tournaments",
    "1v1 gaming matches",
    "supporter battles",
    "live stream gaming platform",
    "competitive gaming community",
    "gaming match streaming",
    "watch live gaming matches",
  ],
} as const;

export const absoluteUrl = (path = "/") =>
  new URL(path, `${siteConfig.url}/`).toString();

