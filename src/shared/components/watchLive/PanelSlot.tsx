"use client";

import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/shared/lib/utils/cn";
import { PanelSide } from "@/types/watchLive/watchLiveTypes";


type Props = {
    data: PanelSide;
    symbolSrc: string; 
    className?: string;
};

export default function PanelSlot({ data, symbolSrc, className }: Props) {
    return (
        <div className={cn("relative h-full w-full overflow-hidden", className)}>
            {/* background: mux feed OR image */}
            {data.playbackId ? (
                <div className="absolute inset-0">
                    <MuxPlayer
                        playbackId={data.playbackId}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full"
                    />
                </div>
            ) : (
                <Image
                    src={data.imageSrc || "/images/home/panel_left.png"}
                    alt={data.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                />
            )}

            {/* gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            {/* center overlay */}
            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <Image
                    src={symbolSrc}
                    alt="symbol"
                    width={140}
                    height={140}
                    className="w-[64px] sm:w-[74px] md:w-[92px] h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.55)]"
                />

                <span
                    className={cn(
                        "mt-1 font-extrabold leading-none",
                        "text-[16px] sm:text-[18px] md:text-[20px]",
                        "text-[#B7FF4A]",
                        "[-webkit-text-stroke:1px_rgba(0,0,0,0.55)]",
                        "drop-shadow-[0_3px_0_rgba(0,0,0,0.75)]"
                    )}
                    style={{ fontFamily: "Manrope" }}
                >
                    {data.points}
                </span>

                <span
                    className={cn(
                        "mt-1 font-extrabold leading-none",
                        "text-[16px] sm:text-[18px] md:text-[20px]",
                        "text-[#DD2E03]",
                        "[-webkit-text-stroke:2px_#F9C80E]",
                        "drop-shadow-[0_3px_0_rgba(0,0,0,0.75)]"
                    )}
                    style={{ fontFamily: "Manrope" }}
                >
                    {data.name}
                </span>
            </div>
        </div>
    );
}
