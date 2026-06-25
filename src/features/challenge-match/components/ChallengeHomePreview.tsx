"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetAllPublicChallengesListQuery } from "@/redux/features/challenge/challengeManagement";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import { useAuth } from "@/redux/features/auth/hooks";
import ChallengeOfferCard from "./ChallengeOfferCard";
import BigBossChallengeOffers from "./BigBossChallengeOffers";
import { mapApiChallengeToOffer, type ApiChallengeItem } from "../utils/apiAdapter";

export default function ChallengeHomePreview() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();


  const { data: challengesData, isLoading, isError } =
    useGetAllPublicChallengesListQuery({ page: 1, limit: 3 });

  const { data: meData } = useGetMeDataQuery(undefined, {
    skip: !isAuthenticated,
  });

  const currentUserId = meData?.data?.user?.id ?? null;
  const topOffers = useMemo(() => {
    if (!challengesData?.data) return [];

    const rawItems = challengesData.data as unknown as ApiChallengeItem[];

    return rawItems
      .map(mapApiChallengeToOffer)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 3);
  }, [challengesData]);


  const canAcceptOffer = (offer: ReturnType<typeof mapApiChallengeToOffer>) => {
    if (offer.mode === "global") {
      return currentUserId != null && Number(offer.challenger.id) !== Number(currentUserId);
    }
    if (offer.mode === "unique") {
      return offer.targetPlayerId != null && currentUserId != null
        ? Number(offer.targetPlayerId) === Number(currentUserId) && Number(offer.challenger.id) !== Number(currentUserId)
        : false;
    }

  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full rounded-[24px] text-left">
        <Link href="/challenge-dashboard">
          <div className="relative mx-auto w-full max-w-[520px]">
            <BigBossChallengeOffers />
          </div>
        </Link>
        <div className="w-full py-8 text-center text-white/50 text-sm">
          Loading challenges...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full rounded-[24px] text-left">
        <Link href="/challenge-dashboard">
          <div className="relative mx-auto w-full max-w-[520px]">
            <BigBossChallengeOffers />
          </div>
        </Link>
        <div className="w-full py-8 text-center text-red-400 text-sm">
          Failed to load challenges. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full rounded-[24px] text-left">
      <Link href="/challenge-dashboard">
        <div className="relative mx-auto w-full max-w-[520px]">
          <BigBossChallengeOffers />
        </div>
      </Link>
      <div className="w-full">
        {topOffers.length === 0 ? (
          <div className="w-full py-8 text-center text-white/50 text-sm">
            No challenges available right now.
          </div>
        ) : (
          topOffers.map((offer) => (
            <ChallengeOfferCard
              key={offer.id}
              offer={offer}
              compact
              onAccept={() => router.push(`/challenge-dashboard/${offer.id}`)}
              acceptVisible={canAcceptOffer(offer)}
            />
          ))
        )}
      </div>
    </div>
  );
}