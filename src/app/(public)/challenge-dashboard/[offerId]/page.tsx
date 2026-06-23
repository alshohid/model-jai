import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChallengeMatchDetails from "@/features/challenge-match/components/ChallengeMatchDetails";
import {
  challengeMatchOffers,
  getChallengeMatchOfferById,
} from "@/features/challenge-match/data/challengeMatchMockData";
import { createMetadata } from "@/shared/seo/metadata";

type ChallengeOfferDetailsPageProps = {
  params: Promise<{ offerId: string }>;
  searchParams?: Promise<{ ref?: string }>;
};

export function generateStaticParams() {
  return challengeMatchOffers.map((offer) => ({
    offerId: offer.id,
  }));
}

export async function generateMetadata({
  params,
}: ChallengeOfferDetailsPageProps): Promise<Metadata> {
  const { offerId } = await params;
  const offer = getChallengeMatchOfferById(offerId);
  console.log("🚀 ~ generateMetadata ~ offer:", offerId)

  return createMetadata({
    title: offer
      ? `${offer.challenger.name} vs ${offer.target.name} Challenge`
      : "Challenge Match Details",
    description: offer
      ? `View the ${offer.game} challenge match offer from ${offer.challenger.name} to ${offer.target.name}.`
      : "View Big Boss challenge match offer details on Model Boss Offers.",
    path: `/challenge-dashboard/${offerId}`,
    noIndex: true,
    image: `/api/og/challenge/${offerId}`,
  });
}

export default async function ChallengeOfferDetailsPage({
  params,
  searchParams,
}: ChallengeOfferDetailsPageProps) {
  const { offerId } = await params;
  const refParam = (await searchParams)?.ref;
  const offer = getChallengeMatchOfferById(offerId);

  if (!offer) {
    notFound();
  }

  return <ChallengeMatchDetails offer={offer} refCode={refParam} />;
}
