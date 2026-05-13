import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Account Access",
  "Login, registration, and account recovery pages for Model Boss Offers.",
);

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

