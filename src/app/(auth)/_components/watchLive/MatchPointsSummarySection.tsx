"use client";

import MatchPointsCard from "@/shared/components/card/MatchPointsCard";
import { cn } from "@/shared/lib/utils/cn";

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
        <section className={cn(["container py-20", className])}>
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
        </section>
    );
}
