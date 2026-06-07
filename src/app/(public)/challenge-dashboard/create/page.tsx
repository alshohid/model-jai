import type { Metadata } from "next";
import ChallengeCreateForm from "@/features/challenge-match/components/ChallengeCreateForm";
import { createMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Create Challenge Match",
  description: "Create a Big Boss challenge match offer on Model Boss Offers.",
  path: "/challenge-dashboard/create",
  noIndex: true,
});

export default function CreateChallengePage() {
  return <ChallengeCreateForm />;
}
