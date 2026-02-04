/**
 * PlayerPanel Component
 * Panel displaying player in triple panel layout
 * Following Single Responsibility Principle
 */

"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

interface PlayerPanelProps {
    imageSrc: string;
    name: string;
    points: number | string;
    symbolSrc: string;
    className?: string;
}

export default function PlayerPanel({
    imageSrc,
    name,
    points,
    symbolSrc,
    className,
}: PlayerPanelProps) {
    return (
        <div className={cn("relative w-full overflow-hidden bg-black/20", className)}>
            <Image
                src={imageSrc}
                alt={name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
            />

            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <Image
                    src={symbolSrc}
                    alt="symbol"
                    width={140}
                    height={140}
                    className="w-[70px] sm:w-[84px] md:w-[110px] h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.55)]"
                />

                <span
                    className={cn(
                        "mt-1 font-extrabold leading-none",
                        "text-[18px] sm:text-[20px] md:text-[22px]",
                        "text-[#B7FF4A]",
                        "[-webkit-text-stroke:1px_rgba(0,0,0,0.55)]",
                        "drop-shadow-[0_3px_0_rgba(0,0,0,0.75)]"
                    )}
                    style={{ fontFamily: "Manrope" }}
                >
                    {points}
                </span>

                <span
                    className={cn(
                        "mt-1 font-extrabold leading-none",
                        "text-[18px] sm:text-[20px] md:text-[22px]",
                        "text-[#DD2E03]",
                        "[-webkit-text-stroke:2px_#F9C80E]",
                        "drop-shadow-[0_3px_0_rgba(0,0,0,0.75)]"
                    )}
                    style={{ fontFamily: "Manrope" }}
                >
                    {name}
                </span>
            </div>
        </div>
    );
}
