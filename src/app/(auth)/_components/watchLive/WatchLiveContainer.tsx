
"use client"

import WatchLiveHeroCarousel from "@/shared/components/watchLive/WatchLiveHero";
import { WatchLiveSlide } from "@/types/watchLive/watchLiveTypes";



// const slides: WatchLiveSlide[] = [
//     {
//         id: "1",
//         bg: "/images/home/watch_main.png",
//         game: "Call of Duty: Warzone",
//         title: "Warzone 3.0",
//         meta: "Battle Royale • English (US)",
//         isLive: true,
//         avatars: ["/images/home/watch_main.png"],
//         thumbs: ["/images/home/watch_main.png"],
//     },
//     {
//         id: "2",
//         bg: "/images/home/watch_2.jpg",
//         game: "The Witcher 3: Wild Hunt",
//         title: "Wild Hunt 2.0",
//         meta: "RPG • English (US)",
//         isLive: true,
//         avatars: ["/images/home/watch_2.jpg"],
//         thumbs: ["/images/home/watch_2.jpg"],
//     },
//     {
//         id: "3",
//         bg: "/images/home/watch_3.jpg",
//         game: "Cyberpunk 2077",
//         title: "Night City 5.0",
//         meta: "Action RPG • English (US)",
//         isLive: true,
//         avatars: ["/images/home/watch_3.jpg"],
//         thumbs: ["/images/home/watch_3.jpg"],
//     },
// ];
const slides: WatchLiveSlide[] = [
    {
        id: "1",
        bg: "/images/home/game_12.png",
        game: "Call of Duty: Warzone",
        title: "Warzone 3.0",
        meta: "Battle Royale • English (US)",
        isLive: true,
        avatars: ["/images/home/game_12.png"],
        thumbs: ["/images/home/game_12.png"],
    },
    {
        id: "2",
        bg: "/images/home/game_13.png",
        game: "The Witcher 3: Wild Hunt",
        title: "Wild Hunt 2.0",
        meta: "RPG • English (US)",
        isLive: true,
        avatars: ["/images/home/game_13.png"],
        thumbs: ["/images/home/game_13.png"],
    },
    {
        id: "3",
        bg: "/images/home/game_14.png",
        game: "Cyberpunk 2077",
        title: "Night City 5.0",
        meta: "Action RPG • English (US)",
        isLive: true,
        avatars: ["/images/home/game_14.png"],
        thumbs: ["/images/home/game_14.png"],
    },
    {
        id: "4",
        bg: "/images/home/game_15.png",
        game: "Cyberpunk 2077",
        title: "Night City 5.0",
        meta: "Action RPG • English (US)",
        isLive: true,
        avatars: ["/images/home/game_15.png"],
        thumbs: ["/images/home/game_15.png"],
    },
];
export default function WatchLivePage() {
    return (
        <div className="w-full">
            <WatchLiveHeroCarousel slides={slides} onWatch={(s) => console.log(s)} />
        </div>
    );
}




