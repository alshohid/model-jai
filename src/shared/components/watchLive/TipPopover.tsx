/* eslint-disable react-hooks/set-state-in-effect */
/**
 * TipPopover Component
 * Displays tip menu or custom tip form
 * Following Single Responsibility Principle - handles only tip UI
 */

"use client";

import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils/cn";
import type { SupportSide } from "@/shared/components/watchLive/types";

type TipView = "menu" | "custom";

interface TipPopoverProps {
    open: boolean;
    side: SupportSide;
    view: TipView;
    align?: "left" | "center" | "right";
    onClose: () => void;
    onPesto: () => void;
    onOpenCustom: () => void;
    onBackToMenu: () => void;
    onSendCustom: (name: string, amount: number) => void;
    triggerFly: (side: SupportSide) => void;
}

const DEFAULT_NAME = "Michael Rohan";
const DEFAULT_AMOUNT = 100;

export default function TipPopover({
    open,
    side,
    view,
    align = "center",
    onClose,
    onPesto,
    onOpenCustom,
    onBackToMenu,
    onSendCustom,
    triggerFly,
}: TipPopoverProps) {
    const [name, setName] = useState(DEFAULT_NAME);
    const [amount, setAmount] = useState<number>(DEFAULT_AMOUNT);

    useEffect(() => {
        if (!open) return;
        setName(DEFAULT_NAME);
        setAmount(DEFAULT_AMOUNT);
    }, [open, side]);

    if (!open) return null;

    const positionClass =
        align === "left"
            ? "left-2"
            : align === "right"
                ? "right-2"
                : "left-1/2 -translate-x-1/2";

    const handlePesoClick = () => {
        console.log("Peso tip clicked - multiple coins");
        for (let i = 0; i < 5; i++) {
            setTimeout(() => triggerFly(side), i * 100);
        }
    };

    const handleSend = () => {
        onSendCustom(name, amount);
        onClose();
    };

    return (
        <div
            data-tip-popover
            className={cn("absolute z-[9999] top-full mt-2", positionClass)}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className={cn(
                    "rounded-2xl",
                    "bg-black/75 backdrop-blur-md",
                    "border border-white/12",
                    "shadow-[0_14px_35px_rgba(0,0,0,0.55)]",
                    "overflow-hidden"
                )}
            >
                {view === "menu" ? (
                    <div className="p-1 md:p-3 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePesoClick}
                            className={cn(
                                "h-7 px-3 rounded-full",
                                "bg-white/10 hover:bg-white/15 transition",
                                "text-white text-sm font-semibold whitespace-nowrap"
                            )}
                        >
                            ₱
                        </button>

                        <button
                            type="button"
                            onClick={onOpenCustom}
                            className={cn(
                                "h-9 px-4 rounded-full",
                                "bg-white/10 hover:bg-white/15 transition",
                                "text-white text-sm font-semibold whitespace-nowrap"
                            )}
                        >
                            Custom tip
                        </button>
                    </div>
                ) : (
                    <div
                        className={cn(
                            "w-[84vw] max-w-[350px] sm:max-w-[420px]",
                            "p-3 sm:p-4",
                            "space-y-2 sm:space-y-3"
                        )}
                    >
                        <div className="text-[1rem] text-start text-white">
                            <h2>Send Tip</h2>
                        </div>

                        <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-2 sm:py-2.5 flex items-center gap-2">
                            <span className="text-white/60 text-sm shrink-0">👤</span>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={cn(
                                    "min-w-0 w-full bg-transparent outline-none",
                                    "text-xs sm:text-sm text-white placeholder:text-white/40"
                                )}
                                placeholder="Sender name"
                            />
                        </div>

                        <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-2 sm:py-2.5 flex items-center gap-2">
                            <span className="text-white/70 text-sm shrink-0">₱</span>
                            <input
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value || 0))}
                                inputMode="numeric"
                                className={cn(
                                    "min-w-0 w-full bg-transparent outline-none",
                                    "text-xs sm:text-sm text-white placeholder:text-white/40"
                                )}
                                placeholder="100"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                            <button
                                type="button"
                                onClick={handleSend}
                                className={cn(
                                    "h-10 sm:h-9 w-full",
                                    "rounded-xl font-semibold text-sm",
                                    "bg-fuchsia-500/95 hover:bg-fuchsia-500 transition",
                                    "shadow-[0_10px_22px_rgba(236,72,153,0.35)]"
                                )}
                            >
                                Send
                            </button>
                            <button
                                type="button"
                                onClick={onBackToMenu}
                                className={cn(
                                    "h-10 sm:h-9 w-full sm:w-auto",
                                    "px-3 rounded-xl",
                                    "bg-white/10 hover:bg-white/15 transition",
                                    "text-white/90 text-sm font-semibold"
                                )}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
