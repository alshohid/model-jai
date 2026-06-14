"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSortedChallengeMatchOffers } from "../data/challengeMatchMockData";
import { useAuth } from "@/redux/features/auth/hooks";
import { cn } from "@/shared/lib/utils/cn";
import type { ChallengeMatchOffer } from "../types";
import ChallengeOfferCard from "./ChallengeOfferCard";
import Link from "next/link";
import BigBossChallengeOffers from "./BigBossChallengeOffers";

export default function ChallengeDashboard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const sortedOffers = useMemo(
    () => getSortedChallengeMatchOffers(),
    [],
  );

  const handleAccept = (offer: ChallengeMatchOffer) => {
    router.push(`/challenge-dashboard/${offer.id}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url('/images/home/modaljai_hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.85)),radial-gradient(circle_at_top,rgba(255,0,247,0.25),transparent_38%)]" />

      <section
        className={cn(
          "relative z-10 mx-auto w-full max-w-7xl px-4 pb-3",
          isAuthenticated ? "" : "pt-[120px] sm:pt-[124px]",
        )}
      >

        <div className="md:mt-6 rounded-[22px] md:px-3 md:py-3">

          <Link href="/challenge-dashboard">
            <div className="relative mx-auto w-full max-w-[520px]">
              <BigBossChallengeOffers />
            </div>
          </Link>

          <div>
            {sortedOffers.map((offer) => (
              <ChallengeOfferCard key={offer.id} offer={offer} onAccept={handleAccept} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
