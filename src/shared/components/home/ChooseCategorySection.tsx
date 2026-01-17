
"use client"
import SectionHead from "@/shared/UI/reusable/head/SectionHead";
import CategoryCarousel, { CategoryItem } from "@/shared/UI/reusable/carousel/CategoryCarousel";

const items: CategoryItem[] = [
    { id: "1", title: "DEVIL HUNTER", imageSrc: "/images/gm1.jpeg" },
    { id: "2", title: "CALL OF DUTY", imageSrc: "/images/gm3.png" },
    { id: "3", title: "THE WITCHER", imageSrc: "/images/gm6.png" },
    { id: "4", title: "DEVIL HUNTER", imageSrc: "/images/gm2.jpeg" },
    { id: "5", title: "CALL OF DUTY", imageSrc: "/images/gm5.jpeg" },
    { id: "6", title: "THE WITCHER", imageSrc: "/images/gm7.jpeg" },
    { id: "7", title: "ADVENTURE", imageSrc: "/images/home/cat_1.png" },
    { id: "8", title: "ADVENTURE", imageSrc: "/images/home/cat_2.png" },
    { id: "9", title: "ADVENTURE", imageSrc: "/images/home/cat_3.png" },
    { id: "10", title: "ADVENTURE", imageSrc: "/images/home/cat_4.png" },
];

export default function ChooseCategorySection() {
    return (
        <section className="w-full overflow-visible">
            <div className="container py-16 ">
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
