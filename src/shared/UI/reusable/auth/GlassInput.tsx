"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";

type Props = {
    label: string;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    className?: string;
    registration: any;
    prefix?: React.ReactNode; // e.g. ₱
    rightHint?: string; // e.g. "Min $1.00"
    disabled?: boolean;
    error?: string;
    inputClassName?: string;
};

export default function GlassInput({
    label,
    placeholder,
    type = "text",
    className,
    registration,
    prefix,
    rightHint,
    disabled,
    error,
    inputClassName,
}: Props) {
    return (
        <div className={cn("w-full", className)}>
            <label className="mb-2 block text-white/70 text-sm">{label}</label>

            <div
                className={cn(
                    "relative w-full",
                    "rounded-[12px]",
                    "bg-white/5 border border-white/12 backdrop-blur-[16px]",
                    disabled && "opacity-60"
                )}
            >
                {prefix && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 text-sm">
                        {prefix}
                    </div>
                )}

                {rightHint && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs">
                        {rightHint}
                    </div>
                )}

                <input
                    {...registration}
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={cn(
                        "w-full h-[52px] rounded-[12px] bg-transparent outline-none",
                        "text-white placeholder:text-white/30",
                        prefix ? "pl-10" : "pl-4",
                        rightHint ? "pr-20" : "pr-4",
                        "border-0",
                        "focus:ring-2 focus:ring-white/10",
                        "cursor-text",
                        inputClassName
                    )}
                />
            </div>

            {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
        </div>
    );
}
