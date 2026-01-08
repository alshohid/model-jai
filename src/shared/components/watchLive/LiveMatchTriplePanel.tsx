"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

type SideInfo = {
    name: string;
    points: number | string;
    symbolSrc: string;
};

type Props = {
    leftImage: string;
    rightImage: string;
    middleImage: string;
    left: SideInfo;
    right: SideInfo;
    middleLabel?: string;
    className?: string;
};

const PANEL_FRAME =
    "relative w-full overflow-hidden " +
    "aspect-[16/9] md:aspect-auto md:h-[320px] lg:h-[380px] xl:h-[420px] " +
    "bg-black/20"; // letterbox bg (contain হলে দরকার)

export default function LiveMatchTriplePanel({
    leftImage,
    rightImage,
    middleImage,
    left,
    right,
    middleLabel = "Model",
    className,
}: Props) {
    return (
        <section
            className={cn(
                "w-full overflow-hidden",
                "grid grid-cols-1 md:grid-cols-3",
                "border border-white/10",
                "divide-y divide-white/10 md:divide-y-0 md:divide-x",
                className
            )}
        >
            <PlayerPanel
                // frameClassName={PANEL_FRAME}
                imageSrc={leftImage}
                // overlayAlign="left"
                name={left.name}
                points={left.points}
                symbolSrc={left.symbolSrc}
            />

            {/* MIDDLE */}
            <div className={cn(PANEL_FRAME)}>
                <Image
                    src={middleImage}
                    alt="middle"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                />

                <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2">
                    <span
                        className={cn(
                            "font-extrabold text-[22px] md:text-[28px] leading-none",
                            "text-[#DD2E03]",
                            "[-webkit-text-stroke:2px_#F9C80E]",
                            "drop-shadow-[0_4px_0_rgba(0,0,0,0.75)]"
                        )}
                        style={{ fontFamily: "Manrope" }}
                    >
                        {middleLabel}
                    </span>
                </div>
            </div>

            <PlayerPanel
                // frameClassName={PANEL_FRAME}
                imageSrc={rightImage}
                // overlayAlign="right"
                name={right.name}
                points={right.points}
                symbolSrc={right.symbolSrc}
            />
        </section>
    );
}

function PlayerPanel({
    imageSrc,
    name,
    points,
    symbolSrc,
    className,
}: {
    imageSrc: string;
    name: string;
    points: number | string;
    symbolSrc: string;
    className?: string;
}) {
    return (
        <div className={cn("relative w-full overflow-hidden bg-black/20", className)}>
            <Image
                src={imageSrc}
                alt={name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain"
            />

            {/* ✅ overlay center */}
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

