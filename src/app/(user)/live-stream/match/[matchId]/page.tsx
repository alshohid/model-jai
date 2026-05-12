"use client";

import React, { useEffect, useMemo, useState } from "react";
import LiveMatchStage from "@/shared/components/watchLive/LiveMatchStage";
import MatchPointsSummarySection from "@/app/(auth)/_components/watchLive/MatchPointsSummarySection";
import SupporterGridSection from "@/app/(auth)/_components/watchLive/SupporterGridSection";
import { useMatchDemoStore } from "@/shared/hooks/useMatchDemoStore";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import RankingSection from "@/app/(public)/_components/rankingSection/RankingSection";
import {
    useReferralRedirect,
    ReferralRegistrationPrompt,
} from "@/shared/hooks/useReferralRedirect";
import { useGetSingleMatchByMatchIdQuery } from "@/redux/features/match/matchManagement";
import { MatchDetailsSkeleton } from "@/components/ui/MatchDetailsSkeleton";
import { useGetTikTokAndTwitchLiveStatusQuery } from "@/redux/features/support/supportManagement";
import { useLiveStatus } from "@/shared/hooks/useLiveStatus";
import MatchRulesModal from "@/shared/components/modal/MatchRulesModal";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import MatchVotingProvider from "@/shared/providers/MatchVotingProvider";

export default function MatchDetails({
    params,
}: {
    params: Promise<{ matchId: string }>;
}) {
    const [rulesModalOpen, setRulesModalOpen] = useState(false);
    const [tipEnabled, setTipEnabled] = useState(false);
    const { matchId } = React.use(params);
    const { data: matchData, isLoading: isMatchLoading } =
        useGetSingleMatchByMatchIdQuery(matchId);
    const { isLive: isLiveStatus, mode: liveMode } = useLiveStatus()
    const { data: twitchLiveData } = useGetTikTokAndTwitchLiveStatusQuery();
    const { data: meData } = useGetMeDataQuery()
    const currentMatch = useMemo(() => {
        if (!matchData?.data) return null;

        return {
            ...matchData.data,
            top_supporters:
                matchData.top_supporters ?? matchData.data.top_supporters ?? [],
            top_voters: matchData.top_voters ?? matchData.data.top_voters ?? [],
            player_one_top_supporter:
                matchData.player_one_top_supporter ??
                matchData.data.player_one_top_supporter ??
                null,
            player_two_top_supporter:
                matchData.player_two_top_supporter ??
                matchData.data.player_two_top_supporter ??
                null,
            player_one_votes:
                matchData.player_one_votes ?? matchData.data.player_one_votes ?? null,
            player_two_votes:
                matchData.player_two_votes ?? matchData.data.player_two_votes ?? null,
            player_one_total_supporter:
                matchData.player_one_total_supporter ??
                matchData.data.player_one_total_supporter ??
                null,
            player_two_total_supporter:
                matchData.player_two_total_supporter ??
                matchData.data.player_two_total_supporter ??
                null,
        };
    }, [matchData]);
    const userReferralNo = meData?.data?.user?.referral_no || "";
    const liveStore = useMatchDemoStore(matchId, currentMatch);
    const isLiveContinue = Boolean(twitchLiveData?.data?.is_live) && isLiveStatus && matchData?.data?.type === "live";
    const twitchChannel = twitchLiveData?.data?.stream?.user_login || "";
    const supportClosed = isLiveContinue;
    const rules = currentMatch?.rules ?? null;
    const modelPicture = matchData?.model_picture ?? "/images/home/middle.png";
    const matchType = currentMatch?.type;
    const watchingPeopleCount = twitchLiveData?.data?.stream?.viewer_count || 0;
    const playerOneLogo = currentMatch?.player_one_logo;
    const playerTwoLogo = currentMatch?.player_two_logo;
    const tiktokLink = currentMatch?.tiktok_link ?? null;
    const leftBossSupporterCount = Number(
        liveStore.leftBossSupporterCount ?? currentMatch?.player_one_total_supporter ?? 0
    );
    const rightBossSupporterCount = Number(
        liveStore.rightBossSupporterCount ?? currentMatch?.player_two_total_supporter ?? 0
    );
    const isVoteClosed = isLiveStatus && matchData?.data?.type === "live"
    const {
        showRegistrationPrompt,
        handleRegister,
        handleLogin,
        handleSkip,
    } = useReferralRedirect();

    useEffect(() => {
        const syncTipShortcut = () => {
            setTipEnabled(localStorage.getItem("tip_shortcut_enabled") === "true");
        };

        const handleTipShortcutChange = (event: Event) => {
            const customEvent = event as CustomEvent<{ storageKey?: string; value?: boolean }>;
            if (customEvent.detail?.storageKey === "tip_shortcut_enabled") {
                setTipEnabled(Boolean(customEvent.detail.value));
            }
        };

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "tip_shortcut_enabled") {
                setTipEnabled(event.newValue === "true");
            }
        };

        syncTipShortcut();
        window.addEventListener("tip-shortcut-change", handleTipShortcutChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("tip-shortcut-change", handleTipShortcutChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);


    return (
        <div className="min-h-screen">
            <PublicNavbar />
            {isMatchLoading || !currentMatch ? <MatchDetailsSkeleton /> : (
                <div className="w-full">
                    <LiveMatchStage
                        matchId={matchId}
                        playerOneLogo={playerOneLogo ?? undefined}
                        playerTwoLogo={playerTwoLogo ?? undefined}
                        twitchChannel={twitchChannel}
                        isLive={isLiveContinue}
                        mode={liveMode as "portrait" | "landscape" | undefined}
                        supportClosed={supportClosed}
                        left={liveStore.left}
                        right={liveStore.right}
                        middle={liveStore.middle}
                        bossSide={liveStore.bossSide}
                        rules={rules}
                        gameLogo={liveStore.left.teamLogoSrc || ""}
                        modelPicture={modelPicture}
                        tiktokLink={tiktokLink}
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
                        <MatchVotingProvider
                            matchId={matchId}
                            matchData={currentMatch}
                            leftPlayerImageSrc={liveStore.left.imageSrc}
                            rightPlayerImageSrc={liveStore.right.imageSrc}
                        >
                            <MatchPointsSummarySection

                                isLive={isLiveContinue}
                                matchType={matchType}
                                gameId={currentMatch?.game_id}
                                matchId={matchId}
                                matchData={currentMatch}
                                tipEnabled={tipEnabled}
                                userReferralNo={userReferralNo}
                                leftPlayerImageSrc={liveStore.left.imageSrc}
                                rightPlayerImageSrc={liveStore.right.imageSrc}

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
                        </MatchVotingProvider>
                        {
                            !isVoteClosed ? (
                                <>
                                    <SupporterGridSection
                                        key={matchId}
                                        mode={(liveMode as "landscape" | "portrait") || "landscape"}
                                        leftBossName={liveStore.left.name}
                                        rightBossName={liveStore.right.name}
                                        leftBoss={{
                                            name: liveStore.leftBoss.name,
                                            total: leftBossSupporterCount,
                                        }}
                                        rightBoss={{
                                            name: liveStore.rightBoss.name,
                                            total: rightBossSupporterCount,
                                        }}
                                        leftImg={liveStore.leftBoss.imageSrc || "/images/home/supported_cardimg.png"}
                                        rightImg={liveStore.rightBoss.imageSrc || "/images/home/rightSupport.jpg"}
                                        onSupport={liveStore.support}
                                    />

                                    <RankingSection
                                        data={liveStore.rankingSupporters}
                                        isLoading={isMatchLoading}
                                    />
                                </>
                            ) : (null)
                        }
                    </div>

                    {/* <LatestNewsSection />
                    <TakeGameSection />
                    <FooterSection /> */}
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
