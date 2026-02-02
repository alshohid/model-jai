"use client";

import React, { useState, useEffect } from "react";
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

export default function MatchDetails({ params }: { params: Promise<{ matchId: string }> }) {
    const { matchId } = React.use(params);
    const searchParams = useSearchParams();
    const platform = (searchParams.get("platform") ?? "tiktok").toLowerCase();

    const mode: "tiktok" | "twitch" = platform === "twitch" ? "twitch" : "tiktok";

    const playbackId = "00H88JLrnB44kSp100PdoEyP4f2kwdAEI7WGRpRiXl6t8";

    // Initialize scheduledAt with a future time (4 seconds from now)
    const [scheduledAt, setScheduledAt] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return new Date(Date.now() + 50 * 1000).toISOString();
        }
        return null;
    });
    const { isLive } = useMatchLiveStatus({ scheduledAt: scheduledAt ?? "" });
    const demo = useMatchDemoStore(matchId);
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


    return (
        <div className="min-h-screen ">
            <PublicNavbar />
            <div className="w-full">
                <LiveMatchStage
                    matchId={matchId}
                    playbackId={playbackId}
                    isLive={isLive}
                    tipEnabled={tipEnabled}
                    mode={mode}
                    supportClosed={supportClosed}
                    left={demo.left}
                    right={demo.right}
                    middle={demo.middle}
                    bossSide={demo.bossSide}
                    onSupportLeft={(amount, supporterName) => demo.support("left", amount, supporterName)}
                    onSupportRight={(amount, supporterName) => demo.support("right", amount, supporterName)}
                />

                <div className="container">
                    <MatchPointsSummarySection
                        layout={mode}
                        isLive={isLive}
                        matchId={matchId}
                        left={{
                            playerName: demo.left.name,
                            teamLogoSrc: demo.left.teamLogoSrc || "",
                            points: demo.left.points,
                        }}
                        right={{
                            playerName: demo.right.name,
                            teamLogoSrc: demo.right.teamLogoSrc || "",
                            points: demo.right.points,
                        }}
                        supportOpen={false}
                        onSupportLeft={(amount, supporterName) => demo.support("left", amount, supporterName)}
                        onSupportRight={(amount, supporterName) => demo.support("right", amount, supporterName)}
                        
                    />
                    <SupporterGridSection
                        matchId={matchId}
                        isLive={isLive}
                        mode={mode}
                        leftBoss={{ name: demo.topLeft.name, total: demo.topLeft.total }}
                        rightBoss={{ name: demo.topRight.name, total: demo.topRight.total }}
                        leftImg="/images/home/supported_cardimg.png"
                        rightImg="/images/home/rightSupport.jpg"
                        onSupport={demo.support}
                    />
                </div>
                <RankingSection />
                <LatestNewsSection />
                <TakeGameSection />
                <FooterSection />
            </div>
            <ReferralRegistrationPrompt
                open={showRegistrationPrompt}
                onRegister={handleRegister}
                onLogin={handleLogin}
                onSkip={handleSkip}
                artistName={demo.left.name || demo.right.name}
            />
        </div>
    );
}
