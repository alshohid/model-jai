"use client";

import MatchPointsCard from "@/shared/components/card/MatchPointsCard";
import { cn } from "@/shared/lib/utils/cn";

type SideInfo = {
    playerName: string;
    teamLogoSrc: string;
    points: number;
};

type Props = {
    layout: "tiktok" | "twitch";
    isLive: boolean;
    supportOpen?: boolean;
    left: SideInfo;
    right: SideInfo;
    className?: string;
};

export default function MatchPointsSummarySection({
    isLive,
    supportOpen = false,
    left,
    right,
    className,
}: Props) {
    return (
        <section className={cn("p-4 sm:p-6 py-4", className)}>
            {/* {isLive && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-40">
                    <span className="px-4 py-2 rounded-full bg-red-600 font-black text-[12px] border border-white/20">
                        LIVE
                    </span>
                </div>
            )} */}
            <div
                className={cn(
                    "mx-auto",
                    " md:w-full"
                    // layout === "tiktok" ? "max-w-[420px]" : "max-w-[1100px]"
                )}
            >
                <div className="grid grid-cols-[1fr_auto_1fr]  gap-2 md:gap-4">
                    <MatchPointsCard
                        playerName={left.playerName}
                        teamLogoSrc={left.teamLogoSrc}
                        title="Matched Points"
                        points={left.points}
                        compact 
                        positive={true}
                    />

                    {/* VS */}
                    <div className="flex flex-col items-center justify-center p-0 md:px-2">
                        <div className="text-[14px] sm:text-[22px] font-extrabold">VS</div>
                        <div className="text-[10px] sm:text-[14px] text-white/80">
                            {isLive ? "Live Now" : "Upcoming"}
                        </div>
                        <div className="text-[9px] sm:text-[13px] text-white/60">
                            {isLive ? (supportOpen ? "Support Open" : "Support Closed") : ""}
                        </div>
                    </div>

                    <MatchPointsCard
                        playerName={right.playerName}
                        teamLogoSrc={right.teamLogoSrc}
                        title="Unmatched Points"
                        points={right.points}
                        compact
                        positive={false}
                    />
                </div>
            </div>
        </section>
    );
}
