"use client";

import clsx from "clsx";
import Image from "next/image";
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
        
                        {/* INFO */}
                        {/* <div className="mt-2">
                          
                            <div className="flex items-center gap-2 md:hidden">
                                <span className={statusStyle}>{status}</span>
                                <GameLogo src={gameLogoSrc} mobile />
                            </div>
        
                
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
                        </div> */}
                    </div>
                </article>
    );
}

// function PlayerBlock({
//     img,
//     name,
//     align,
//     size = "sm",
// }: {
//     img: string;
//     name: string;
//     align: "left" | "right";
//     size?: "sm" | "lg";
// }) {
//     return (
//         <div
//             className={clsx(
//                 "grid gap-2 md:p-4",
//                 align === "right" ? "justify-items-end" : "justify-items-start"
//             )}
//         >
//             <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10] rounded-[14px] overflow-hidden bg-black/40">
//                 <Image
//                     src={img}
//                     alt={name}
//                     fill
//                     sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 30vw"
//                     className="object-contain p-2"  // ✅ no crop
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
//             </div>


//             {/* name tag */}
//             <div
//                 className={clsx(
//                     "px-2 sm:px-3 py-1 rounded-lg",
//                     // "bg-black/45 border border-white/10",
//                     "text-white font-bold truncate",
//                     "text-[10px] sm:text-[12px] md:text-[14px]",
//                     "max-w-full"
//                 )}
//                 title={name}
//             >
//                 {name}
//             </div>
//         </div>
//     );
// }
