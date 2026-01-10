import MasonryImageGrid from "@/shared/components/grid/MasonryImageGrid";
const images = [
    { id: "1", src: "/images/home/p1.png", alt: "image 1", width: 1200, height: 1600 },
    { id: "2", src: "/images/home/m1.jpg", alt: "image 2", width: 1200, height: 900 },
    { id: "3", src: "/images/home/m2.jpg", alt: "image 3", width: 1200, height: 1400 },
    { id: "4", src: "/images/home/m3.jpg", alt: "image 4", width: 1200, height: 1000 },
    { id: "5", src: "/images/home/pro_2.jpg", alt: "image 2", width: 1200, height: 900 },
    { id: "6", src: "/images/home/pro_4.jpg", alt: "image 3", width: 1200, height: 1400 },
    { id: "7", src: "/images/home/m1.jpg", alt: "image 2", width: 1200, height: 900 },
    { id: "8", src: "/images/home/p1.png", alt: "image 1", width: 1200, height: 1600 },
];



const MissionarySection = () => {
    return (
        <div className="container py-10 md:py-15 lg:py-20">
            <MasonryImageGrid items={images} />
        </div>
    

    )
}
export default MissionarySection;