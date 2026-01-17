import GameCarousel, { GameCarouselItem } from "@/shared/UI/reusable/carousel/GameCarousel"


const items: GameCarouselItem[] = [
    { id: "1", title: "DEVIL HUNTER", imageSrc: "/images/home/carousel1.jpg" },
    { id: "2", title: "CALL OF DUTY", imageSrc: "/images/home/carousel3.png" },
    { id: "3", title: "THE WITCHER", imageSrc: "/images/home/carousel4.jpg" },
    { id: "4", title: "DEVIL HUNTER", imageSrc: "/images/home/carousel1.jpg" },
    { id: "5", title: "CALL OF DUTY", imageSrc: "/images/home/carousel3.png" },
    { id: "6", title: "THE WITCHER", imageSrc: "/images/home/carousel4.jpg" },
    { id: "7", title: "DEVIL HUNTER", imageSrc: "/images/gm1.jpeg" },
    { id: "8", title: "CALL OF DUTY", imageSrc: "/images/gm3.png" },
    { id: "9", title: "THE WITCHER", imageSrc: "/images/gm6.png" },
    { id: "10", title: "DEVIL HUNTER", imageSrc: "/images/gm2.jpeg" },
    { id: "11", title: "CALL OF DUTY", imageSrc: "/images/gm5.jpeg" },
    { id: "12", title: "THE WITCHER", imageSrc: "/images/gm7.jpeg" },
]

export default function GamesSection() {
    return (
        <section className="w-full pt-5 md:pt-15 container">
            <GameCarousel items={items} />
        </section>
    )
}
