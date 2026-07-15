import type { Metadata } from "next";
import { createMetadata } from "@/shared/seo/metadata";
import { getPublicChallengeById } from "@/shared/seo/public-content";
import ChallengeOfferDetailsClient from "@/features/challenge-match/components/ChallengeOfferDetailsClient";

type ChallengeOfferDetailsPageProps = {
  params: Promise<{ offerId: string }>;
  searchParams?: Promise<{ ref?: string }>;
};

export async function generateMetadata({
  params,
}: ChallengeOfferDetailsPageProps): Promise<Metadata> {
  const { offerId } = await params;
  const response = await getPublicChallengeById(offerId);
  const data = response?.data;

  const challengerName = data?.challenger?.name ?? "A challenger";
  const gameName = data?.game?.name ?? "Model Boss Offers";
  const targetName = data?.target_player?.name;

  const title = data
    ? `${challengerName} Challenges You! Go to Challenge`
    : "Challenge Match Details — Go to Challenge";
  const description = data
    ? `Think you've got what it takes? Accept ${challengerName}'s ${gameName} challenge${
        targetName ? ` against ${targetName}` : ""
      } and show your skills.`
    : "View Big Boss challenge match offer details on Model Boss Offers.";

  return createMetadata({
    title,
    description,
    path: `/challenge-dashboard/${offerId}`,
    noIndex: true,
    image: data?.challenger?.image ?? undefined,
  });
}

export default async function ChallengeOfferDetailsPage({
  params,
  searchParams,
}: ChallengeOfferDetailsPageProps) {
  const { offerId } = await params;
  const refParam = (await searchParams)?.ref;

  return <ChallengeOfferDetailsClient offerId={offerId} refCode={refParam} />;
}
