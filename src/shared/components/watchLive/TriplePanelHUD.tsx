"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import PanelSlot from "./PanelSlot";
import { TriplePanelState } from "@/types/watchLive/watchLiveTypes";


type Props = {
    state: TriplePanelState;
    className?: string;
};

export default function TriplePanelHUD({ state, className }: Props) {
    const leftSymbol =
        state.left.badge === "taken"
            ? "/images/home/taken_slot.png"
            : state.left.badge === "winner"
                ? "/images/home/taken_slot.png"
                : "/images/home/available_slot.png";

    const rightSymbol =
        state.right.badge === "taken"
            ? "/images/home/taken_slot.png"
            : state.right.badge === "winner"
                ? "/images/home/taken_slot.png"
                : "/images/home/available_slot.png";

    return (
        <section
            className={cn(
                "w-full",
                "pointer-events-none", 
                className
            )}
        >
            <div
                className={cn(
                    "grid grid-cols-3",
                    "h-[160px] sm:h-[190px] md:h-[260px]", 
                    "border border-white/10",
                    "divide-x divide-white/10",
                    "bg-black/20 backdrop-blur-[2px]"
                )}
            >
                <PanelSlot data={state.left} symbolSrc={leftSymbol} />

                {/* middle */}
                <div className="relative h-full w-full overflow-hidden">
                    {state.middle.playbackId ? (
                        <div className="absolute inset-0">
                            {/* optional: mux middle feed */}
                            {/* keep muted */}
                            {/* <MuxPlayer ... /> */}
                        </div>
                    ) : (
                        <Image
                            src={state.middle.imageSrc || "/images/home/middle.png"}
                            alt="middle"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                    <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2">
                        <span
                            className={cn(
                                "font-extrabold text-[18px] sm:text-[20px] md:text-[24px] leading-none",
                                "text-[#DD2E03]",
                                "[-webkit-text-stroke:2px_#F9C80E]",
                                "drop-shadow-[0_4px_0_rgba(0,0,0,0.75)]"
                            )}
                            style={{ fontFamily: "Manrope" }}
                        >
                            {state.middle.label}
                        </span>
                    </div>
                </div>

                <PanelSlot data={state.right} symbolSrc={rightSymbol} />
            </div>
        </section>
    );
}
