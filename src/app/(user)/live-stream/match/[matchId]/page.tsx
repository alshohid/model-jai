

"use client";

import { useState } from "react";
import LiveMatchStage from "@/shared/components/watchLive/LiveMatchStage";
import MatchPointsSummarySection from "@/app/(auth)/_components/watchLive/MatchPointsSummarySection";
import SupporterGridSection from "@/app/(auth)/_components/watchLive/SupporterGridSection";
import { useMatchLiveStatus } from "@/shared/providers/hook/useMatchLiveStatus";
import { useMatchDemoStore } from "@/shared/hooks/useMatchDemoStore";
import { useOrientationLayout } from "@/shared/hooks/useOrientationLayout";
// import { useOrientationLayout } from "@/shared/hooks/useOrientationLayout";

export default function MatchDetails({ params }: { params: { matchId: string } }) {
    const { matchId } = params;
    const playbackId = "00H88JLrnB44kSp100PdoEyP4f2kwdAEI7WGRpRiXl6t8";

    const [scheduledAt, setScheduledAt] = useState<string | null>(null);
    const { isLive, timeLeft } = useMatchLiveStatus({ scheduledAt: scheduledAt ?? "" });

    const layout = useOrientationLayout(); // "tiktok" | "twitch"

    // ✅ demo store
    const demo = useMatchDemoStore(matchId);

    const handleStartStreaming = () => {
        const twentySecLater = new Date(Date.now() + 20 * 1000).toISOString();
        setScheduledAt(twentySecLater);
    };

    return (
        <div className="min-h-screen bg-black">
            <LiveMatchStage
                matchId={matchId}
                playbackId={playbackId}
                isLive={isLive}
                layout={layout}
                // ✅ clickable support
                onSupportLeft={() => demo.support("left", 100)}
                onSupportRight={() => demo.support("right", 100)}
                // ✅ top panel data
                leftPlayer={demo.leftPlayer}
                rightPlayer={demo.rightPlayer}
                middle={demo.middle}
                bossSide={demo.bossSide}
            />

            <MatchPointsSummarySection
                layout={layout}
                isLive={isLive}
                timeLeft={timeLeft}
                onStartStreaming={handleStartStreaming}
                isScheduled={!!scheduledAt}
                // ✅ summary data store থেকে
                left={{
                    playerName: demo.leftPlayer.name,
                    teamLogoSrc: demo.leftPlayer.teamLogoSrc || "",
                    points: demo.leftPlayer.points,
                }}
                right={{
                    playerName: demo.rightPlayer.name,
                    teamLogoSrc: demo.rightPlayer.teamLogoSrc || "",
                    points: demo.rightPlayer.points,
                }}
                supportOpen={false} // demo: live থাকলেও closed রাখতে পারো
            />

            <SupporterGridSection
                matchId={matchId}
                layout={layout}
                leftPlayerName={demo.leftPlayer.name}
                rightPlayerName={demo.rightPlayer.name}
                leftBoss={demo.topLeftSupporter}
                rightBoss={demo.topRightSupporter}
                onSupport={demo.support} // ✅ grid click -> points update
            />
        </div>
    );
}





// "use client";

// import { useState } from "react";
// import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
// import RankingSection from "@/app/(public)/_components/rankingSection/RankingSection";
// import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
// import TakeGameSection from "@/shared/components/home/TakeGameSection";
// import SupporterGridSection from "@/app/(auth)/_components/watchLive/SupporterGridSection";
// import MatchPointsSummarySection from "@/app/(auth)/_components/watchLive/MatchPointsSummarySection";
// import FooterSection from "@/shared/components/home/FooterSection";
// import LiveMatchStage from "@/shared/components/watchLive/LiveMatchStage";
// import { useMatchLiveStatus } from "@/shared/providers/hook/useMatchLiveStatus";

// export default function MatchDetails({
//     params,
// }: {
//     params: { matchId: string };
// }) {
//     const { matchId } = params;
//     const playbackId = "00H88JLrnB44kSp100PdoEyP4f2kwdAEI7WGRpRiXl6t8";
//     const [scheduledAt, setScheduledAt] = useState<string | null>(null);

//     const { isLive, timeLeft } = useMatchLiveStatus({
//         scheduledAt: scheduledAt ?? "", 
//     });

//     const handleStartStreaming = () => {
//         const oneMinuteLater = new Date(Date.now() + 20 * 1000).toISOString();
//         setScheduledAt(oneMinuteLater);
//     };

//     return (
//         <div>
//             <PublicNavbar />

//             {/* {isLive && ( */}
//                 <LiveMatchStage matchId={matchId} playbackId={playbackId} />
//             {/* )} */}

//             <MatchPointsSummarySection
//                 isLive={isLive}
//                 timeLeft={timeLeft}
//                 onStartStreaming={handleStartStreaming}
//                 isScheduled={!!scheduledAt}
//             />

//             {/* {!isLive && <SupporterGridSection matchId={matchId} />} */}
//             <SupporterGridSection matchId={matchId} />

//             <RankingSection />
//             <LatestNewsSection />
//             <TakeGameSection />
//             <FooterSection />
//         </div>
//     );
// }
