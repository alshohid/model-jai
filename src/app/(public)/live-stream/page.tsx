
import WatchLivePage from "@/app/(auth)/_components/auth/watchLive/WatchLiveContainer";
import ChooseCategorySection from "@/shared/components/home/ChooseCategorySection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";

const LiveStreamMatch = () => {
    return (
        <div>
            <WatchLivePage/>
            <ChooseCategorySection />
            <LatestNewsSection />
            <TakeGameSection />
        </div>
    )
}

export default LiveStreamMatch;