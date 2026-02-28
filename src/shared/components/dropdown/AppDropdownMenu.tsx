"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils/cn";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";

export type AppDropdownItem =
    | {
        type?: "item";
        label: string;
        href?: string;
        onSelect?: () => void;
        icon?: React.ReactNode;
        shortcut?: string;
        disabled?: boolean;
        className?: string;
        isLogoutLoading?: boolean;
    }
    | { type: "separator" }
    | { type: "label"; label: string };

type Props = {
    trigger: React.ReactNode;
    items: AppDropdownItem[];
    contentClassName?: string;
    align?: "start" | "center" | "end";
    sideOffset?: number;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    isLogoutLoading?: boolean;
};

export default function AppDropdownMenu({
    trigger,
    items,
    contentClassName,
    align = "end",
    sideOffset = 10,
    open,
    onOpenChange,
    isLogoutLoading
}: Props) {
    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

            <DropdownMenuContent
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    "min-w-[230px] z-[100] rounded-[14px]",
                    "border border-white/10 bg-[#160F16]/95 text-white backdrop-blur-xl",
                    "shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
                    "p-2",
                    contentClassName
                )}
            >
                {items.map((it, idx) => {
                    if (it.type === "separator") return <DropdownMenuSeparator key={idx} className="bg-white/10" />;

                    if (it.type === "label") {
                        return (
                            <DropdownMenuLabel key={idx} className="text-white/70 text-xs">
                                {it.label}
                            </DropdownMenuLabel>
                        );
                    }

                    // normal item
                    const itemInner = (
                        <div className="flex items-center gap-2 w-full">
                            {it.icon ? <span className="shrink-0">{it.icon}</span> : null}
                            <span className="flex-1 text-sm">{it.label}</span>
                            {it.shortcut ? (
                                <span className="text-xs text-white/45">{it.shortcut}</span>
                            ) : null}
                        </div>
                    );

                    // href item
                    if (it.href) {
                        return (
                            <DropdownMenuItem
                                key={idx}
                                disabled={it.disabled}
                                asChild
                                className={cn(
                                    "cursor-pointer rounded-[10px]",
                                    "focus:bg-white/10 focus:text-white",
                                    "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
                                    it.className
                                )}
                            >
                                <Link href={it.href}>{itemInner}</Link>
                            </DropdownMenuItem>
                        );
                    }

                    // action item
                    return (
                        <DropdownMenuItem
                            key={idx}
                            disabled={it.disabled || isLogoutLoading}
                            onSelect={(e) => {
                                // Radix onSelect fires even when navigating; action-only items need this:
                                e.preventDefault();
                                it.onSelect?.();
                            }}
                            className={cn(
                                "cursor-pointer rounded-[10px]",
                                "focus:bg-white/10 focus:text-white",
                                "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
                                it.className
                            )}
                        >
                            {isLogoutLoading ? <div className="flex items-center gap-2">
                                <span>Logging Out...</span>< Loader2 className="animate-spin" />
                            </div> : itemInner}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
