import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/shared/seo/metadata";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";

export const metadata: Metadata = createNoIndexMetadata(
  "User Profile",
  "Private user profile page for Model Boss Offers members.",
);

export default function UserProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <PublicNavbar />
      {children}
    </div>
  );
}
