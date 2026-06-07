import type { Metadata } from "next";
import { createMetadata } from "@/shared/seo/metadata";

type MatchDetailLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ matchId: string }>;
}>;

export async function generateMetadata({
  params,
}: MatchDetailLayoutProps): Promise<Metadata> {
  const { matchId } = await params;

  return createMetadata({
    title: "Live Match Details",
    description:
      "Live match details require account access and are not intended to appear in search results.",
    path: `/live-stream/match/${matchId}`,
    noIndex: true,
  });
}

export default function MatchDetailLayout({
  children,
}: MatchDetailLayoutProps) {
  return children;
}
