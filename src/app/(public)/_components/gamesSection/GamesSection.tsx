
"use client"
import { useGetAllPublicGamesListQuery } from "@/redux/features/game/gameListManagement";
import GameCarousel, { GameCarouselItem } from "@/shared/UI/reusable/carousel/GameCarousel"
import SectionHead from "@/shared/UI/reusable/head/SectionHead";
import { Sparkles } from "lucide-react";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

export default function GamesSection() {
    const { data, isLoading } = useGetAllPublicGamesListQuery({
        page: 1,
        limit: 100,
    });

    const items: GameCarouselItem[] =
        data?.data?.map((game) => ({
            id: String(game?.id),
            title: game?.name,
            imageSrc: getSafeImageSrc(game?.image, "/images/home/cat_1.png"),
        })) ?? [];

    return (
        <section className="w-full overflow-visible">
            <div className="container py-12 sm:py-16">
                <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(140deg,rgba(10,9,18,0.98),rgba(23,16,30,0.94))] px-3 py-4 shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                    <div className="pointer-events-none absolute -left-12 top-10 h-32 w-32 rounded-full bg-[#00C3FF]/12 blur-3xl sm:h-40 sm:w-40" />
                    <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 bg-[radial-gradient(circle_at_top_right,rgba(255,77,141,0.18),transparent_62%)] sm:h-56 sm:w-56" />
                    <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-[#7CF7FF]/10 blur-3xl sm:h-32 sm:w-32" />

                    <div className="relative">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#9FE8FF]/20 bg-[#00C3FF]/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-[#9FE8FF]">
                                <Sparkles className="size-3.5" />
                                Featured Games
                            </div>

                            <SectionHead
                                title="Choose Games"
                                className="mt-3 [&_h2]:text-3xl [&_h2]:sm:text-3xl"
                            />
                        </div>
                        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-end lg:gap-8">


                            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:rounded-[24px] sm:p-4 lg:p-5">
                                {isLoading ? (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <div
                                                key={index}
                                                className="h-[230px] rounded-[24px] border border-white/10 bg-white/8 animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : items.length > 0 ? (
                                    <GameCarousel items={items} />
                                ) : (
                                    <div className="flex min-h-[260px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-black/20 px-6 text-center text-sm text-white/55">
                                        No games are available right now. Please check back again shortly.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
