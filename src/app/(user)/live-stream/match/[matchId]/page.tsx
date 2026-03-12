"use client";

import React, { useMemo, useState } from "react";
import LiveMatchStage from "@/shared/components/watchLive/LiveMatchStage";
import MatchPointsSummarySection from "@/app/(auth)/_components/watchLive/MatchPointsSummarySection";
import SupporterGridSection from "@/app/(auth)/_components/watchLive/SupporterGridSection";
import { useMatchLiveStatus } from "@/shared/providers/hook/useMatchLiveStatus";
import { useMatchDemoStore } from "@/shared/hooks/useMatchDemoStore";
import { useSearchParams } from "next/navigation";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import RankingSection from "@/app/(public)/_components/rankingSection/RankingSection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";
import FooterSection from "@/shared/components/home/FooterSection";
import {
    useReferralRedirect,
    ReferralRegistrationPrompt,
} from "@/shared/hooks/useReferralRedirect";
import { useGetSingleMatchByMatchIdQuery } from "@/redux/features/match/matchManagement";

export default function MatchDetails({
    params,
}: {
    params: Promise<{ matchId: string }>;
}) {
    const { matchId } = React.use(params);
    const searchParams = useSearchParams();
    const platform = (searchParams.get("platform") ?? "tiktok").toLowerCase();
    const mode: "tiktok" | "twitch" = platform === "twitch" ? "twitch" : "tiktok";

    const playbackId = "00H88JLrnB44kSp100PdoEyP4f2kwdAEI7WGRpRiXl6t8";

    const [scheduledAt] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return new Date(Date.now() + 1000 * 1000).toISOString();
        }
        return null;
    });

    const { isLive } = useMatchLiveStatus({ scheduledAt: scheduledAt ?? "" });

    const { data: matchData, isLoading: isMatchLoading } =
        useGetSingleMatchByMatchIdQuery(matchId);

    const currentMatch = useMemo(() => {
        return (
            matchData?.data || null
        );
    }, [matchData]);

    const liveStore = useMatchDemoStore(matchId, currentMatch);

    const supportClosed = isLive;

    const {
        showRegistrationPrompt,
        handleRegister,
        handleLogin,
        handleSkip,
    } = useReferralRedirect();

    const tipEnabled =
        typeof window !== "undefined" &&
        localStorage.getItem("tip_shortcut_enabled") === "true";

    if (isMatchLoading || !currentMatch) {
        return (
            <div className="min-h-screen bg-black text-white">
                <PublicNavbar />
                <div className="container py-24">Loading match...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <PublicNavbar />

            <div className="w-full">
                <LiveMatchStage
                    matchId={matchId}
                    playbackId={playbackId}
                    isLive={isLive}
                    mode={mode}
                    supportClosed={supportClosed}
                    left={liveStore.left}
                    right={liveStore.right}
                    middle={liveStore.middle}
                    bossSide={liveStore.bossSide}
                    onSupportLeft={(amount, supporterName) =>
                        liveStore.support("left", amount, supporterName)
                    }
                    onSupportRight={(amount, supporterName) =>
                        liveStore.support("right", amount, supporterName)
                    }
                />

                <div className="container">
                    <MatchPointsSummarySection
                        layout={mode}
                        isLive={isLive}
                        matchId={matchId}
                        tipEnabled={tipEnabled}

                        left={{
                            playerName: liveStore.left.name,
                            teamLogoSrc: liveStore.left.teamLogoSrc || "",
                            points: liveStore.left.points,
                            playerId: liveStore.left.id,
                        }}
                        right={{
                            playerName: liveStore.right.name,
                            teamLogoSrc: liveStore.right.teamLogoSrc || "",
                            points: liveStore.right.points,
                            playerId: liveStore.right.id,
                        }}
                        supportOpen={false}
                        onSupportLeft={(amount, supporterName) =>
                            liveStore.support("left", amount, supporterName)
                        }
                        onSupportRight={(amount, supporterName) =>
                            liveStore.support("right", amount, supporterName)
                        }
                    />

                    <SupporterGridSection
                        matchId={matchId}
                        isLive={isLive}
                        mode={mode}
                        leftBossName={liveStore.left.name}
                        rightBossName={liveStore.right.name}
                        leftBoss={{
                            name: liveStore.leftBoss.name,
                            total: liveStore.left.points,
                        }}
                        rightBoss={{
                            name: liveStore.rightBoss.name,
                            total: liveStore.right.points,
                        }}
                        leftImg={liveStore.leftBoss.imageSrc || "/images/home/supported_cardimg.png"}
                        rightImg={liveStore.rightBoss.imageSrc || "/images/home/rightSupport.jpg"}
                        onSupport={liveStore.support}
                    />

                    <RankingSection
                        data={liveStore.rankingSupporters}
                        isLoading={isMatchLoading}
                    />
                </div>

                <LatestNewsSection />
                <TakeGameSection />
                <FooterSection />
            </div>

            <ReferralRegistrationPrompt
                open={showRegistrationPrompt}
                onRegister={handleRegister}
                onLogin={handleLogin}
                onSkip={handleSkip}
                artistName={liveStore.left.name || liveStore.right.name}
            />
        </div>
    );
}