"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type AppSelectOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

type Props = {
    value?: string;
    onValueChange?: (v: string) => void;
    options: AppSelectOption[];
    placeholder?: string;
    disabled?: boolean;

    // ✅ expected design default = "rounded" (not pill)
    shape?: "rounded" | "pill";
    size?: "sm" | "md";

    triggerClassName?: string;
    contentClassName?: string;
};

export default function AppSelect({
    value,
    onValueChange,
    options,
    placeholder = "Select",
    disabled,
    shape = "rounded",
    size = "sm",
    triggerClassName,
    contentClassName,
}: Props) {
    const sizeClass = size === "md" ? "!h-[56px]" : "h-12"; // 48px

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger
                className={cn(
                    "w-full justify-between",
                    sizeClass,
                    "px-4 py-3",
                    // ✅ #FFFFFF1A
                    "bg-white/10",
                    "border border-white/15",
                    // ✅ expected shape
                    shape === "pill" ? "rounded-full" : "rounded-[18px]",
                    // ✅ text
                    "text-white",
                    // placeholder color
                    "[&_[data-placeholder]]:text-white/85",
                    // subtle depth like screenshot
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
                    "hover:bg-white/12 transition",
                    "focus:ring-0 focus:outline-none",
                    "data-[state=open]:bg-white/12",
                    triggerClassName
                )}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent
                className={cn(
                    "z-[80]",
                    "bg-[#160F16]/95 backdrop-blur-xl",
                    "border border-white/10",
                    "rounded-[16px]",
                    "p-1",
                    "shadow-[0_22px_70px_rgba(0,0,0,0.55)]",
                    contentClassName
                )}
            >
                {options.map((o) => (
                    <SelectItem
                        key={o.value}
                        value={o.value}
                        disabled={o.disabled}
                        className={cn(
                            "cursor-pointer rounded-[12px]",
                            "text-white/90 focus:text-white",
                            "focus:bg-white/10",
                            "data-[highlighted]:bg-white/10 data-[highlighted]:text-white"
                        )}
                    >
                        {o.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
