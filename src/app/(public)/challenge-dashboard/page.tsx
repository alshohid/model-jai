import type { Metadata } from "next";
import ChallengeDashboard from "@/features/challenge-match/components/ChallengeDashboard";
import { createMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Big Boss Challenge Offers",
  description:
    "View ranked Big Boss challenge offers, accept open challenges, and launch new challenge matches on Model Boss Offers.",
  path: "/challenge-dashboard",
  noIndex: true,
});

export default function ChallengeDashboardPage() {
  return <ChallengeDashboard />;
}
