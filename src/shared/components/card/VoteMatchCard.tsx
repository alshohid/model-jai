"use client";

import clsx from "clsx";
import { GameLogo } from "../cardComponent/GameLogo";
import { Meta } from "../cardComponent/Meta";
import { PlayerImage } from "../cardComponent/PlayerImage";
import { Versus } from "../cardComponent/Versus";

type Props = {
  title: string;
  gameLogoSrc: string;
  leftPlayerImg: string;
  rightPlayerImg: string;
  leftPlayerName: string;
  rightPlayerName: string;
  totalVotes: number;
  isVoting?: boolean;
  onVote: () => void;
};

export default function VoteMatchCard({
  title,
  gameLogoSrc,
  leftPlayerImg,
  rightPlayerImg,
  leftPlayerName,
  rightPlayerName,
  totalVotes,
  isVoting = false,
  onVote,
}: Props) {
  const badgeStyle = clsx(
    "px-2 md:px-3 py-0 md:py-1 rounded-md text-xs border",
    "bg-red-500/25 text-red-100 border-red-400/30"
  );

  return (
    <article
      className={clsx(
        "w-full flex flex-col rounded-[16px]",
        "bg-matchCardBg border border-matchCardBorder backdrop-blur-[16px]"
      )}
    >
      <div className="overflow-hidden px-3 py-2 md:p-6">
        <div
          className="relative grid grid-cols-[1fr_12px_1fr] sm:grid-cols-[1fr_20px_1fr] md:grid-cols-[1fr_30px_1fr]
            aspect-[2.8/2] gap-1 rounded-[16px] bg-[#FFFFFF0D] border border-white/10 p-2 md:p-5"
        >
          <PlayerImage src={leftPlayerImg} />
          <Versus src="/images/home/versus.png" />
          <PlayerImage src={rightPlayerImg} />
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-2 md:hidden">
            <span className={badgeStyle}>live vote</span>
            <GameLogo src={gameLogoSrc} mobile />
          </div>

          <div className="hidden md:block">
            <GameLogo src={gameLogoSrc} />
          </div>

          <div className="flex flex-col gap-2 md:gap-3">
            <div className="hidden md:flex">
              <span className={badgeStyle}>live vote</span>
            </div>

            <h3 className="text-white font-semibold text-[12px] md:text-[18px] leading-tight">
              {title}
            </h3>

            <p className="text-[11px] text-white/65 md:text-sm">
              {leftPlayerName} vs {rightPlayerName}
            </p>

            <div className="flex gap-x-2 md:gap-x-6 text-white/75 text-xs md:text-sm">
              <Meta icon="🗳" text={`${totalVotes} votes`} />
              <Meta icon="🔥" text="Fan choice" />
            </div>
          </div>

          <div className="mt-2 md:mt-5">
            <button
              type="button"
              onClick={onVote}
              disabled={isVoting}
              className={clsx(
                "cursor-pointer inline-flex items-center justify-center gap-3",
                "w-full h-[30px] md:h-[48px] rounded-[12px]",
                "bg-white/5 border border-[#D15B9C80]/50",
                "text-white/80 hover:text-white transition",
                "shadow-inner shadow-[inset_0_0_10px_#D15B9C40]",
                isVoting && "cursor-not-allowed opacity-60"
              )}
            >
              <span className="inline-flex items-center justify-center w-4 h-4 md:w-8 md:h-8 rounded-full bg-white/80 text-[9px] md:text-xs font-black text-black">
                V
              </span>
              <span className="text-xs md:text-sm font-extralight">
                {isVoting ? "Voting..." : "Vote now"}
              </span>
            </button>

            <p className="mt-2 md:mt-3 text-center text-xs md:text-base font-medium text-[#FF2EC8]">
              Vote Your Favorite Match
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
