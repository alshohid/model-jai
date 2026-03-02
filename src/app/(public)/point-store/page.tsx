import { Suspense } from "react";
import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import PointStoreListSection from "../_components/pointStore/PointStoreListSection";
import WalletDepositeSection from "../_components/pointStore/WalletDepositeSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";

const PointStore = () => {

    console.log("PointStore page");
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