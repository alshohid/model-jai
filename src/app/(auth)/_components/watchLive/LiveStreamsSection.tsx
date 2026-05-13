/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LiveSectionHeader from "./LiveSectionHeader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MatchCard from "@/shared/components/card/MatchCard";
import { useAuth } from "@/redux/features/auth/hooks";
import { useGetAllPublicMatchListQuery } from "@/redux/features/match/matchManagement";
import { useState } from "react";
import { formateDate, formateTime } from "@/shared/lib/utils/dateFormater";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

export type MatchStatus = "upcoming" | "past" | "live" | "completed";
const LoadingSkeleton = () => (
    <div className="grid gap-3 md:gap-6 w-full grid-cols-2 md:grid-cols-3 place-items-center">
        {[...Array(6)].map((_, index) => (
            <div
                key={index}
                className="w-full max-w-[176px] rounded-[20px] border border-white/10 bg-[#272d34] p-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.22)] animate-pulse sm:max-w-[190px] md:max-w-[240px] md:rounded-[24px] md:p-3"
            >
                <div className="aspect-[1.48/1] rounded-[18px] bg-white/10"></div>
                <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="h-6 w-20 rounded-[9px] bg-white/10"></div>
                    <div className="size-10 rounded-full bg-white/10 md:size-12"></div>
                </div>
                <div className="mt-3 h-7 w-24 rounded-md bg-white/10"></div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="h-8 rounded-md bg-white/10"></div>
                    <div className="h-8 rounded-md bg-white/10"></div>
                </div>
                <div className="mt-4 h-11 rounded-full bg-white/10"></div>
                <div className="mt-3 flex justify-center gap-3">
                    <div className="size-8 rounded-[10px] bg-white/10"></div>
                    <div className="size-8 rounded-[10px] bg-white/10"></div>
                </div>
            </div>
        ))}
    </div>
);
export default function LiveStreamsSection() {
    const [page] = useState(1);
    const limit = 10;
    const { data, isLoading } = useGetAllPublicMatchListQuery({
        page,
        limit,
        type: "live",
    });


    const router = useRouter();
    const { isAuthenticated, role } = useAuth();


    const handleWatch = (matchId: any, platform: any) => {
        if (!isAuthenticated || role !== "user" && role !== "artist") {
            router.push(`/login?redirect=/live-stream/match/${matchId}?platform=${platform}`);
            return;
        }

        router.push(`/live-stream/match/${matchId}?platform=${platform}`);
    };
    if (isLoading) {
        return <LoadingSkeleton />;
    }
    return (
        <section className="relative w-full overflow-hidden py-10 md:py-20">
            {/* Background ellipse */}
            <div className="pointer-events-none absolute -left-[400px] -top-[400px] -z-10">
                <Image
                    src="/images/home/live_left_ellipse.png"
                    width={1200}
                    height={1200}
                    alt="ellipse"
                    className="h-[1200px] w- [1200px]"
                />
            </div>

            {/* Content */}
            <div className="container mx-auto">
                <LiveSectionHeader
                    title="Live Streams"
                    className="mb-16 md:mb-20 tracking-wide text-[35px] md:text-[44px] lg:text-[48px]"
                />

                {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"> */}
                <div className="grid gap-3 md:gap-6 w-full grid-cols-1 md:grid-cols-3 place-items-center">
                    {data?.data?.map((match) => (
                        <MatchCard
                            key={match.id}
                            status={match.type as MatchStatus}
                            title={match.game.name}
                            dateText={formateDate(match.match_date)}
                            timeText={formateTime(match.match_time)}
                            gameLogoSrc={getSafeImageSrc(match.game.image, "/images/home/gameLogo.png")}
                            leftPlayerImg={getSafeImageSrc(match.player_one?.image_url || match.player_one?.image, "/images/home/leftPlayerImg.png")}
                            rightPlayerImg={getSafeImageSrc(match.player_two?.image_url || match.player_two?.image, "/images/home/rightPlayerImg.png")}
                            voteRequired={match.confirmation_status === 0} // If confirmation is 0, vote is required
                            watchHref={match.tiktok_link || "#"} // Assuming you are passing TikTok link
                            versusImg="/images/home/versus.png" // Static or dynamic image
                            onWatch={() => handleWatch(match.id, match.platform || "tiktok")} tiktokLink={""} twitchLink={""} />
                    ))}
                </div>

            </div>
        </section>
    );
}
