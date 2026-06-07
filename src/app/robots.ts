import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/seo/site";

const protectedRoutes = [
  "/admin",
  "/admin/",
  "/apple",
  "/apple/",
  "/facebook",
  "/facebook/",
  "/google",
  "/google/",
  "/login",
  "/register",
  "/forgot-password",
  "/user-profile",
  "/support-history",
  "/transactions",
  "/notifications",
  "/payment-success",
  "/payment-cancel",
  "/account-connected",
  "/account-failed",
  "/live-stream/match/",
  "/artist/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: protectedRoutes,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
