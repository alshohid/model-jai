
"use client"

import { useAuth } from "@/redux/features/auth/hooks";
import WatchLiveHeroCarousel from "@/shared/components/watchLive/WatchLiveHero";
import { WatchLiveHeroSlide } from "@/types/watchLive/watchLiveTypes";
import { useRouter } from "next/navigation";


const slides: WatchLiveHeroSlide[] = [
    {
        id: "1",
        bg: "/images/home/game_12.png",
        game: "FreeStyle",
        title: "Shadow R vs Phonex Force",
        meta: "Novembar 2024 • 5:30pm",
        isLive: true,

        status: "Live",
        dateText: "March 2024",
        timeText: "4:30pm",
        gameLogoSrc: "/images/home/bayern.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        versusImg: "/images/home/versus.png",
        watchHref: "/live-stream/match/2",
        voteRequired: true,
        platform: "tiktok",
        thumbs: ["/images/home/game_12.png"],
    },
    {
        id: "2",
        bg: "/images/home/game_12.png",
        game: "FC26",
        title: "Steev R vs Jack Force",
        meta: "April 2024 • 4:30pm",
        isLive: true,

        status: "Live",
        dateText: "April 2024",
        timeText: "4:20pm",
        gameLogoSrc: "/images/home/bayern.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        versusImg: "/images/home/versus.png",
        watchHref: "/live-stream/match/2",
        voteRequired: true,
        platform: "twitch",
        thumbs: ["/images/home/game_12.png"],
    },
    {
        id: "3",
        bg: "/images/home/game_12.png",
        game: "Combat",
        title: "Shadow R vs Phonex Force",
        meta: "Novembar 2024 • 4:30pm",
        isLive: true,

        status: "Live",
        dateText: "Novembar 2024",
        timeText: "4:30pm",
        gameLogoSrc: "/images/home/bayern.png",
        leftPlayerImg: "/images/home/leftPlayerImg.png",
        rightPlayerImg: "/images/home/rightPlayerImg.png",
        versusImg: "/images/home/versus.png",
        watchHref: "/live-stream/match/2",
        voteRequired: true,
        platform: "tiktok",
        thumbs: ["/images/home/game_12.png"],
    },
    
];


export default function WatchLivePage() {
    const { isAuthenticated } = useAuth()
    const onWatchHandler = (s: WatchLiveHeroSlide) => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/live-stream/match/${s.id!}?platform=tiktok`);
            return;
        }
        router.push(`/live-stream/match/${s.id!}?platform=tiktok`);
    }
    const router = useRouter()
    return (
        <div className={`w-full ${isAuthenticated ? "py-0" : "py-20"}`}>
            <WatchLiveHeroCarousel slides={slides} onWatch={(s) => onWatchHandler(s)} />
        </div>
    );
}




