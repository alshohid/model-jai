
"use client"

import WatchLiveHeroCarousel from "@/shared/components/watchLive/WatchLiveHero";
import { WatchLiveHeroSlide } from "@/types/watchLive/watchLiveTypes";


const slides: WatchLiveHeroSlide[] = [
    {
        id: "1",
        bg: "/images/home/game_12.png",
        game: "FreeStyle",
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
    {
        id: "2",
        bg: "/images/home/game_12.png",
        game: "FC26",
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
    {
        id: "4",
        bg: "/images/home/game_12.png",
        game: "2K26",
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
        platform: "twitch",
        thumbs: ["/images/home/game_12.png"],
    },
];


export default function WatchLivePage() {
    return (
        <div className="w-full ">
            <WatchLiveHeroCarousel slides={slides} onWatch={(s) => console.log(s)} />
        </div>
    );
}




