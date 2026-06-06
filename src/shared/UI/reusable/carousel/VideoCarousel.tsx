"use client";

import * as React from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

const AUTO_SCROLL_INTERVAL_MS = 4200;

export type VideoCarouselItem = {
    id: string;
    title: string;
    videoSrc: string;
    posterSrc?: string;
};

type Props = {
    items: VideoCarouselItem[];
    className?: string;
    cardClassName?: string;
    onCardClick?: (item: VideoCarouselItem, index: number) => void;
    onCardIntent?: (item: VideoCarouselItem, index: number) => void;
};

export default function VideoCarousel({
    items,
    className,
    cardClassName,
    onCardClick,
    onCardIntent,
}: Props) {
    const [api, setApi] = React.useState<CarouselApi | null>(null);
    const [current, setCurrent] = React.useState(0);
    const count = api ? api.scrollSnapList().length : items.length;
    const shouldAutoScroll = items.length > 1;

    React.useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
        };

        queueMicrotask(() => onSelect());
        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    React.useEffect(() => {
        if (!api || !shouldAutoScroll) return;

        const scrollNext = () => {
            if (document.visibilityState === "hidden") return;
            api.scrollNext();
        };

        const intervalId = window.setInterval(scrollNext, AUTO_SCROLL_INTERVAL_MS);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [api, shouldAutoScroll]);

    return (
        <div className={cn("w-full", className)}>
            <div className="relative w-full">
                <button
                    type="button"
                    onClick={() => api?.scrollPrev()}
                    disabled={!api?.canScrollPrev()}
                    className="absolute left-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#120B14]/90 p-2.5 text-white/80 shadow-[0_14px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:left-3 sm:p-3"
                    aria-label="Previous video"
                >
                    <ChevronLeft className="size-5" />
                </button>

                <button
                    type="button"
                    onClick={() => api?.scrollNext()}
                    disabled={!api?.canScrollNext()}
                    className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#120B14]/90 p-2.5 text-white/80 shadow-[0_14px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:right-3 sm:p-3"
                    aria-label="Next video"
                >
                    <ChevronRight className="size-5" />
                </button>

                <Carousel
                    opts={{ align: "start", containScroll: false, loop: shouldAutoScroll }}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent className="ml-0 gap-4 sm:gap-5 lg:gap-6">
                        {items.map((item, idx) => (
                            <CarouselItem
                                key={item.id}
                                className="basis-[320px] p-0 sm:basis-[360px] md:basis-[430px] lg:basis-[480px] xl:basis-[520px]"
                            >
                                <AutoPlayingVideoCard
                                    item={item}
                                    index={idx}
                                    cardClassName={cardClassName}
                                    onCardClick={onCardClick}
                                    onCardIntent={onCardIntent}
                                />
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

type AutoPlayingVideoCardProps = {
    item: VideoCarouselItem;
    index: number;
    cardClassName?: string;
    onCardClick?: (item: VideoCarouselItem, index: number) => void;
    onCardIntent?: (item: VideoCarouselItem, index: number) => void;
};

function AutoPlayingVideoCard({
    item,
    index,
    cardClassName,
    onCardClick,
    onCardIntent,
}: AutoPlayingVideoCardProps) {
    const cardRef = React.useRef<HTMLButtonElement | null>(null);
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const [hasVideoError, setHasVideoError] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);
    const canRenderVideo = Boolean(item.videoSrc) && !hasVideoError;
    const shouldRenderVideo = canRenderVideo && isVisible;

    React.useEffect(() => {
        setHasVideoError(false);
    }, [item.videoSrc]);

    React.useEffect(() => {
        const card = cardRef.current;

        if (!card) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.35);
            },
            {
                threshold: [0, 0.35, 0.7],
            }
        );

        observer.observe(card);

        return () => {
            observer.disconnect();
        };
    }, []);

    React.useEffect(() => {
        const video = videoRef.current;

        if (!video || !shouldRenderVideo) return;

        const playVideo = () => {
            if (document.visibilityState === "hidden") return;

            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;
            void video.play().catch(() => { });
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                playVideo();
                return;
            }

            video.pause();
        };

        const frameId = window.requestAnimationFrame(playVideo);

        video.addEventListener("canplay", playVideo);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.cancelAnimationFrame(frameId);
            video.removeEventListener("canplay", playVideo);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            video.pause();
        };
    }, [shouldRenderVideo, item.videoSrc]);

    return (
        <button
            ref={cardRef}
            type="button"
            onMouseEnter={() => onCardIntent?.(item, index)}
            onFocus={() => onCardIntent?.(item, index)}
            onTouchStart={() => onCardIntent?.(item, index)}
            onClick={() => onCardClick?.(item, index)}
            className={cn(
                "cursor-pointer select-none",
                "group relative aspect-video w-full overflow-hidden rounded-[24px]",
                "border border-white/10 bg-[#09070D]",
                "shadow-[0_22px_60px_rgba(0,0,0,0.3)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
                cardClassName
            )}
            aria-label={item.title || "Open video"}
        >
            {shouldRenderVideo ? (
                <video
                    ref={videoRef}
                    src={item.videoSrc}
                    poster={item.posterSrc || "/images/home/cat_1.png"}
                    className="pointer-events-none size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    onLoadedMetadata={(event) => {
                        const video = event.currentTarget;
                        video.muted = true;
                        video.defaultMuted = true;
                        void video.play().catch(() => { });
                    }}
                    onError={() => setHasVideoError(true)}
                />
            ) : (
                <Image
                    src={item.posterSrc || "/images/home/cat_1.png"}
                    alt={item.title || "Video thumbnail"}
                    fill
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 360px, (max-width: 1024px) 430px, (max-width: 1280px) 480px, 520px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index === 0}
                />
            )}

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,8,0.06),rgba(4,4,8,0.18)_48%,rgba(4,4,8,0.5)_100%)]" />

            <div className="pointer-events-none absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-full bg-black/45 text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md sm:size-14">
                <ArrowUpRight className="size-5 sm:size-6" />
            </div>
        </button>
    );
}
