"use client";

import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

export type VideoCarouselItem = {
    id: string;
    title: string;
    videoSrc: string;      // ✅ mp4/webm
    posterSrc?: string;    // ✅ optional fallback image
};

type Props = {
    items: VideoCarouselItem[];
    className?: string;
    cardClassName?: string;
    onCardClick?: (item: VideoCarouselItem, index: number) => void;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    suspendPlayback?: boolean;
};

export default function VideoCarousel({
    items,
    className,
    cardClassName,
    onCardClick,
    autoPlay = true,
    muted = true,
    loop = true,
    suspendPlayback = false,
}: Props) {
    const [api, setApi] = React.useState<CarouselApi | null>(null);
    const [current, setCurrent] = React.useState(0);
    const count = api ? api.scrollSnapList().length : items.length;
    const [playingIndex, setPlayingIndex] = React.useState<number | null>(autoPlay ? 0 : null);

    const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);

    React.useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            const idx = api.selectedScrollSnap();
            setCurrent(idx);

            if (autoPlay && !suspendPlayback) {
                videoRefs.current.forEach((v, i) => {
                    if (!v) return;
                    if (i === idx) {
                        v.currentTime = 0;
                        v.play().catch(() => { });
                    } else {
                        v.pause();
                    }
                });
                setPlayingIndex(idx);
            } else {
                videoRefs.current.forEach((v) => {
                    if (v) v.pause();
                });
                setPlayingIndex(null);
            }
        };

        queueMicrotask(() => onSelect());
        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api, autoPlay, suspendPlayback]);

    React.useEffect(() => {
        if (suspendPlayback) {
            videoRefs.current.forEach((video) => {
                video?.pause();
            });
            return;
        }

        if (!autoPlay) return;

        const activeVideo = videoRefs.current[current];
        activeVideo?.play().catch(() => { });
    }, [autoPlay, current, suspendPlayback]);

    const isPaused = (idx: number) =>
        autoPlay ? idx !== current : playingIndex !== idx;

    const handleCardClick = (item: VideoCarouselItem, idx: number) => {
        if (!autoPlay) {
            const video = videoRefs.current[idx];
            if (video) {
                if (playingIndex === idx) {
                    video.pause();
                    setPlayingIndex(null);
                } else {
                    videoRefs.current.forEach((v, i) => {
                        if (v && i !== idx) v.pause();
                    });
                    video.currentTime = 0;
                    video.play().catch(() => { });
                    setPlayingIndex(idx);
                }
            }
        }
        onCardClick?.(item, idx);
    };

    return (
        <div className={cn("w-full", className)}>
            <div className="relative w-full">
                <button
                    type="button"
                    onClick={() => api?.scrollPrev()}
                    disabled={!api?.canScrollPrev()}
                    className="absolute left-0 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#120B14]/90 p-3 text-white/80 shadow-[0_14px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:flex"
                    aria-label="Previous video"
                >
                    <ChevronLeft className="size-5" />
                </button>

                <button
                    type="button"
                    onClick={() => api?.scrollNext()}
                    disabled={!api?.canScrollNext()}
                    className="absolute right-0 top-1/2 z-20 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#120B14]/90 p-3 text-white/80 shadow-[0_14px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:flex"
                    aria-label="Next video"
                >
                    <ChevronRight className="size-5" />
                </button>

                <Carousel
                    opts={{ align: "start", containScroll: false }}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent className="ml-0 gap-4 sm:gap-5 lg:gap-6">
                        {items.map((item, idx) => (
                            <CarouselItem
                                key={item.id}
                                className="basis-[212px] p-0 sm:basis-[240px] md:basis-[280px] lg:basis-[300px] xl:basis-[320px]"
                            >
                                <button
                                    type="button"
                                    onClick={() => handleCardClick(item, idx)}
                                    className={cn(
                                        "cursor-pointer select-none",
                                        "relative aspect-[10/16] w-full overflow-hidden rounded-[24px]",
                                        "border border-white/10 bg-[#09070D]",
                                        "shadow-[0_22px_60px_rgba(0,0,0,0.3)]",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
                                        cardClassName
                                    )}
                                    aria-label="Open video"
                                >
                                    <video
                                        ref={(el) => {
                                            videoRefs.current[idx] = el;
                                        }}
                                        src={item.videoSrc}
                                        poster={item.posterSrc}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        autoPlay={autoPlay && idx === current && !suspendPlayback}
                                        muted={muted}
                                        loop={loop}
                                        playsInline
                                        preload="metadata"
                                    />

                                    {isPaused(idx) && (
                                        <div
                                            className={cn(
                                                "absolute inset-0 flex items-center justify-center",
                                                "z-10"
                                            )}
                                            aria-hidden
                                        >
                                            <div
                                                className={cn(
                                                    "flex items-center justify-center",
                                                    "h-14 w-14 rounded-full sm:h-16 sm:w-16",
                                                    "bg-white/20 backdrop-blur-sm border-2 border-white/40",
                                                    "text-white"
                                                )}
                                            >
                                                <Play className="ml-1 size-7 fill-white sm:size-8" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,8,0.04),rgba(4,4,8,0.18)_40%,rgba(4,4,8,0.62)_100%)]" />

                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
                                        <div className="rounded-[18px] border border-white/10 bg-black/35 px-3 py-2.5 backdrop-blur-md">
                                            <div className="h-1.5 w-9 rounded-full bg-[#7CF7FF]" />
                                        </div>
                                    </div>
                                </button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2.5 sm:mt-8 sm:gap-3">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => api?.scrollTo(i)}
                        className={cn(
                            "cursor-pointer",
                            "h-2 w-6 rounded-full sm:h-2.5 sm:w-8",
                            "transition-opacity",
                            current === i
                                ? "w-10 bg-cyan-400 opacity-100 sm:w-12"
                                : "bg-white/30 opacity-70 hover:opacity-100"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
