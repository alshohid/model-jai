/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

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

                        <div className="h-full flex items-end pb-6 sm:pb-8">

                            <div className="w-full grid grid-cols-1 lg:grid-cols-[6fr_6fr] items-end gap-6 lg:gap-10">
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

                                {/* RIGHT: ThumbRail static */}
                                <div className="flex items-center justify-start lg:justify-end gap-3 min-w-0">
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
            </div>
        </section>
    );
}
