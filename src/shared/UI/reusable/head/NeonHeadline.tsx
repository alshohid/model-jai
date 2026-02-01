"use client";

import { cn } from "@/shared/lib/utils/cn";

export default function NeonHeadline({
    className,
}: {
    className?: string;
}) {
    return (
        <div className={cn("w-full flex justify-center text-center", className)}>
            <h2
                className={cn(
                    "font-black uppercase tracking-wide sm:tracking-wider",
                    "leading-tight",
                    "text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl",
                    "max-w-[90vw] mx-auto"
                )}
                style={{
                    color: "#4040FF",
                    WebkitTextStroke: "2px #00C3FF",
                    paintOrder: "stroke fill",
                    textShadow:
                        "0 0 2px #FF40FF, 0 0 4px rgba(255, 64, 255, 0.8), 0 0 6px rgba(204, 51, 204, 0.5)",
                }}
            >
                <span className="block">SUPPORT YOUR FAVORITE ARTIST</span>
                <span className="block mt-1 sm:mt-2">WHILE THEY PLAY LIVE</span>
            </h2>
        </div>
    );
}
