import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Support History",
  "Private support history page for Model Boss Offers users.",
);

export default function SupportHistoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

