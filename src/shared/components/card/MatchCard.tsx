import WatchStreamButton from "@/shared/UI/button/WatchStreamButton";
import clsx from "clsx";
import { SocialLinks } from "../cardComponent/SocialLinks";
import { Meta } from "../cardComponent/Meta";
import { GameLogo } from "../cardComponent/GameLogo";
import { PlayerImage } from "../cardComponent/PlayerImage";
import { Versus } from "../cardComponent/Versus";

type MatchStatus = "Upcoming" | "Past" | "Live";

type Props = {
    status: MatchStatus;
    title: string;
    dateText: string;
    timeText: string;
    gameLogoSrc: string;
    leftPlayerImg: string;
    rightPlayerImg: string;
    watchHref: string;
    voteRequired?: boolean;
    className?: string;
    versusImg: string;
    onWatch?: () => void;
};

export default function MatchCard({
    status,
    title,
    dateText,
    timeText,
    gameLogoSrc,
    leftPlayerImg,
    rightPlayerImg,
    voteRequired = true,
    className = "",
    versusImg,
    onWatch,
}: Props) {
    const statusStyle = clsx(
        "px-2 md:px-3 py-0 md:py-1 rounded-md text-xs border",
        status === "Live"
            ? "bg-red-500/25 text-red-100 border-red-400/30"
            : "bg-white/10 text-white/70 border-white/15"
    );

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

                {/* INFO */}
                <div className="mt-2">
                    {/* MOBILE HEADER */}
                    <div className="flex items-center gap-2 md:hidden">
                        <span className={statusStyle}>{status}</span>
                        <GameLogo src={gameLogoSrc} mobile />
                    </div>

                    {/* DESKTOP LOGO */}
                    <div className="hidden md:block">
                        <GameLogo src={gameLogoSrc} />
                    </div>

                    <div className="flex flex-col gap-2 md:gap-3">
                        <div className="hidden md:flex">
                            <span className={statusStyle}>{status}</span>
                        </div>

                        <h3 className="text-white font-semibold text-[12px] md:text-[18px] leading-tight">
                            {title}
                        </h3>

                        <div className="flex gap-x-1 md:gap-x-6 text-white/75 text-xs md:text-sm">
                            <Meta icon="🗓" text={dateText} />
                            <Meta icon="🕒" text={timeText} />
                        </div>
                    </div>

                    {/* ACTION */}
                    <div className="mt-2 md:mt-5">
                        <WatchStreamButton label="Watch stream" onClick={onWatch} />

                        {voteRequired ? (
                            <p className="mt-2 md:mt-3 text-center text-xs md:text-base font-medium text-[#FF2EC8]">
                                Tiktok Vote Required
                            </p>
                        ) : (
                            <SocialLinks />
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}


