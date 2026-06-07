import type { Metadata } from "next";
import { Suspense } from "react";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import PointStoreListSection from "../_components/pointStore/PointStoreListSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";
import { createMetadata } from "@/shared/seo/metadata";
import PublicPageStructuredData from "@/shared/seo/PublicPageStructuredData";

const pointStoreDescription =
  "Buy points on Model Boss Offers to support players, join live match activity, and stay ready for upcoming gaming tournaments.";

export const metadata: Metadata = createMetadata({
  title: "Buy Gaming Points for Live Support",
  description: pointStoreDescription,
  path: "/point-store",
  keywords: [
    "buy points online",
    "gaming support points",
    "tournament points store",
  ],
});

const PointStore = () => {
  return (
    <div>
      <PublicPageStructuredData
        path="/point-store"
        name="Buy Gaming Points for Live Support"
        description={pointStoreDescription}
        about={[
          "Gaming point packs",
          "Player support points",
          "Tournament activity credits",
        ]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PointStoreListSection />
      </Suspense>
      <LatestNewsSection />
      <TakeGameSection />
    </div>
  );
};

export default PointStore;
