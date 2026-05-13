import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Payment Cancelled",
  "Utility payment status page for Model Boss Offers users.",
);

export default function PaymentCancelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

