

"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";
import MatchPointsCard from "@/shared/components/card/MatchPointsCard";
import SupportDialog from "@/shared/components/watchLive/SupportDialog";
import FlyingPeso from "@/shared/components/watchLive/FlyingPeso";
import TipPopover from "@/shared/components/watchLive/TipPopover";
import { useTipSystem } from "@/shared/hooks/useTipSystem";
import { useSupportDialog } from "@/shared/hooks/useSupportDialog";
import type {
    SupportSide,
} from "@/shared/components/watchLive/types";
import { MatchPointsSummarySectionProps } from "@/types/liveMatchDetails/MatchPointSummerySectionProps";
import { getSideXPosition } from "@/lib/helper/getSideXPosition";
import { TipCaretButton } from "@/shared/UI/button/TipCaretButton";


export default function MatchPointsSummarySection({
    isLive,
    supportOpen = false,
    tipEnabled,
    left,
    right,
    matchId,
    className,
    layout = "tiktok",
    onSupportLeft,
    onSupportRight,
}: MatchPointsSummarySectionProps) {
    const tipSystem = useTipSystem();
    const supportDialog = useSupportDialog();

    const handleSupportConfirm = (
        side: "left" | "right" | "middle",
        supporterName: string,
        amount: number
    ) => {
        if (side === "left") {
            onSupportLeft?.(amount, supporterName);
        } else if (side === "right") {
            onSupportRight?.(amount, supporterName);
        }

        // Trigger 5 flying coins sequentially
        for (let i = 0; i < 5; i++) {
            setTimeout(() => tipSystem.triggerFlyingCoin(side as SupportSide), i * 100);
        }
    };

    const getPlayerName = () => {
        return supportDialog.selectedSide === "left" ? left.playerName : right.playerName;
    };

    const handleCardClick = (side: "left" | "right") => {
        supportDialog.openDialog(side);
    };

    return (
        <section className={cn("text-white relative", className)}>
            {/* Flying Coins Container */}
            <div className="fixed inset-0 pointer-events-none z-[9999]">
                {tipSystem.flyingCoins.map((coin) => (
                    <FlyingPeso
                        key={coin.id}
                        id={coin.id}
                        xPercent={getSideXPosition(coin.side) + (coin.txJitter ?? 0)}
                        ty={coin.ty}
                        rot={coin.rot}
                        dur={coin.dur}
                        onDone={tipSystem.removeFlyingCoin}
                    />
                ))}
            </div>

            {/* ================= TIP CARETS (if enabled) ================= */}
            {tipEnabled && (
                <div className="px-2 md:px-4 md:py-4">
                    <div className="flex justify-between">
                        {/* Left Tip Caret */}
                        <TipCaretButton
                            side="left"
                            isOpen={tipSystem.tipOpen === "left"}
                            onClick={() => tipSystem.openTip("left")}
                        >
                            <TipPopover
                                open={tipSystem.tipOpen === "left"}
                                side="left"
                                view={tipSystem.tipView}
                                align="left"
                                triggerFly={tipSystem.triggerFlyingCoin}
                                onClose={tipSystem.closeTip}
                                onPesto={() => console.log("Pesto tip left")}
                                onOpenCustom={tipSystem.switchToCustomView}
                                onBackToMenu={tipSystem.switchToMenuView}
                                onSendCustom={(name, amount) => {
                                    console.log("Custom tip left:", name, amount);
                                    tipSystem.closeTip();
                                }}
                            />
                        </TipCaretButton>

                        {/* Middle Tip Caret */}
                        <TipCaretButton
                            side="middle"
                            isOpen={tipSystem.tipOpen === "middle"}
                            onClick={() => tipSystem.openTip("middle")}
                        >
                            <TipPopover
                                open={tipSystem.tipOpen === "middle"}
                                side="middle"
                                view={tipSystem.tipView}
                                align="center"
                                triggerFly={tipSystem.triggerFlyingCoin}
                                onClose={tipSystem.closeTip}
                                onPesto={() => console.log("Pesto tip middle")}
                                onOpenCustom={tipSystem.switchToCustomView}
                                onBackToMenu={tipSystem.switchToMenuView}
                                onSendCustom={(name, amount) => {
                                    console.log("Custom tip middle:", name, amount);
                                    tipSystem.closeTip();
                                }}
                            />
                        </TipCaretButton>

                        {/* Right Tip Caret */}
                        <TipCaretButton
                            side="right"
                            isOpen={tipSystem.tipOpen === "right"}
                            onClick={() => tipSystem.openTip("right")}
                        >
                            <TipPopover
                                open={tipSystem.tipOpen === "right"}
                                side="right"
                                view={tipSystem.tipView}
                                align="right"
                                triggerFly={tipSystem.triggerFlyingCoin}
                                onClose={tipSystem.closeTip}
                                onPesto={() => console.log("Pesto tip right")}
                                onOpenCustom={tipSystem.switchToCustomView}
                                onBackToMenu={tipSystem.switchToMenuView}
                                onSendCustom={(name, amount) => {
                                    console.log("Custom tip right:", name, amount);
                                    tipSystem.closeTip();
                                }}
                            />
                        </TipCaretButton>
                    </div>
                </div>
            )}

            {/* ================= MATCH POINTS CARDS ================= */}
            <div>
                <div className={cn("mx-auto", "md:w-full")}>
                    <div className="grid grid-cols-[1fr_auto_1fr] py-6 gap-2 md:gap-4">
                        <MatchPointsCard
                            playerName={left.playerName}
                            teamLogoSrc={left.teamLogoSrc}
                            title="Matched Points"
                            points={left.points}
                            compact
                            positive={true}
                            shareTitle={`Support ${left.playerName}`}
                            matchId={matchId}
                            playerRef="left"
                            onClick={() => handleCardClick("left")}
                        />

                        {/* VS */}
                        <div className="flex flex-col items-center justify-center p-0 md:px-2">
                            <div className="rotate-45 out translate-x-1 flex flex-col items-center origin-center">
                                <div className="text-[14px] sm:text-[22px] font-extrabold">VS</div>
                                <div className="text-[10px] sm:text-[14px] text-white/80">
                                    {isLive ? "Live Now" : "Upcoming"}
                                </div>
                            </div>
                        </div>

                        <MatchPointsCard
                            playerName={right.playerName}
                            teamLogoSrc={right.teamLogoSrc}
                            title="Unmatched Points"
                            points={right.points}
                            compact
                            positive={false}
                            shareTitle={`Support ${right.playerName}`}
                            matchId={matchId}
                            playerRef="right"
                            onClick={() => handleCardClick("right")}
                        />
                    </div>
                </div>

                <SupportDialog
                    open={supportDialog.isOpen}
                    onOpenChange={supportDialog.closeDialog}
                    playerName={getPlayerName()}
                    side={supportDialog.selectedSide}
                    defaultSupporterName="Michael Rohan"
                    defaultAmount={100}
                    onConfirm={handleSupportConfirm}
                />
            </div>
        </section>
    );
}




