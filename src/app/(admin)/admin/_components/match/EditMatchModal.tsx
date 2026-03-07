/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useUpdateMatchMutation, useViewSingleMatchQuery } from "@/redux/features/match/matchManagement";
import { useGetAllGamesQuery } from "@/redux/features/game/gameListManagement";
import { useGetAllPlayerQuery } from "@/redux/features/user/userManagement";

export default function EditMatchModal({ matchId, open, onClose }: any) {

    const { data } = useViewSingleMatchQuery(matchId, { skip: !matchId || !open });

    const { data: games } = useGetAllGamesQuery();
    const { data: players } = useGetAllPlayerQuery();

    const [updateMatch, { isLoading }] = useUpdateMatchMutation();

    const [form, setForm] = useState<any>({
        game_id: "",
        player_one_id: "",
        player_two_id: "",
        players_bet_amount: "",
        match_date: "",
        match_time: "",
        type: "",
        winner_percentage: 0,
        loser_percentage: 0,
    });

    useEffect(() => {

        if (data?.data) {
            const m = data.data;

            setForm({
                game_id: m.game_id,
                player_one_id: m.player_one_id,
                player_two_id: m.player_two_id,
                players_bet_amount: m.player_one_bet,
                match_date: m.match_date,
                match_time: m.match_time,
                type: m.type,
                winner_percentage: m.winner_percentage,
                loser_percentage: m.loser_percentage,
            });
        }

    }, [data]);

    const handleSubmit = async () => {

        await updateMatch({
            id: matchId,
            ...form,
            game_id: Number(form.game_id),
            player_one_id: Number(form.player_one_id),
            player_two_id: Number(form.player_two_id),
            players_bet_amount: Number(form.players_bet_amount),
            type: "upcoming",
            winner_percentage: 1,
            loser_percentage: 1,
        }).unwrap();

        onClose();
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Edit Match">

            <div className="space-y-4 py-4">

                {/* Game */}
                <select
                    value={form.game_id}
                    onChange={(e) => setForm({ ...form, game_id: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                >
                    {games?.data?.map((g: any) => (
                        <option key={g.id} value={g.id} className="text-black">
                            {g.name}
                        </option>
                    ))}
                </select>

                {/* Player One */}
                <select
                    value={form.player_one_id}
                    onChange={(e) => setForm({ ...form, player_one_id: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                >
                    {players?.data?.map((p: any) => (
                        <option key={p.id} value={p.id} className="text-black">
                            {p.name}
                        </option>
                    ))}
                </select>

                {/* Player Two */}
                <select
                    value={form.player_two_id}
                    onChange={(e) => setForm({ ...form, player_two_id: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                >
                    {players?.data?.map((p: any) => (
                        <option key={p.id} value={p.id} className="text-black">
                            {p.name}
                        </option>
                    ))}
                </select>

                {/* Bet */}
                <input
                    value={form.players_bet_amount}
                    onChange={(e) =>
                        setForm({ ...form, players_bet_amount: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                />

                {/* Date */}
                <input
                    type="date"
                    value={form.match_date}
                    onChange={(e) =>
                        setForm({ ...form, match_date: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                />

                {/* Time */}
                <input
                    type="time"
                    value={form.match_time}
                    onChange={(e) =>
                        setForm({ ...form, match_time: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-md bg-white/10 text-white"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full h-10 bg-[#FF2EC8] text-white rounded-md"
                >
                    {isLoading ? "Updating..." : "Update Match"}
                </button>

            </div>

        </AppDialog>
    );
}