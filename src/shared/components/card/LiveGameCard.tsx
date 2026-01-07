"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

type LiveGameCardProps = {
    cover: string;
    isLive?: boolean;
    watchingCount?: string;
    title: string;
    userName: string;
    gameName: string;
    avatar: string;
    onWatch?: () => void;
    className?: string;
};

export default function LiveGameCard({
    cover,
    isLive = true,
    watchingCount = "4.6k",
    title,
    userName,
    gameName,
    avatar,
    onWatch,
    className,
}: LiveGameCardProps) {
    return (
        <div
            className={cn(
                "w-full max-w-[424px] rounded-[16px]",
                "p-8 flex flex-col gap-8",
                "bg-white/5 border border-white/20",
                "backdrop-blur-[16px]",
                className
            )}
        >
            {/* Cover */}
            <div className="relative w-full overflow-hidden rounded-[12px]">
                <Image
                    src={cover}
                    alt={title}
                    width={424}
                    height={240}
                    className="w-full h-auto object-cover"
                />

                {/* Live + Watching */}
                <div className="w-full pt-6 flex items-center justify-between gap-3">
                    {isLive && (
                        <div className="flex items-center gap-2 bg-[#E85B5B] px-4 py-2 rounded-full">
                            <span className="w-4 h-4 rounded-full border-2 border-white" />
                            <span
                                className="text-white text-[16.8px] leading-none"
                                
                            >
                                Live
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-white/80">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span
                            className="text-[16.8px] leading-none"
                            
                        >
                            {watchingCount} watching
                        </span>
                    </div>
                </div>
            </div>

            {/* Title */}
            <h3
                className="text-white text-[24px] font-extrabold leading-none"
            >
                {title}
            </h3>

            {/* User */}
            <div className="flex items-center gap-4">
                <Image
                    src={avatar}
                    alt={userName}
                    width={42}
                    height={42}
                    className="rounded-full"
                />

                <div className="flex flex-col">
                    <span className="text-white font-medium">{userName}</span>
                    <span className="text-white/60 text-sm">{gameName}</span>
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={onWatch}
                className="w-full h-[56px] rounded-[14px] border border-pink-400/40
                   flex items-center justify-center gap-3
                   text-white hover:bg-white/5 transition cursor-pointer"
            >
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    ▶
                </span>
                <span className="text-lg">Watch stream</span>
            </button>

            {/* Footer note */}
            <p className="text-center text-pink-500 text-sm">
                Tiktok Vote Required
            </p>
        </div>
    );
}
