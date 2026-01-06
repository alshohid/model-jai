"use client";

import PromoSplitCard from "../card/PromoSplitCard";



export default function TakeGameSection() {
    return (
        <section className="w-full">
            <div className="container md:py-24 py-20">
                <PromoSplitCard>
                    <PromoSplitCard.Content>
                        <h2 className="text-[#FFFFFF] text-[40px] md:text-[48px]  leading-[1.05] font-light">
                            Take the game with
                            <br />
                            you anywhere
                        </h2>
                    </PromoSplitCard.Content>

                    <PromoSplitCard.Media
                        src="/images/home/takegame.png" 
                        alt="Take the game anywhere"
                    />
                </PromoSplitCard>
            </div>
        </section>
    );
}
