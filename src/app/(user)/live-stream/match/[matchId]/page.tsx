import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import RankingSection from "@/app/(public)/_components/rankingSection/RankingSection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";
import SupporterGridSection from "@/app/(auth)/_components/watchLive/SupporterGridSection";
import MatchPointsSummarySection from "@/app/(auth)/_components/watchLive/MatchPointsSummarySection";
import LiveMatchTriplePanel from "@/shared/components/watchLive/LiveMatchTriplePanel";


export default async function MatchDetails({
    params,
}: {
    params: Promise<{ matchId: string }>;
}) {
    const { matchId } = await params;

    return (
        <div >
            <PublicNavbar />
            <LiveMatchTriplePanel
                leftImage="/images/home/panel_left.png"
                middleImage="/images/home/middle.png"
                rightImage="/images/home/panel_right.png"
                left={{
                    name: "Jack",
                    points: 1000,
                    symbolSrc: "/images/home/taken_slot.png",
                }}
                right={{
                    name: "Steve",
                    points: 1000,
                    symbolSrc: "/images/home/available_slot.png",
                }}
                middleLabel="Model"
            />

            <MatchPointsSummarySection />
            <SupporterGridSection matchId={matchId} />
            <RankingSection />
            <LatestNewsSection />
            <TakeGameSection />
        </div>
    );
}
