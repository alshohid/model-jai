import type { Metadata } from "next";
import { createMetadata } from "@/shared/seo/metadata";
import constants from "@/constant";
import ChallengeOfferDetailsClient from "@/features/challenge-match/components/ChallengeOfferDetailsClient";

type ChallengeOfferDetailsPageProps = {
  params: Promise<{ offerId: string }>;
  searchParams?: Promise<{ ref?: string }>;
};

// export function generateStaticParams() {
//   return [];
// }

// export async function generateMetadata({
//   params,
// }: ChallengeOfferDetailsPageProps): Promise<Metadata> {
//   const { offerId } = await params;
//   const numericId = Number(offerId);
//   let title = "Challenge Match Details";
//   let description = "View Big Boss challenge match offer details on Model Boss Offers.";

//   try {
//     const res = await fetch(`${constants.baseApiURL}/challenges/${numericId}`, {
//       next: { revalidate: 60 },
//     });
//     const json = await res.json();

//     if (json?.success && json?.data) {
//       const d = json.data;
//       const challengerName = d.challenger?.name ?? "Unknown";
//       const gameName = d.game?.name ?? "Unknown Game";
//       const targetName = d.target_player?.name ?? "Open Challenge";

//       title = `${challengerName} vs ${targetName} Challenge`;
//       description = `View the ${gameName} challenge match offer from ${challengerName} to ${targetName}.`;
//     }
//   } catch {
//     // fallback to default metadata
//   }

//   return createMetadata({
//     title,
//     description,
//     path: `/challenge-dashboard/${offerId}`,
//     noIndex: true,
//     image: `/api/og/challenge/${offerId}`,
//   });
// }

export default async function ChallengeOfferDetailsPage({
  params,
  searchParams,
}: ChallengeOfferDetailsPageProps) {
  const { offerId } = await params;
  const refParam = (await searchParams)?.ref;

  return <ChallengeOfferDetailsClient offerId={offerId} refCode={refParam} />;
}
// }
