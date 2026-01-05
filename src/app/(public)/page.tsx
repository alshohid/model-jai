

import HeroSection from "./_components/heroSection/HeroSection";
import MatchesSection from "@/shared/components/home/MatchesSection";
import RankingSection from "./_components/rankingSection/RankingSection";
import WatchLivestreamSection from "@/shared/components/home/WatchLivestreamSection";
import GamesSection from "./_components/gamesSection/GamesSection";
import ChooseCategorySection from "@/shared/components/home/ChooseCategorySection";

const Public = () => {
    return (
        <main>
            <HeroSection />
            <MatchesSection />
            <WatchLivestreamSection/>
            <RankingSection />
            <GamesSection />
            <ChooseCategorySection/>
        </main>
    )
}

export default Public;