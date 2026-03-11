"use client";

import { useGetBigBossSupporterRankingAllDataQuery } from "@/redux/features/support/supportManagement";
import Skeleton from "@/shared/UI/Skeleton";
import SupporterCard from "@/shared/components/card/SupporterCard";
import RankPointReusableTable from "@/shared/components/rankPointTable/RankPointReusableTable";
import Image from "next/image";

const RankingSection = () => {
    const { data, isLoading } = useGetBigBossSupporterRankingAllDataQuery();
    console.log(data?.data);
    return (
        <section className="relative w-full ">
            {/* Background layer (clipped) */}
            <div className="pointer-events-none absolute inset-0 -z-10 ">
                <div className="absolute top-0 left-0 -translate-y-2/3 pointer-events-none">
                    <Image
                        src="/images/home/Ellipse2.png"
                        alt="ellipse"
                        width={1600}
                        height={800}
                        className="w-[1600px] h-[800px]"
                        unoptimized
                    />
                </div>

                <div className="absolute right-0 bottom-0 translate-y-1/4 pointer-events-none">
                    <Image
                        src="/images/home/Ellipse4.png"
                        width={1700}
                        height={1400}
                        alt="ellipse"
                        className="w-[1700px] h-[1400px]"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="container py-20">
                <div className="flex flex-col items-center gap-8">
                    {isLoading ? (
                        <div className="w-full">
                            <Skeleton className="w-full h-40" />
                        </div>
                    ) : (
                        <SupporterCard
                            imageSrc={data?.data[0]?.supporter?.image || "/images/home/supported_cardimg.png"}
                            title="Big Boss Supporter"
                            name={data?.data[0]?.supporter?.name || "Fatt Le Sage"}
                            className="mx-auto"
                        />
                    )}

                    <div className="w-full">
                        <RankPointReusableTable data={data?.data || []} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RankingSection;
