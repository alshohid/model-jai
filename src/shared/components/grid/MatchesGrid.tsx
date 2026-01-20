import { useRouter } from "next/navigation";
import MatchCard from "../card/MatchCard";
import { useAuth } from "@/shared/providers/auth/useAuth";

export type MatchStatus = "Upcoming" | "Past" | "Live";

export type MatchItem = {
    id: string;
    status: MatchStatus;
    title: string;
    dateText: string;
    timeText: string;
    gameLogoSrc: string;
    leftPlayerImg: string;
    rightPlayerImg: string;
    watchHref: string;
    voteRequired?: boolean;
    versusImg: string;
    platform?: string;
};

export default function MatchesGrid({ matches }: { matches: MatchItem[] }) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const handleWatch = (matchId:any, platform:any ) => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/live-stream/match/${matchId}?platform=${platform}`);
            return;
        }

        router.push(`/live-stream/match/${matchId}?platform=${platform}`);
    };

    return (
        <div className="grid gap-3 md:gap-6 w-full grid-cols-2 md:grid-cols-3 place-items-center">
            {matches.map((m) => (
                <MatchCard
                    key={m.id}
                    status={m.status}
                    title={m.title}
                    dateText={m.dateText}
                    timeText={m.timeText}
                    gameLogoSrc={m.gameLogoSrc}
                    leftPlayerImg={m.leftPlayerImg}
                    rightPlayerImg={m.rightPlayerImg}
                    watchHref={m.watchHref}
                    voteRequired={m.voteRequired}
                    versusImg={m.versusImg}
                    onWatch={()=>handleWatch(m.id,m.platform) as any}

                />
            ))}
        </div>
    );
}
