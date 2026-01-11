"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
};

export default function PrimaryCtaButton({
    children,
    className,
    fullWidth = false,
    type = "button",
    disabled,
    ...props
}: Props) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={cn(
                "cursor-pointer inline-flex items-center justify-center select-none",
                fullWidth ? "w-full" : "w-auto",
                // size responsive
                "h-[52px] sm:h-[56px]",
                "px-6 sm:px-8",
                // shape
                "rounded-[18px] sm:rounded-[22px]",
                // colors
                "bg-[#FF2EC8] text-white",
                // typography (Inter Tight)
                "font-medium text-[16px] sm:text-[18px] leading-[132%] tracking-[0]",
                "[font-family:Inter_Tight,Inter,system-ui,sans-serif]",
                // shadow / glow like image
                "shadow-[0_16px_40px_rgba(255,46,200,0.22)]",
                // interactions
                "transition-all duration-200",
                "hover:brightness-[1.03] active:scale-[0.99]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2EC8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
                // disabled
                disabled && "opacity-60 cursor-not-allowed hover:brightness-100 active:scale-100",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
