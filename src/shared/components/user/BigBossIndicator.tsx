"use client";

import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

interface BigBossIndicatorProps {
    isBigBoss: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
    showLabel?: boolean;
}

export default function BigBossIndicator({
    isBigBoss,
    size = "md",
    className,
    showLabel = false,
}: BigBossIndicatorProps) {
    if (!isBigBoss) return null;

    const sizeClasses = {
        sm: "size-3",
        md: "size-4",
        lg: "size-5",
    };

    return (
        <div className={cn("inline-flex items-center gap-1", className)}>
            <div className="relative">
                <Star
                    className={cn(
                        sizeClasses[size],
                        "text-[#FF2EC8] fill-[#FF2EC8]",
                        "drop-shadow-[0_2px_4px_rgba(255,46,200,0.5)]"
                    )}
                />
            </div>
            {showLabel && (
                <span className="text-[#FF2EC8] font-semibold text-xs md:text-sm">
                    Big Boss
                </span>
            )}
        </div>
    );
}
