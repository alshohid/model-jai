
"use client"
import SectionHead from "@/shared/UI/reusable/head/SectionHead";
import CategoryCarousel, { CategoryItem } from "@/shared/UI/reusable/carousel/CategoryCarousel";

const items: CategoryItem[] = [
    { id: "1", title: "ADVENTURE", imageSrc: "/images/home/cat_1.png" },
    { id: "2", title: "ADVENTURE", imageSrc: "/images/home/cat_2.png" },
    { id: "3", title: "ADVENTURE", imageSrc: "/images/home/cat_3.png" },
    { id: "4", title: "ADVENTURE", imageSrc: "/images/home/cat_4.png" },
];

export default function ChooseCategorySection() {
    return (
        <section className="w-full overflow-visible">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-0 py-16 sm:py-20 overflow-hidden">
                <SectionHead title="Choose Category" />
                <div className="mt-12 sm:mt-16">
                    <CategoryCarousel
                        items={items}
                        onItemClick={(item) => console.log("clicked:", item)}
                    />
                </div>
            </div>
        </section>
    );
}
