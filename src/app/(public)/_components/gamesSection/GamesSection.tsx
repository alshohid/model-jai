
"use client";

import { useGetAllPublicGamesListQuery } from "@/redux/features/game/gameListManagement";
import CategoryCarousel, {
    CategoryItem,
} from "@/shared/UI/reusable/carousel/CategoryCarousel";
import SectionHead from "@/shared/UI/reusable/head/SectionHead";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

export default function GamesSection() {
    const { data, isLoading } = useGetAllPublicGamesListQuery({
        page: 1,
        limit: 1000,
    });

    const items: CategoryItem[] =
        data?.data?.map((game) => ({
            id: String(game?.id),
            title: game?.name,
            imageSrc: getSafeImageSrc(game?.image, "/images/home/cat_1.png"),
        })) ?? [];

    return (
        <section className="w-full overflow-visible">
            <div className="container py-10 md:py-16">
                <SectionHead title="Choose Games" />

                <div className="mt-6 md:mt-16">
                    {isLoading ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-[220px] rounded-[20px] bg-white/10 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <CategoryCarousel items={items} />
                    )}
                </div>
            </div>
        </section>
    );
}
