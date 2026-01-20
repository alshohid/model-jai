
"use client"
import SectionHead from "@/shared/UI/reusable/head/SectionHead";
import CategoryCarousel, { CategoryItem } from "@/shared/UI/reusable/carousel/CategoryCarousel";

const items: CategoryItem[] = [
    { id: "1", title: "MORTAL COMBAT", imageSrc: "/images/gm6.png" },
    { id: "2", title: "EA SPORTS FC", imageSrc: "/images/gm1.jpeg" },
    { id: "3", title: "FC26", imageSrc: "/images/gm3.png" },
    { id: "11", title: "MORTAL COMBAT", imageSrc: "/images/gm6.png" },
    { id: "4", title: "EA SPORTS FC", imageSrc: "/images/gm2.jpeg" },
    { id: "5", title: "EA SPORTS FC", imageSrc: "/images/gm5.jpeg" },
    { id: "6", title: "CAR RACING", imageSrc: "/images/gm7.jpeg" },
    { id: "7", title: "TRUCK RACING", imageSrc: "/images/home/cat_1.png" },
    { id: "8", title: "AIR CRAFT", imageSrc: "/images/home/cat_2.png" },
    { id: "9", title: "MINI CAR", imageSrc: "/images/home/cat_3.png" },
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
