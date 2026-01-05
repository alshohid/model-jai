import GameCarousel, { GameCarouselItem } from "@/shared/UI/reusable/carousel/GameCarousel"


const items: GameCarouselItem[] = [
    { id: "1", title: "DEVIL HUNTER", imageSrc: "/images/home/carousel1.jpg" },
    { id: "2", title: "CALL OF DUTY", imageSrc: "/images/home/carousel3.png" },
    { id: "3", title: "THE WITCHER", imageSrc: "/images/home/carousel4.jpg" },
    { id: "4", title: "DEVIL HUNTER", imageSrc: "/images/home/carousel1.jpg" },
    { id: "5", title: "CALL OF DUTY", imageSrc: "/images/home/carousel3.png" },
    { id: "6", title: "THE WITCHER", imageSrc: "/images/home/carousel4.jpg" },
]

export default function GamesSection() {
    return (
        <section className="w-full max-w-7xl mx-auto overflow-x-hidden">
            <GameCarousel items={items} />
        </section>
    )
}
