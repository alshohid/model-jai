"use client";

import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import { XCircle } from "lucide-react";

interface IChallengeLostToastProps {
    amount: number;
}

export default function ChallengeLostToast({
    amount,
}: IChallengeLostToastProps) {
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-red-500/20 bg-black/95 backdrop-blur-xl shadow-2xl">
            <div className="flex gap-4 p-4">
                {/* Logo */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-3xl">
                    <BrandMark width={100} height={100} />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <h3 className="text-[0.7rem] font-bold text-white md:text-[0.9rem]">
                            Model Boss Offers
                        </h3>

                        <span className="text-xs text-gray-400">
                            now
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                            <XCircle className="h-3 w-3 text-white" />
                        </div>

                        <span className="text-[0.67rem] text-gray-200 md:text-[0.9rem]">
                            You Lost!
                        </span>
                    </div>

                    <p className="text-[0.67rem] text-white md:text-[0.9rem]">
                        Better luck next time. You lost{" "}
                        <span className="font-semibold text-red-400">
                            ${amount.toFixed(2)}
                        </span>
                    </p>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-1 w-40 rounded-r-full bg-gradient-to-r from-red-500 to-rose-500" />
        </div>
    );
}