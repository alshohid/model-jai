"use client"

import Image from "next/image"
import * as React from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
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
    }, [api, items.length])

    return (
        <div className={cn("w-full", className)}>
            <div className="relative w-full">
                <button
                    type="button"
                    onClick={() => api?.scrollPrev()}
                    disabled={!api?.canScrollPrev()}
                    className={cn(
                        "absolute left-0 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#120B14]/90 p-3 text-white/80 shadow-[0_14px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
                    )}
                    aria-label="Previous game"
                >
                    <ChevronLeft className="size-5" />
                </button>

                <button
                    type="button"
                    onClick={() => api?.scrollNext()}
                    disabled={!api?.canScrollNext()}
                    className={cn(
                        "absolute right-0 top-1/2 z-20 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#120B14]/90 p-3 text-white/80 shadow-[0_14px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
                    )}
                    aria-label="Next game"
                >
                    <ChevronRight className="size-5" />
                </button>

                <Carousel
                    opts={{ align: "start", containScroll: false }}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent className="ml-0 gap-4 sm:gap-5 md:gap-6">
                        {items.map((item, idx) => (
                            <CarouselItem
                                key={item.id}
                                className="basis-[248px] pl-0 sm:basis-[300px] lg:basis-[320px]"
                            >
                                <button
                                    type="button"
                                    onClick={() => onCardClick?.(item, idx)}
                                    className={cn(
                                        "group relative h-[210px] w-full cursor-pointer select-none overflow-hidden rounded-[24px] border border-white/12 bg-[#0E0A12] sm:h-[235px] sm:rounded-[28px]",
                                        "shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
                                        cardClassName
                                    )}
                                >
                                    <Image
                                        src={item.imageSrc}
                                        alt={item.title}
                                        fill
                                        className="object-fill transition-transform duration-700 group-hover:scale-105"
                                        sizes="320px"
                                        priority={idx === 0}
                                    />
                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,18,0.05),rgba(7,9,18,0.38)_45%,rgba(7,9,18,0.92)_100%)]" />
                                    <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_70%)]" />

                                    <div className="absolute left-3 top-3 hidden items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#CFF7FF] backdrop-blur-md sm:inline-flex">
                                        <Sparkles className="size-3" />
                                        Featured
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                                        <div className="rounded-[18px] border border-white/10 bg-white/[0.08] p-3.5 backdrop-blur-md sm:rounded-[22px] sm:p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">

                                                    <h3 className="mt-1.5 line-clamp-2 text-left text-[18px] leading-tight text-white font-porterSansBlock sm:mt-2 sm:text-[22px]">
                                                        {item.title}
                                                    </h3>
                                                </div>

                                                <span className="mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/10 p-1.5 text-white/85 transition group-hover:border-[#9FE8FF]/40 group-hover:text-[#9FE8FF] sm:p-2">
                                                    <ArrowUpRight className="size-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            {count > 1 ? (
                <div className="mt-6 flex items-center justify-center gap-2.5 sm:mt-8 sm:gap-3">
                    {Array.from({ length: count }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => api?.scrollTo(i)}
                            className={cn(
                                "cursor-pointer rounded-full transition-all duration-300",
                                current === i
                                    ? "h-2 w-10 bg-[#7CF7FF] sm:h-2.5 sm:w-12"
                                    : "h-2 w-5 bg-white/18 hover:bg-white/35 sm:h-2.5 sm:w-6"
                            )}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}
