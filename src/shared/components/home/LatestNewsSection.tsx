"use client";

import Image from "next/image";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";

type NewsItem = {
    id: string;
    title: string;
    image: string;
};

const news: NewsItem[] = [
    {
        id: "1",
        title: "Valeant's latest update changes the meta",
        image: "/images/home/news_1.png",
    },
    {
        id: "2",
        title: "Exclusive interview with pro player Blaze",
        image: "/images/home/news_2.png",
    },
];

export default function LatestNewsSection() {
    return (
        <section className="w-full relative">
            <div className="absolute top-0 left-0 -translate-y-2/3 ">
                <Image
                    src="/images/home/Ellipse2.png"
                    alt="ellipse"
                    width={1600}
                    height={800}
                    className="w-[1600px] h-[800px]"
                    unoptimized
                />
            </div>
            <div className="container py-8 md:py-15 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-10 lg:gap-16 items-start">
                    {/* Left */}
                    <div className="flex flex-col items-start gap-6">
                        <h2 className="text-[#FFFFFF] text-[48px] sm:text-[52px] leading-[1.05] font-light pb-4 ">
                            Latest news &<br /> updates
                        </h2>

                        <StartStreamingButton>
                            Sign Up
                        </StartStreamingButton>
                    </div>

                    {/* Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {news.map((item) => (
                            <article key={item.id} className="w-full">
                                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="(min-width: 768px) 320px, 100vw"
                                    />
                                </div>

                                <p className="mt-5 text-white/90 text-lg sm:text-xl leading-snug">
                                    {item.title}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
