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
        setCount(api.slideNodes().length);
        console.log("count set to", api.slideNodes().length);

        const onSelect = () => {
            const curr = api.selectedScrollSnap();
            setCurrent(curr);
            console.log("current set to", curr);
        };
        onSelect();
        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    return (
        <div className={cn("w-full", className)}>
            <div className="relative w-full">
                {/* LEFT */}
                <button
                    onClick={() => api?.scrollPrev()}
                    disabled={!api?.canScrollPrev()}
                    className="absolute left-0 top-1/2 -translate-x-15 -translate-y-1/2 z-20 cursor-pointer disabled:opacity-50"
                >
                    <Image src="/images/home/larrow.png" alt="Prev" width={24} height={24} />
                </button>

                {/* RIGHT */}
                <button
                    onClick={() => api?.scrollNext()}
                    disabled={!api?.canScrollNext()}
                    className="absolute right-0 top-1/2 translate-x-15 cursor-pointer -translate-y-1/2 z-20 disabled:opacity-50"
                >
                    <Image src="/images/home/rarrow.png" alt="Next" width={24} height={24} />
                </button>

                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        containScroll: false,
                        dragFree: false,
                    }}
                >
                    <CarouselContent className="gap-8">
                        {items.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="basis-[306px]"
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

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-3">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={`page-${i}`}
                        onClick={() => {
                            console.log("clicking button", i);
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
