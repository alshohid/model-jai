"use client";
import { useAuth } from "@/shared/providers/auth/useAuth";
import WalletDepositPanel from "./WalletDepositPanel";

const WalletDepositeSection = () => {
    const { isAuthenticated } = useAuth()

    return (
        <div className="container py-4 md:py-6">
            <WalletDepositPanel
                locked={!isAuthenticated}
                balance="35000"
                withdrawable="0.00"
                bonus="0.00"
                onDeposit={(v) => console.log("deposit submit", v)}
                onChangePaymentMethod={() => console.log("change payment method")}
            />
      </div>

    )
}
export default WalletDepositeSection;