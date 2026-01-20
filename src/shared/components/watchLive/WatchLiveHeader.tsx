"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

export default function WatchLiveHeader({
    coins = 35000,
    className,
}: {
    coins?: number;
    className?: string;
}) {
    return (
        <header
            className={cn(
                "w-full bg-[#F4B6E7] border-b border-black/20",
                className
            )}
        >
            <div className="mx-auto w-full max-w-[520px] md:max-w-[1200px] px-3 py-2 flex items-center gap-3">
                {/* Left title */}
                <div className="leading-[1.05] font-extrabold text-[#2FA8E0] text-[14px] sm:text-[16px]">
                    Model Boss
                    <br />
                    Offers
                </div>

                {/* Coins pill */}
                <div className="ml-auto flex items-center gap-2 bg-[#6EC1FF] border-2 border-black rounded-xl px-3 py-1.5">
                    <span className="text-[14px]">🪙</span>
                    <span className="font-black text-black text-[14px]">{coins}</span>
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-black bg-white">
                    <Image
                        src="/images/home/user.png"
                        alt="profile"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Menu */}
                <button
                    type="button"
                    className="w-10 h-9 rounded-xl bg-white/70 border-2 border-black flex items-center justify-center"
                    aria-label="menu"
                >
                    <span className="text-black font-black">≡</span>
                </button>

                {/* Right icon (optional) */}
                <button
                    type="button"
                    className="ml-1 w-10 h-9 rounded-xl bg-black/10 border border-black/20 flex items-center justify-center"
                    aria-label="extra"
                >
                    <span className="text-black">⟐</span>
                </button>
            </div>
        </header>
    );
}
