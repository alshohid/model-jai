import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Payment Success",
  "Utility payment status page for Model Boss Offers users.",
);

export default function PaymentSuccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

