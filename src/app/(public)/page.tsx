

import HeroSection from "./_components/heroSection/HeroSection";
import MatchesSection from "@/shared/components/home/MatchesSection";
import RankingSection from "./_components/rankingSection/RankingSection";
import WatchLivestreamSection from "@/shared/components/home/WatchLivestreamSection";
import GamesSection from "./_components/gamesSection/GamesSection";
import ChooseCategorySection from "@/shared/components/home/ChooseCategorySection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";
import VideosSection from "@/shared/components/home/VideosSection";


const Public = () => {
    return (
        <main>
            <HeroSection />
            <MatchesSection />
            <RankingSection />
            <WatchLivestreamSection />
            <VideosSection/>
            <GamesSection />
            <ChooseCategorySection />
            <LatestNewsSection />
            <TakeGameSection />
        </main>
    )
}

export default Public;