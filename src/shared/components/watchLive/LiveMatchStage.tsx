"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import SupportDialog from "@/shared/components/watchLive/SupportDialog";
import { useSupportDialog } from "@/shared/hooks/useSupportDialog";
import type { SupportSide } from "@/shared/components/watchLive/types";
import { PlayerCard } from "../card/PlayerCard";
import { StageProps } from "@/types/liveMatchDetails/LiveMatchStage";
import TwitchEmbedPlayer from "./TwitchEmbededPlayer";


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
    onSupportLeft,
    onSupportRight,
}: StageProps) {
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


            <div className="mx-auto w-full  pt-2">

                <div className="grid grid-cols-3 gap-1 mb-2">

                    <PlayerCard
                        image={left.imageSrc}
                        name={left.name}
                        points={left.points}
                        status="lose"
                        bossSide={bossSide === "left"}
                        onClick={() => supportDialog.openDialog("left")}
                    />


                    <div className="relative aspect-3/4 overflow-hidden">
                        <Image src={middle.imageSrc} fill className="object-cover" alt="host" />
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
                                6K watching
                            </div>
                        }
                    />
                </div>
                {isLive && (
                    <div
                        className={cn(
                            mode === "portrait"
                                ? "w-full max-w-xs mx-auto aspect-9/16"
                                : "w-full aspect-video",
                            "relative rounded-xl overflow-hidden border border-white/10"
                        )}
                    >
                        {mode === "landscape" || mode === "portrait" ? (
                            twitchChannel ? (
                                <>
                                    <TwitchEmbedPlayer
                                        channel={twitchChannel}
                                        autoplay
                                        muted={false}
                                        className="absolute inset-0 w-full h-full"
                                    />


                                    <div className="absolute inset-0 z-10 bg-transparent" />
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white/60">
                                    Live Starts soon...
                                </div>
                            )
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
                defaultSupporterName="Michael Rohan"
                defaultAmount={100}
                onConfirm={handleSupportConfirm}
            />
        </section>
    );
}

