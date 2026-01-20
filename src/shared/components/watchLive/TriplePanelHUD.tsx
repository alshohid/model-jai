"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
// import type { DemoPlayer, SupportSide } from "@/shared/hooks/useMatchDemoStore";

export default function TriplePanelHUD({
    left,
    right,
    middle,
    bossSide,
    className,
}: {
    left: DemoPlayer;
    right: DemoPlayer;
    middle: { label: string; imageSrc: string };
    bossSide: SupportSide | null;
    className?: string;
}) {
    return (
        <section className={cn("w-full", className)}>
            <div className="grid grid-cols-3 h-[170px] sm:h-[190px] md:h-[230px] border border-white/10 divide-x divide-white/10 bg-black/20 backdrop-blur-[2px] rounded-xl overflow-hidden">
                {/* LEFT */}
                <div className="relative">
                    <Image src={left.imageSrc} alt={left.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    {bossSide === "left" && (
                        <div className="absolute top-2 left-2 rounded-lg bg-yellow-400 text-black font-black px-3 py-1">
                            BOSS
                        </div>
                    )}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
                        <div className="text-5xl font-black drop-shadow">X</div>
                        <div className="text-lime-300 font-extrabold text-xl">{left.points}</div>
                        <div className="text-[#DD2E03] font-extrabold text-2xl">{left.name}</div>
                    </div>
                </div>

                {/* MIDDLE (fixed) */}
                <div className="relative">
                    <Image src={middle.imageSrc} alt="middle" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-extrabold text-2xl text-[#DD2E03]">
                        {middle.label}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="relative">
                    <Image src={right.imageSrc} alt={right.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    {bossSide === "right" && (
                        <div className="absolute top-2 right-2 rounded-lg bg-yellow-400 text-black font-black px-3 py-1">
                            BOSS
                        </div>
                    )}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
                        <div className="text-5xl font-black drop-shadow">O</div>
                        <div className="text-lime-300 font-extrabold text-xl">{right.points}</div>
                        <div className="text-[#DD2E03] font-extrabold text-2xl">{right.name}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
