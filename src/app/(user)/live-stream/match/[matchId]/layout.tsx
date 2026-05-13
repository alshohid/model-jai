import type { Metadata } from "next";
import { createMetadata } from "@/shared/seo/metadata";
import { getPublicMatchById } from "@/shared/seo/public-content";

type MatchDetailLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ matchId: string }>;
}>;

export async function generateMetadata({
  params,
}: MatchDetailLayoutProps): Promise<Metadata> {
  const { matchId } = await params;
  const matchResponse = await getPublicMatchById(matchId);
  const match = matchResponse?.data;

  if (!match) {
    return createMetadata({
      title: "Live Match Details",
      description:
        "Follow live match details, supporter activity, and tournament updates on Model Boss Offers.",
      path: `/live-stream/match/${matchId}`,
    });
  }

  const playerOne = match.player_one?.name?.trim() || "Player One";
  const playerTwo = match.player_two?.name?.trim() || "Player Two";
  const gameName = match.game?.name?.trim() || "Featured Game";

  return createMetadata({
    title: `${playerOne} vs ${playerTwo}`,
    description: `Watch ${playerOne} vs ${playerTwo} in ${gameName} on Model Boss Offers and follow the latest live match action and supporter momentum.`,
    path: `/live-stream/match/${matchId}`,
    keywords: [
      gameName,
      `${playerOne} vs ${playerTwo}`,
      "live match details",
      "supporter match page",
    ],
  });
}

export default function MatchDetailLayout({
  children,
}: MatchDetailLayoutProps) {
  return children;
}

