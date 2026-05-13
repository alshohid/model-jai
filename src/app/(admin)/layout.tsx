import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Admin Dashboard",
  "Administrative pages for managing Model Boss Offers.",
);

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

