import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Apple Callback",
  "Utility callback page for Apple sign-in on Model Boss Offers.",
);

export default function AppleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

