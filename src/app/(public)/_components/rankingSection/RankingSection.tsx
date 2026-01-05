import SupporterCard from "@/shared/components/card/SupporterCard";
import RankPointReusableTable from "@/shared/components/rankPointTable/RankPointReusableTable";
import Image from "next/image";

const RankingSection = () => {
    return (
        <section className="w-full relative ">
            <div className=" absolute top-0 left-0">
                <Image
                    src={'/images/home/Ellipse2.png'}
                    alt="ellispe"
                    width={900}
                    height={900}
                    className="w-[1600px] h-[800px]"
                    unoptimized

                />
            </div>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-0 py-20">
                <div className="flex flex-col items-center gap-8">
                    <SupporterCard
                        imageSrc="/images/home/supported_cardimg.png"
                        title="Big Boss Supporter"
                        name="Cameron Williamson"
                        className="mx-auto"
                    />

                    <div className="w-full">
                        <RankPointReusableTable />
                    </div>
                </div>
            </div>
            <div className=" pointer-events-none absolute right-0 bottom-0 -z-10 translate-x-1/4 translate-y-1/4">
                <Image
                    src="/images/home/Ellipse4.png"
                    width={702}
                    height={702}
                    alt="elips"
                    className="w-[1700px] h-[1400px]"
                />
            </div>

        </section>
    );
};

export default RankingSection;
