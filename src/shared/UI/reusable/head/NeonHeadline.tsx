"use client";

import { cn } from "@/shared/lib/utils/cn";

export default function NeonHeadline({
    className,
}: {
    className?: string;
}) {
    return (
        <div className={cn("w-full flex justify-center", className)}>
            <h2
                className={cn(
                    "text-center font-extrabold uppercase",
                    "leading-[1.05]",
                    "text-[18px] sm:text-[26px] md:text-[34px] lg:text-[44px]",
                    "tracking-wider",
                    "text-[#22D3FF]"
                )}
                style={{
                    // stroke + glow combo
                    WebkitTextStroke: "2px rgba(255, 0, 214, 0.85)",
                    textShadow:
                        "0 2px 0 rgba(0,0,0,0.75), 0 0 10px rgba(255,0,214,0.55), 0 0 22px rgba(34,211,255,0.45)",
                }}
            >
                SUPPORT YOUR FAVORITE ARTIST
                <br />
                WHILE THEY PLAY LIVE
            </h2>
        </div>
    );
}
