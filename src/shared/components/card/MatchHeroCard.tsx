"use client";

import clsx from "clsx";
import { PlayerImage } from "../cardComponent/PlayerImage";
import { Versus } from "../cardComponent/Versus";

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

    leftPlayerImg,
    rightPlayerImg,
    versusImg,
    className,
    onWatch,
}: Props) {

    return (
            <article
                    className={clsx(
                        "w-full flex flex-col rounded-[16px]",
                        "bg-matchCardBg border border-matchCardBorder backdrop-blur-[16px]",
                        className
                    )}
                >
                    <div className="overflow-hidden px-3 py-2 md:p-6">
                        {/* PLAYERS */}
                        <div className="grid grid-cols-[1fr_12px_1fr] sm:grid-cols-[1fr_20px_1fr] md:grid-cols-[1fr_30px_1fr]
                    aspect-[2.8/2] gap-1 rounded-[16px] bg-[#FFFFFF0D] border border-white/10 p-2 md:p-5">
                            <PlayerImage src={leftPlayerImg} />
                            <Versus src={versusImg} />
                            <PlayerImage src={rightPlayerImg} />
                        </div>
        
                      
                    </div>
                </article>
    );
}


