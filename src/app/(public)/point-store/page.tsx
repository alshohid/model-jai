import type { Metadata } from "next";
import { Suspense } from "react";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import PointStoreListSection from "../_components/pointStore/PointStoreListSection";
import WalletDepositeSection from "../_components/pointStore/WalletDepositeSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";
import { createMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createMetadata({
    title: "Buy Points for Live Support and Tournament Activity",
    description:
        "Buy points on Model Boss Offers to support players, join live match activity, and stay ready for upcoming gaming tournaments.",
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
            {/* <WalletDepositeSection /> */}
            <Suspense fallback={<div>Loading...</div>}>
                <PointStoreListSection />
            </Suspense>
            <LatestNewsSection />
            <TakeGameSection />
        </div>
    )
}
export default PointStore;
