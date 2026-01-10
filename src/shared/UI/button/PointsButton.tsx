"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";
import Image from "next/image";

type Props = {
    points: number | string;
    icon?: any;
    onClick?: () => void;
    className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

export default function PointsButton({
    points,
    icon,
    onClick,
    className,
    ...props
}: Props) {
    const base = cn(
        "inline-flex items-center justify-center whitespace-nowrap select-none cursor-pointer",
        "h-[48px] px-[24px] py-[12px]",
        "rounded-[8px]",
        "text-[16px] leading-[24px] font-semibold text-white",
        "transition-transform transition-shadow duration-150 ease-out",
        "gap-3"
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
            <span className="inline-flex items-center justify-center w-6 h-8 rounded-full bg-white/15">
                {icon ? <Image
                    src={icon}
                    alt="point icon"
                    width={200}
                    height={200}
                
                />  : "🪙"}
            </span>
            <span>{points} </span>
        </button>
    );
}
