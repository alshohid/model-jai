"use client";

import React, { useState, useEffect } from "react";
import LiveMatchStage from "@/shared/components/watchLive/LiveMatchStage";
import MatchPointsSummarySection from "@/app/(auth)/_components/watchLive/MatchPointsSummarySection";
import SupporterGridSection from "@/app/(auth)/_components/watchLive/SupporterGridSection";
import { useMatchLiveStatus } from "@/shared/providers/hook/useMatchLiveStatus";
import { useMatchDemoStore } from "@/shared/hooks/useMatchDemoStore";


import { useSearchParams } from "next/navigation";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";

export default function MatchDetails({ params }: { params: Promise<{ matchId: string }> }) {
    const [isScheduling, setIsScheduling] = useState(false);
    const [countdownSec, setCountdownSec] = useState<number>(0);
    
    const { matchId } = React.use(params);

    const searchParams = useSearchParams(); 
    const platform = (searchParams.get("platform") ?? "tiktok").toLowerCase();

    const mode: "tiktok" | "twitch" = platform === "twitch" ? "twitch" : "tiktok";

    const playbackId = "00H88JLrnB44kSp100PdoEyP4f2kwdAEI7WGRpRiXl6t8";

    const [scheduledAt, setScheduledAt] = useState<string | null>(null);
    const { isLive } = useMatchLiveStatus({ scheduledAt: scheduledAt ?? "" });
    const demo = useMatchDemoStore(matchId);
    const supportClosed = isLive;
    const startDemoLive = () => {

        const seconds = 4;
        const t = new Date(Date.now() + seconds * 1000).toISOString();
        setScheduledAt(t);
        setCountdownSec(seconds);
        setIsScheduling(true);
    };


    useEffect(() => {
        if (!isScheduling) return;

        const timer = setInterval(() => {
            setCountdownSec((s) => {
                if (s <= 1) {
                    clearInterval(timer);
                    setIsScheduling(false);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isScheduling]);

    return (
        <div className="min-h-screen bg-black">
            <PublicNavbar/> 
            <div className="w-full">
                <LiveMatchStage
                    matchId={matchId}
                    playbackId={playbackId}
                    isLive={isLive}
                    mode={mode} 
                    supportClosed={supportClosed}
                    left={demo.left}
                    right={demo.right}
                    middle={demo.middle}
                    bossSide={demo.bossSide}
                    onSupportLeft={() => demo.support("left", 100)}
                    onSupportRight={() => demo.support("right", 100)}
                />

                <div className="container">
                    <MatchPointsSummarySection
                        layout={mode}
                        isLive={isLive}
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
                    />
                    {!isLive  && (
                        <div className="flex justify-center pb-10">
                            <button
                                onClick={startDemoLive}
                                disabled={isScheduling}
                                className={[
                                    "px-6 py-3 rounded-xl transition font-semibold text-white shadow-lg",
                                    isScheduling ? "bg-white/10 cursor-not-allowed" : "bg-red-600 hover:bg-red-700",
                                ].join(" ")}
                            >
                                {isScheduling ? `Live in ${countdownSec}s…` : "Start Live (Demo)"}
                            </button>
                        </div>
                    )}


                    <SupporterGridSection
                        matchId={matchId}
                        isLive={isLive}
                        mode={mode}
                        leftBoss={{ name: demo.topLeft.name, total: demo.topLeft.total }}
                        rightBoss={{ name: demo.topRight.name, total: demo.topRight.total }}
                        leftImg="/images/home/supported_cardimg.png"
                        rightImg="/images/home/rightPlayer_1.png"
                        onSupport={demo.support}
                    />
            </div>
            </div>
    
        </div>
    );
}
