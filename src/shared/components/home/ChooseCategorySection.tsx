"use client";

import SectionHead from "@/shared/UI/reusable/head/SectionHead";
import CategoryCarousel, {
    CategoryItem,
} from "@/shared/UI/reusable/carousel/CategoryCarousel";
import { useGetAllPublicCategoryListQuery } from "@/redux/features/game/gameCategoryManagement";

export default function ChooseCategorySection() {
    const { data, isLoading } = useGetAllPublicCategoryListQuery({
        page: 1,
        limit: 100,
    });

    const items: CategoryItem[] =
        data?.data?.map((category) => ({
            id: String(category?.id),
            title: category?.name,
            imageSrc: category?.image || "/images/home/cat_1.png",
        })) ?? [];

    return (
        <section className="w-full overflow-visible">
            <div className="container py-16">
                <SectionHead title="Choose Category" />

                <div className="mt-12 sm:mt-16">
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
                        <CategoryCarousel
                            items={items}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
