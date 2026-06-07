import type { Metadata } from "next";

import GameBrowseSection from "@/app/(auth)/_components/watchLive/GameBrowseSection";
import LiveStreamsSection from "@/app/(auth)/_components/watchLive/LiveStreamsSection";
import WatchLivePage from "@/app/(auth)/_components/watchLive/WatchLiveContainer";
import ChooseCategorySection from "@/shared/components/home/ChooseCategorySection";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";
import { createMetadata } from "@/shared/seo/metadata";
import PublicPageStructuredData from "@/shared/seo/PublicPageStructuredData";

const liveStreamDescription =
  "Watch live gaming tournaments, browse featured match streams, and follow supporter-driven competition on Model Boss Offers.";

export const metadata: Metadata = createMetadata({
  title: "Watch Live Gaming Tournaments",
  description: liveStreamDescription,
  path: "/live-stream",
  keywords: [
    "live gaming stream",
    "watch live tournaments",
    "gaming match livestream",
  ],
});

const LiveStreamMatch = () => {
  return (
    <div>
      <PublicPageStructuredData
        path="/live-stream"
        name="Watch Live Gaming Tournaments"
        description={liveStreamDescription}
        about={[
          "Live gaming streams",
          "1v1 tournament viewing",
          "Supporter-driven competition",
        ]}
      />
      <WatchLivePage />
      <LiveStreamsSection />
      <ChooseCategorySection />
      <GameBrowseSection />
      <LatestNewsSection />
      <TakeGameSection />
    </div>
  );
};

export default LiveStreamMatch;
