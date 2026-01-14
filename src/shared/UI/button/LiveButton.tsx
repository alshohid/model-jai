"use client";

import { cn } from "@/shared/lib/utils/cn";

type Props = {
    label?: string;
    className?: string;
};

export default function LiveBadge({
    label = "LIVE",
    className,
}: Props) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
                "bg-red-600 text-white font-bold tracking-wide",
                // "shadow-[0_0_20px_rgba(239,68,68,0.8)]",
                className
            )}
        >
            {/* Pulse dot */}
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>

            {/* Label */}
            <span className="text-sm leading-none">{label}</span>
        </div>
    );
}
