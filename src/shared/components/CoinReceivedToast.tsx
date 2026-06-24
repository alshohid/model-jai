"use client";

import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import { Wallet } from "lucide-react";



interface ICoinReceivedToastProps {
    sender_name: string;
    amount: number;
}

export default function CoinReceivedToast({
    sender_name,
    amount,
}: ICoinReceivedToastProps) {
    return (
        <div className="w-full overflow-hidden rounded-[32px] border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl">
            <div className="flex gap-4 p-4">
                <div className=" flex items-center justify-center h-12 w-12 shrink-0 overflow-hidden rounded-3xl ">
                    <BrandMark width={100} height={100} />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <h3 className="text-[1rem] md:text-[1.2rem] font-bold text-white">
                            Model Boss Offers
                        </h3>

                        <span className="text-sm text-gray-400">
                            now
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600">
                            <Wallet className="w-4 h-4" />
                        </div>

                        <span className="text-[.7rem] md:text-[.9rem] text-gray-200">
                            Money Received
                        </span>
                    </div>

                    <p className="mt-3 text-[.67rem] md:text-[0.9rem] text-white">
                        {sender_name} has sent you{" "}
                        <span className="font-semibold text-violet-400">
                            ${amount.toFixed(2)}
                        </span>
                    </p>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-1 w-40 rounded-r-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
        </div>
    );
}