
import RankPointReusableTable from "@/shared/components/rankPointTable/RankPointReusableTable";
import HeroSection from "./_components/heroSection/HeroSection";
import MatchesSection from "@/shared/components/home/MatchesSection";

const Public = () => {
    return (
        <main>
            <HeroSection />
            <MatchesSection />
            <RankPointReusableTable/>

        </main>
    )
}

export default Public;