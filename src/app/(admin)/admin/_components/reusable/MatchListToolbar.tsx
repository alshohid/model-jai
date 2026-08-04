/* eslint-disable @typescript-eslint/no-explicit-any */
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
    /** Extra actions next to the primary CTA (e.g. Add User). */
    actions?: React.ReactNode;
    /** Renders between the filter and CTA on mobile (e.g. search). */
    children?: React.ReactNode;
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
    actions,
    children,
}: Props) {
    const select = showSelect ? (
        <div className="w-full sm:w-[195px]">
            <AppSelect
                value={matchType}
                onValueChange={(v) => {
                    onMatchTypeChange?.(v);
                }}
                placeholder={selectPlaceholder}
                options={matchTypeOptions}
                variant="toolbar"
                shape={selectShape}
                size="sm"
            />
        </div>
    ) : null;

    const renderCtaButton = () => (
        <PrimaryCtaButton
            onClick={onCreateMatch}
            fullWidth
            className={cn(
                "h-10 rounded-[12px] px-4 text-sm shadow-none",
                "sm:h-12 sm:w-auto sm:rounded-[18px] sm:px-6 sm:text-sm",
                "sm:shadow-[0_16px_40px_rgba(255,46,200,0.22)]",
            )}
        >
            {ctaLabel}
        </PrimaryCtaButton>
    );

    return (
        <div
            className={cn(
                "mb-4 w-full",
                "flex flex-col gap-3",
                "sm:mb-5 sm:gap-4",
                className,
            )}
        >
            {/* Title + desktop controls */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2
                    className={cn(
                        "text-white font-semibold",
                        "text-xl leading-tight sm:text-[22px] md:text-[26px]",
                    )}
                >
                    {title}
                </h2>

                <div className="hidden items-center justify-end gap-3 md:flex">
                    {select}
                    {renderCtaButton()}
                    {actions}
                </div>
            </div>

            {/* Mobile: select first */}
            {showSelect ? <div className="md:hidden">{select}</div> : null}

            {/* Optional middle content (search) */}
            {children}

            {/* Mobile: actions at the bottom */}
            <div className="flex flex-col gap-2.5 md:hidden">
                {renderCtaButton()}
                {actions}
            </div>
        </div>
    );
}
