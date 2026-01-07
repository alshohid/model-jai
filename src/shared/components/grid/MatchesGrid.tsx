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
};

export default function MatchesGrid({ matches }: { matches: MatchItem[] }) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const handleWatch = (matchId: string) => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/match/${matchId}`);
            return;
        }

        router.push(`/match/${matchId}`);
    };
    return (
        <div className="grid gap-6 w-full sm:grid-cols-2 xl:grid-cols-3 place-items-center">
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
                    onWatch={handleWatch as any}

                />
            ))}
        </div>
    );
}
