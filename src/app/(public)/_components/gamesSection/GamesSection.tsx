import GameCarousel, { GameCarouselItem } from "@/shared/UI/reusable/carousel/GameCarousel"


const items: GameCarouselItem[] = [
    // { id: "1", title: "DEVIL HUNTER", imageSrc: "/images/gm1.jpeg" },
    { id: "1", title: "MORTAL COMBAT", imageSrc: "/images/gm6.png" },
    { id: "2", title: "FC26", imageSrc: "/images/gm3.png" },
  
    { id: "3", title: "CAR RACING", imageSrc: "/images/gm7.jpeg" },
    { id: "5", title: "2K26", imageSrc: "/images/gm5.jpeg" },
    
    { id: "7", title: "DEVIL HUNTER", imageSrc: "/images/home/carousel1.jpg" },
    { id: "8", title: "CALL OF DUTY", imageSrc: "/images/home/carousel3.png" },
    { id: "9", title: "THE WITCHER", imageSrc: "/images/home/carousel4.jpg" },
    { id: "10", title: "2K26", imageSrc: "/images/gm2.jpeg" },
    { id: "11", title: "DEVIL HUNTER", imageSrc: "/images/home/carousel1.jpg" },
    { id: "12", title: "CALL OF DUTY", imageSrc: "/images/home/carousel3.png" },
    { id: "13", title: "THE WITCHER", imageSrc: "/images/home/carousel4.jpg" },

]

export default function GamesSection() {
    return (
        <section className="w-full pt-5 md:pt-15 container">
            <GameCarousel items={items} />
        </section>
    )
}
