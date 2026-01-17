"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";
import { WatchIconPlay } from "../icon/icon";

type Props = {
    label?: string;
    className?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
};

export default function WatchStreamButton({
    label = "Watch stream",
    className,
    onClick,
}: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "cursor-pointer inline-flex items-center justify-center gap-3",
                "w-full h-[30px] md:h-[48px] rounded-[12px]",
                "bg-white/5 border border-[#D15B9C80]/50",
                "text-white/80 hover:text-white transition",
                "shadow-inner shadow-[inset_0_0_10px_#D15B9C40]",
                className
            )}
        >
            <span className="inline-flex items-center justify-center w-4 h-4 md:w-8 md:h-8 rounded-full bg-white/80">
                <WatchIconPlay/>
            </span>
            <span className=" text-xs md:text-sm font-extralight">{label}</span>
        </button>
    );
}
