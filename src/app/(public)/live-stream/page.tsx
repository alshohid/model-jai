
"use client"

import GameBrowseSection from "@/app/(auth)/_components/watchLive/GameBrowseSection";
import LiveStreamsSection from "@/app/(auth)/_components/watchLive/LiveStreamsSection";
import WatchLivePage from "@/app/(auth)/_components/watchLive/WatchLiveContainer";
import ChooseCategorySection from "@/shared/components/home/ChooseCategorySection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";

const LiveStreamMatch = () => {

    return (
        <div>
            <WatchLivePage />
            <LiveStreamsSection />
            <GameBrowseSection/>
            <ChooseCategorySection />
            <LatestNewsSection />
            <TakeGameSection />
        </div>
    )
}

export default LiveStreamMatch;