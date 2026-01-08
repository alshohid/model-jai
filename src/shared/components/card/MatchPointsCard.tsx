"use client"

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";

type Props = {
    playerName: string;
    teamLogoSrc: string;
    title: "Matched Points" | "Unmatched Points";
    points: number | string;
    onShare?: () => void;
    className?: string;
};

export default function MatchPointsCard({
    playerName,
    teamLogoSrc,
    title,
    points,
    onShare,
    className,
}: Props) {
    return (
        <div
            className={cn(
                "w-full rounded-[20px] bg-white/5 border border-white/15 backdrop-blur-[16px]",
                "shadow-[inset_0_0_0_2px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)]",
                "px-6 py-6 md:px-10 md:py-10",
                className
            )}
        >
            <div className="flex items-center gap-5 md:gap-8">
                {/* team logo */}
                <div className="shrink-0 w-[64px] h-[64px] md:w-[80px] md:h-[80px] rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                    <Image
                        src={teamLogoSrc}
                        alt={`${playerName} team`}
                        width={120}
                        height={120}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <span
                        className={cn(
                            "inline-flex items-center justify-center",
                            "font-bold text-[24px] leading-[32px]",
                            "text-[#DD2E03] ",
                            "mb-2",
                            "[-webkit-text-stroke:2px_#F9C80E]"
                        )}
                        style={{ fontFamily: "Manrope" }}
                    >
                        {playerName}
                    </span>


                    {/* title */}
                    <h3 className="text-white font-extrabold text-[22px] md:text-[30px] leading-tight truncate">
                        {title} - {points}
                    </h3>

                    {/* button */}
                    <div className="mt-4 md:mt-6">
                        <StartStreamingButton onClick={onShare}>
                            Share Referral
                        </StartStreamingButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
