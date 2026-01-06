
"use client"

import WatchLiveHeroCarousel, { WatchLiveSlide } from "@/shared/components/watchLive/WatchLiveHero";



const slides: WatchLiveSlide[] = [
    {
        id: "1",
        bg: "/images/home/watch_main.png",
        game: "Call Of Duty",
        title: "Warzone 2.0",
        meta: "Warzone • US English",
        isLive: true,
        avatars: ["/images/home/watch_1.jpg", "/images/home/watch_2.jpg"],
        thumbs: [
            "/images/home/watch_1.jpg",
           "/images/home/watch_1.jpg",
            "/images/home/watch_1.jpg",
           "/images/home/watch_1.jpg",
        ],
    },
    {
        id: "2",
        bg: "/images/home/watch_main.png",
        game: "Call Of Duty55",
        title: "Warzone 2.0",
        meta: "Warzone • US English",
        isLive: true,
        avatars: ["/images/home/watch_1.jpg", "/images/home/watch_2.jpg"],
        thumbs: [
            "/images/home/watch_1.jpg",
            "/images/home/watch_1.jpg",
            "/images/home/watch_1.jpg",
            "/images/home/watch_1.jpg",
        ],
    },
    
];

export default function WatchLivePage() {
    return (
        <div className="w-full">
            <WatchLiveHeroCarousel slides={slides} onWatch={(s) => console.log(s)} />
        </div>
    );
}




// "use client";

// import WatchLiveHero from "@/shared/components/watchLive/WatchLiveHero";


// const slides = [
//     {
//         id: "1",
//         bg: "/images/home/watch_1.jpg",
//         game: "Call Of Duty",
//         title: "Warzone 2.0",
//         meta: "Warzone • US English",
//         isLive: true,
//         thumbs: [{ id: "t1", src: "/images/home/watch_main.png", alt: "Warzone thumb" }],
//     },
//     {
//         id: "2",
//         bg: "/images/home/watch_2.jpg",
//         game: "Valorant",
//         title: "Episode Update",
//         meta: "Valorant • EU",
//         isLive: true,
//         thumbs: [{ id: "t2", src: "/images/home/watch_2.jpg", alt: "Valorant thumb" }],
//     },
// ];

// export default function WatchLiveContainer() {
//     return (
//         <div className="container ">
//             <WatchLiveHero
//                 slides={slides}
//                 onWatch={(s) => console.log("watch:", s)}
//             />
//         </div>
//     );
// }
