"use client";
import { useAuth } from "@/shared/providers/auth/useAuth";
import WalletDepositPanel from "./WalletDepositPanel";

const WalletDepositeSection = () => {
    const { isAuthenticated } = useAuth()

    return (
        <WalletDepositPanel
            locked={!isAuthenticated}
            balance="35000"
            withdrawable="0.00"
            bonus="0.00"
            onDeposit={(v) => console.log("deposit submit", v)}
            onChangePaymentMethod={() => console.log("change payment method")}
        />

    )
}
export default WalletDepositeSection;