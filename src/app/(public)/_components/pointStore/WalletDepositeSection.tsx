"use client";

import { useAuth } from "@/redux/features/auth/hooks";
import WalletDepositPanel from "./WalletDepositPanel";

const WalletDepositeSection = () => {
    const { isAuthenticated, role } = useAuth()

    return (
        <div className="container py-4 md:py-6">
            {
                isAuthenticated && role !== "user" && role !== "artist" ? <WalletDepositPanel
                    balance="35000"
                    withdrawable="0.00"
                    bonus="0.00"
                /> : ""

            }
        </div>

    )
}
export default WalletDepositeSection;
