/* eslint-disable @typescript-eslint/no-explicit-any */

import LiveSectionHeader from "./LiveSectionHeader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MatchCard from "@/shared/components/card/MatchCard";
import { MatchItem } from "@/shared/components/grid/MatchesGrid";
import { useAuth } from "@/redux/features/auth/hooks";


const MOCK_MATCHES: MatchItem[] = [
    {
        id: "1",
        status: "Live",
        title: "ShadowR vs Phoenix Force",
        dateText: "November 1, 2024",
        timeText: "4:30 pm",
        gameLogoSrc: "/images/home/2k.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        watchHref: "/matches/1",
        voteRequired: false,
        versusImg: "/images/home/versus.png",
        platform:"tiktok"
    },
    {
        id: "2",
        status: "Live",
        title: "ShadowR vs Phoenix Force",
        dateText: "November 1, 2024",
        timeText: "4:30 pm",
        gameLogoSrc: "/images/home/freestyle_1.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        watchHref: "/matches/2",
        voteRequired: false,
        versusImg: "/images/home/versus.png",
        platform: "twitch"
    },
    {
        id: "3",
        status: "Live",
        title: "ShadowR vs Phoenix Force",
        dateText: "November 1, 2024",
        timeText: "4:30 pm",
        gameLogoSrc: "/images/home/mortal_1.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        watchHref: "/matches/3",
        voteRequired: false,
        versusImg: "/images/home/versus.png",
        platform: "tiktok"
    },
    {
        id: "4",
        status: "Live",
        title: "ShadowR vs Phoenix Force",
        dateText: "November 1, 2024",
        timeText: "4:30 pm",
        gameLogoSrc: "/images/home/freestyle.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        watchHref: "/matches/1",
        voteRequired: true,
        versusImg: "/images/home/versus.png",
        platform: "twitch"
    },
    
];

export default function LiveStreamsSection() {
    const dummyLiveGames = MOCK_MATCHES;
    const router = useRouter();
    const { isAuthenticated } = useAuth();


    const handleWatch = (matchId:any, platform:any) => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/live-stream/match/${matchId}?platform=${platform}`);
            return;
        }

        router.push(`/live-stream/match/${matchId}?platform=${platform}`);
    };

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
                    className="mb-16 md:mb-20 tracking-wide text-[35px] md:text-[44px] lg:text-[48px]"
                />

                {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"> */}
                <div className="grid gap-3 md:gap-6 w-full grid-cols-1 md:grid-cols-3 place-items-center">
                    {dummyLiveGames.map((m) => (
                        <MatchCard
                            key={m.id}
                            status={m.status}
                            title={m.title}
                            dateText={m.dateText}
                            timeText={m.timeText}
                            gameLogoSrc={m.gameLogoSrc}
                            leftPlayerImg={m.leftPlayerImg}
                            rightPlayerImg={m.rightPlayerImg}
                            watchHref={m.watchHref}
                            voteRequired={m.voteRequired}
                            versusImg={m.versusImg}
                            onWatch={()=>handleWatch(m.id, m.platform) as any}

                        />
                        
                    ))}
                </div>

            </div>
        </section>
    );
}

