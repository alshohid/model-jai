/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

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
import { useSendTipMutation } from "@/redux/features/support/supportManagement";
import { toast } from "sonner";


export default function MatchPointsSummarySection({
    isLive,
    tipEnabled,
    left,
    right,
    matchId,
    className,
    onSupportLeft,
    onSupportRight,



}: MatchPointsSummarySectionProps) {
    const tipSystem = useTipSystem();
    const supportDialog = useSupportDialog();
    const [sendTip, { isLoading: isTipSending }] = useSendTipMutation();

    const handleSupportConfirm = async (
        side: "left" | "right" | "middle",
        supporterName: string,
        amount: number
    ) => {
        try {
            if (side === "left") {
                await onSupportLeft?.(amount, supporterName);
            } else if (side === "right") {
                await onSupportRight?.(amount, supporterName);
            }

            for (let i = 0; i < 5; i++) {
                setTimeout(() => tipSystem.triggerFlyingCoin(side as SupportSide), i * 100);
            }

            supportDialog.closeDialog();
        } catch (error) {
            console.error("Support failed:", error);
        }
    };

    const getPlayerName = () => {
        return supportDialog.selectedSide === "left" ? left.playerName : right.playerName;
    };

    const handleCardClick = (side: "left" | "right") => {
        supportDialog.openDialog(side);
    };

    const getReceiverId = (side: "left" | "right" | "middle") => {
        if (side === "left") return left.playerId;
        if (side === "right") return right.playerId;
        return null;
    };

    const handleSendTip = async (side: "left" | "right" | "middle", amount: number) => {
        try {
            const receiverId = side === "middle" ? 1 : getReceiverId(side);

            if (!receiverId) {
                toast.error("Tip receiver not found.");
                return;
            }

            await sendTip({
                receiver_id: String(receiverId),
                tip_amount: amount,
            }).unwrap();

            for (let i = 0; i < 5; i++) {
                setTimeout(() => tipSystem.triggerFlyingCoin(side as SupportSide), i * 100);
            }

            toast.success("Tip sent successfully.");
            tipSystem.closeTip();
        } catch (error: any) {
            console.error("Tip send failed:", error);
            toast.error(error?.data?.message || "Failed to send tip.");
        }
    };

    return (
        <section className={cn("text-white relative", className)}>

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
                                isLoading={isTipSending}
                                open={tipSystem.tipOpen === "left"}
                                side="left"
                                view={tipSystem.tipView}
                                align="left"
                                triggerFly={tipSystem.triggerFlyingCoin}
                                onClose={tipSystem.closeTip}
                                onPesto={() => handleSendTip("left", 10)}
                                onOpenCustom={tipSystem.switchToCustomView}
                                onBackToMenu={tipSystem.switchToMenuView}
                                onSendCustom={async (name, amount) => {
                                    await handleSendTip("left", amount);
                                }}
                            />
                        </TipCaretButton>

                        <TipCaretButton
                            side="middle"
                            isOpen={tipSystem.tipOpen === "middle"}
                            onClick={() => tipSystem.openTip("middle")}
                        >
                            <TipPopover
                                isLoading={isTipSending}
                                open={tipSystem.tipOpen === "middle"}
                                side="middle"
                                view={tipSystem.tipView}
                                align="center"
                                triggerFly={tipSystem.triggerFlyingCoin}
                                onClose={tipSystem.closeTip}
                                onPesto={() => handleSendTip("middle", 10)}
                                onOpenCustom={tipSystem.switchToCustomView}
                                onBackToMenu={tipSystem.switchToMenuView}
                                onSendCustom={async (name, amount) => {
                                    await handleSendTip("middle", amount);
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
                                isLoading={isTipSending}
                                open={tipSystem.tipOpen === "right"}
                                side="right"
                                view={tipSystem.tipView}
                                align="right"
                                triggerFly={tipSystem.triggerFlyingCoin}
                                onClose={tipSystem.closeTip}
                                onPesto={() => handleSendTip("right", 10)}
                                onOpenCustom={tipSystem.switchToCustomView}
                                onBackToMenu={tipSystem.switchToMenuView}
                                onSendCustom={async (name, amount) => {
                                    await handleSendTip("right", amount);
                                }}
                            />
                        </TipCaretButton>
                    </div>
                </div>
            )}

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
                    defaultSupporterName={supportDialog.selectedSide === "left" ? left.playerName : right.playerName}
                    defaultAmount={100}
                    onConfirm={handleSupportConfirm}
                />
            </div>
        </section>
    );
}




