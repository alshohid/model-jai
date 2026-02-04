/**
 * SelectSideCard Component
 * Card for selecting left/right team side
 * Following Single Responsibility Principle
 */

"use client";

import { cn } from "@/shared/lib/utils/cn";
import type { MatchMode } from "@/shared/components/watchLive/types";

interface SelectSideCardProps {
    mode: MatchMode;
    selected: boolean;
    name: string;
    sideLabel?: string;
    onClick: () => void;
}

export default function SelectSideCard({
    mode,
    selected,
    name,
    sideLabel,
    onClick,
}: SelectSideCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "relative rounded-xl",
                "px-4 sm:px-6 py-3 sm:py-4",
                "min-w-[140px] sm:min-w-[180px]",
                "border transition text-left",
                "bg-black/35 backdrop-blur-md",
                selected
                    ? "border-2 border-yellow-400"
                    : "border border-white/15 opacity-85 hover:opacity-100"
            )}
            aria-pressed={selected}
        >
            {sideLabel && (
                <div className="text-[10px] sm:text-[12px] text-white/70 font-semibold">
                    {sideLabel}
                </div>
            )}

            <div
                className={cn(
                    "font-extrabold leading-none truncate",
                    "text-[18px] sm:text-[22px]",
                    selected
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-white to-pink-300"
                        : "text-[#DD2E03] [-webkit-text-stroke:1px_#F9C80E]"
                )}
                style={{ fontFamily: "Manrope" }}
            >
                {name}
            </div>

            <div
                className={cn(
                    "mt-1 text-[10px] sm:text-[12px]",
                    selected ? "text-yellow-300" : "text-white/60"
                )}
            >
                {selected ? "Selected" : "Tap to select"}
            </div>
        </button>
    );
}
