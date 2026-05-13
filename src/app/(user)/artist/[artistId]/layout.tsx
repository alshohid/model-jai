import type { Metadata } from "next";
import { createMetadata } from "@/shared/seo/metadata";
import { getPublicArtistProfileById } from "@/shared/seo/public-content";

type ArtistLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ artistId: string }>;
}>;

export async function generateMetadata({
  params,
}: ArtistLayoutProps): Promise<Metadata> {
  const { artistId } = await params;
  const profileResponse = await getPublicArtistProfileById(artistId);
  const artist = profileResponse?.data?.user;

  if (!artist?.name) {
    return createMetadata({
      title: "Artist Profile",
      description:
        "Explore featured artist profiles, posts, and supporter activity on Model Boss Offers.",
      path: `/artist/${artistId}`,
      type: "profile",
    });
  }

  const bio = artist.note?.trim();
  const fallbackDescription = `Explore ${artist.name}'s profile, posts, and supporter activity on Model Boss Offers.`;

  return createMetadata({
    title: `${artist.name} Profile`,
    description: bio && bio.length > 40 ? bio : fallbackDescription,
    path: `/artist/${artistId}`,
    image: artist.image || undefined,
    keywords: [
      artist.name,
      "artist profile",
      "supporter community",
      "gaming creator profile",
    ],
    type: "profile",
  });
}

export default function ArtistLayout({ children }: ArtistLayoutProps) {
  return children;
}
