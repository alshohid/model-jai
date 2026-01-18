"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";
import AppSelect, { AppSelectOption } from "./AppSelect";
import PrimaryCtaButton from "./PrimaryCtaButton";

type Props = {
    title?: string;

    // ✅ Select controls (optional)
    showSelect?: boolean;
    matchType?: string;
    onMatchTypeChange?: (v: string) => void;
    matchTypeOptions?: AppSelectOption[];
    selectPlaceholder?: string;

    // ✅ CTA
    onCreateMatch: () => void;
    ctaLabel?: string;
    selectShape?: any;
    className?: string;
};

export default function MatchListToolbar({
    title = "Match List",

    showSelect = true,
    matchType,
    onMatchTypeChange,
    matchTypeOptions = [],
    selectPlaceholder = "Match Type",
    selectShape = "rounded",
    onCreateMatch,
    ctaLabel = "Create New Match",
    className,
}: Props) {
    return (
        <div
            className={cn(
                "w-full",
                "flex flex-col gap-4",
                "md:flex-row md:items-center md:justify-between",
                className
            )}
        >
            {/* Left title */}
            <h2 className={cn("text-white font-semibold", "text-[22px] md:text-[26px]")}>
                {title}
            </h2>

            {/* Right controls */}
            <div
                className={cn(
                    "flex flex-col gap-3",
                    "sm:flex-row sm:items-center sm:justify-end",
                    "w-full md:w-auto"
                )}
            >
                {/* ✅ Select (conditionally render) */}
                {showSelect ? (
                    <div className={cn("w-full sm:w-[195px] focus:outline-none")}>
                        <AppSelect
                            value={matchType}
                            onValueChange={(v) => {
                                onMatchTypeChange?.(v);
                            }}
                            placeholder={selectPlaceholder}
                            options={matchTypeOptions}
                            shape={selectShape}   // "rounded" | "pill"
                            size="sm"             // "sm" | "md"
                            className={cn(
                                "text-[18px] leading-[132%]"
                                // "[font-family:Inter_Tight,Inter,system-ui,sans-serif]"
                            )}
                        />

                    </div>
                ) : null}

                {/* CTA Button */}
                <PrimaryCtaButton
                    onClick={onCreateMatch}
                    fullWidth
                    className={cn(
                        "h-10 rounded-[14px]",
                        "sm:w-auto w-full",
                        "px-6 sm:px-10"
                    )}
                >
                    {ctaLabel}
                </PrimaryCtaButton>
            </div>
        </div>
    );
}
