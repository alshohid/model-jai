"use client";

import MatchPointsCard from "@/shared/components/card/MatchPointsCard";
import { cn } from "@/shared/lib/utils/cn";
import Image from "next/image";

export default function MatchPointsSummarySection({
    noticeText = "Match Live Almost Start In 1 Hour",
    className,
}: {
    noticeText?: string;
    className?: string;
}) {
    const left = {
        playerName: "Jack",
        teamLogoSrc: "/images/home/bayern.png",
        points: 1000,
    };

    const right = {
        playerName: "Steve",
        teamLogoSrc: "/images/home/totenhum.png",
        points: 2000,
    };

    const handleShareLeft = () => console.log("share left");
    const handleShareRight = () => console.log("share right");

    return (
        <section className={cn(["relative ", className])}>
            <div className=" pointer-events-none absolute right-0 bottom-0 -z-10 translate-y-1/2">
                <Image
                    src="/images/home/bottom_right.png"
                    width={702}
                    height={702}
                    alt="elips"
                    className="w-[1700px] h-[1400px]"
                />
            </div>
            <div className="container py-20">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                    <MatchPointsCard
                        playerName={left.playerName}
                        teamLogoSrc={left.teamLogoSrc}
                        title="Matched Points"
                        points={left.points}
                        onShare={handleShareLeft}
                    />

                    <MatchPointsCard
                        playerName={right.playerName}
                        teamLogoSrc={right.teamLogoSrc}
                        title="Unmatched Points"
                        points={right.points}
                        onShare={handleShareRight}
                    />
                </div>

                <p className="mt-10 text-center text-white/85 text-[16px] md:text-[18px] tracking-wide">
                    {noticeText}
                </p>

            </div>
           
        </section>
    );
}
