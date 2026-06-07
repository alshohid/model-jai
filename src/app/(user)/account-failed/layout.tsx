import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Account Connection Failed",
  "Utility account connection status page for Model Boss Offers users.",
);

export default function AccountFailedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

