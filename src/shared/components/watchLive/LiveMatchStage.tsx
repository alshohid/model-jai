"use client";

import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/shared/lib/utils/cn";
import type { Side } from "@/shared/hooks/useMatchDemoStore";
import { PhilippinePeso } from 'lucide-react';
import MatchGuidelinesDialog from "@/shared/components/match/MatchGuidelinesDialog";


type StageProps = {
    matchId: string;
    playbackId: string;
    isLive: boolean;

    mode?: "tiktok" | "twitch"; // tiktok=3 panel, twitch=mux
    supportClosed: boolean;

    left: { name: string; points: number; imageSrc: string };
    right: { name: string; points: number; imageSrc: string };
    middle: { label: string; imageSrc: string };
    bossSide: Side | null;

    onSupportLeft?: () => void;
    onSupportRight?: () => void;
};

export default function LiveMatchStage({
    matchId,
    playbackId,
    isLive,
    mode,
    supportClosed,
    left,
    right,
    middle,
    bossSide,
    onSupportLeft,
    onSupportRight,
}: StageProps) {
    const playerId = `mux-${matchId}`;

    return (
        <section className="w-full bg-black text-white">
            <div className={cn("mx-auto w-full  px-3 md:px-4 pt-2")}>
                {/* Guidelines Icon */}
                <div className="flex justify-end mb-2">
                    <MatchGuidelinesDialog matchId={matchId} />
                </div>
                {/* Stage */}
                <div className="relative w-full aspect-video bg-black overflow-hidden rounded-md border border-white/10">
                    {/* Content */}
                    {mode === "twitch" ? (
                        isLive ? (
                            <MuxPlayer
                                playbackId={playbackId}
                                autoPlay
                                muted
                                playsInline
                                streamType="live"
                                className="absolute inset-0 w-full h-full"
                               
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white/70">
                                Live starts soon...
                            </div>
                        )
                    ) : (
                        // tiktok 3-panel stage
                        <div className="absolute inset-0 grid grid-cols-3">
                            {/* left */}
                                <div className={`relative ${bossSide === "left" ? "border border-bold border-yellow-300":""}`}>
                                <Image src={left.imageSrc} alt={left.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                                        <div>
                                            <Image src={"/images/home/taken_slot.png"} alt="available" width={70} height={70}  />
                                        </div>
                                        <div className="text-[#B7FF4A] font-extrabold text-xl flex items-center"> <span className="text-2xl">{left.points} </span>  <span className="text-white"><PhilippinePeso  size={20}/></span></div>
                                    <div className="text-[#DD2E03] font-extrabold text-2xl">{left.name}</div>
                                </div>
                            </div>

                            {/* middle fixed */}
                            <div className="relative">
                                <Image src={middle.imageSrc} alt="model" fill className="object-cover" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                                        <div
                                            className="text-[#80f03f] font-extrabold text-2xl"
                                            style={{
                                                textShadow: "0 2px 8px rgba(255, 193, 7, 0.5)",
                                            }}
                                        >
                                            {middle.label}
                                        </div>
                                    </div>

                            </div>

                            {/* right */}
                                <div className={`relative ${bossSide === "right" ? "border border-bold border-yellow-300" : ""}`}>
                                <Image src={right.imageSrc} alt={right.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                                        <div>
                                            <Image src={"/images/home/available_slot.png"} alt="available" width={70} height={70}/>
                                        </div>
                                        <div className="text-[#B7FF4A] font-extrabold text-xl flex items-center"> <span className="text-2xl">{right.points} </span>     <span className="text-white"><PhilippinePeso size={20} /></span></div>
                                    <div className="text-[#DD2E03] font-extrabold text-2xl">{right.name}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* {mode === "twitch" && <button
                        type="button"
                        onClick={() => (document.getElementById(playerId) as any)?.requestFullscreen?.()}
                        className="absolute top-3 right-3 z-30 text-xs bg-black/50 px-3 py-2 rounded-lg"
                    >
                        Fullscreen
                    </button>} */}
                    {/* Support overlay (Support Closed হলে hide) */}
                    {/* {!supportClosed && (
                        <div className="absolute inset-0 z-20 grid grid-cols-2">
                            <button type="button" onClick={onSupportLeft} className="relative">
                                <span className="absolute left-3 bottom-3 rounded-lg bg-black/60 px-3 py-2 text-[12px] font-black">
                                    CLICK SUPPORT {left.name}
                                </span>
                            </button>
                            <button type="button" onClick={onSupportRight} className="relative">
                                <span className="absolute right-3 bottom-3 rounded-lg bg-black/60 px-3 py-2 text-[12px] font-black">
                                    CLICK SUPPORT {right.name}
                                </span>
                            </button>
                        </div>
                    )} */}

                    {/* LIVE pill overlap (center bottom) */}
                  
                </div>
            </div>
        </section>
    );
}
