import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import RankingSection from "@/app/(public)/_components/rankingSection/RankingSection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";

const MatchDetails = () => {
    return (
        <div>
            <PublicNavbar />
            <RankingSection />
            <LatestNewsSection />
            <TakeGameSection />
        </div>
    )
}
export default MatchDetails;