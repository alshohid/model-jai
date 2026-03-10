

"use client"
import { useGetAllPublicGamesListQuery } from "@/redux/features/game/gameListManagement";
import GameCarousel, { GameCarouselItem } from "@/shared/UI/reusable/carousel/GameCarousel"
import SectionHead from "@/shared/UI/reusable/head/SectionHead";




export default function GamesSection() {
    const { data, isLoading } = useGetAllPublicGamesListQuery({
        page: 1,
        limit: 100,
    });

    const items: GameCarouselItem[] =
        data?.data?.map((game) => ({
            id: String(game?.id),
            title: game?.name,
            imageSrc: game?.image || "/images/home/cat_1.png",
        })) ?? [];
    return (
        <section className="w-full pt-5 md:pt-15 container">
            <SectionHead title="Choose Games" />
            {
                isLoading ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-[220px] rounded-[20px] bg-white/10 animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <GameCarousel items={items} />
                )
            }
        </section>
    )
}
