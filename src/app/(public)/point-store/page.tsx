import LatestNewsSection from "@/shared/components/home/LatestNewsSection";
import PointStoreListSection from "../_components/pointStore/PointStoreListSection";
import WalletDepositeSection from "../_components/pointStore/WalletDepositeSection";
import TakeGameSection from "@/shared/components/home/TakeGameSection";

const PointStore = () => {
    return (
        <div>
            <WalletDepositeSection />
            <PointStoreListSection />
            <LatestNewsSection />
            <TakeGameSection />
        </div>
    )
}
export default PointStore;