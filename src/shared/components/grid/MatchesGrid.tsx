/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/redux/features/auth/hooks";
import MatchCard from "../card/MatchCard";
import { formateDate, formateTime } from "@/shared/lib/utils/dateFormater";

export type MatchStatus = "upcoming" | "past" | "live";

type Props = {
    matches: any[];
    isLoading?: boolean;
};

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

export default function MatchesGrid({ matches, isLoading }: Props) {
    const router = useRouter();
    const { isAuthenticated, role } = useAuth();

    const handleWatch = (matchId: string, platform: string) => {
        console.log(matchId, platform);

        if (!isAuthenticated) {
            router.push(`/login?redirect=/live-stream/match/${matchId}?platform=${platform}`);
            return;
        }

        if (role === "user" || role === "artist") {
            router.push(`/live-stream/match/${matchId}?platform=${platform}`);
            return;
        }

        router.push(`/admin/dashboard`);
    };

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="grid gap-3 md:gap-6 w-full grid-cols-2 md:grid-cols-3 place-items-center">
            {matches.map((match) => (
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
                    onWatch={() => handleWatch(match.id!, match.platform || "tiktok")}
                />
            ))}
        </div>
    );
}