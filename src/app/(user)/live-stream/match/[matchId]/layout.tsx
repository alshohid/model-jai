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
  const response = await getPublicMatchById(matchId);
  const match = response?.data;

  const playerOneName = match?.player_one?.name ?? match?.player_one?.full_name;
  const playerTwoName = match?.player_two?.name ?? match?.player_two?.full_name;
  const isVotingMatch = Boolean(match?.vote_start_time);
  const cta = isVotingMatch ? "Vote Now" : "Support Now";

  const title =
    playerOneName && playerTwoName
      ? `${playerOneName} vs ${playerTwoName} — ${cta}`
      : `Live Match Details — ${cta}`;
  const description =
    playerOneName && playerTwoName
      ? isVotingMatch
        ? `Cast your vote for ${playerOneName} or ${playerTwoName} — who takes the win?`
        : `Support ${playerOneName} or ${playerTwoName} in this live 1v1 match on Model Boss Offers.`
      : "Live match details require account access and are not intended to appear in search results.";

  return createMetadata({
    title,
    description,
    path: `/live-stream/match/${matchId}`,
    noIndex: true,
    image: match?.player_one?.image ?? match?.player_two?.image ?? undefined,
  });
}

export default function MatchDetailLayout({
  children,
}: MatchDetailLayoutProps) {
  return children;
}
