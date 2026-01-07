"use client";

import { useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

// @ts-ignore
import "slick-carousel/slick/slick.css";
// @ts-ignore
import "slick-carousel/slick/slick-theme.css";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";

export type WatchLiveSlide = {
    id: string;
    bg: string;
    game: string;     // "Call Of Duty"
    title: string;    // "Warzone 2.0"
    meta: string;     // "Warzone • US English"
    isLive?: boolean;
    avatars?: string[]; // small avatars left-bottom (optional)
    thumbs: string[];   // thumbnail images for rail
};

type Props = {
    slides: WatchLiveSlide[];
    className?: string;
    onWatch?: (slide: WatchLiveSlide) => void;
};

export default function WatchLiveHeroCarousel({ slides, className, onWatch }: Props) {
    const sliderRef = useRef<any>(null);
    const [active, setActive] = useState(0);

    const settings = useMemo(() => {
        return {
            dots: false,
            arrows: false,
            infinite: true,
            speed: 550,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: true,
            beforeChange: (_: number, next: number) => setActive(next),
            responsive: [
                { breakpoint: 1024, settings: { speed: 500 } },
                { breakpoint: 640, settings: { speed: 450 } },
            ],
        };
    }, []);

    const total = slides.length;
    const current = active + 1;
    const slide = slides[active];
    const railThumbs = useMemo(() => {
        // প্রতিটা slide-এর জন্য একটা thumb pick করো
        return slides.map((s) => s.thumbs?.[0] ?? s.bg);
    }, [slides]);


    return (
        <section className="relative h-screen w-full overflow-hidden">
            <style jsx global>{`
    .watchlive-slider,
    .watchlive-slider .slick-list,
    .watchlive-slider .slick-track,
    .watchlive-slider .slick-slide > div {
        height: 100%;
    }
`}</style>

            <div className="relative">
                <div className="relative overflow-hidden rounded-2xl border border-white/10">
                    <Slider className="watchlive-slider" ref={(r) => { sliderRef.current = r; }} {...settings}>
                        {slides.map((s) => (
                            <HeroSlide
                                key={s.id}
                                slide={s}
                                thumbs={railThumbs}
                                activeIndex={active}
                                onWatch={() => onWatch?.(s)}
                                onPrev={() => sliderRef.current?.slickPrev()}
                                onNext={() => sliderRef.current?.slickNext()}
                                onThumbClick={(idx) => sliderRef.current?.slickGoTo(idx)}
                            />


                        ))}
                    </Slider>

                </div>
            </div>
        </section>
    );
}

/* ---------------- Slide ---------------- */

function HeroSlide({
    slide,
    thumbs,
    activeIndex,
    onWatch,
    onPrev,
    onNext,
    onThumbClick,
}: {
    slide: WatchLiveSlide;
    thumbs: string[];
    activeIndex: number;
    onWatch?: () => void;
    onPrev: () => void;
    onNext: () => void;
    onThumbClick: (i: number) => void;
}) {
    return (
        <div className="relative">
            <div className="relative w-full h-screen">
                <Image src={slide.bg} alt={slide.title} fill priority className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 ">
                    <div className="container h-full">
                        {/* <div className="grid grid-cols-1 lg:grid-cols-[6fr_6fr]"> */}
                        <div className="h-full flex flex-col-wrap items-end pb-20 sm:pb-24 lg:pb-28">
                            <div className="w-full">
                                {slide.isLive ? <LiveBadge /> : null}

                                <p className="mt-10 text-[#FFFFFF] font-bold text-xs lg:text-[21px] sm:text-sm">{slide.game}</p>

                                <h2 className="mt-1 text-white font-semibold leading-tight text-4xl  md:text-7xl">
                                    {slide.title}
                                </h2>

                                <div className="mt-3 flex items-center gap-3">
                                    {slide.avatars?.length ? <Avatars items={slide.avatars} /> : null}
                                    <p className="text-[#FFFFFF] text-xs sm:text-sm">{slide.meta}</p>
                                </div>

                                <div className="pt-10 pb-10">
                                    <StartStreamingButton
                                        type="button"
                                        onClick={onWatch}
                                        className="h-10 sm:h-11 px-6 py-0"
                                    >
                                        Watch
                                    </StartStreamingButton>

                                </div>
                            </div>

                            {/* Right column */}
                            <div >

                                <div className="flex items-end justify-start lg:justify-end gap-3 min-w-0">
                                    <CircleNavButton dir="prev" onClick={onPrev} />

                                    <div className="min-w-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        <ThumbRail
                                            thumbs={thumbs}
                                            activeIndex={activeIndex}
                                            onThumbClick={onThumbClick}
                                        />

                                    </div>

                                    <CircleNavButton dir="next" onClick={onNext} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
            </div>
        </div>
    );
}


/* ---------------- Small UI pieces ---------------- */

function LiveBadge() {
    return (
        <>
            <div className="inline-flex items-center md:px-4 md:py-3 gap-4 rounded-lg bg-[#E85B5B] px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                {/* <Image
                    src={"/images/home/wifi.png"}
                    alt="wifi"
                    width={200}
                    height={200}
                    className="h-8 w-8"
                /> */}

                <span className="text-white text-lg font-medium">Live</span>

                {/* live pulse dot */}
                <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="live-ping absolute inset-0 rounded-full bg-white/60" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-white border border-black/10" />
                </span>
            </div>

            <style jsx>{`
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
        `}</style>
            </>
    );
}


function Avatars({ items }: { items: string[] }) {
    return (
        <div className="flex items-center -space-x-2">
            {items.slice(0, 2).map((src, i) => (
                <span
                    key={i}
                    className="relative w-7 h-7 rounded-full overflow-hidden border border-white/25 bg-white/10"
                >
                    <Image src={src} alt="" fill className="object-cover" sizes="28px" />

                </span>
            ))}
        </div>
    );
}

function CircleNavButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={dir === "prev" ? "Previous" : "Next"}
            className={cn(
                "pointer-events-auto cursor-pointer",
                "w-9 h-9 sm:w-10 sm:h-10 rounded-full",
                "bg-[#FF3DBB] hover:bg-[#ff2eb4]",
                "flex items-center justify-center",
                "shadow-[0_14px_40px_rgba(0,0,0,0.45)]",
                "transition"
            )}
        >
            <span className="text-white text-lg leading-none select-none">
                {dir === "prev" ? "‹" : "›"}
            </span>
        </button>
    );
}

function ThumbRail({
    thumbs,
    activeIndex,
    onThumbClick,
}: {
    thumbs: string[];
    activeIndex: number;
    onThumbClick: (i: number) => void;
}) {
    const visible = thumbs.slice(0, 4);

    return (
        <div className="flex items-center gap-3">
            {visible.map((src, i) => (
                <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => onThumbClick(i)}
                    className={cn(
                        "pointer-events-auto cursor-pointer relative overflow-hidden",
                        "w-[70px] h-[42px] sm:w-[92px] sm:h-[54px] lg:w-[122px] lg:h-[64px]",
                        "rounded-2xl bg-black/25 backdrop-blur shadow-[0_12px_35px_rgba(0,0,0,0.35)] transition",
                        i === activeIndex
                            ? "border-2 border-white"
                            : "border border-white/40 opacity-80"
                    )}
                >
                    <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                </button>
            ))}
        </div>
    );
}


