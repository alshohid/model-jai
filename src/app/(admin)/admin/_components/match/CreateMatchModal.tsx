/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useGetAllGamesQuery } from "@/redux/features/game/gameListManagement";
import { useGetAllPlayerQuery } from "@/redux/features/user/userManagement";
import { useCreateMatchMutation } from "@/redux/features/match/matchManagement";
import { MatchType } from "@/types/match/MatchManagementTypes";

export default function CreateMatchModal({ open, onClose }: any) {

    const [form, setForm] = useState({
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

    const { data: games } = useGetAllGamesQuery();
    const { data: players } = useGetAllPlayerQuery();

    const [createMatch, { isLoading }] = useCreateMatchMutation();
    const [error, setError] = useState("");

    const handleSubmit = async () => {

        if (
            !form.game_id ||
            !form.player_one_id ||
            !form.player_two_id ||
            !form.players_bet_amount ||
            !form.match_date ||
            !form.match_time ||
            !form.type
        ) {
            setError("All fields are required.");
            return;
        }

        if (form.player_one_id === form.player_two_id) {
            setError("Player One and Player Two cannot be the same.");
            return;
        }

        try {

            await createMatch({
                ...form,
                game_id: Number(form.game_id),
                player_one_id: Number(form.player_one_id),
                player_two_id: Number(form.player_two_id),
                players_bet_amount: Number(form.players_bet_amount),
                type: form.type as MatchType,
                winner_percentage: Number(form.winner_percentage),
                loser_percentage: Number(form.loser_percentage),
            }).unwrap();

            setForm({
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

            setError("");
            onClose();

        } catch (err) {
            console.error(err);
        }
    };

    const filteredPlayerOne =
        players?.data?.filter((p: any) => p.id !== Number(form.player_two_id));

    const filteredPlayerTwo =
        players?.data?.filter((p: any) => p.id !== Number(form.player_one_id));

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Create Match">

            <div className="space-y-5 py-4">

                {error && (
                    <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md">
                        {error}
                    </div>
                )}

                {/* Game */}
                <div className="space-y-1">
                    <label className="text-sm text-white/70">Game *</label>

                    <select
                        value={form.game_id}
                        onChange={(e) =>
                            setForm({ ...form, game_id: e.target.value })
                        }
                        className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white"
                    >
                        <option value="" className="text-black">
                            Select Game
                        </option>

                        {games?.data?.map((g: any) => (
                            <option key={g.id} value={g.id} className="text-black">
                                {g.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Player One */}
                <div className="space-y-1">
                    <label className="text-sm text-white/70">Player One *</label>

                    <select
                        value={form.player_one_id}
                        onChange={(e) =>
                            setForm({ ...form, player_one_id: e.target.value })
                        }
                        className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white"
                    >
                        <option value="" className="text-black">
                            Select Player
                        </option>

                        {filteredPlayerOne?.map((p: any) => (
                            <option key={p.id} value={p.id} className="text-black">
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Player Two */}
                <div className="space-y-1">
                    <label className="text-sm text-white/70">Player Two *</label>

                    <select
                        value={form.player_two_id}
                        onChange={(e) =>
                            setForm({ ...form, player_two_id: e.target.value })
                        }
                        className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white"
                    >
                        <option value="" className="text-black">
                            Select Player
                        </option>

                        {filteredPlayerTwo?.map((p: any) => (
                            <option key={p.id} value={p.id} className="text-black">
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bet Amount */}
                <div className="space-y-1">
                    <label className="text-sm text-white/70">Bet Amount *</label>

                    <input
                        type="number"
                        placeholder="Enter bet amount"
                        value={form.players_bet_amount}
                        onChange={(e) =>
                            setForm({ ...form, players_bet_amount: e.target.value })
                        }
                        className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white"
                    />
                </div>

                {/* Game Type */}
                <div className="space-y-1">
                    <label className="text-sm text-white/70">Match Type *</label>

                    <select
                        value={form.type}
                        onChange={(e) =>
                            setForm({ ...form, type: e.target.value })
                        }
                        className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white"
                    >
                        <option value="" className="text-black">
                            Select Type
                        </option>

                        {["live", "upcoming", "completed"].map((t) => (
                            <option key={t} value={t} className="text-black">
                                {t}
                            </option>
                        ))}
                    </select>
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

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-4">

                    <div className="space-y-1">
                        <label className="text-sm text-white/70">Match Date *</label>

                        <input
                            type="date"
                            value={form.match_date}
                            onChange={(e) =>
                                setForm({ ...form, match_date: e.target.value })
                            }
                            className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-white/70">Match Time *</label>

                        <input
                            type="time"
                            value={form.match_time}
                            onChange={(e) =>
                                setForm({ ...form, match_time: e.target.value })
                            }
                            className="w-full h-11 px-3 rounded-lg bg-[#1F1F23] border border-white/10 text-white"
                        />
                    </div>

                </div>

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