import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Account Connected",
  "Utility account connection page for Model Boss Offers users.",
);

export default function AccountConnectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

