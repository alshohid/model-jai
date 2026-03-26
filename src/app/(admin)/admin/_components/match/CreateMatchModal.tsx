"use client";

import { useState } from "react";
import { User } from "@/types/user/usermanagement";
import { IGame } from "@/types/game/gameList/gameListTypes";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useGetAllGamesQuery } from "@/redux/features/game/gameListManagement";
import { useGetAllPlayerQuery } from "@/redux/features/user/userManagement";
import { useCreateMatchMutation } from "@/redux/features/match/matchManagement";
import { ChevronDownCircle } from "lucide-react";

// ── Reusable field wrapper ──────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/45">
                {label}
                {required && <span className="ml-1 text-[#FF2EC8]">*</span>}
            </label>
            {children}
        </div>
    );
}

const inputCls =
    "w-full h-11 px-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/5 transition-all duration-200";

const selectCls =
    "w-full h-11 px-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/5 transition-all duration-200 appearance-none";

// Chevron down icon for selects
const ChevronDown = () => {
    return (
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    )
};

interface CreateMatchModalProps {
    open: boolean;
    onClose: () => void;
}

interface MatchFormState {
    game_id: string;
    player_one_id: string;
    player_two_id: string;
    players_bet_amount: string;
    match_date: string;
    match_time: string;
    type: string;
    winner_percentage: number;
    loser_percentage: number;
    tiktok_link: string;
    twitch_link: string;
    rules: string;
}

export default function CreateMatchModal({ open, onClose }: CreateMatchModalProps) {
    const [form, setForm] = useState<MatchFormState>({
        game_id: "",
        player_one_id: "",
        player_two_id: "",
        players_bet_amount: "",
        match_date: "",
        match_time: "",
        type: "",
        winner_percentage: 0,
        loser_percentage: 0,
        tiktok_link: "",
        twitch_link: "",
        rules: "",
    });

    const { data: games } = useGetAllGamesQuery();
    const { data: players } = useGetAllPlayerQuery();
    const [createMatch, { isLoading }] = useCreateMatchMutation();
    const [error, setError] = useState("");

    const set = (key: keyof MatchFormState, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async () => {
        if (!form.game_id || !form.player_one_id || !form.player_two_id || !form.players_bet_amount || !form.match_date || !form.match_time) {
            setError("Please fill in all required fields.");
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
                type: "upcoming",
                winner_percentage: Number(form.winner_percentage),
                loser_percentage: Number(form.loser_percentage),
            }).unwrap();

            setForm({
                game_id: "", player_one_id: "", player_two_id: "",
                players_bet_amount: "", match_date: "", match_time: "",
                type: "upcoming", winner_percentage: 0, loser_percentage: 0,
                twitch_link: "", tiktok_link: "", rules: "",
            });
            setError("");
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredPlayerOne = players?.data?.filter((p: User) => p.id !== Number(form.player_two_id));
    const filteredPlayerTwo = players?.data?.filter((p: User) => p.id !== Number(form.player_one_id));

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Create Match">
            <div className="py-4 space-y-5">

                {/* ── Error Banner ── */}
                {error && (
                    <div className="flex items-center gap-2.5 text-red-400 text-[13px] bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 rounded-lg">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* ── Game ── */}
                <Field label="Game" required>
                    <div className="relative">
                        <select value={form.game_id} onChange={(e) => set("game_id", e.target.value)} className={selectCls}>
                            <option value="" className="bg-[#1a1a1f]">Select a game</option>
                            {games?.data?.map((g: IGame) => (
                                <option key={g.id} value={g.id} className="bg-[#1a1a1f]">{g.name}</option>
                            ))}
                        </select>
                        <ChevronDown />
                    </div>
                </Field>

                {/* ── Players ── */}
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Player One" required>
                        <div className="relative">
                            <select value={form.player_one_id} onChange={(e) => set("player_one_id", e.target.value)} className={selectCls}>
                                <option value="" className="bg-[#1a1a1f]">Select player</option>
                                {filteredPlayerOne?.map((p: User) => (
                                    <option key={p.id} value={p.id} className="bg-[#1a1a1f]">{p.name}</option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>
                    </Field>

                    <Field label="Player Two" required>
                        <div className="relative">
                            <select value={form.player_two_id} onChange={(e) => set("player_two_id", e.target.value)} className={selectCls}>
                                <option value="" className="bg-[#1a1a1f]">Select player</option>
                                {filteredPlayerTwo?.map((p: User) => (
                                    <option key={p.id} value={p.id} className="bg-[#1a1a1f]">{p.name}</option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>
                    </Field>
                </div>

                {/* ── Bet Amount ── */}
                <Field label="Bet Amount" required>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={form.players_bet_amount}
                        onChange={(e) => set("players_bet_amount", e.target.value)}
                        className={inputCls}
                    />
                </Field>

                {/* ── Live Links ── */}
                <div className="grid grid-cols-2 gap-3">
                    <Field label="TikTok Live Link">
                        <input
                            type="url"
                            placeholder="https://tiktok.com/..."
                            value={form.tiktok_link}
                            onChange={(e) => set("tiktok_link", e.target.value)}
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Twitch Live Link">
                        <input
                            type="url"
                            placeholder="https://twitch.tv/..."
                            value={form.twitch_link}
                            onChange={(e) => set("twitch_link", e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                </div>

                {/* ── Percentage Settings ── */}
                <Field label="Percentage Settings">
                    <div className="flex gap-3">
                        {(["winner_percentage", "loser_percentage"] as const).map((key) => {
                            const label = key === "winner_percentage" ? "Winner %" : "Loser %";
                            const checked = form[key] === 1;
                            return (
                                <label
                                    key={key}
                                    className={`
                                        flex items-center gap-2.5 flex-1 h-11 px-3.5 rounded-lg border cursor-pointer
                                        transition-all duration-200 text-sm font-medium
                                        ${checked
                                            ? "border-[#FF2EC8]/60 bg-[#FF2EC8]/8 text-[#FF2EC8]"
                                            : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                                        }
                                    `}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => set(key, e.target.checked ? 1 : 0)}
                                        className="sr-only"
                                    />
                                    {/* Custom checkbox */}
                                    <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all duration-200 ${checked ? "bg-[#FF2EC8] border-[#FF2EC8]" : "border-white/20 bg-white/5"}`}>
                                        {checked && (
                                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                                <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </span>
                                    {label}
                                </label>
                            );
                        })}
                    </div>
                </Field>

                {/* ── Date + Time ── */}
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Match Date" required>
                        <input
                            type="date"
                            value={form.match_date}
                            onChange={(e) => set("match_date", e.target.value)}
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Match Time" required>
                        <input
                            type="time"
                            value={form.match_time}
                            onChange={(e) => set("match_time", e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                </div>

                {/* ── Rules ── */}
                <Field label="Match Rules">
                    <textarea
                        rows={4}
                        placeholder="Describe the match rules, conditions, or any special instructions..."
                        value={form.rules}
                        onChange={(e) => set("rules", e.target.value)}
                        className="w-full px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/5 transition-all duration-200 resize-none leading-relaxed"
                    />
                </Field>

                {/* ── Divider ── */}
                <div className="border-t border-white/8" />

                {/* ── Submit ── */}
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`
                        w-full h-11 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200
                        ${isLoading
                            ? "bg-white/10 text-white/30 cursor-not-allowed"
                            : "bg-[#FF2EC8] hover:bg-[#ff48d0] active:scale-[0.98] text-white shadow-[0_0_20px_rgba(255,46,200,0.3)] hover:shadow-[0_0_28px_rgba(255,46,200,0.45)]"
                        }
                    `}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
                            Creating Match...
                        </span>
                    ) : (
                        "Create Match"
                    )}
                </button>

            </div>
        </AppDialog>
    );
}