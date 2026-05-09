/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { SocialLinks } from "../cardComponent/SocialLinks";
import { useState } from "react";
import MatchRulesModal from "@/shared/components/modal/MatchRulesModal";
import { CalendarDays, Clock3, Info, Play } from "lucide-react";
import Image from "next/image";

type MatchStatus = "upcoming" | "past" | "live" | "completed";

type Props = {
    status: MatchStatus;
    title: string;
    dateText: string;
    timeText: string;
    gameLogoSrc: string;
    leftPlayerImg: string;
    rightPlayerImg: string;
    watchHref?: string;
    voteRequired?: boolean;
    className?: string;
    rules?: string | null;
    onWatch?: () => void;
    tiktokLink: string;
    twitchLink: string;
    versusImg?: string;
};

export default function MatchCard(props: Props) {
    const {
        status,
        title,
        dateText,
        timeText,
        gameLogoSrc,
        leftPlayerImg,
        rightPlayerImg,
        className = "",
        rules,
        tiktokLink,
        twitchLink,
        versusImg = "/images/home/versus.png",
        onWatch,
    } = props;
    const [rulesOpen, setRulesOpen] = useState(false);

    const normalizedStatus =
        status === "past" ? "completed" : status;

    const statusLabel =
        normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

    const statusStyle = clsx(
        "inline-flex items-center rounded-[9px] border px-1 md:px-2.5 py-0.5 md:py-1 text-[9px] md:text-[11px] font-medium leading-none",
        normalizedStatus === "live"
            ? "border-red-400/20 bg-red-500/18 text-red-100"
            : normalizedStatus === "completed"
                ? "border-white/10 bg-white/[0.05] text-white/55"
                : "border-white/10 bg-white/[0.06] text-white/78"
    );

    return (
        <>
            <article
                className={clsx(
                    "w-full overflow-hidden rounded-[20px] border border-white/10 p-2.5",
                    "md:rounded-[24px] md:p-3",
                    className
                )}
            >
                <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(61,69,77,0.95),rgba(35,40,47,0.98)_74%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:rounded-[20px]">
                    <div className="relative aspect-[1.48/1]">
                        {rules && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRulesOpen(true);
                                }}
                                className="absolute left-1 top-1 z-20 inline-flex size-4 items-center justify-center rounded-full bg-[#8a4673] text-white shadow-[0_0_18px_rgba(255,55,186,0.45)] transition hover:scale-105 md:size-6"
                                aria-label="View rules"
                            >
                                <Info className="size-2.5 md:size-3" />
                            </button>
                        )}

                        <div className="absolute inset-y-0 left-0 w-[48%] overflow-hidden">
                            <img
                                src={leftPlayerImg}
                                alt={`${title} player one`}
                                className="h-full w-full object-cover object-top"
                            />
                        </div>

                        <div className="absolute inset-y-0 right-0 w-[48%] overflow-hidden">
                            <img
                                src={rightPlayerImg}
                                alt={`${title} player two`}
                                className="h-full w-full object-cover object-top"
                            />
                        </div>

                        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[20%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(27,34,40,0.12),rgba(17,20,24,0.36),rgba(27,34,40,0.12))]" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,12,0.02),rgba(8,10,12,0.1)_45%,rgba(8,10,12,0.3)_100%)]" />

                        <div className="absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center">
                            <Image src={versusImg} alt="versus" className="w-6 h-6 md:w-8 md:h-8" width={40} height={40} />
                        </div>
                    </div>
                </div>

                <div className="mt-1 px-0.5 md:mt-4 md:px-1">
                    <div className="flex items-center justify-between gap-3">
                        <span className={statusStyle}>{statusLabel}</span>
                        <div className="flex size-14 md:size-20 shrink-0 items-center justify-center">
                            <img
                                src={gameLogoSrc}
                                alt={`${title} logo`}
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>

                    <h3 className="mt-2 text-[1rem] font-semibold leading-none tracking-[-0.02em] text-white md:mt-3 md:text-[1.5rem]">
                        {title}
                    </h3>

                    <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-white/72 md:mt-4">
                        <div className="flex min-w-0 items-center gap-1.5">
                            <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-[#22313c] text-[#69d8ff] ring-1 ring-white/8 md:size-5">
                                <CalendarDays className="size-1.5 md:size-3" />
                            </span>
                            <span className="truncate whitespace-nowrap text-[0.5rem] leading-none md:text-[0.7rem]">
                                {dateText}
                            </span>
                        </div>

                        <div className="flex min-w-0 items-center gap-1.5 justify-self-end text-right">
                            <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-white/15 text-white/80 ring-1 ring-white/8 md:size-5">
                                <Clock3 className="size-1.5 md:size-3" />
                            </span>
                            <span className="whitespace-nowrap text-[0.5rem] leading-none md:text-[0.7rem]">
                                {timeText}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onWatch}
                        className="mt-4 inline-flex h-10 w-full flex-nowrap items-center justify-center gap-2 rounded-full border border-[#d15b9c66] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-3 text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-[#d15b9c99] hover:text-white md:mt-5 md:h-12 md:gap-3 md:px-4"
                    >
                        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-black shadow-[0_6px_14px_rgba(255,255,255,0.12)]">
                            <Play className="ml-0.5 size-4 fill-current" />
                        </span>
                        <span className="whitespace-nowrap text-[13px] leading-none font-light sm:text-sm">
                            Watch stream
                        </span>
                    </button>

                    <SocialLinks className="mt-3 md:mt-4" tiktokLink={tiktokLink} twitchLink={twitchLink} />
                </div>
            </article>

            {rules && (
                <MatchRulesModal
                    open={rulesOpen}
                    onClose={() => setRulesOpen(false)}
                    rules={rules}
                />
            )}
        </>
    );
}
