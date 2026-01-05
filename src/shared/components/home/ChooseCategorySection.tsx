
"use client"
import SectionHead from "@/shared/UI/reusable/head/SectionHead";
import CategoryCarousel, { CategoryItem } from "@/shared/UI/reusable/carousel/CategoryCarousel";

const items: CategoryItem[] = [
    { id: "1", title: "ADVENTURE", imageSrc: "/images/home/adventure.jpg" },
    { id: "2", title: "SIMULATOR", imageSrc: "/images/home/simulator.jpg" },
    { id: "3", title: "RACING", imageSrc: "/images/home/racing.jpg" },
    { id: "4", title: "SCI-FI GAME", imageSrc: "/images/home/scifi.jpg" },
];

export default function ChooseCategorySection() {
    return (
        <section className="w-full overflow-x-hidden">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-0 py-16 sm:py-20">
                <SectionHead title="Choose Category" />
                <div className="mt-12 sm:mt-16">
                    <CategoryCarousel
                        items={items}
                        onItemClick={(item) => {
                            console.log("clicked:", item);
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
