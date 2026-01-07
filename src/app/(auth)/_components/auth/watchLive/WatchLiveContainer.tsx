
"use client"

import WatchLiveHeroCarousel from "@/shared/components/watchLive/WatchLiveHero";
import { WatchLiveSlide } from "@/types/watchLive/watchLiveTypes";



const slides: WatchLiveSlide[] = [
    {
        id: "1",
        bg: "/images/home/watch_main.png",
        game: "Call of Duty: Warzone",
        title: "Warzone 3.0",
        meta: "Battle Royale • English (US)",
        isLive: true,
        avatars: ["/images/home/watch_1.jpg"],
        thumbs: ["/images/home/watch_1.jpg"],
    },
    {
        id: "2",
        bg: "/images/home/watch_2.jpg",
        game: "The Witcher 3: Wild Hunt",
        title: "Wild Hunt 2.0",
        meta: "RPG • English (US)",
        isLive: true,
        avatars: ["/images/home/watch_2.jpg"],
        thumbs: ["/images/home/watch_2.jpg"],
    },
    {
        id: "3",
        bg: "/images/home/watch_3.jpg",
        game: "Cyberpunk 2077",
        title: "Night City 5.0",
        meta: "Action RPG • English (US)",
        isLive: true,
        avatars: ["/images/home/watch_3.jpg"],
        thumbs: ["/images/home/watch_3.jpg"],
    },
];

export default function WatchLivePage() {
    return (
        <div className="w-full">
            <WatchLiveHeroCarousel slides={slides} onWatch={(s) => console.log(s)} />
        </div>
    );
}




