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

    leftPlayerName?: string;
    rightPlayerName?: string;

    leftPlayerImg: string;
    rightPlayerImg: string;
    versusImg: string;

    voteRequired?: boolean;
    className?: string;

    onWatch?: () => void;
    onLeftPlayerClick?: () => void;
    onRightPlayerClick?: () => void;
};

export default function MatchHeroCard({

    leftPlayerName,
    rightPlayerName,
    leftPlayerImg,
    rightPlayerImg,
    versusImg,
    className,
    onWatch,
    onLeftPlayerClick,
    onRightPlayerClick,
}: Props) {
    const leftPlayerLabel = leftPlayerName || "player one";
    const rightPlayerLabel = rightPlayerName || "player two";

    return (
        <article
            className={clsx(
                "w-full flex flex-col rounded-[16px]",
                "bg-matchCardBg border border-matchCardBorder backdrop-blur-[16px]",
                className
            )}
        >
            <div className="overflow-hidden px-3 py-2 md:p-6">
                <div className="grid grid-cols-[1fr_12px_1fr] sm:grid-cols-[1fr_20px_1fr] md:grid-cols-[1fr_30px_1fr]
                    aspect-[2.8/2] gap-1 rounded-[16px] bg-[#FFFFFF0D] border border-white/10 p-2 md:p-5">
                    {onLeftPlayerClick ? (
                        <button
                            type="button"
                            onClick={onLeftPlayerClick}
                            className="h-full w-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                            aria-label={`View ${leftPlayerLabel} profile`}
                        >
                            <PlayerImage src={leftPlayerImg} />
                        </button>
                    ) : (
                        <PlayerImage src={leftPlayerImg} />
                    )}
                    <Versus src={versusImg} />
                    {onRightPlayerClick ? (
                        <button
                            type="button"
                            onClick={onRightPlayerClick}
                            className="h-full w-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                            aria-label={`View ${rightPlayerLabel} profile`}
                        >
                            <PlayerImage src={rightPlayerImg} />
                        </button>
                    ) : (
                        <PlayerImage src={rightPlayerImg} />
                    )}
                </div>


            </div>
        </article>
    );
}
