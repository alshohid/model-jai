"use client";

import { useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

// @ts-ignore
import "slick-carousel/slick/slick.css";
// @ts-ignore
import "slick-carousel/slick/slick-theme.css";

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
                            <HeroSlide key={s.id} slide={s} onWatch={() => onWatch?.(s)} />
                        ))}
                    </Slider>

                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />

                        {/* Thumbnail rail + pink side buttons */}
                        <div className="absolute right-4 sm:right-6 lg:right-10 bottom-6 sm:bottom-7 flex items-center gap-3 pointer-events-auto">
                            {/* left pink */}
                            <CircleNavButton
                                dir="prev"
                                onClick={() => sliderRef.current?.slickPrev()}
                            />

                            <ThumbRail
                                thumbs={slide?.thumbs ?? []}
                                activeIndex={active}
                                onThumbClick={(idx) => sliderRef.current?.slickGoTo(idx)}
                            />

                            {/* right pink */}
                            <CircleNavButton
                                dir="next"
                                onClick={() => sliderRef.current?.slickNext()}
                            />
                        </div>

                        {/* Counter pill (center bottom) */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-5 pointer-events-auto">
                            <CounterPill
                                current={current}
                                total={total}
                                onPrev={() => sliderRef.current?.slickPrev()}
                                onNext={() => sliderRef.current?.slickNext()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------------- Slide ---------------- */

function HeroSlide({ slide, onWatch }: { slide: WatchLiveSlide; onWatch?: () => void }) {
    return (
        <div className="relative">
            {/* Responsive height via aspect */}
            <div className="relative w-full h-screen">

                <Image src={slide.bg} alt={slide.title} fill priority className="object-cover" sizes="100vw" />

                {/* left readability gradient like figma */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
                <div className="absolute inset-0 bg-black/10" />

                {/* Left content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="container grid grid-cols-[6fr_6fr]">
                        <div className="max-w-[520px]">
                            {slide.isLive ? <LiveBadge /> : null}

                            <p className="mt-4 text-white/70 text-xs sm:text-sm">{slide.game}</p>

                            <h2 className="mt-1 text-white font-semibold leading-tight text-[28px] sm:text-[44px] lg:text-[52px]">
                                {slide.title}
                            </h2>

                            <div className="mt-3 flex items-center gap-3">
                                {slide.avatars?.length ? <Avatars items={slide.avatars} /> : null}
                                <p className="text-white/55 text-xs sm:text-sm">{slide.meta}</p>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={onWatch}
                                    className={cn(
                                        "cursor-pointer",
                                        "inline-flex items-center justify-center",
                                        "h-10 sm:h-11 px-6",
                                        "rounded-lg",
                                        "bg-[#FF3DBB] hover:bg-[#ff2eb4]",
                                        "text-white font-medium",
                                        "border border-white/25",
                                        "shadow-[0_14px_40px_rgba(0,0,0,0.45)]",
                                        "transition"
                                    )}
                                >
                                    Watch
                                </button>
                            </div>
                        </div>
                    
                    </div>
                </div>

                {/* bottom dust (optional) */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
            </div>
        </div>
    );
}

/* ---------------- Small UI pieces ---------------- */

function LiveBadge() {
    return (
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FF5A5A] px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <span className="text-white text-xs font-medium">Live</span>
            <span className="w-3 h-3 rounded-full bg-white/80" />
        </div>
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
                    <Image src={src} alt="" fill className="h-screen object-cover" sizes="28px" />
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
    onThumbClick,
}: {
    thumbs: string[];
    activeIndex: number;
    onThumbClick: (i: number) => void;
}) {
    // show last 4 thumbs like figma row (tune if needed)
    const visible = thumbs.slice(0, 4);

    return (
        <div className="flex items-center gap-3">
            {visible.map((src, i) => (
                <button
                    key={src + i}
                    type="button"
                    onClick={() => onThumbClick(i)}
                    className={cn(
                        "pointer-events-auto cursor-pointer",
                        "relative overflow-hidden",
                        "w-[70px] h-[42px] sm:w-[92px] sm:h-[54px] lg:w-[110px] lg:h-[64px]",
                        "rounded-xl",
                        "border border-white/15",
                        "bg-black/25 backdrop-blur",
                        "shadow-[0_12px_35px_rgba(0,0,0,0.35)]",
                        "transition"
                    )}
                >
                    <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                </button>
            ))}
        </div>
    );
}

function CounterPill({
    current,
    total,
    onPrev,
    onNext,
}: {
    current: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <div
            className={cn(
                "pointer-events-auto",
                "flex items-center gap-4",
                "px-4 py-2 rounded-xl",
                "bg-black/35 backdrop-blur",
                "border border-white/10",
                "shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
            )}
        >
            <button
                type="button"
                onClick={onPrev}
                className="cursor-pointer text-white/90 hover:text-white transition"
                aria-label="Previous slide"
            >
                ‹
            </button>

            <p className="text-white/80 text-xs sm:text-sm tabular-nums">
                {current} / {total}
            </p>

            <button
                type="button"
                onClick={onNext}
                className="cursor-pointer text-white/90 hover:text-white transition"
                aria-label="Next slide"
            >
                ›
            </button>
        </div>
    );
}
