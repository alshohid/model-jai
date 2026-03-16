/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useUpdateMatchMutation, useViewSingleMatchQuery } from "@/redux/features/match/matchManagement";
import { useGetAllGamesQuery } from "@/redux/features/game/gameListManagement";
import { useGetAllPlayerQuery } from "@/redux/features/user/userManagement";
import { EditMatchSkeleton } from "./EditMatchSkeleton";

export default function EditMatchModal({ matchId, open, onClose }: any) {

    const { data, isLoading } = useViewSingleMatchQuery(matchId, { skip: !matchId || !open });

    const { data: games } = useGetAllGamesQuery();
    const { data: players } = useGetAllPlayerQuery();

    const [updateMatch, { isLoading: isMatchUpdateLoading }] = useUpdateMatchMutation();

    const [form, setForm] = useState<any>({
        game_id: "",
        player_one_id: "",
        player_two_id: "",
        players_bet_amount: "",
        match_date: "",
        match_time: "",
        type: "upcoming",
        winner_percentage: 0,
        loser_percentage: 0,
        tiktok_link: "",
        twitch_link: "",
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
                tiktok_link: m.tiktok_link,
                twitch_link: m.twitch_link
            });
        }

    }, [data]);

    const handleSubmit = async () => {
        const matchTime = form.match_time?.slice(0, 5);
        await updateMatch({
            id: matchId,
            game_id: Number(form.game_id),
            player_one_id: Number(form.player_one_id),
            player_two_id: Number(form.player_two_id),
            players_bet_amount: Number(form.players_bet_amount),
            match_date: form.match_date,
            match_time: matchTime,
            type: "upcoming",
            winner_percentage: form.winner_percentage,
            loser_percentage: form.loser_percentage,
            tiktok_link: form.tiktok_link,
            twitch_link: form.twitch_link,
        }).unwrap();

        onClose();
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Edit Match">
            {
                isLoading ? (
                    <EditMatchSkeleton />
                )
                    : (<div className="space-y-4 py-4">

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

                        <div className="space-y-1">
                            <label className="text-sm text-white/70">TikTok Live Link</label>

                            <input
                                type="url"
                                placeholder="https://tiktok.com/..."
                                value={form.tiktok_link}
                                onChange={(e) =>
                                    setForm({ ...form, tiktok_link: e.target.value })
                                }
                                className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-white/70">Twitch Live Link</label>

                            <input
                                type="url"
                                placeholder="https://twitch.tv/..."
                                value={form.twitch_link}
                                onChange={(e) =>
                                    setForm({ ...form, twitch_link: e.target.value })
                                }
                                className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#FF2EC8]"
                            />
                        </div>
                        <div className="space-y-2">

                            <label className="text-sm text-white/70">Percentage Settings</label>

                            <div className="flex gap-6">

                                {/* Winner Percentage */}
                                <label className="flex items-center gap-2 text-white/80 cursor-pointer">

                                    <input
                                        type="checkbox"
                                        checked={form.winner_percentage === 1}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                winner_percentage: e.target.checked ? 1 : 0,
                                            })
                                        }
                                        className="w-4 h-4 accent-[#FF2EC8]"
                                    />

                                    Winner Percentage
                                </label>

                                {/* Loser Percentage */}
                                <label className="flex items-center gap-2 text-white/80 cursor-pointer">

                                    <input
                                        type="checkbox"
                                        checked={form.loser_percentage === 1}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                loser_percentage: e.target.checked ? 1 : 0,
                                            })
                                        }
                                        className="w-4 h-4 accent-[#FF2EC8]"
                                    />

                                    Loser Percentage
                                </label>

                            </div>

                        </div>

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
                            disabled={isMatchUpdateLoading}
                            className={`w-full h-10 bg-[#FF2EC8] text-white rounded-md ${isMatchUpdateLoading ? "cursor-not-allowed bg-[#673259]" : ""}`}
                        >
                            {isMatchUpdateLoading ? "Updating..." : "Update Match"}
                        </button>

                    </div>)
            }


        </AppDialog >
    );
}