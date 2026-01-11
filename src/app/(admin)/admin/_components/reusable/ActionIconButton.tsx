"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";

type Tone = "default" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ReactNode;
    label: string; // aria-label
    tone?: Tone;
    size?: "sm" | "md";
};

export default function ActionIconButton({
    icon,
    label,
    tone = "default",
    size = "sm",
    className,
    disabled,
    ...props
}: Props) {
    const isDanger = tone === "danger";

    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            className={cn(
                "cursor-pointer inline-flex items-center justify-center select-none",
                // size (32x32 like screenshot)
                size === "sm" ? "h-8 w-8" : "h-9 w-9",
                // shape
                "rounded-[12px]",
                // base glass
                "bg-white/10 border border-white/10",
                // subtle depth (outer shadow + inner highlight)
                "shadow-[0_10px_25px_rgba(0,0,0,0.35)]",
                "relative overflow-hidden",
                // top glossy highlight
                "before:content-[''] before:absolute before:inset-0",
                "before:bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))]",
                "before:pointer-events-none",
                // icon
                "text-white/80",
                // hover/active
                isDanger
                    ? "hover:bg-red-500/15 hover:border-red-300/20 hover:text-white"
                    : "hover:bg-white/14 hover:border-white/15 hover:text-white",
                "active:scale-[0.98]",
                "transition-all duration-200",
                // focus
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
                // disabled
                disabled && "opacity-40 cursor-not-allowed hover:bg-white/10 active:scale-100",
                className
            )}
            {...props}
        >
            {/* keep icon above the glossy overlay */}
            <span className="relative z-[1] flex items-center justify-center">
                {icon}
            </span>
        </button>
    );
}
