/* eslint-disable @typescript-eslint/no-explicit-any */

import LiveSectionHeader from "./LiveSectionHeader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MatchCard from "@/shared/components/card/MatchCard";
import { useAuth } from "@/redux/features/auth/hooks";
import { useGetAllPublicMatchListQuery } from "@/redux/features/match/matchManagement";
import { useState } from "react";
import { formateDate, formateTime } from "@/shared/lib/utils/dateFormater";

export type MatchStatus = "upcoming" | "past" | "live";
const LoadingSkeleton = () => (
    <div className="grid gap-3 md:gap-6 w-full grid-cols-2 md:grid-cols-3 place-items-center">
        {[...Array(6)].map((_, index) => (
            <div
                key={index}
                className="w-full max-w-[250px] bg-[#2e2e2e] p-3 rounded-lg animate-pulse"
            >
                <div className="h-32 bg-gray-600 rounded-md mb-3"></div>
                <div className="h-5 bg-gray-600 mb-2 rounded-md"></div>
                <div className="h-4 bg-gray-600 mb-2 rounded-md"></div>
                <div className="h-5 bg-gray-600 rounded-md"></div>
            </div>
        ))}
    </div>
);
export default function LiveStreamsSection() {
    const [page, setPage] = useState(1);
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
                            gameLogoSrc={match.game.image || "/images/home/gameLogo.png"}
                            leftPlayerImg={match.player_one?.image_url || "/images/home/leftPlayerImg.png"}
                            rightPlayerImg={match.player_two?.image_url || "/images/home/rightPlayerImg.png"}
                            voteRequired={match.confirmation_status === 0} // If confirmation is 0, vote is required
                            watchHref={match.tiktok_link || "#"} // Assuming you are passing TikTok link
                            versusImg="/images/home/versus.png" // Static or dynamic image
                            onWatch={() => handleWatch(match.id, match.platform || "tiktok")}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}

