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
    shareTitle?: string;
    matchId?: string;
    playerRef?: string;
    shareImageSrc?: string;
    shareImageAlt?: string;
    compact?: boolean;
    className?: string;
    positive: boolean;
    onClick: () => void;
    matchSide?: "left" | "right";
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
    shareImageSrc,
    shareImageAlt,
    compact = true,
    className,
    positive,
    onClick,
    matchSide,
}: Props) {
    const [shareSheetOpen, setShareSheetOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const sign = positive ? "+" : "+";

    const numericPoints =
        typeof points === "string"
            ? Number(points.replace(/,/g, ""))
            : points;

    const canFormatNumber =
        typeof numericPoints === "number" && !Number.isNaN(numericPoints);

    const formattedPoints = canFormatNumber
        ? numericPoints >= 1_000_000_000
            ? `${sign}${(numericPoints / 1_000_000_000).toFixed(1)}B`
            : `${sign}${numericPoints.toLocaleString()}`
        : `${sign}${points}`;

    const showShareSheet = Boolean(shareTitle && matchId && playerRef);
    const isRightSide = matchSide === "right";

    const handleShareClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.stopPropagation();
        if (showShareSheet && typeof window !== "undefined" && matchId && playerRef) {
            const nextShareUrl = new URL(
                `/live-stream/match/${matchId}`,
                window.location.origin
            );
            const currentPlatform =
                new URLSearchParams(window.location.search).get("platform") || "tiktok";

            nextShareUrl.searchParams.set("platform", currentPlatform);
            nextShareUrl.searchParams.set("ref", playerRef);
            setShareUrl(nextShareUrl.toString());
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
                compact ? "p-2 md:p-8" : "px-3 py-6 md:px-10 md:py-10",
                className
            )}
        >
            <div
                onClick={onClick}
                className={cn(
                    "flex flex-col gap-2 md:gap-5",
                    isRightSide
                        ? "items-end text-right md:flex-row md:items-center md:text-left"
                        : "items-start text-left md:flex-row md:items-center"
                )}
            >
                {/* Logo */}
                <div
                    className={cn(
                        "shrink-0 rounded-full overflow-hidden bg-white/5 flex items-center justify-center",
                        isRightSide ? "self-end md:self-auto" : "self-start md:self-auto",
                        compact
                            ? "w-[50px] h-[50px]"
                            : "w-[100px] h-[100px] md:w-[100px] md:h-[100px]"
                    )}
                >
                    <Image
                        src={teamLogoSrc}
                        alt={`${playerName} team`}
                        width={50}
                        height={50}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className={cn("min-w-0 flex-1", isRightSide ? "text-right md:text-left" : "text-left")}>
                    {/* Player name */}
                    <div
                        className={cn(
                            "font-extrabold truncate text-[#DD2E03]",
                            compact ? "text-[12px]" : "text-[22px] md:text-[26px]",
                            "[-webkit-text-stroke:1px_#F9C80E]"
                        )}
                    >
                        {playerName}
                    </div>

                    {/* Title + points */}
                    <div
                        className={cn(
                            "font-bold text-white truncate",
                            compact ? "text-[8px]" : "text-[18px] md:text-[26px]"
                        )}
                    >
                        {title}

                        <div
                            className={cn(
                                "flex max-w-full items-center gap-1 overflow-hidden",
                                isRightSide ? "justify-end md:justify-start" : "justify-start"
                            )}
                        >
                            <span
                                className={cn(
                                    "font-extrabold tabular-nums truncate number-safe",
                                    compact
                                        ? "text-[14px] md:text-[16px]"
                                        : "text-[20px] md:text-[24px] lg:text-[28px]"
                                )}
                            >
                                {formattedPoints}
                            </span>

                            <PhilippinePeso
                                size={compact ? 16 : 22}
                                className="shrink-0"
                            />
                        </div>
                    </div>

                    {/* Share button */}
                    <div
                        className={cn(
                            compact ? "mt-2" : "mt-4",
                            isRightSide ? "flex justify-end md:justify-start" : "flex justify-start"
                        )}
                    >
                        <StartStreamingButton
                            onClick={handleShareClick}
                            className={cn(
                                compact
                                    ? "h-[23px] md:h-[30px] text-[8px] md:text-[14px] px-3 rounded-md"
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
                    imageSrc={shareImageSrc}
                    imageAlt={shareImageAlt || playerName}
                />
            )}
        </div>
    );
}
