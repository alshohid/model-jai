"use client";

import * as React from "react";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/shared/lib/utils/cn";
import type { Side } from "@/shared/hooks/useMatchDemoStore";
import {  PhilippinePeso } from "lucide-react";
import MatchGuidelinesDialog from "@/shared/components/match/MatchGuidelinesDialog";
import SupportDialog from "@/shared/components/watchLive/SupportDialog";

type StageProps = {
    matchId: string;
    playbackId: string;
    isLive: boolean;
    tipEnabled?: boolean;

    mode?: "tiktok" | "twitch"; 
    supportClosed: boolean;

    left: { name: string; points: number; imageSrc: string };
    right: { name: string; points: number; imageSrc: string };
    middle: { label: string; imageSrc: string };
    bossSide: Side | null;

    onSupportLeft?: (amount: number, supporterName?: string) => void;
    onSupportRight?: (amount: number, supporterName?: string) => void;
};

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
    

    const [supportDialogOpen, setSupportDialogOpen] = React.useState(false);
    const [supportDialogSide, setSupportDialogSide] =
        React.useState<"left" | "right">("left");

    const openSupportDialog = (side: "left" | "right") => {
        setSupportDialogSide(side);
        setSupportDialogOpen(true);
    };

    const handleSupportConfirm = (
        side: "left" | "right",
        supporterName: string,
        amount: number
    ) => {
        side === "left"
            ? onSupportLeft?.(amount, supporterName)
            : onSupportRight?.(amount, supporterName);

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
                        onClick={() => openSupportDialog("left")}
                    />

                    {/* MIDDLE */}
                    <div className="relative aspect-[3/4]  overflow-hidden">
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
                        onClick={() => openSupportDialog("right")}
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
                    (mode === "twitch") ? "w-full max-w-[420px] mx-auto aspect-[9/16]" : "w-full aspect-video",
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

            {/* ================= SUPPORT POPUP ================= */}
            <SupportDialog
                open={supportDialogOpen}
                onOpenChange={setSupportDialogOpen}
                playerName={supportDialogSide === "left" ? left.name : right.name}
                side={supportDialogSide}
                defaultSupporterName="Michael Rohan"
                defaultAmount={100}
                onConfirm={handleSupportConfirm}
            />
        </section>
    );
}

/* ================= PLAYER CARD ================= */
function PlayerCard({
    image,
    name,
    points,
    status,
    onClick,
    bossSide,
    topRightBadge
    

}: {
    image: string;
    name: string;
        points: number;
        bossSide: any;
    status: "win" | "lose";
    onClick: () => void;
     topRightBadge?: React.ReactNode
}) {
    return (
        <div className={`relative aspect-[3/4]  overflow-hidden ${bossSide ? "border border-amber-400" : ""} ` }>
            <Image src={image} fill className="object-cover" alt={name} />
            <div className="absolute inset-0 bg-black/40" />
            {topRightBadge ? (
        <div className="absolute top-2 right-2 z-20">
          {topRightBadge}
        </div>
      ) : null}

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                <div
                    className={cn(
                        "text-xl font-extrabold",
                        status === "win" ? "text-green-400" : "text-red-500"
                    )}
                >
                    {status === "win" ? <Image
                        src={'/images/home/available_slot.png'}
                        alt="images"
                        width={200}
                        height={200}
                        className="w-[30px] h-[30px] md:w-[200px] md:h-[200px]"
                    /> : <Image
                        src={'/images/home/taken_slot.png'}
                        alt="images"
                        width={200}
                        height={200}
                        className="w-[30px] h-[30px] md:w-[200px] md:h-[200px]"
                    />}
                </div>

                <button
                    onClick={onClick}
                    className="text-red-700 font-extrabold text-md md:text-2xl hover:underline"
                >
                    {name}
                </button>

                <div className="text-yellow-400 text-sm md:text-lg flex items-center justify-center gap-1">
                    {points} <PhilippinePeso size={14} />
                </div>
            </div>
        </div>
    );
}

