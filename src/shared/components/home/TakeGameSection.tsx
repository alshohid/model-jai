"use client";

import Image from "next/image";
import PromoSplitCard from "../card/PromoSplitCard";



export default function TakeGameSection() {
    return (
        <section className="w-full relative">

            <div className="container md:py-24 py-10">
                <PromoSplitCard>
                    <PromoSplitCard.Content>
                        <h2 className="text-[#FFFFFF] text-[40px] md:text-[48px]  leading-[1.05] font-light">
                            Become the Boss
                        </h2>
                    </PromoSplitCard.Content>

                    <PromoSplitCard.Media
                        src="/images/home/boss.png"
                        alt="Take the game anywhere"
                    />
                </PromoSplitCard>
            </div>
            <div className="absolute bottom-0 left-0 -translate-y-1/2 ">
                <Image
                    src="/images/home/Ellipse2.png"
                    alt="ellipse"
                    width={1600}
                    height={800}
                    className="w-[1600px] h-[800px]"
                    unoptimized
                />
            </div>
        </section>
    );
}
