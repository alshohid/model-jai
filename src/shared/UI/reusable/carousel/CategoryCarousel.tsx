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
    

    React.useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);

        const onSelect = () => setCurrent(api.selectedScrollSnap());
        onSelect();

        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    return (
        <div className={cn("w-full", className)}>
            <div className="relative w-full">
                <div className="relative px-8 sm:px-12 lg:px-16">
                    {/* LEFT ARROW (outside the card viewport) */}
                    <button
                        type="button"
                        onClick={() => api?.scrollPrev()}
                        className={cn(
                            "cursor-pointer",
                            "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-20",
                            "w-12 h-12 rounded-full",
                            "border border-cyan-500/40",
                            "bg-black/40 backdrop-blur",
                            "flex items-center justify-center",
                            "hover:border-cyan-300/70",
                            "transition"
                        )}
                        aria-label="Previous"
                    >
                        {/* ✅ don't use fill here; fixed size is simpler */}
                        <Image
                            src="/images/home/larrow.png"
                            alt="Previous"
                            width={24}
                            height={24}
                            className="opacity-90"
                        />
                    </button>

                    {/* RIGHT ARROW (outside the card viewport) */}
                    <button
                        type="button"
                        onClick={() => api?.scrollNext()}
                        className={cn(
                            "cursor-pointer",
                            "absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-20",
                            "w-12 h-12 rounded-full",
                            "border border-cyan-500/40",
                            "bg-black/40 backdrop-blur",
                            "flex items-center justify-center",
                            "hover:border-cyan-300/70",
                            "transition"
                        )}
                        aria-label="Next"
                    >
                        <Image
                            src="/images/home/rarrow.png"
                            alt="Next"
                            width={24}
                            height={24}
                            className="opacity-90"
                        />
                    </button>

                    {/* CAROUSEL */}
                    <Carousel opts={{ align: "start" }} setApi={setApi} className="w-full">
                        {/* ✅ remove px padding hack from content */}
                        <CarouselContent className="ml-0 gap-6 sm:gap-8 md:gap-10">
                            {items.map((item) => (
                                <CarouselItem
                                    key={item.id}
                                    className={cn(
                                        "p-0 flex-[0_0_auto]",
                                        // Keep your card fixed size (306px) but allow responsive snapping
                                        "basis-full sm:basis-[340px] md:basis-[340px] lg:basis-[340px]"
                                    )}
                                >
                                    <CategoryCard
                                        title={item.title}
                                        imageSrc={item.imageSrc}
                                        onClick={() => onItemClick?.(item)}
                                        className="mx-auto"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => api?.scrollTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={cn(
                            "cursor-pointer w-10 h-2 rounded-[3px] transition-opacity",
                            current === i
                                ? "bg-cyan-400 opacity-100"
                                : "bg-white/20 opacity-70 hover:opacity-100"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
