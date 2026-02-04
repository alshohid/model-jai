"use client";

import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/shared/lib/utils/cn";
import type { Side } from "@/shared/hooks/useMatchDemoStore";
import MatchGuidelinesDialog from "@/shared/components/match/MatchGuidelinesDialog";
import SupportDialog from "@/shared/components/watchLive/SupportDialog";
import { useSupportDialog } from "@/shared/hooks/useSupportDialog";
import type { SupportSide } from "@/shared/components/watchLive/types";
import { PlayerCard } from "../card/PlayerCard";
import { StageProps } from "@/types/liveMatchDetails/LiveMatchStage";


export default function LiveMatchStage({
    matchId,
    playbackId,
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

    const handleSupportConfirm = (
        side: SupportSide,
        supporterName: string,
        amount: number
    ) => {
        if (side === "left") {
            onSupportLeft?.(amount, supporterName);
        } else if (side === "right") {
            onSupportRight?.(amount, supporterName);
        }
        supportDialog.closeDialog();
    };

    const getPlayerName = () => {
        return supportDialog.selectedSide === "left" ? left.name : right.name;
    };


    return (
        <section className="w-full bg-black text-white">

            {/* <div className="flex justify-end mb-2">
                    <MatchGuidelinesDialog matchId={matchId} />
                </div> */}
            <div className="mx-auto w-full  pt-2">
                {/* ================= MOBILE TOP PLAYERS ================= */}
                <div className="grid grid-cols-3 gap-1 mb-2">
                    {/* LEFT */}
                    <PlayerCard
                        image={left.imageSrc}
                        name={left.name}
                        points={left.points}
                        status="lose"
                        bossSide={bossSide === "left"}
                        onClick={() => supportDialog.openDialog("left")}
                    />

                    {/* MIDDLE */}
                    <div className="relative aspect-3/4 overflow-hidden">
                        <Image src={middle.imageSrc} fill className="object-cover" alt="host" />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute bottom-2 w-full text-center text-[#80f03f] font-extrabold">
                            {middle.label}
                        </div>
                    </div>

                    {/* RIGHT */}
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
                {/* ================= LIVE VIDEO ================= */}
                {isLive && <div className={cn(
                    // portrait: tall, landscape: standard video
                    (mode === "twitch") ? "w-full max-w-xs mx-auto aspect-9/16" : "w-full aspect-video",
                    "relative rounded-xl overflow-hidden border border-white/10"
                )}>
                    {(mode === "twitch") || (mode === "tiktok") ? (
                        isLive ? (
                            <MuxPlayer
                                playbackId={playbackId}
                                autoPlay
                                muted
                                playsInline
                                streamType="live"
                                className="absolute inset-0 w-full h-full"
                                style={{ objectFit: (mode === "tiktok") ? "cover" : "contain" }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white/60">
                                Live starts soon...
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
                </div>}
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

