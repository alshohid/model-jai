"use client";

import React, { useMemo, useState } from "react";
import LiveMatchStage from "@/shared/components/watchLive/LiveMatchStage";
import MatchPointsSummarySection from "@/app/(auth)/_components/watchLive/MatchPointsSummarySection";
import SupporterGridSection from "@/app/(auth)/_components/watchLive/SupporterGridSection";
import { useMatchDemoStore } from "@/shared/hooks/useMatchDemoStore";
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
import { MatchDetailsSkeleton } from "@/components/ui/MatchDetailsSkeleton";
import { useGetTikTokAndTwitchLiveStatusQuery } from "@/redux/features/support/supportManagement";
import { useLiveStatus } from "@/shared/hooks/useLiveStatus";
import MatchRulesModal from "@/shared/components/modal/MatchRulesModal";

export default function MatchDetails({
    params,
}: {
    params: Promise<{ matchId: string }>;
}) {
    const [rulesModalOpen, setRulesModalOpen] = useState(false);
    const { matchId } = React.use(params);
    const { data: matchData, isLoading: isMatchLoading } =
        useGetSingleMatchByMatchIdQuery(matchId);
    const { isLive: isLiveStatus, mode: liveMode } = useLiveStatus()
    const { data: twitchLiveData } = useGetTikTokAndTwitchLiveStatusQuery();
    const currentMatch = useMemo(() => {
        return (
            matchData?.data || null
        );
    }, [matchData]);
    const liveStore = useMatchDemoStore(matchId, currentMatch);
    const isLiveContinue = Boolean(twitchLiveData?.data?.is_live) && isLiveStatus && matchData?.data?.type === "live";
    const twitchChannel = twitchLiveData?.data?.stream?.user_login || "";
    const supportClosed = isLiveContinue;
    const rules = currentMatch?.rules ?? null;
    const modelPicture = matchData?.model_picture ?? "/images/home/middle.png";
    const watchingPeopleCount = twitchLiveData?.data?.stream?.viewer_count || 0;

    const {
        showRegistrationPrompt,
        handleRegister,
        handleLogin,
        handleSkip,
    } = useReferralRedirect();

    const tipEnabled =
        typeof window !== "undefined" &&
        localStorage.getItem("tip_shortcut_enabled") === "true";


    return (
        <div className="min-h-screen">
            <PublicNavbar />
            {isMatchLoading || !currentMatch ? <MatchDetailsSkeleton /> : (
                <div className="w-full">
                    <LiveMatchStage
                        matchId={matchId}
                        twitchChannel={twitchChannel}
                        isLive={isLiveContinue}
                        mode={liveMode as "portrait" | "landscape" | undefined}
                        supportClosed={supportClosed}
                        left={liveStore.left}
                        right={liveStore.right}
                        middle={liveStore.middle}
                        bossSide={liveStore.bossSide}
                        rules={rules}
                        modelPicture={modelPicture}
                        watchingPeopleCount={watchingPeopleCount}
                        onRulesClick={() => setRulesModalOpen(true)}
                        onSupportLeft={(amount, supporterName) =>
                            liveStore.support("left", amount, supporterName)
                        }
                        onSupportRight={(amount, supporterName) =>
                            liveStore.support("right", amount, supporterName)
                        }
                    />

                    <div className="container">
                        <MatchPointsSummarySection

                            isLive={isLiveContinue}
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
                            // supportOpen={false}
                            onSupportLeft={(amount, supporterName) =>
                                liveStore.support("left", amount, supporterName)
                            }
                            onSupportRight={(amount, supporterName) =>
                                liveStore.support("right", amount, supporterName)
                            }
                        />

                        <SupporterGridSection
                            matchId={matchId}
                            mode={(liveMode as "landscape" | "portrait") || "landscape"}
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
            )}



            <ReferralRegistrationPrompt
                open={showRegistrationPrompt}
                onRegister={handleRegister}
                onLogin={handleLogin}
                onSkip={handleSkip}
                artistName={liveStore.left.name || liveStore.right.name}
            />
            {rules && (
                <MatchRulesModal
                    open={rulesModalOpen}
                    onClose={() => setRulesModalOpen(false)}
                    rules={rules}
                />
            )}
        </div>
    );
}