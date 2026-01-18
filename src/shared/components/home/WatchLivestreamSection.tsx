"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton"

const slides = [
    "/images/home/carousel1.jpg",
    "/images/home/herobg.png",
    "/images/home/carousel3.png",
]
export default function WatchLivestreamSection() {
    const [api, setApi] = useState<CarouselApi | null>(null)
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (!api) return

        const snaps = api.scrollSnapList()
        setCount(snaps.length)

        const onSelect = () => setCurrent(api.selectedScrollSnap())
        onSelect()

        api.on("select", onSelect)
        return () => {
            api.off("select", onSelect)
        }
    }, [api])
   
    return (
        <section className="w-full bg-transparent relative">

            <div
                className={[
                    "mx-auto w-full max-w-[1600px]",
                    "px-4 sm:px-6 lg:px-12 xl:px-[140px]",
                    "py-10 sm:py-14 xl:py-[84px]",
                    "flex flex-col gap-14",
                    "xl:h-[720px] xl:flex xl:items-center",
                ].join(" ")}
            >
                <div className="w-full flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-[60px]">
                    {/* LEFT CONTENT */}
                    <div className="w-full lg:w-[420px] text-white relative">
                        
                        <button
                            onClick={() => api?.scrollPrev()}
                            className="cursor-pointer absolute left-3 hidden md:block top-1/2 -translate-y-1/2 z-20 text-gray-300 hover:text-white lg:-left-18"
                            aria-label="Previous"
                            type="button"
                        >
                            <Image
                                src={'/images/home/angle-right.png'}
                                alt="arrow left"
                                width={30}
                                height={30}
                                className="!w-6 !h-6"

                            />
                        </button>

                        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
                            Watch Livestream
                        </h2>

                        <p className="text-gray-300 text-sm sm:text-base leading-6 mb-6">
                            Play with us and prove yourself that you are a true cold blooded gamer.
                            Explore a world of epic games, unbeatable offers, and non-stop action.
                        </p>

                        <StartStreamingButton>
                            Play Live
                        </StartStreamingButton>
                    </div>

                    <div className="relative w-full lg:flex-1 lg:max-w-[850px]">
                        <Carousel opts={{ align: "start" }} setApi={setApi} className="w-full">
                            <CarouselContent className="w-full">
                                {slides.map((src, i) => (
                                    <CarouselItem
                                        key={src}
                                        className="flex-[0_0_100%] p-0"
                                    >
                                        <div
                                            className={[
                                                "relative w-full overflow-hidden rounded-[24px]",
                                                "aspect-[757/484]",
                                                "xl:w-[850px] xl:h-[484px] xl:aspect-auto",
                                            ].join(" ")}
                                        >
                                            <Image
                                                src={src}
                                                alt={`slide-${i + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 100vw, 757px"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>


                        <button
                            onClick={() => api?.scrollNext()}
                            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-300 hover:text-white lg:-right-12"
                            aria-label="Next"
                            type="button"
                        >
                            <Image
                                src={'/images/home/angle-left.png'}
                                alt="arrow left"
                                width={30}
                                height={30}
                                className= "w-4 h-4 md:!w-6 md:!h-6"

                            />
                        </button>
                    </div>

                </div>
                <div className="flex justify-center items-center gap-[22px]">
                    {Array.from({ length: count || slides.length }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => api?.scrollTo(i)}
                            className={[
                                "cursor-pointer",
                                "w-[122px] h-[8px] rounded-[3px]",
                                "transition-opacity",
                                current === i ? "bg-cyan-400 opacity-100" : "bg-[#6B6B6B] opacity-70 hover:opacity-100",
                            ].join(" ")}
                        />
                    ))}
                </div>
            </div>

        </section>
    )
}
