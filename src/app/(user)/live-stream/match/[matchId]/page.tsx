import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import RankingSection from "@/app/(public)/_components/rankingSection/RankingSection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";
import SupporterGridSection from "@/app/(auth)/_components/watchLive/SupporterGridSection";
import MatchPointsSummarySection from "@/app/(auth)/_components/watchLive/MatchPointsSummarySection";

export default async function MatchDetails({
    params,
}: {
    params: Promise<{ matchId: string }>;
}) {
    const { matchId } = await params;

    return (
        <div>
            <PublicNavbar />

            <MatchPointsSummarySection />
            <SupporterGridSection matchId={matchId} />
            <RankingSection />
            <LatestNewsSection />
            <TakeGameSection />
        </div>
    );
}
