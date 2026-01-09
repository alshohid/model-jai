"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

type Props = {
    points: number | string;
    price: number | string;
    currency?: string; // "$"
    imageSrc: string;
    onBuy?: () => void;
    buyLabel?: string;
    className?: string;
    disabled?: boolean;
};

export default function PointCard({
    points,
    price,
    currency = "$",
    imageSrc,
    onBuy,
    buyLabel = "Buy Coins",
    className,
    disabled = false,
}: Props) {
    return (
        <article
            className={cn(
                "w-full",
                // responsive width cap but fluid
                "max-w-[420px]",
                "rounded-[16px]",
                "p-5 sm:p-6",
                "bg-white/5 border border-white/12 backdrop-blur-[16px]",
                "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.05),0_0_0_1px_rgba(0,0,0,0.35)]",
                disabled && "opacity-60",
                className
            )}
        >
            {/* Image panel */}
            <div
                className={cn(
                    "relative w-full overflow-hidden",
                    "rounded-[14px]",
                    // keep the same "panel" look across devices
                    "aspect-[16/9]",
                    "bg-white/6 border border-white/10",
                    "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                )}
            >
                <Image
                    src={imageSrc}
                    alt={`${points} points`}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px"
                    className="object-contain h-[236px] w-[358px] p-4 sm:p-6"
                    priority={false}
                />
            </div>

            {/* Info row */}
            <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-white font-semibold text-[18px] sm:text-[20px] leading-none">
                    {points} Points
                </p>

                <p className="text-white font-semibold text-[18px] sm:text-[20px] leading-none">
                    {currency}
                    {price}
                </p>
            </div>

            {/* CTA */}
            <button
                type="button"
                disabled={disabled}
                onClick={onBuy}
                className={cn(
                    "mt-5 w-full h-[48px] rounded-[12px]",
                    "cursor-pointer select-none",
                    "bg-white/5 border border-white/12 text-white/70",
                    "shadow-[inset_0_0_0_2px_rgba(209,91,156,0.25),0_0_0_1px_rgba(255,255,255,0.06)]",
                    "hover:text-white hover:bg-white/8 transition",
                    disabled && "cursor-not-allowed hover:bg-white/5 hover:text-white/70"
                )}
            >
                {buyLabel}
            </button>
        </article>
    );
}
