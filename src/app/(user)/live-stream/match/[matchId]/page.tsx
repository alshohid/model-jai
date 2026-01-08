import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import RankingSection from "@/app/(public)/_components/rankingSection/RankingSection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";
import SupporterGridSection from "@/app/(auth)/_components/watchLive/SupporterGridSection";

export default function MatchDetails({
    params,
}: {
    params: { matchId: string };
}) {
    return (
        <div>
            <PublicNavbar />

            <SupporterGridSection matchId={params.matchId} />

            <RankingSection />
            <LatestNewsSection />
            <TakeGameSection />
        </div>
    );
}
