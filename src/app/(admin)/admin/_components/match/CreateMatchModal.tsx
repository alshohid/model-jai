/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useGetAllGamesQuery } from "@/redux/features/game/gameListManagement";
import { useGetAllPlayerQuery } from "@/redux/features/user/userManagement";
import { useCreateMatchMutation } from "@/redux/features/match/matchManagement";

export default function CreateMatchModal({ open, onClose }: any) {

    const [form, setForm] = useState({
        game_id: "",
        player_one_id: "",
        player_two_id: "",
        players_bet_amount: "",
        match_date: "",
        match_time: "",
    });

    const { data: games } = useGetAllGamesQuery();
    const { data: players } = useGetAllPlayerQuery();

    const [createMatch, { isLoading }] = useCreateMatchMutation();

    const handleSubmit = async () => {
        await createMatch({
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
        <AppDialog open={open} onOpenChange={onClose} title="Create Match">

            <div className="space-y-5 py-4">

                {/* Game Select */}
                <div className="space-y-1">
                    <label className="text-sm text-white/70">Game</label>
                    <select
                        onChange={(e) =>
                            setForm({ ...form, game_id: e.target.value })
                        }
                        className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2EC8]"
                    >
                        <option className="text-gray-500">Select Game</option>

                        {games?.data?.map((g: any) => (
                            <option key={g.id} value={g.id} className="text-gray-500">
                                {g.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-white/70">Player One</label>
                    <select
                        onChange={(e) =>
                            setForm({ ...form, player_one_id: e.target.value })
                        }
                        className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2EC8]"
                    >
                        <option className="text-gray-500">Select Player</option>

                        {players?.data?.map((p: any) => (
                            <option key={p.id} value={p.id} className="text-gray-500">
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-white/70">Player Two</label>
                    <select
                        onChange={(e) =>
                            setForm({ ...form, player_two_id: e.target.value })
                        }
                        className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2EC8]"
                    >
                        <option className="text-gray-300">Select Player</option>

                        {players?.data?.map((p: any) => (
                            <option key={p.id} value={p.id} className="text-gray-300">
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bet Amount */}
                <div className="space-y-1">
                    <label className="text-sm text-white/70">Bet Amount</label>
                    <input
                        placeholder="Enter bet amount"
                        onChange={(e) =>
                            setForm({ ...form, players_bet_amount: e.target.value })
                        }
                        className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF2EC8]"
                    />
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-4">

                    <div className="space-y-1">
                        <label className="text-sm text-white/70">Match Date</label>
                        <input
                            type="date"
                            onChange={(e) =>
                                setForm({ ...form, match_date: e.target.value })
                            }
                            className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2EC8]"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-white/70">Match Time</label>
                        <input
                            type="time"
                            onChange={(e) =>
                                setForm({ ...form, match_time: e.target.value })
                            }
                            className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2EC8]"
                        />
                    </div>

                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full h-11 rounded-lg font-medium transition 
                    ${isLoading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-[#FF2EC8] hover:bg-[#ff2ec8e1]"
                        } text-white`}
                >
                    {isLoading ? "Creating Match..." : "Create Match"}
                </button>

            </div>
        </AppDialog>
    );
}