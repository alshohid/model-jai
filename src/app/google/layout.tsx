import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Google Callback",
  "Utility callback page for Google sign-in on Model Boss Offers.",
);

export default function GoogleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

