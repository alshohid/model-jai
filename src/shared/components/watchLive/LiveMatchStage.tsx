"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import SupportDialog from "@/shared/components/watchLive/SupportDialog";
import { useSupportDialog } from "@/shared/hooks/useSupportDialog";
import type { SupportSide } from "@/shared/components/watchLive/types";
import { PlayerCard } from "../card/PlayerCard";
import { StageProps } from "@/types/liveMatchDetails/LiveMatchStage";
import TwitchPlayer from "./TwitchPlayer";

export default function LiveMatchStage({
    matchId,
    twitchChannel,
    isLive,
    mode,
    left,
    right,
    middle,
    bossSide,
    tipEnabled = false,
    rules,
    onRulesClick,
    onSupportLeft,
    onSupportRight,
    watchingPeopleCount,
    modelPicture,
}: StageProps & {
    rules?: string | null;
    onRulesClick?: () => void;
    watchingPeopleCount?: number;
    modelPicture?: string;
}) {
    const supportDialog = useSupportDialog();

    const handleSupportConfirm = async (
        side: SupportSide,
        supporterName: string,
        amount: number
    ) => {
        try {
            if (side === "left") {
                await onSupportLeft?.(amount, supporterName);
            } else if (side === "right") {
                await onSupportRight?.(amount, supporterName);
            }
            supportDialog.closeDialog();
        } catch (error) {
            console.error("Support failed:", error);
        }
    };

    const getPlayerName = () => {
        return supportDialog.selectedSide === "left" ? left.name : right.name;
    };

    return (
        <section className="w-full bg-black text-white">
            <div className="mx-auto w-full pt-2">
                <div className="grid grid-cols-3 gap-1 mb-2">

                    {/* ── Left Player + Rules Button ── */}
                    <div className="relative">
                        <PlayerCard
                            image={left.imageSrc}
                            name={left.name}
                            points={left.points}
                            status="lose"
                            bossSide={bossSide === "left"}
                            onClick={() => supportDialog.openDialog("left")}
                        />


                        {rules && onRulesClick && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRulesClick();
                                }}
                                className="
                                    absolute top-1 left-0 z-20
                                    flex items-center gap-1
                                    pl-1.5 pr-2 py-1 rounded-full
                                    text-[#FF2EC8] text-[8px] md:text-[10px] font-bold uppercase tracking-wider
                                    hover:bg-[#FF2EC8]/15 hover:border-[#FF2EC8]
                                    transition-all duration-200
                                    shadow-[0_0_10px_rgba(255,46,200,0.3)]
                                    cursor-pointer
                                "
                            >

                                <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#FF2EC8] flex items-center justify-center flex-shrink-0 shadow-[0_0_6px_rgba(255,46,200,0.6)]">
                                    <span className="text-white font-black text-[10px] leading-none">!</span>
                                </span>

                            </button>
                        )}
                    </div>

                    {/* ── Middle ── */}
                    <div className="relative aspect-3/4 overflow-hidden">
                        <Image
                            src={modelPicture ?? "/images/home/middle.png"}
                            fill
                            className="object-cover"
                            alt="host"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute bottom-2 w-full text-center text-[#80f03f] font-extrabold">
                            {middle.label}
                        </div>
                    </div>

                    <PlayerCard
                        image={right.imageSrc}
                        name={right.name}
                        points={right.points}
                        status="win"
                        bossSide={bossSide === "right"}
                        onClick={() => supportDialog.openDialog("right")}
                        topRightBadge={
                            <div className="rounded-full bg-black/70 px-2 py-1 text-[11px] font-bold border border-white/10 backdrop-blur">
                                {watchingPeopleCount} watching
                            </div>
                        }
                    />
                </div>

                {isLive && (
                    <div
                        className={cn(
                            mode === "portrait"
                                ? "w-full max-w-xs mx-auto aspect-9/16 object-contain"
                                : "w-full h-auto aspect-video",
                            "relative rounded-xl overflow-hidden border border-white/10"
                        )}
                    >
                        {mode === "landscape" || mode === "portrait" ? (
                            <TwitchPlayer />
                        ) : (
                            <Image
                                src="/images/home/demo_pitch.jpg"
                                alt="match"
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                )}
            </div>

            <SupportDialog
                open={supportDialog.isOpen}
                onOpenChange={supportDialog.closeDialog}
                playerName={getPlayerName()}
                side={supportDialog.selectedSide}
                defaultSupporterName={getPlayerName()}
                defaultAmount={100}
                onConfirm={handleSupportConfirm}
            />
        </section>
    );
}