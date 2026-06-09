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
        {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd44d]/35 bg-black/35 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#ffe27a]">
              <Crown className="h-4 w-4" />
              Big Boss Challenge Offers
            </div>
            <h1 className="mt-4 text-4xl font-black italic leading-none text-white [text-shadow:0_0_22px_#ff36ff] sm:text-6xl">
              Big boss challenge offers
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
              Biggest challenge stays on top. Accept a challenge, confirm the terms, and get ready for the match flow.
            </p>
          </div>

          <Link
            href="/challenge-dashboard/create"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#ff43ff]/55 bg-[#28002f]/80 px-5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_0_24px_rgba(255,67,255,0.45)] transition hover:bg-[#3a0045]"
          >
            <Plus className="h-4 w-4" />
            Create Challenge
          </Link>
        </div> */}

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
