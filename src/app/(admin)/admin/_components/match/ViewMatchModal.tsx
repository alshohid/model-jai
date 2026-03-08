/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppDialog from "@/shared/components/modal/AppDialog";
import { useViewSingleMatchQuery } from "@/redux/features/match/matchManagement";

export default function ViewMatchModal({ matchId, open, onClose }: any) {

    const { data, isLoading } = useViewSingleMatchQuery(matchId, {
        skip: !matchId || !open
    });

    const match = data?.data;

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Match Details">

            {isLoading ? (
                <div className="py-6 text-center text-white">Loading...</div>
            ) : (
                <div className="space-y-4 text-white">

                    <div className="grid grid-cols-2 gap-4">

                        <Info label="Match No" value={match?.match_no} />
                        <Info label="Game" value={match?.game?.name} />

                        <Info label="Player One" value={match?.player_one?.name} />
                        <Info label="Player Two" value={match?.player_two?.name} />

                        <Info label="Player One Bet" value={match?.player_one_bet} />
                        <Info label="Player Two Bet" value={match?.player_two_bet} />

                        <Info label="Winner" value={match?.winner?.name ?? "-"} />

                        <Info label="Match Date" value={match?.match_date} />
                        <Info label="Match Time" value={match?.match_time} />

                        <Info label="TikTok Link" value={match?.tiktok_link} />
                        <Info label="Twitch Link" value={match?.twitch_link} />

                    </div>

                </div>
            )}

        </AppDialog>
    );
}

function Info({ label, value }: any) {
    return (
        <div className="flex flex-col bg-white/5 p-3 rounded-md">
            <span className="text-sm text-white/60">{label}</span>
            <span className="font-medium truncate">{value ?? "-"}</span>
        </div>
    );
}