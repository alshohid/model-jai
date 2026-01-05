

import HeroSection from "./_components/heroSection/HeroSection";
import MatchesSection from "@/shared/components/home/MatchesSection";
import RankingSection from "./_components/rankingSection/RankingSection";
import WatchLivestreamSection from "@/shared/components/home/WatchLivestreamSection";
import GamesSection from "./_components/gamesSection/GamesSection";

const Public = () => {
    return (
        <main>
            <HeroSection />
            <MatchesSection />
            <WatchLivestreamSection/>
            <RankingSection />
            <GamesSection/>
        </main>
    )
}

export default Public;