import LiveGameCard from "@/shared/components/card/LiveGameCard";
import LiveSectionHeader from "./LiveSectionHeader";
import Image from "next/image";

const dummyLiveGames = [
    {
        cover: "/images/home/livecard_1.jpg",
        isLive: true,
        watchingCount: "4.2K",
        title: "2022 world champs gaming warzone",
        userName: "Guy Hawkins",
        gameName: "Call of Duty",
        avatar: "/images/home/avatar_1.png",
    },
    {
        id: "2",
        cover: "/images/home/livecard_2.jpg",
        isLive: true,
        watchingCount: "4.5K",
        title: "2022 world champs gaming warzone",
        userName: "Guy Hawkins",
        gameName: "Call of duty",
        avatar: "/images/home/avatar_1.png",
    },
    {
        id: "3",
        cover: "/images/home/livecard_3.jpg",
        isLive: true,
        watchingCount: "4.8K",
        title: "2022 world champs gaming warzone",
        userName: "Guy Hawkins",
        gameName: "Call of duty",
        avatar: "/images/home/avatar_1.png",
    },
];

export default function LiveStreamsSection() {
    return (
        <section className="relative w-full overflow-hidden py-10 md:py-20">
            {/* Background ellipse */}
            <div className="pointer-events-none absolute -left-[400px] -top-[400px] -z-10">
                <Image
                    src="/images/home/live_left_ellipse.png"
                    width={1200}
                    height={1200}
                    alt="ellipse"
                    className="h-[1200px] w- [1200px]"
                />
            </div>

            {/* Content */}
            <div className="container mx-auto">
                <LiveSectionHeader
                    title="Live Streams"
                    className="mb-16 md:mb-20 tracking-wide text-[48px]"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {dummyLiveGames.map((game, i) => (
                        <LiveGameCard
                            key={i}
                            {...game}
                            onWatch={() => console.log("Watch:", game.title)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

