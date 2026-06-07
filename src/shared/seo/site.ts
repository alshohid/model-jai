const FALLBACK_SITE_URL = "https://modelbossoffers.com";

const normalizeUrl = (value: string) => value.replace(/\/+$/, "");

export const siteConfig = {
  name: "Model Boss Offers",
  shortName: "Model Boss",
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL),
  defaultTitle: "Model Boss Offers",
  description:
    "Model Boss Offers is a live gaming platform for 1v1 tournaments, real-time supporter battles, featured gaming matches, and point-based player support. Model Boss Offers is a competitive, skill-based tournament platform where users support players using virtual points not real-money betting or wagering. All competitions are determined purely by player skill, and rewards are distributed through supporter contributions. The platform is built for entertainment and community engagement within a structured, secure, and transparent ecosystem. Play fair, support smarter, and climb like a Boss",
  locale: "en_US",
  language: "en",
  ogImage: "/images/home/modaljai_hero.jpg",
  ogImageWidth: 1280,
  ogImageHeight: 720,
  logo: "/images/home/brand-logo.png",
  keywords: [
    "Model Boss Offers",
    "model boss",
    "modelboss",
    "Model Boss",
    "boss offers",
    "model offers",
    "model boss offers",
    "model offers",
    "model boss tournament",
    "model tournament",
    "model games",
    "modelboss offers",
    "modelboss tournament",
    "modelboss games",
    "modelboss gaming",
    "model gaming",
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
