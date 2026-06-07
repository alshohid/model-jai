import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Facebook Callback",
  "Utility callback page for Facebook sign-in on Model Boss Offers.",
);

export default function FacebookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

