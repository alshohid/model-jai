
"use client"
import LiveSectionHeader from "@/app/(auth)/_components/watchLive/LiveSectionHeader";
import PointCard from "@/shared/components/card/PointCard";

const PointStoreListSection = () => {
    const packs = [
        { id: "pack-50", points: 50, price: "17.00" },
        { id: "pack-100", points: 100, price: "29.00" },
        { id: "pack-250", points: 250, price: "59.00" },
        { id: "pack-500", points: 500, price: "99.00" },
        { id: "pack-750", points: 750, price: "149.00" },
        { id: "pack-1000", points: 1000, price: "179.00" },
        { id: "pack-1500", points: 1500, price: "249.00" },
        { id: "pack-2000", points: 2000, price: "319.00" },
        { id: "pack-5000", points: 5000, price: "699.00" },
    ];

    return (
        <div>
            <div className="container ">
                <LiveSectionHeader
                    title="Point Store"
                    className="mb-8 md:mb-15tracking-wide text-[48px]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
                    {packs.map((p) => (
                        <PointCard
                            key={p.id}
                            points={p.points}
                            price={p.price}
                            imageSrc="/images/home/coin.png"
                            onBuy={() => console.log("buy pack", p.id)}
                        />
                    ))}
                </div>


            </div>

        </div>
    )

}
export default PointStoreListSection;