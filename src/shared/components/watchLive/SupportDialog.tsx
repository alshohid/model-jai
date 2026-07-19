/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Bell, PhilippinePeso, User } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/shared/lib/utils/cn";
import type { SupportSide } from "@/shared/components/watchLive/types";

const DEFAULT_SUPPORTER_NAME = "Michael Rohan";
const DEFAULT_AMOUNT = 100;

interface SupportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    playerName: string;
    side: SupportSide;
    defaultSupporterName?: string;
    defaultAmount?: number;
    onConfirm: (
        side: SupportSide,
        supporterName: string,
        amount: number
    ) => Promise<void> | void;
}

export default function SupportDialog({
    open,
    onOpenChange,
    playerName,
    side,
    defaultSupporterName = DEFAULT_SUPPORTER_NAME,
    defaultAmount = DEFAULT_AMOUNT,
    onConfirm,
}: SupportDialogProps) {
    const [supporterName, setSupporterName] = React.useState(defaultSupporterName);
    const [amount, setAmount] = React.useState<string>(String(defaultAmount));
    const [success, setSuccess] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState("");
    const [keyboardStyle, setKeyboardStyle] = React.useState<
        React.CSSProperties | undefined
    >(undefined);
    const amountInputRef = React.useRef<HTMLInputElement>(null);

    // Keep the focused input visible once the keyboard finishes animating in.
    const scrollFieldIntoView = (target: HTMLElement) => {
        window.setTimeout(() => {
            target.scrollIntoView({ block: "center", behavior: "smooth" });
        }, 300);
    };

    // On iOS the keyboard overlays the page without resizing it, so a
    // vertically-centered fixed dialog ends up hidden behind the keyboard.
    // Track the visual viewport and pin the dialog inside the visible area
    // while the keyboard is open.
    React.useEffect(() => {
        if (!open) {
            setKeyboardStyle(undefined);
            return;
        }
        const vv = window.visualViewport;
        if (!vv) return;

        const update = () => {
            const keyboardOpen = vv.height < window.innerHeight - 100;
            setKeyboardStyle(
                keyboardOpen
                    ? {
                          top: vv.offsetTop + 12,
                          translate: "-50% 0",
                          maxHeight: vv.height - 24,
                      }
                    : undefined
            );
        };

        update();
        vv.addEventListener("resize", update);
        vv.addEventListener("scroll", update);
        return () => {
            vv.removeEventListener("resize", update);
            vv.removeEventListener("scroll", update);
        };
    }, [open]);

    React.useEffect(() => {
        if (open) {
            setSupporterName(defaultSupporterName);
            setAmount(String(defaultAmount));
            setSuccess(false);
            setSubmitting(false);
            setError("");
        }
    }, [open, defaultSupporterName, defaultAmount]);

    const handleConfirm = async () => {
        const num = Math.max(0, parseInt(amount, 10) || 0);
        if (num <= 0) return;

        try {
            setSubmitting(true);
            setError("");

            await onConfirm(side, supporterName, num);

            setSuccess(true);

            setTimeout(() => {
                onOpenChange(false);
            }, 800);
        } catch (err: any) {
            setError(err?.data?.message || err?.message || "Support failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const numAmount = Math.max(0, parseInt(amount, 10) || 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "max-w-[calc(100vw-2rem)] w-full sm:max-w-md",
                    "max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain",
                    "bg-[#1a141a] border-white/10 text-white",
                    "p-0 gap-0"
                )}
                style={keyboardStyle}
                showCloseButton={true}
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                    const input = amountInputRef.current;
                    if (input) {
                        input.focus();
                        input.select();
                        scrollFieldIntoView(input);
                    }
                }}
            >
                <DialogTitle className="sr-only">Support {playerName}</DialogTitle>

                <div className="flex items-center gap-2 px-5 pt-5 pb-4 border-b border-white/10">
                    <span className="font-bold text-white text-lg tracking-wide">
                        SUPPORT
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-500/90 text-white">
                        {playerName}
                    </span>
                </div>

                {success ? (
                    <div className="px-5 py-8 text-center">
                        <p className="text-green-400 font-semibold text-lg">
                            Support successfully placed!
                        </p>
                        <p className="text-white/60 text-sm mt-1">
                            Your support has been recorded. Check the bell for updates.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="px-5 py-4">
                            <label className="block text-white/70 text-sm font-medium mb-2">
                                Supporter Full Name
                            </label>
                            <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                                <User className="size-4 text-white/50 shrink-0" />
                                <input
                                    type="text"
                                    value={supporterName}
                                    onChange={(e) => setSupporterName(e.target.value)}
                                    onFocus={(e) => scrollFieldIntoView(e.target)}
                                    className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-base sm:text-sm"
                                    placeholder="Your name"
                                />
                            </div>
                        </div>

                        <div className="px-5 py-2 pb-4">
                            <label className="block text-white/70 text-sm font-medium mb-2">
                                Support amount
                            </label>
                            <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
                                <PhilippinePeso className="size-4 text-white/50 shrink-0" />
                                <input
                                    ref={amountInputRef}
                                    type="number"
                                    min={1}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    onFocus={(e) => scrollFieldIntoView(e.target)}
                                    className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-base sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0"
                                />
                                <span className="text-white/60 text-sm">₱</span>
                            </div>
                        </div>

                        {error ? (
                            <div className="px-5 pb-2 text-sm text-red-400">{error}</div>
                        ) : null}

                        <div className="px-5 pb-6">
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={numAmount <= 0 || submitting}
                                className={cn(
                                    "w-full py-3.5 rounded-xl font-semibold text-white transition",
                                    "bg-[#FF2EC8] hover:bg-[#FF2EC8]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                {submitting ? "Processing..." : "Confirm Support"}
                            </button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}