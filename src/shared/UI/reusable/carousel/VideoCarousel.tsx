"use client";

import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
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
};

export default function VideoCarousel({
    items,
    className,
    cardClassName,
    onCardClick,
    autoPlay = true,
    muted = true,
    loop = true,
}: Props) {
    const [api, setApi] = React.useState<CarouselApi | null>(null);
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(items.length);

    // Keep refs to all video nodes (for play/pause control)
    const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);

    React.useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);

        const onSelect = () => {
            const idx = api.selectedScrollSnap();
            setCurrent(idx);

            // ✅ Only active slide plays; others pause
            videoRefs.current.forEach((v, i) => {
                if (!v) return;
                if (i === idx) {
                    // try play (can fail on some browsers if not muted)
                    v.currentTime = 0;
                    v.play().catch(() => { });
                } else {
                    v.pause();
                }
            });
        };

        onSelect();
        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    return (
        <div className={cn("w-full", className)}>
            <Carousel opts={{ align: "center" }} setApi={setApi} className="w-full">
                <CarouselContent className="ml-0 gap-[50px]">
                    {items.map((item, idx) => (
                        <CarouselItem key={item.id} className="flex-[0_0_auto] p-0">
                            <button
                                type="button"
                                onClick={() => onCardClick?.(item, idx)}
                                className={cn(
                                    "cursor-pointer select-none",
                                    "relative overflow-hidden rounded-[25px]",
                                    "w-[424px] h-[324px]",
                                    "shadow-[0_20px_60px_rgba(102,157,255,0.25)]",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
                                    cardClassName
                                )}
                            >
                                {/* ✅ Video */}
                                <video
                                    ref={(el) => {
                                        videoRefs.current[idx] = el;
                                    }}
                                    src={item.videoSrc}
                                    poster={item.posterSrc}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    autoPlay={autoPlay && idx === current}
                                    muted={muted}
                                    loop={loop}
                                    playsInline
                                    preload="metadata"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/35" />

                                {/* Title */}
                                <div className="absolute inset-0 flex items-center justify-center px-[38px] py-[164px]">
                                    <h3 className="w-[293px] h-[38px] text-center text-white text-[24px] leading-[160%] tracking-[0.005em] font-porterSansBlock">
                                        {item.title}
                                    </h3>
                                </div>
                            </button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => api?.scrollTo(i)}
                        className={cn(
                            "cursor-pointer",
                            "w-[30px] h-[7px] md:w-[40px] md:h-[8px] rounded-[3px]",
                            "transition-opacity",
                            current === i
                                ? "bg-cyan-400 opacity-100"
                                : "bg-white/30 opacity-70 hover:opacity-100"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
