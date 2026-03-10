"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/redux/features/auth/hooks";
import { useGetAllPublicMatchListQuery } from "@/redux/features/match/matchManagement";
import WatchLiveHeroCarousel from "@/shared/components/watchLive/WatchLiveHero";
import { formateDate, formateTime } from "@/shared/lib/utils/dateFormater";
import { WatchLiveHeroSlide } from "@/types/watchLive/watchLiveTypes";

function WatchLiveHeroSkeleton() {
    return (
        <div className="w-full animate-pulse">
            <div className="relative w-full overflow-hidden rounded-[24px] bg-white/5 border border-white/10">
                <div className="h-[260px] md:h-[420px] w-full bg-white/10" />

                <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
                    <div className="mb-3 h-6 w-24 rounded-full bg-white/10" />
                    <div className="mb-3 h-8 md:h-12 w-2/3 rounded-lg bg-white/10" />
                    <div className="mb-6 h-5 w-1/3 rounded-lg bg-white/10" />

                    <div className="flex items-center gap-3">
                        <div className="h-11 w-36 rounded-xl bg-white/10" />
                        <div className="h-11 w-28 rounded-xl bg-white/10" />
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-20 md:h-24 rounded-[16px] bg-white/10"
                    />
                ))}
            </div>
        </div>
    );
}

export default function WatchLivePage() {
    const router = useRouter();
    const { isAuthenticated, role } = useAuth();
    const [page] = useState(1);
    const limit = 10;

    const { data, isLoading } = useGetAllPublicMatchListQuery({
        page,
        limit,
        type: "all",
    });

    const matches = data?.data || [];

    const slides: WatchLiveHeroSlide[] = matches.map((match) => ({
        id: String(match.id),
        bg: match.game?.image || "/images/home/gameLogo.png",
        game: match.game?.name || "",
        title: `${match.player_one?.name || "Player One"} vs ${match.player_two?.name || "Player Two"}`,
        meta: `${formateDate(match?.match_date)} • ${formateTime(match?.match_time)}`,
        isLive: match.type === "live",
        status:
            match.type === "live"
                ? "Live"
                : match.type === "upcoming"
                    ? "Upcoming"
                    : "Past",
        dateText: formateDate(match?.match_date),
        timeText: formateTime(match?.match_time),
        gameLogoSrc: match.game?.image || "/images/home/gameLogo.png",
        leftPlayerImg:
            match?.player_one?.image_url ||
            match?.player_one?.image ||
            "/images/home/leftPlayerImg.png",
        rightPlayerImg:
            match?.player_two?.image_url ||
            match?.player_two?.image ||
            "/images/home/rightPlayerImg.png",
        versusImg: "/images/home/versus.png",
        watchHref: `/live-stream/match/${match.id}?platform=${match?.platform || "tiktok"}`,
        voteRequired: match?.confirmation_status === 0,
        platform: (match?.platform === "twitch" ? "twitch" : "tiktok"),
        thumbs: [match.game?.image || "/images/home/gameLogo.png"],
    }));

    const onWatchHandler = (s: WatchLiveHeroSlide) => {
        if (!isAuthenticated || (role !== "user" && role !== "artist")) {
            router.push(`/login?redirect=/live-stream/match/${s.id}?platform=${s.platform || "tiktok"}`);
            return;
        }

        router.push(`/live-stream/match/${s.id}?platform=${s.platform || "tiktok"}`);
    };

    return (
        <div className={`w-full ${isAuthenticated ? "py-0" : "py-20"}`}>
            {isLoading ? (
                <WatchLiveHeroSkeleton />
            ) : (
                <WatchLiveHeroCarousel
                    slides={slides}
                    onWatch={(s) => onWatchHandler(s)}
                />
            )}
        </div>
    );
}