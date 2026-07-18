"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetAllPublicChallengesListQuery } from "@/redux/features/challenge/challengeManagement";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import { useAuth } from "@/redux/features/auth/hooks";
import ChallengeOfferCard from "./ChallengeOfferCard";
import BigBossChallengeOffers from "./BigBossChallengeOffers";
import { mapApiChallengeToOffer, type ApiChallengeItem } from "../utils/apiAdapter";

type ChallengeOffer = ReturnType<typeof mapApiChallengeToOffer>;

export function canAcceptOffer(offer: ChallengeOffer, currentUserId: number | null): boolean {
  if (currentUserId == null) return false;
  if (Number(offer.challenger.id) === currentUserId) return false;

  if (offer.mode === "global") return true;

  // mode === "unique"
  return offer.targetPlayerId != null && Number(offer.targetPlayerId) === currentUserId;
}

export function PreviewHeader() {
  return (
    <Link href="/challenge-dashboard">
      <div className="relative mx-auto w-full max-w-[520px]">
        <BigBossChallengeOffers />
      </div>
    </Link>
  );
}

export default function ChallengeHomePreview() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { data: challengesData, isLoading, isError } =
    useGetAllPublicChallengesListQuery({ page: 1, limit: 3 });

  const { data: meData } = useGetMeDataQuery(undefined, { skip: !isAuthenticated });
  const currentUserId = meData?.data?.user?.id ?? null;

  const offers = useMemo(() => {
    if (!challengesData?.data) return [];
    return (challengesData.data as unknown as ApiChallengeItem[])
      .map(mapApiChallengeToOffer)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 3)
      .map((offer) => ({ offer, acceptVisible: canAcceptOffer(offer, currentUserId) }));
  }, [challengesData, currentUserId]);

  const goToOffer = useCallback(
    (offerId: string) => router.push(`/challenge-dashboard/${offerId}`),
    [router],
  );

  return (
    <div className="mx-auto w-full rounded-[24px] text-left">
      <PreviewHeader />
      <div className="w-full">
        {isLoading ? (
          <p className="w-full py-8 text-center text-white/50 text-sm">Loading challenges...</p>
        ) : isError ? (
          <p className="w-full py-8 text-center text-red-400 text-sm">
            Failed to load challenges. Please try again later.
          </p>
        ) : offers.length === 0 ? (
          <p className="w-full py-8 text-center text-white/50 text-sm">
            No challenges available right now.
          </p>
        ) : (
          offers.map(({ offer, acceptVisible }) => (
            <ChallengeOfferCard
              key={offer.id}
              offer={offer}
              compact
              onAccept={() => goToOffer(offer.id)}
              acceptVisible={acceptVisible}
            />
          ))
        )}
      </div>
    </div>
  );
}
