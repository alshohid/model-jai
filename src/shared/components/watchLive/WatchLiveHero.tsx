/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import { cn } from "@/shared/lib/utils/cn";

// @ts-ignore
import "slick-carousel/slick/slick.css";
// @ts-ignore
import "slick-carousel/slick/slick-theme.css";

import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { LiveBadge } from "@/shared/UI/button/LiveBadge";
import { Avatars } from "@/shared/UI/reusable/avatar/Avatar";
import { CircleNavButton } from "@/shared/UI/button/CircleNavButton";
import { ThumbRail } from "./ThumbRail";
import { WatchLiveHeroSlide } from "@/types/watchLive/watchLiveTypes";
import MatchHeroCard from "../card/MatchHeroCard";

type Props = {
    slides: WatchLiveHeroSlide[];
    className?: string;
    onWatch?: (slide: WatchLiveHeroSlide) => void;
};

export default function WatchLiveHeroCarousel({ slides, className, onWatch }: Props) {
    const sliderRef = useRef<any>(null);
    const [active, setActive] = useState(0);
    const [dir, setDir] = useState<"next" | "prev">("next");

    const settings = useMemo(() => {
        return {
            dots: false,
            arrows: false,
            infinite: true,
            speed: 550,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: true,
            autoplay: true,
            autoplaySpeed: 4500,
            pauseOnHover: true,
            pauseOnFocus: true,
            beforeChange: (current: number, next: number) => {
                setDir(next > current ? "next" : "prev");
                setActive(next);
            },
            responsive: [
                { breakpoint: 1024, settings: { speed: 500 } },
                { breakpoint: 640, settings: { speed: 450 } },
            ],
        };
    }, []);

    const activeSlide = slides[active];
    const railThumbs = useMemo(() => {
        return slides.map((s) => s.thumbs?.[0] ?? s.bg);
    }, [slides]);

    return (
        <section className={cn("relative w-full overflow-hidden", className)}>
            <style jsx global>{`
                .watchlive-slider,
                .watchlive-slider .slick-list,
                .watchlive-slider .slick-track,
                .watchlive-slider .slick-slide > div {
                    height: 100%;
                }
                .live-ping {
                    animation: live 2s ease-in-out infinite;
                }
                @keyframes live {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    100% {
                        transform: scale(3.5);
                        opacity: 0;
                    }
                }
                .info-anim {
                    animation: infoFade 350ms ease both;
                }
                .info-next {
                    transform-origin: center;
                }
                .info-prev {
                    transform-origin: center;
                }
                @keyframes infoFade {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>


            <div className="relative h-[90vh] md:h-[calc(100vh-64px)]  overflow-hidden">
                <Slider
                    className="watchlive-slider"
                    ref={(r) => {
                        sliderRef.current = r;
                    }}
                    {...settings}
                >
                    {slides.map((s) => (
                        <div key={s.id} className="relative w-full h-full">
                            <div key={s.id} className="w-full h-[70vh] md:h-[calc(100vh-64px)]  ">
                                <MatchHeroCard
                                    status={s.status}
                                    title={s.title}
                                    dateText={s.dateText}
                                    timeText={s.timeText}
                                    gameLogoSrc={s.gameLogoSrc}
                                    leftPlayerName="JACK"
                                    rightPlayerName="STEEVE"
                                    leftPlayerImg={s.leftPlayerImg}
                                    rightPlayerImg={s.rightPlayerImg}
                                    versusImg={s.versusImg}
                                    voteRequired={s.voteRequired}
                                    className="w-full h-full max-w-none rounded-none"
                                />
                            </div>

                        </div>
                    ))}
                </Slider>

                <div className="absolute bottom-20 inset-0 pointer-events-none">
                    <div className="container h-full pointer-events-auto ">

                        <div className="flex h-full flex-col justify-end pb-6 sm:pb-8">

                            <div className="grid w-full grid-cols-[minmax(0,1fr)_104px] items-end gap-4 sm:grid-cols-[minmax(0,1fr)_128px] sm:gap-5 md:grid-cols-[minmax(0,1fr)_150px] md:gap-6 lg:grid-cols-[minmax(0,1fr)_178px] lg:gap-10">
                                <div className="w-full">
                                    <div
                                        key={activeSlide?.id}
                                        className={cn("info-anim", dir === "next" ? "info-next" : "info-prev")}
                                    >
                                        {activeSlide?.isLive ? <LiveBadge /> : null}
                                        <p className="mt-6 lg:mt-10 text-white font-bold text-xs sm:text-sm lg:text-base xl:text-[21px]">
                                            {activeSlide?.game}
                                        </p>
                                        <h2 className="mt-1 text-white font-semibold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                                            {activeSlide?.title}
                                        </h2>
                                        <div className="mt-3 flex items-center gap-3">
                                            {activeSlide?.avatars?.length ? <Avatars items={activeSlide.avatars} /> : null}
                                            <p className="text-white text-xs sm:text-sm">{activeSlide?.meta}</p>
                                        </div>
                                    </div>
                                    <div className="pt-6 lg:pt-10">
                                        <StartStreamingButton
                                            type="button"
                                            onClick={() => onWatch?.(activeSlide)}
                                            className="h-10 sm:h-11 px-6 py-0"
                                        >
                                            Watch
                                        </StartStreamingButton>
                                    </div>
                                </div>

                                <div className="flex items-end justify-end">
                                    <div
                                        key={`${activeSlide?.id}-game-image`}
                                        className={cn(
                                            "info-anim",
                                            dir === "next" ? "info-next" : "info-prev",
                                            "flex h-[104px] w-[104px] items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.28)] sm:h-[128px] sm:w-[128px] md:h-[150px] md:w-[150px] lg:h-[178px] lg:w-[178px]"
                                        )}
                                    >
                                        <Image
                                            src={activeSlide?.gameImage || activeSlide?.gameLogoSrc || "/images/home/gameLogo.png"}
                                            alt={activeSlide?.game || "Game"}
                                            width={160}
                                            height={160}
                                            className="h-[72%] w-[72%] object-contain"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex w-full items-center justify-center gap-3 min-w-0 lg:mt-8">
                                <CircleNavButton dir="prev" onClick={() => sliderRef.current?.slickPrev()} />

                                <div className="min-w-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <ThumbRail
                                        thumbs={railThumbs}
                                        activeIndex={active}
                                        onThumbClick={(idx) => sliderRef.current?.slickGoTo(idx)}
                                    />
                                </div>

                                <CircleNavButton dir="next" onClick={() => sliderRef.current?.slickNext()} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
