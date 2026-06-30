"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useGetUserAcceptedChallengesListQuery } from "@/redux/features/challenge/challengeManagement";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import { useAuth } from "@/redux/features/auth/hooks";
import { cn } from "@/shared/lib/utils/cn";
import type { ChallengeMatchOffer } from "../types";
import ChallengeOfferCard from "./ChallengeOfferCard";
import BigBossChallengeOffers from "./BigBossChallengeOffers";
import { mapApiChallengeToOffer, type ApiChallengeItem } from "../utils/apiAdapter";
import ChallengeAcceptedButton from "./ChallengeAcceptedButton";

const PAGE_SIZE = 100;

export default function AcceptedChallengesList() {
    const { isAuthenticated } = useAuth();
    const { data: meData } = useGetMeDataQuery(undefined, {
        skip: !isAuthenticated,
    });
    const currentUserId = meData?.data?.user?.id ?? null;

    const {
        data: acceptedData,
        isLoading,
        isError,
    } = useGetUserAcceptedChallengesListQuery(
        { userId: currentUserId ?? 0, page: 1, limit: PAGE_SIZE },
        { skip: !currentUserId },
    );

    const acceptedOffers = useMemo(() => {
        if (!acceptedData?.data) return [];
        const rawItems = acceptedData.data as unknown as ApiChallengeItem[];
        return rawItems
            .map(mapApiChallengeToOffer)
            .sort((a, b) => a.rank - b.rank);
    }, [acceptedData]);

    if (!isAuthenticated) {
        return (
            <main className="relative min-h-screen overflow-hidden bg-black text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{ backgroundImage: "url('/images/home/modaljai_hero.jpg')" }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.85)),radial-gradient(circle_at_top,rgba(255,0,247,0.25),transparent_38%)]" />
                <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-3 pt-[120px] sm:pt-[124px]">
                    <div className="md:mt-6 rounded-[22px] md:px-3 md:py-3">
                        <div className="w-full py-8 text-center text-white/50 text-sm">
                            Please log in to view your accepted challenges.
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (!currentUserId) {
        return (
            <main className="relative min-h-screen overflow-hidden bg-black text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{ backgroundImage: "url('/images/home/modaljai_hero.jpg')" }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.85)),radial-gradient(circle_at_top,rgba(255,0,247,0.25),transparent_38%)]" />
                <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-3 pt-[120px] sm:pt-[124px]">
                    <div className="md:mt-6 rounded-[22px] md:px-3 md:py-3">
                        <div className="w-full py-8 text-center text-white/50 text-sm">
                            Loading user information...
                        </div>
                    </div>
                </section>
            </main>
        );
    }

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
                            Loading accepted challenges...
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
                            Failed to load accepted challenges. Please try again later.
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

                    <div className="mt-2 mb-4">
                        <h2 className="text-lg font-bold text-white/80 px-2">
                            Accepted Challenges ({acceptedOffers.length})
                        </h2>
                    </div>

                    <div>
                        {acceptedOffers.length === 0 ? (
                            <div className="w-full py-8 text-center text-white/50 text-sm">
                                You haven&apos;t accepted any challenges yet.
                            </div>
                        ) : (
                            <>
                                {acceptedOffers.map((offer) => (
                                    <ChallengeOfferCard
                                        key={offer.id}
                                        offer={offer}
                                        acceptVisible={false}
                                        isShowAcceptedButton={true}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}