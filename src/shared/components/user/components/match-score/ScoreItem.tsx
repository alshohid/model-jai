import React, { memo } from "react";
import { cn } from "@/lib/utils";

interface ScoreItemProps {
    score: number;
    color: "green" | "red";
}

const colors = {
    green: "bg-green-600",
    red: "bg-red-600",
};

export const ScoreItem = memo(function ScoreItem({
    score,
    color,
}: ScoreItemProps) {
    return (
        <div className="flex items-center gap-3">
            <span className="md:text-3xl text-lg font-semibold tracking-tight text-white">
                {score}
            </span>

            <span
                className={cn(
                    "md:h-7 md:w-7 h-5 w-5 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.12)]",
                    colors[color]
                )}
            />
        </div>
    );
});