"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetAllPublicChallengesListQuery } from "@/redux/features/challenge/challengeManagement";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import { useAuth } from "@/redux/features/auth/hooks";
import { cn } from "@/shared/lib/utils/cn";
import type { ChallengeMatchOffer } from "../types";
import ChallengeOfferCard from "./ChallengeOfferCard";
import BigBossChallengeOffers from "./BigBossChallengeOffers";
import { mapApiChallengeToOffer, type ApiChallengeItem } from "../utils/apiAdapter";
import AppPagination from "@/app/(admin)/admin/_components/topComponent/AppPagination";

const PAGE_SIZE = 100;

export default function ChallengeDashboard() {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: challengesData, isLoading, isError } =
    useGetAllPublicChallengesListQuery({ page, limit: PAGE_SIZE });
  const { data: meData } = useGetMeDataQuery(undefined, {
    skip: !isAuthenticated,
  });
  const currentUserId = meData?.data?.user?.id ?? null;
  const sortedOffers = useMemo(() => {
    if (!challengesData?.data) return [];
    const rawItems = challengesData.data as unknown as ApiChallengeItem[];
    return rawItems
      .map(mapApiChallengeToOffer)
      .sort((a, b) => a.rank - b.rank);
  }, [challengesData]);

  const canAcceptOffer = (offer: ChallengeMatchOffer) => {
    if (offer.mode === "global") {
      return currentUserId != null && Number(offer.challenger.id) !== Number(currentUserId);
    }
    if (offer.mode === "unique") {
      return offer.targetPlayerId != null && currentUserId != null
        ? Number(offer.targetPlayerId) === Number(currentUserId) && Number(offer.challenger.id) !== Number(currentUserId)
        : false;
    }

    return true;
  };

  const handleAccept = (offer: ChallengeMatchOffer) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/challenge-dashboard/${offer.id}`);
      return;
    }

    if (role === "user" || role === "artist") {
      router.push(`/challenge-dashboard/${offer.id}`);
      return;
    }

    router.push(`/admin/dashboard`);
  };

  if (isLoading) {
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
            <div className="w-full py-8 text-center text-white/50 text-sm">
              Loading challenges...
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (isError) {
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
            <div className="w-full py-8 text-center text-red-400 text-sm">
              Failed to load challenges. Please try again later.
            </div>
          </div>
        </section>
      </main>
    );
  }

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
            {sortedOffers.length === 0 ? (
              <div className="w-full py-8 text-center text-white/50 text-sm">
                No challenges available right now.
              </div>
            ) : (
              <>
                {sortedOffers.map((offer) => (
                  <ChallengeOfferCard
                    key={offer.id}
                    offer={offer}
                    onAccept={handleAccept}
                    acceptVisible={canAcceptOffer(offer)}
                  />
                ))}
                {/* {challengesData?.meta && (
                  <div className="mt-3">
                    <AppPagination
                      meta={{
                        page: challengesData.meta.currentPage,
                        limit: PAGE_SIZE,
                        total: challengesData.meta.total,
                        prev: challengesData.meta.prev,
                        next: challengesData.meta.next,
                      }}
                      onPageChange={(newPage) => {
                        setPage(newPage);
                      }}
                      showSummary={false}
                    />
                  </div>
                )} */}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}