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
    leftPlayerName?: string;
    rightPlayerName?: string;
    gameLogoFallbackSrc?: string;
    leftPlayerFallbackSrc?: string;
    rightPlayerFallbackSrc?: string;
    watchHref?: string;
    voteRequired?: boolean;
    className?: string;
    rules?: string | null;
    onWatch?: () => void;
    onLeftPlayerClick?: () => void;
    onRightPlayerClick?: () => void;
    tiktokLink: string;
    twitchLink: string;
    versusImg?: string;
};

const cardImageBlurDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#1b1f25"/></svg>`
)}`;

type MatchCardImageProps = {
    src: string;
    fallbackSrc: string;
    alt: string;
    wrapperClassName: string;
    imageClassName: string;
    sizes: string;
    onClick?: () => void;
};

function MatchCardImage({
    src,
    fallbackSrc,
    alt,
    wrapperClassName,
    imageClassName,
    sizes,
    onClick,
}: MatchCardImageProps) {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [isLoaded, setIsLoaded] = useState(false);

    const imageNode = (
        <>
            <div
                aria-hidden="true"
                className={clsx(
                    "absolute inset-0 bg-[#1b1f25] transition-opacity duration-300",
                    isLoaded ? "opacity-0" : "opacity-100"
                )}
            >
                <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),rgba(255,255,255,0.04)_38%,rgba(255,255,255,0)_72%)]" />
            </div>

            <Image
                src={currentSrc}
                alt={alt}
                fill
                sizes={sizes}
                placeholder="blur"
                blurDataURL={cardImageBlurDataUrl}
                className={clsx(
                    imageClassName,
                    "transition duration-500 ease-out",
                    isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
                )}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    if (currentSrc !== fallbackSrc) {
                        setCurrentSrc(fallbackSrc);
                        setIsLoaded(false);
                        return;
                    }

                    setIsLoaded(true);
                }}
            />
        </>
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={clsx(
                    wrapperClassName,
                    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                )}
                aria-label={`View ${alt} profile`}
            >
                {imageNode}
            </button>
        );
    }

    return <div className={wrapperClassName}>{imageNode}</div>;
}

export default function MatchCard(props: Props) {
    const {
        status,
        title,
        dateText,
        timeText,
        gameLogoSrc,
        leftPlayerImg,
        rightPlayerImg,
        leftPlayerName,
        rightPlayerName,
        gameLogoFallbackSrc = "/images/home/gameLogo.png",
        leftPlayerFallbackSrc = "/images/home/leftPlayerImg.png",
        rightPlayerFallbackSrc = "/images/home/rightPlayerImg.png",
        className = "",
        rules,
        tiktokLink,
        twitchLink,
        versusImg = "/images/home/versus.png",
        onWatch,
        onLeftPlayerClick,
        onRightPlayerClick,
    } = props;
    const [rulesOpen, setRulesOpen] = useState(false);

    const normalizedStatus =
        status === "past" ? "completed" : status;

    const statusLabel =
        normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

    const leftPlayerAlt = leftPlayerName || `${title} player one`;
    const rightPlayerAlt = rightPlayerName || `${title} player two`;

    const statusStyle = clsx(
        "inline-flex items-center rounded-[9px] border px-1 md:px-2.5 py-0.5 md:py-1 text-[9px] md:text-[11px] font-medium leading-none",
        normalizedStatus === "live"
            ? "border-red-400/20 bg-red-500/18 text-red-100"
            : normalizedStatus === "completed"
                ? "border-white/10 bg-white/[0.05] text-white/55"
                : "border-white/10 bg-white/[0.06] text-white/78"
    );

    const renderPlayerImage = ({
        imageSrc,
        fallbackSrc,
        alt,
        positionClassName,
        onClick,
    }: {
        imageSrc: string;
        fallbackSrc: string;
        alt: string;
        positionClassName: string;
        onClick?: () => void;
    }) => {
        const containerClassName = clsx(
            "absolute inset-y-0 w-[48%] overflow-hidden",
            positionClassName
        );

        return (
            <MatchCardImage
                key={`${positionClassName}-${imageSrc}`}
                src={imageSrc}
                fallbackSrc={fallbackSrc}
                alt={alt}
                wrapperClassName={containerClassName}
                imageClassName="object-cover object-top"
                sizes="(max-width: 768px) 42vw, 160px"
                onClick={onClick}
            />
        );
    };

    return (
        <>
            <article
                className={clsx(
                    "w-full overflow-hidden rounded-[20px] border border-white/10 p-2.5",
                    "md:rounded-[24px] md:p-3",
                    className
                )}
            >
                <div className="relative overflow-hidden rounded-[18px] border border-white/10 md:rounded-[20px]">
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

                        {renderPlayerImage({
                            imageSrc: leftPlayerImg,
                            fallbackSrc: leftPlayerFallbackSrc,
                            alt: leftPlayerAlt,
                            positionClassName: "left-0",
                            onClick: onLeftPlayerClick,
                        })}

                        {renderPlayerImage({
                            imageSrc: rightPlayerImg,
                            fallbackSrc: rightPlayerFallbackSrc,
                            alt: rightPlayerAlt,
                            positionClassName: "right-0",
                            onClick: onRightPlayerClick,
                        })}

                        {/* <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[20%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(27,34,40,0.12),rgba(17,20,24,0.36),rgba(27,34,40,0.12))]" /> */}
                        {/* <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,12,0.02),rgba(8,10,12,0.1)_45%,rgba(8,10,12,0.3)_100%)]" /> */}

                        <div className="absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center">
                            <Image
                                src={versusImg}
                                alt="versus"
                                width={56}
                                height={101}
                                unoptimized
                                className="h-7 w-auto object-contain md:h-9"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-1 px-0.5 md:mt-4 md:px-1">
                    <div className="flex items-center justify-between gap-3">
                        <span className={statusStyle}>{statusLabel}</span>
                        <div className="flex size-14 md:size-20 shrink-0 items-center justify-center">
                            <MatchCardImage
                                key={gameLogoSrc}
                                src={gameLogoSrc}
                                fallbackSrc={gameLogoFallbackSrc}
                                alt={`${title} logo`}
                                wrapperClassName="relative h-full w-full"
                                imageClassName="object-contain"
                                sizes="(max-width: 768px) 56px, 80px"
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
