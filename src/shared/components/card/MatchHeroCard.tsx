"use client";

import clsx from "clsx";
import Image from "next/image";
import { GameLogo } from "../cardComponent/GameLogo";

type MatchStatus = "Upcoming" | "Past" | "Live";

type Props = {
    status: MatchStatus;
    title: string;
    dateText: string;
    timeText: string;

    gameLogoSrc: string;

    leftPlayerName: string;
    rightPlayerName: string;

    leftPlayerImg: string;
    rightPlayerImg: string;
    versusImg: string;

    voteRequired?: boolean;
    className?: string;

    onWatch?: () => void;
};

export default function MatchHeroCard({
    status,
    title,
    dateText,
    timeText,
    gameLogoSrc,
    leftPlayerName,
    rightPlayerName,
    leftPlayerImg,
    rightPlayerImg,
    versusImg,
    voteRequired = true,
    className,
    onWatch,
}: Props) {

    return (
        <article
            className={clsx(
                "w-full max-w-none", // ✅ hero full width
                "rounded-[18px]",
                "bg-black/35 border border-white/15 backdrop-blur-[18px]",
                "shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
                className
            )}
        >
            {/* ✅ GRID wrapper */}
            <div className="grid grid-rows-[auto_auto_auto] gap-3 sm:gap-4 p-3 sm:p-5 lg:p-6">
                {/* TOP BAR */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <div className="flex items-center gap-2">
                    
                        <div className="hidden sm:block">
                            <GameLogo src={gameLogoSrc} />
                        </div>
                    </div>

                    <div className="sm:hidden justify-self-end">
                        <GameLogo src={gameLogoSrc} mobile />
                    </div>
                </div>

                <div
                    className={clsx(
                        "rounded-[16px] overflow-hidden",
                        "bg-white/5 border border-white/10"
                    )}
                >
                    <div className="grid grid-cols-[1fr_70px_1fr] sm:grid-cols-[1fr_90px_1fr] md:grid-cols-[1fr_120px_1fr] gap-2 sm:gap-3 md:gap-5 p-3 sm:p-4 md:p-5 items-center">
                        <PlayerBlock
                            img={leftPlayerImg}
                            name={leftPlayerName}
                            align="left"
                            size="sm"
                        />

                        {/* VS */}
                        <div className="relative w-full aspect-square mx-auto">
                            <Image src={versusImg} alt="vs" fill className="object-contain" />
                        </div>

                        <PlayerBlock
                            img={rightPlayerImg}
                            name={rightPlayerName}
                            align="right"
                            size="sm"
                        />
                    </div>
                </div>

                {/* INFO */}
                <div className="grid gap-2">
                    <h3 className="text-white font-semibold leading-tight text-[13px] sm:text-[15px] md:text-[18px]">
                        {title}
                    </h3>
                </div>
            </div>
        </article>
    );
}

function PlayerBlock({
    img,
    name,
    align,
    size = "sm",
}: {
    img: string;
    name: string;
    align: "left" | "right";
    size?: "sm" | "lg";
}) {
    return (
        <div
            className={clsx(
                "grid gap-2 md:p-4",
                align === "right" ? "justify-items-end" : "justify-items-start"
            )}
        >
            {/* image box */}
            <div
                className={clsx(
                    "relative w-full rounded-[14px] overflow-hidden  md:p-8",
                    // responsive height using aspect ratio
                    "aspect-[4/3]"
                )}
            >
                <Image src={img} alt={name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
            </div>

            {/* name tag */}
            <div
                className={clsx(
                    "px-2 sm:px-3 py-1 rounded-lg",
                    // "bg-black/45 border border-white/10",
                    "text-white font-bold truncate",
                    "text-[10px] sm:text-[12px] md:text-[14px]",
                    "max-w-full"
                )}
                title={name}
            >
                {name}
            </div>
        </div>
    );
}
