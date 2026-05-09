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
};

export default function VideoCarousel({
    items,
    className,
    cardClassName,
    onCardClick,
}: Props) {
    const [api, setApi] = React.useState<CarouselApi | null>(null);
    const [current, setCurrent] = React.useState(0);
    const count = api ? api.scrollSnapList().length : items.length;

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
                                className="basis-[280px] p-0 sm:basis-[340px] md:basis-[400px] lg:basis-[440px] xl:basis-[480px]"
                            >
                                <button
                                    type="button"
                                    onClick={() => onCardClick?.(item, idx)}
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
                                    <Image
                                        src={item.posterSrc || "/images/home/cat_1.png"}
                                        alt={item.title || "Video thumbnail"}
                                        fill
                                        sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 400px, 480px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        priority={idx === 0}
                                    />

                                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,8,0.06),rgba(4,4,8,0.18)_48%,rgba(4,4,8,0.5)_100%)]" />

                                    <div className="pointer-events-none absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-full bg-black/45 text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md sm:size-14">
                                        <ArrowUpRight className="size-5 sm:size-6" />
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
