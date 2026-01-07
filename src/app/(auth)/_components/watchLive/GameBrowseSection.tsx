"use client";

import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import Image from "next/image";
import LiveSectionHeader from "./LiveSectionHeader";

// Contract:
// - Every game MUST define `featured`
// - Exactly ONE game must be featured

const games = [
    {
        id: 1,
        title: "Warzone 2.0",
        subtitle: "Call Of Duty",
        genre: "Shooter",
        platform: "PC",
        watching: "4.2K watching",
        image: "/images/home/Frame_1.png",
        featured: true,
    },
    {
        id: 2,
        title: "Fortnite",
        genre: "Shooter",
        watching: "4.2K watching",
        image: "/images/home/Frame_3.png",
        featured: false,
    },
    {
        id: 3,
        title: "Tom Clancy's The Division 2",
        genre: "Shooter",
        watching: "4.2K watching",
        image: "/images/home/Frame_2.png",
        featured: false,
    },
    {
        id: 4,
        title: "Watch Dogs Legion",
        genre: "Shooter",
        watching: "4.2K watching",
        image: "/images/home/Frame_3.png",
        featured: false,
    },
];

export default function GameBrowseSection() {
    const featured = games.find(g => g.featured === true);
    const list = games.filter(g => g.featured === false);

    if (!featured) {
        throw new Error("Exactly one featured game is required.");
    }

    return (
        <section className="relative w-full py-20">

            <div className=" pointer-events-none absolute right-0 bottom-0 -z-10 translate-y-1/2">
                <Image
                    src="/images/home/bottom_right.png"
                    width={702}
                    height={702}
                    alt="elips"
                    className="w-[1700px] h-[1400px]"
                />
            </div>
            <div className="container ">
                <LiveSectionHeader
                    title="Popular Categories"
                    className="mb-16 md:mb-20 tracking-wide text-[48px]"
                />
                <div className="grid grid-cols-1  gap-10 lg:grid-cols-[6fr_6fr]">

                    <div className="relative overflow-hidden rounded-3xl">
                        <Image
                            src={featured?.image}
                            alt={featured?.title}
                            fill
                            priority
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="absolute bottom-8 left-8 max-w-[70%] space-y-3">
                            <div className="flex gap-2">
                                <span className="rounded-md bg-white/20 px-3 py-1 text-xs text-white">
                                    {featured.genre}
                                </span>
                                {featured.platform && (
                                    <span className="rounded-md bg-white/20 px-3 py-1 text-xs text-white">
                                        {featured.platform}
                                    </span>
                                )}
                            </div>

                            {featured.subtitle && (
                                <p className="text-sm text-white/70">{featured.subtitle}</p>
                            )}

                            <h2 className="text-4xl font-semibold tracking-tight text-white">
                                {featured.title}
                            </h2>

                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                {featured.watching}
                            </div>

                            <div>
                                <StartStreamingButton className="text-md"> Follow</StartStreamingButton>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {list.map(game => (
                            <div key={game.id} className="flex items-center gap-6">

                                {/* Image */}
                                <div className="relative w-72 aspect-[16/10] flex-shrink-0 overflow-hidden rounded-2xl">
                                    <Image
                                        src={game.image}
                                        alt={game.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-3">
                                    <span className="inline-block w-fit rounded-lg border border-white/80 bg-white/20 px-3 py-1 text-sm text-[#DBE0E1]">
                                        {game.genre}
                                    </span>

                                    <h3 className="text-xl font-semibold text-white">
                                        {game.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-white/70">
                                        <span className="h-2 w-2 rounded-full bg-green-500" />
                                        {game.watching}
                                    </div>

                                    <div>
                                        <StartStreamingButton className="text-md"> Follow</StartStreamingButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
}
