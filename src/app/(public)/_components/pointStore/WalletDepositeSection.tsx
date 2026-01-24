"use client";
import { useAuth } from "@/shared/providers/auth/useAuth";
import WalletDepositPanel from "./WalletDepositPanel";

const WalletDepositeSection = () => {
    const { isAuthenticated } = useAuth()

    return (
        <div className="container py-4 md:py-6">
            {
                isAuthenticated ? <WalletDepositPanel
                    balance="35000"
                    withdrawable="0.00"
                    bonus="0.00"
                    onDeposit={(v) => {
                        console.log("DEPOSIT SUBMIT 👉", v);
                        // v = { amount, priceCode, paymentMethod }
                    }}
                /> :""

            }
    </div>

    )
}
export default WalletDepositeSection;