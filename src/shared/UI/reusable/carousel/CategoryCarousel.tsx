"use client";

import * as React from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/shared/lib/utils/cn";
import CategoryCard from "@/shared/components/card/CategoryCard";

const AUTO_SLIDE_INTERVAL_MS = 3200;

export type CategoryItem = {
    id: string;
    title: string;
    imageSrc: string;
};

type Props = {
    items: CategoryItem[];
    className?: string;
    onItemClick?: (item: CategoryItem) => void;
};

export default function CategoryCarousel({ items, className, onItemClick }: Props) {
    const [api, setApi] = React.useState<CarouselApi | null>(null);
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(items.length);
    const shouldAutoSlide = items.length > 1;

    React.useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setCount(api.scrollSnapList().length);
            setCurrent(api.selectedScrollSnap());
        };

        onSelect();
        api.on("select", onSelect);
        api.on("reInit", onSelect);

        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api, items.length]);

    React.useEffect(() => {
        if (!api || !shouldAutoSlide) return;

        const scrollNext = () => {
            if (document.visibilityState === "hidden") return;
            api.scrollNext();
        };

        const intervalId = window.setInterval(scrollNext, AUTO_SLIDE_INTERVAL_MS);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [api, shouldAutoSlide]);

    return (
        <div className={cn("w-full", className)}>
            <div className="relative w-full">
                <button
                    type="button"
                    onClick={() => api?.scrollPrev()}
                    disabled={!api?.canScrollPrev()}
                    className="absolute left-0 top-1/2 -translate-x-15 -translate-y-1/2 z-20 cursor-pointer disabled:opacity-50 hidden sm:block"
                    aria-label="Previous category"
                >
                    <Image src="/images/home/larrow.png" alt="" width={24} height={24} />
                </button>

                <button
                    type="button"
                    onClick={() => api?.scrollNext()}
                    disabled={!api?.canScrollNext()}
                    className="absolute right-0 top-1/2 translate-x-15 cursor-pointer -translate-y-1/2 z-20 disabled:opacity-50 hidden sm:block"
                    aria-label="Next category"
                >
                    <Image src="/images/home/rarrow.png" alt="" width={24} height={24} />
                </button>

                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        containScroll: false,
                        dragFree: false,
                        loop: shouldAutoSlide,
                    }}
                >
                    <CarouselContent className="-ml-3 md:-ml-8">
                        {items.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="basis-1/2 pl-3 md:basis-[338px] md:pl-8"
                            >
                                <CategoryCard
                                    title={item.title}
                                    imageSrc={item.imageSrc}
                                    onClick={() => onItemClick?.(item)}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            <div className="mt-8 flex justify-center gap-3">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={`page-${i}`}
                        type="button"
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => {
                            api?.scrollTo(i);
                        }}
                        className={cn(
                            "h-3 w-12 rounded cursor-pointer hover:bg-cyan-300 transition-colors",
                            current === i ? "bg-cyan-400" : "bg-white/20"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
