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
                    "text-[18px] md:text-[20px] ",
                    "tracking-wider",
                    "text-[#22D3FF]"
                )}
                style={{
                    // stroke + glow combo
                    WebkitTextStroke: "2px rgba(151, 122, 189, 0.85)",
                    textShadow:
                        "0 2px 0 rgba(92, 34, 34, 0.75), 0 0 10px rgba(109, 56, 100, 0.55), 0 0 22px rgba(34,211,255,0.45)",
                }}
            >
                SUPPORT YOUR FAVORITE ARTIST
                <br />
                WHILE THEY PLAY LIVE
            </h2>
        </div>
    );
}
