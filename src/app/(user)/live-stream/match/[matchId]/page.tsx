"use client";

import { useState } from "react";
import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import RankingSection from "@/app/(public)/_components/rankingSection/RankingSection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";
import SupporterGridSection from "@/app/(auth)/_components/watchLive/SupporterGridSection";
import MatchPointsSummarySection from "@/app/(auth)/_components/watchLive/MatchPointsSummarySection";
import FooterSection from "@/shared/components/home/FooterSection";
import LiveMatchStage from "@/shared/components/watchLive/LiveMatchStage";
import { useMatchLiveStatus } from "@/shared/providers/hook/useMatchLiveStatus";

export default function MatchDetails({
    params,
}: {
    params: { matchId: string };
}) {
    const { matchId } = params;
    const playbackId = "00H88JLrnB44kSp100PdoEyP4f2kwdAEI7WGRpRiXl6t8";
    const [scheduledAt, setScheduledAt] = useState<string | null>(null);

    const { isLive, timeLeft } = useMatchLiveStatus({
        scheduledAt: scheduledAt ?? "", 
    });

    const handleStartStreaming = () => {
        const oneMinuteLater = new Date(Date.now() + 20 * 1000).toISOString();
        setScheduledAt(oneMinuteLater);
    };

    return (
        <div>
            <PublicNavbar />

            {/* {isLive && ( */}
                <LiveMatchStage matchId={matchId} playbackId={playbackId} />
            {/* )} */}

            <MatchPointsSummarySection
                isLive={isLive}
                timeLeft={timeLeft}
                onStartStreaming={handleStartStreaming}
                isScheduled={!!scheduledAt}
            />

            {/* {!isLive && <SupporterGridSection matchId={matchId} />} */}
            <SupporterGridSection matchId={matchId} />

            <RankingSection />
            <LatestNewsSection />
            <TakeGameSection />
            <FooterSection />
        </div>
    );
}
