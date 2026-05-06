"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck, Sparkles, X } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import PaymentMethodLogo from "@/shared/components/payment/PaymentMethodLogo";
import { PaymentMethodConfig } from "@/shared/constants/paymentMethods";

export type PointPack = {
    id: string;
    points: number;
    price: string;
    currencySymbol?: string;
    currencyCode?: string;
    imageSrc: string;
    title?: string;
    description?: string;
    badge?: string;
};

function toMoney(n: number, symbol = "$") {
    return `${symbol}${n.toFixed(2)}`;
}

export default function BuyPointsDialog({
    open,
    onOpenChange,
    pack,
    paymentMethod,
    onPay,
    isLoading
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    pack: PointPack | null;
    paymentMethod: PaymentMethodConfig;
    onPay?: (pack: PointPack) => void;
    isLoading?: boolean;
}) {
    if (!pack) return null;

    const symbol = pack.currencySymbol ?? "$";
    const code = pack.currencyCode ?? "USD";
    const subtotal = Number(pack.price || 0);
    const title = pack.title ?? `${pack.points.toLocaleString()} Points`;
    const description =
        pack.description ??
        `You will be redirected to ${paymentMethod.name} to complete your purchase securely.`;
    const badge = pack.badge ?? "Secure Checkout";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "w-[calc(100vw-1rem)] max-w-[460px]",
                    "max-h-[calc(100vh-1rem)] overflow-y-auto overscroll-contain",
                    "border-0 bg-transparent p-0 shadow-none",
                    "sm:w-[92vw] sm:max-h-[calc(100vh-2rem)]"
                )}
            >
                <div
                    className={cn(
                        "relative flex min-h-full flex-col overflow-hidden",
                        "rounded-[24px]",
                        "bg-[#120B14]/95 backdrop-blur-xl",
                        "border border-white/10",
                        "shadow-[0_22px_70px_rgba(0,0,0,0.55)]",
                        "sm:min-h-0"
                    )}
                >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(0,195,255,0.22),transparent_60%)]" />
                    <div className="pointer-events-none absolute -right-16 top-20 h-36 w-36 rounded-full bg-[#FF4D8D]/15 blur-3xl" />
                    <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#00C3FF]/10 blur-3xl" />

                    <div className="relative flex-1 px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
                        <DialogHeader className="relative space-y-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-[#9FE8FF]">
                                        <Sparkles className="size-3.5" />
                                        {badge}
                                    </div>
                                    <DialogTitle className="mt-3 text-[20px] font-semibold text-white sm:text-[22px]">
                                        Confirm Checkout
                                    </DialogTitle>
                                    <p className="mt-2 max-w-sm text-[13px] leading-5 text-white/65 sm:text-sm sm:leading-6">
                                        {description}
                                    </p>
                                </div>
                                <DialogClose className="text-white/80 cursor-pointer hover:text-white transition-colors">
                                    <X size={24} />
                                </DialogClose>
                            </div>
                        </DialogHeader>

                        <div className="relative mt-4 grid gap-4 rounded-[20px] border border-white/10 bg-white/5 p-4 sm:grid-cols-[170px_1fr] sm:p-5">
                            <div
                                className={cn(
                                    "relative overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))]",
                                    "aspect-square sm:aspect-auto sm:min-h-[170px]"
                                )}
                            >
                                <div className="absolute inset-x-4 top-0 h-24 rounded-full bg-[#00C3FF]/12 blur-2xl" />
                                <Image
                                    src={pack.imageSrc}
                                    alt={`${pack.points} points`}
                                    fill
                                    sizes="220px"
                                    className="object-contain p-6"
                                />
                            </div>

                            <div className="flex flex-col justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                                        Selected Package
                                    </p>
                                    <p className="mt-2.5 text-[20px] font-semibold text-white sm:text-[22px]">
                                        {title}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2.5 text-[13px] text-white/65 sm:text-sm">
                                        <ShieldCheck className="size-4 text-[#9FE8FF]" />
                                        Secure {paymentMethod.name} checkout
                                    </div>
                                </div>

                                <div className="mt-4 flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                                            Points
                                        </p>
                                        <p className="mt-1.5 text-lg font-semibold text-white sm:text-xl">
                                            {pack.points.toLocaleString()} pts
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                                            Pay Today
                                        </p>
                                        <p className="mt-1.5 text-[24px] font-semibold text-white sm:text-[26px]">
                                            {toMoney(subtotal, symbol)}
                                        </p>
                                        <p className="text-xs text-white/45">{code}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "mt-4 rounded-[18px]",
                                "bg-white/5 border border-white/12",
                                "p-4"
                            )}
                        >
                            <div className="flex items-center justify-between gap-4 text-[13px] text-white/80 sm:text-sm">
                                <span>Subtotal</span>
                                <span className="text-right">
                                    {toMoney(subtotal, symbol)} {code}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-4 text-[13px] text-white/80 sm:text-sm">
                                <span>Points Delivered</span>
                                <span className="text-right">{pack.points.toLocaleString()} pts</span>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-4">
                                <span className="text-base font-semibold text-white sm:text-[17px]">Total</span>
                                <span className="text-right text-base font-semibold text-white sm:text-[17px]">
                                    {toMoney(subtotal, symbol)} {code}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 rounded-[18px] border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start gap-3">
                                <PaymentMethodLogo
                                    method={paymentMethod}
                                    className="size-12 rounded-[16px]"
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-white">
                                            {paymentMethod.name}
                                        </p>
                                        <span
                                            className={cn(
                                                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                                                "bg-[#00C3FF]/14 text-[#9FE8FF]"
                                            )}
                                        >
                                            Selected Method
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm leading-6 text-white/55">
                                        {paymentMethod.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sticky bottom-0 relative z-10 border-t border-white/10 bg-[#120B14]/95 px-4 pb-4 pt-3 backdrop-blur-xl sm:px-6 sm:pb-5 sm:pt-4">
                        <p className="text-[11px] leading-5 text-white/45 sm:text-xs">
                            {`After clicking continue, ${paymentMethod.name} will open in a secure hosted page for payment completion.`}
                        </p>

                        <StartStreamingButton
                            isLoading={isLoading}
                            className="mt-3 flex h-11 w-full items-center justify-center gap-2 text-base sm:h-auto sm:text-[1.125rem]"
                            onClick={() => onPay?.(pack)}
                        >
                            {isLoading
                                ? "Processing..."
                                : `Continue with ${paymentMethod.name}`}
                            {!isLoading && <ArrowRight className="size-4" />}
                        </StartStreamingButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
