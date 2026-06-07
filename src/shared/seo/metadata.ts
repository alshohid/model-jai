import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./site";

type MetadataPageType = "website" | "article" | "profile";

type MetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: MetadataPageType;
};

const mergeKeywords = (keywords?: string[]) =>
  Array.from(new Set([...siteConfig.keywords, ...(keywords ?? [])]));

const resolveFullTitle = (title?: string) =>
  title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;

const defaultRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(`${siteConfig.url}/`),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: siteConfig.ogImageWidth,
        height: siteConfig.ogImageHeight,
        alt: `${siteConfig.name} hero banner`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  creator: siteConfig.name,
  publisher: siteConfig.name,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: defaultRobots,
};

export const createMetadata = ({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.ogImage,
  keywords,
  noIndex = false,
  type = "website",
}: MetadataOptions = {}): Metadata => {
  const fullTitle = resolveFullTitle(title);
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords: mergeKeywords(keywords),
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: siteConfig.ogImageWidth,
          height: siteConfig.ogImageHeight,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex ? noIndexRobots : defaultRobots,
  };
};

export const createNoIndexMetadata = (
  title: string,
  description = "This page is not intended to appear in search results.",
) =>
  createMetadata({
    title,
    description,
    noIndex: true,
  });
