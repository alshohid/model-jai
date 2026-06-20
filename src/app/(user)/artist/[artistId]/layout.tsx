import type { Metadata } from "next";
import { createMetadata } from "@/shared/seo/metadata";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";

type ArtistLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ artistId: string }>;
}>;

export async function generateMetadata({
  params,
}: ArtistLayoutProps): Promise<Metadata> {
  const { artistId } = await params;

  return createMetadata({
    title: "Artist Profile",
    description:
      "Artist profile pages require account access and are not intended to appear in search results.",
    path: `/artist/${artistId}`,
    noIndex: true,
  });
}

export default function ArtistLayout({ children }: ArtistLayoutProps) {
  return <div>
    <PublicNavbar />
    {children}
  </div>;
}
