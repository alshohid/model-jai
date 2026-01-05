"use client"

import Image from "next/image"
import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/shared/lib/utils/cn"

export type GameCarouselItem = {
    id: string
    title: string
    imageSrc: string
}

type Props = {
    items: GameCarouselItem[]
    className?: string
    cardClassName?: string
    onCardClick?: (item: GameCarouselItem, index: number) => void
}

export default function GameCarousel({
    items,
    className,
    cardClassName,
    onCardClick,
}: Props) {
    const [api, setApi] = React.useState<CarouselApi | null>(null)
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(items.length)

    React.useEffect(() => {
        if (!api) return
        setCount(api.scrollSnapList().length)

        const onSelect = () => setCurrent(api.selectedScrollSnap())
        onSelect()

        api.on("select", onSelect)
        return () => {
            api.off("select", onSelect)
        }
    }, [api])

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
                                <Image
                                    src={item.imageSrc}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="424px"
                                    priority={idx === 0}
                                />
                                <div className="absolute inset-0 bg-black/35" />
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


            {/* Pagination (centered) */}
            <div className="mt-10 flex items-center justify-center gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => api?.scrollTo(i)}
                        className={cn(
                            "cursor-pointer",
                            "w-[40px] h-[8px] rounded-[3px]",
                            "transition-opacity",
                            current === i ? "bg-cyan-400 opacity-100" : "bg-white/30 opacity-70 hover:opacity-100"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
