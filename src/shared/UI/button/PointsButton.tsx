"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";
import Image from "next/image";

type Props = {
    points: number | string;
    icon?: any;
    onClick?: () => void;
    className?: string;
    /** Compact size for mobile navbar */
    size?: "default" | "compact";
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

export default function PointsButton({
    points,
    icon,
    onClick,
    className,
    size = "default",
    ...props
}: Props) {
    const isCompact = size === "compact";
    const displayPoints =
        isCompact && typeof points === "number" && points >= 1000
            ? `${Math.round(points / 1000)}k`
            : String(points);
    const base = cn(
        "inline-flex items-center justify-center whitespace-nowrap select-none cursor-pointer",
        "rounded-[8px]",
        "font-semibold text-white",
        "transition-transform transition-shadow duration-150 ease-out",
        isCompact
            ? "h-7 min-w-0 px-2 py-1 gap-1 text-[10px] leading-tight"
            : "h-[40px] md:h-[48px] px-[24px] py-[12px] gap-3 text-[0.7rem] md:text-[1rem] leading-[24px]"
    );

    const shadowDefault =
        "shadow-[4px_4px_0_0_rgba(0,0,0,1),inset_0_0_0_2px_rgba(0,0,0,1)]";

    const pressed =
        "active:translate-x-[2px] active:translate-y-[2px] " +
        "active:shadow-[2px_2px_0_0_rgba(0,0,0,1),inset_0_0_0_2px_rgba(0,0,0,1)]";

    const styles = "bg-[#18B9FF] hover:brightness-105";

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(base, shadowDefault, pressed, styles, className)}
            {...props}
        >
            <span className={cn(
                "inline-flex items-center justify-center rounded-full bg-white/15",
                isCompact ? "w-3 h-3" : "w-4 h-4 md:w-6 md:h-8"
            )}>
                {icon ? <Image
                    src={icon}
                    alt="point icon"
                    width={200}
                    height={200}
                    className="object-contain size-full"
                />  : "🪙"}
            </span>
            <span>{displayPoints}</span>
        </button>
    );
}
