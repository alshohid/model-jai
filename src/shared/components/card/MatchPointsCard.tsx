"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { PhilippinePeso } from "lucide-react";
import ReferralShareSheet from "@/shared/components/myProfile/ReferralShareSheet";

type Props = {
    playerName: string;
    teamLogoSrc: string;
    title: "Matched Points" | "Unmatched Points";
    points: number | string;
    onShare?: () => void;
    /** নিচ থেকে শেয়ার শীট খুলবে – মোবাইলে লিংক শেয়ার */
    shareTitle?: string;
    matchId?: string;
    playerRef?: string;
    compact?: boolean;
    className?: string;
    positive: boolean;
    onClick: () => void;
};

export default function MatchPointsCard({
    playerName,
    teamLogoSrc,
    title,
    points,
    onShare,
    shareTitle,
    matchId,
    playerRef,
    compact = true,
    className,
    positive,
    onClick
}: Props) {
    const [shareSheetOpen, setShareSheetOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const sign = positive ? "+" : "-";

    const numericPoints =
        typeof points === "string"
            ? Number(points.toString().replace(/,/g, ""))
            : points;
    const canFormatNumber = typeof numericPoints === "number" && !Number.isNaN(numericPoints);
    const showShareSheet = Boolean(shareTitle && matchId && playerRef);

    const handleShareClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.stopPropagation();
        if (showShareSheet && typeof window !== "undefined" && matchId && playerRef) {
            setShareUrl(
                `${window.location.origin}/live-stream/match/${matchId}?ref=ref_${playerRef}_${Date.now()}`
            );
            setShareSheetOpen(true);
        } else {
            onShare?.();
        }
    };

    return (
        <div
            className={cn(
                "w-full rounded-[16px] bg-white/5 border border-white/15 backdrop-blur-[16px]",
                "shadow-[inset_0_0_0_2px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)]",
                compact
                    ? " p-4 md:p-8"
                    : "px-6 py-6 md:px-10 md:py-10",
                className
            )}
        >
            <div onClick={onClick} className="flex flex-col md:flex-row md:items-center  gap-3 md:gap-5">
                {/* logo */}
                <div
                    className={cn(
                        "shrink-0 rounded-full overflow-hidden bg-white/5 flex items-center justify-center",
                        compact
                            ? "w-[36px] h-[36px]"
                            : "w-[64px] h-[64px] md:w-[80px] md:h-[80px]"
                    )}
                >
                    <Image
                        src={teamLogoSrc}
                        alt={`${playerName} team`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">

                    {/* name */}
                    <div
                        className={cn(
                            "font-extrabold truncate",
                            compact ? "text-[12px]" : "text-[22px] md:text-[26px]",
                            "text-[#DD2E03]",
                            "[-webkit-text-stroke:1px_#F9C80E]"
                        )}
                    >
                        {playerName}
                    </div>

                    <div
                        className={cn(
                            "font-bold text-white truncate",
                            compact ? "text-[8px]" : "text-[18px] md:text-[26px]"
                        )}
                    >
                        {title}
                        <div className="flex items-center gap-1 max-w-full overflow-hidden">
                            <span
                                className={cn(
                                    "font-extrabold tabular-nums truncate number-safe",
                                    compact
                                        ? "text-[12px]"
                                        : "text-[18px] md:text-[22px] lg:text-[26px]"
                                )}
                            >
                                {canFormatNumber
                                    ? numericPoints > 9_999_999
                                        ? `${sign}${(numericPoints / 1_000_000).toFixed(1)}M`
                                        : `${sign}${numericPoints.toLocaleString()}`
                                    : `${sign}${points}`}
                            </span>


                            <PhilippinePeso
                                size={compact ? 14 : 20}
                                className="shrink-0"
                            />
                        </div>


                    </div>


                    {/* button */}
                    <div className={compact ? "mt-2" : "mt-4"}>
                        <StartStreamingButton
                            onClick={handleShareClick}
                            className={cn(
                                compact
                                    ? "h-[23px] md:h-[30px] text-[8px]  md:text-[14px] px-3 rounded-md"
                                    : "h-[44px] text-[14px]"
                            )}
                        >
                            Share Referral
                        </StartStreamingButton>
                    </div>
                </div>
            </div>

            {showShareSheet && (
                <ReferralShareSheet
                    open={shareSheetOpen}
                    onOpenChange={setShareSheetOpen}
                    title={shareTitle ?? ""}
                    shareUrl={shareUrl}
                />
            )}
        </div>
    );
}
