"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";

export type PointPack = {
    id: string;
    points: number;
    price: string; // "17.00"
    currencySymbol?: string; // "$"
    currencyCode?: string; // "USD"
    imageSrc: string;
};

function toMoney(n: number, symbol = "$") {
    return `${symbol}${n.toFixed(2)}`;
}

export default function BuyPointsDialog({
    open,
    onOpenChange,
    pack,
    onPay,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    pack: PointPack | null;
    onPay?: (pack: PointPack) => void;
}) {
    if (!pack) return null;

    const symbol = pack.currencySymbol ?? "$";
    const code = pack.currencyCode ?? "USD";

    const subtotal = Number(pack.price || 0);
    const tax = Number((subtotal * 0.025).toFixed(2)); // dummy tax 2.5%
    const total = subtotal + tax;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "p-0 border-0 bg-transparent shadow-none",
                    "w-[92vw] max-w-[460px]"
                )}
            >
                <div
                    className={cn(
                        "relative overflow-hidden",
                        "rounded-[18px]",
                        "bg-[#160F16]/90 backdrop-blur-xl",
                        "border border-white/10",
                        "shadow-[0_22px_70px_rgba(0,0,0,0.55)]",
                        "p-5 sm:p-6"
                    )}
                >
                    {/* Header */}
                    <DialogHeader className="space-y-0">
                        <div className="flex items-start justify-between gap-4">
                            <DialogTitle className="text-white text-[22px] font-semibold">
                                Buy Points
                            </DialogTitle>

                        </div>
                    </DialogHeader>

                    {/* Pack preview */}
                    <div className="mt-4">
                        <div
                            className={cn(
                                "relative w-full overflow-hidden",
                                "rounded-[14px]",
                                "bg-white/6 border border-white/12",
                                "aspect-[16/9]"
                            )}
                        >
                            <Image
                                src={pack.imageSrc}
                                alt={`${pack.points} points`}
                                fill
                                sizes="460px"
                                className="object-contain p-4 sm:p-6"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-white text-[20px] font-semibold">
                                {pack.points} Points
                            </p>
                            <p className="text-white text-[20px] font-semibold">
                                {symbol}
                                {pack.price}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="mt-4 h-px w-full bg-white/10" />
                    </div>

                    {/* Summary box */}
                    <div
                        className={cn(
                            "mt-4 rounded-[14px]",
                            "bg-white/5 border border-white/12",
                            "p-4"
                        )}
                    >
                        <div className="flex items-center justify-between text-white/80 text-sm">
                            <span>Subtotal</span>
                            <span>
                                {toMoney(subtotal, symbol)} {code}
                            </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-white/80 text-sm">
                            <span>Tax</span>
                            <span>
                                {toMoney(tax, symbol)} {code}
                            </span>
                        </div>

                        <div className="mt-4 h-px w-full bg-white/10" />

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-white font-semibold text-[18px]">Total</span>
                            <span className="text-white font-semibold text-[18px]">
                                {toMoney(total, symbol)} {code}
                            </span>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        type="button"
                        onClick={() => onPay?.(pack)}
                        className={cn(
                            "mt-5 w-full h-[52px] rounded-[12px]",
                            "bg-[#FF2EC8] text-white font-semibold",
                            "cursor-pointer",
                            "shadow-[0_10px_25px_rgba(255,46,200,0.22)]",
                            "hover:opacity-95 active:scale-[0.99] transition"
                        )}
                    >
                        Pay with Stripe
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
