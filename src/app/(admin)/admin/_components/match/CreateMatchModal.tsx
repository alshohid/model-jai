"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { User } from "@/types/user/usermanagement";
import { IGame } from "@/types/game/gameList/gameListTypes";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useGetAllGamesQuery } from "@/redux/features/game/gameListManagement";
import { useGetAllPlayerQuery } from "@/redux/features/user/userManagement";
import { useCreateMatchMutation } from "@/redux/features/match/matchManagement";
import {
    ChevronDown,
    createEmptyMatchForm,
    ErrorBanner,
    formatVotingDateTimeForApi,
    Field,
    getMinMatchDateValue,
    getMinVotingDateTimeValue,
    isMatchDateBeforeToday,
    isVotingDateTimeBeforeMin,
    inputCls,
    LogoUploadField,
    MatchFormState,
    normalizeTimeValue,
    readImagePreview,
    selectCls,
    textareaCls,
} from "./matchFormShared";

interface CreateMatchModalProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateMatchModal({
    open,
    onClose,
}: CreateMatchModalProps) {
    const [form, setForm] = useState<MatchFormState>(createEmptyMatchForm());
    const [playerOneLogoPreview, setPlayerOneLogoPreview] = useState<string | null>(
        null,
    );
    const [playerTwoLogoPreview, setPlayerTwoLogoPreview] = useState<string | null>(
        null,
    );
    const [error, setError] = useState("");

    const { data: games } = useGetAllGamesQuery();
    const { data: players } = useGetAllPlayerQuery();
    const [createMatch, { isLoading }] = useCreateMatchMutation();
    const minMatchDate = getMinMatchDateValue();
    const minVotingDateTime = getMinVotingDateTimeValue();

    const setField = <K extends keyof MatchFormState>(
        key: K,
        value: MatchFormState[K],
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (error) {
            setError("");
        }
    };

    const handleLogoChange = async (
        field: "player_one_logo" | "player_two_logo",
        file: File | null,
        setPreview: (value: string | null) => void,
    ) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please choose a valid image file for both player logos.");
            return;
        }

        try {
            const preview = await readImagePreview(file);
            setField(field, file);
            setPreview(preview);
        } catch (previewError) {
            setError(getErrorMessage(previewError));
        }
    };

    const resetForm = () => {
        setForm(createEmptyMatchForm());
        setPlayerOneLogoPreview(null);
        setPlayerTwoLogoPreview(null);
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (
            !form.game_id ||
            !form.player_one_id ||
            !form.player_two_id ||
            !form.players_bet_amount ||
            !form.match_date ||
            !form.match_time
            // !form.voting_time
        ) {
            setError("Please fill in all required fields, including voting time.");
            return;
        }

        if (form.player_one_id === form.player_two_id) {
            setError("Player One and Player Two cannot be the same.");
            return;
        }

        if (Number(form.players_bet_amount) <= 0) {
            setError("Bet amount must be greater than zero.");
            return;
        }

        if (isMatchDateBeforeToday(form.match_date)) {
            setError("Match date cannot be earlier than today.");
            return;
        }

        if (isVotingDateTimeBeforeMin(form.voting_time)) {
            setError("Voting date and time must be now or a future time.");
            return;
        }

        if (!form.player_one_logo || !form.player_two_logo) {
            setError("Please upload both player logos before creating the match.");
            return;
        }

        try {
            const response = await createMatch({
                game_id: Number(form.game_id),
                player_one_id: Number(form.player_one_id),
                player_two_id: Number(form.player_two_id),
                players_bet_amount: Number(form.players_bet_amount),
                match_date: form.match_date,
                match_time: normalizeTimeValue(form.match_time),
                voting_time: formatVotingDateTimeForApi(form.voting_time),
                type: "upcoming",
                winner_percentage: Number(form.winner_percentage),
                loser_percentage: Number(form.loser_percentage),
                tiktok_link: form.tiktok_link.trim(),
                twitch_link: form.twitch_link.trim(),
                rules: form.rules.trim(),
                player_one_logo: form.player_one_logo,
                player_two_logo: form.player_two_logo,
            }).unwrap();

            toast.success(response?.message ?? "Match created successfully");
            handleClose();
        } catch (submitError) {
            const message = getErrorMessage(submitError);
            setError(message);
            toast.error(message);
        }
    };

    const playerList = players?.data ?? [];
    const filteredPlayerOne = playerList.filter(
        (player: User) => player.id !== Number(form.player_two_id),
    );
    const filteredPlayerTwo = playerList.filter(
        (player: User) => player.id !== Number(form.player_one_id),
    );

    return (
        <AppDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) handleClose();
            }}
            title="Create Match"
            className="max-w-[720px]"
            bodyClassName="pb-4 sm:pb-6"
        >
            <form onSubmit={handleSubmit} className="space-y-4 py-3 sm:space-y-5 sm:py-4">
                <ErrorBanner message={error} />

                <Field label="Game" required>
                    <div className="relative">
                        <select
                            value={form.game_id}
                            onChange={(event) => setField("game_id", event.target.value)}
                            className={selectCls}
                        >
                            <option value="" className="bg-[#1a1a1f]">
                                Select a game
                            </option>
                            {games?.data?.map((game: IGame) => (
                                <option
                                    key={game.id}
                                    value={game.id}
                                    className="bg-[#1a1a1f]"
                                >
                                    {game.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown />
                    </div>
                </Field>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Player One" required>
                        <div className="relative">
                            <select
                                value={form.player_one_id}
                                onChange={(event) =>
                                    setField("player_one_id", event.target.value)
                                }
                                className={selectCls}
                            >
                                <option value="" className="bg-[#1a1a1f]">
                                    Select player
                                </option>
                                {filteredPlayerOne.map((player: User) => (
                                    <option
                                        key={player.id}
                                        value={player.id}
                                        className="bg-[#1a1a1f]"
                                    >
                                        {player.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>
                    </Field>

                    <Field label="Player Two" required>
                        <div className="relative">
                            <select
                                value={form.player_two_id}
                                onChange={(event) =>
                                    setField("player_two_id", event.target.value)
                                }
                                className={selectCls}
                            >
                                <option value="" className="bg-[#1a1a1f]">
                                    Select player
                                </option>
                                {filteredPlayerTwo.map((player: User) => (
                                    <option
                                        key={player.id}
                                        value={player.id}
                                        className="bg-[#1a1a1f]"
                                    >
                                        {player.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown />
                        </div>
                    </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <LogoUploadField
                        label="Player One Logo"
                        inputId="create-player-one-logo"
                        previewSrc={playerOneLogoPreview}
                        fileName={form.player_one_logo?.name ?? null}
                        required
                        helperText=""
                        onFileChange={(file) =>
                            handleLogoChange(
                                "player_one_logo",
                                file,
                                setPlayerOneLogoPreview,
                            )
                        }
                        onClear={() => {
                            setField("player_one_logo", null);
                            setPlayerOneLogoPreview(null);
                        }}
                    />

                    <LogoUploadField
                        label="Player Two Logo"
                        inputId="create-player-two-logo"
                        previewSrc={playerTwoLogoPreview}
                        fileName={form.player_two_logo?.name ?? null}
                        required
                        helperText=""
                        onFileChange={(file) =>
                            handleLogoChange(
                                "player_two_logo",
                                file,
                                setPlayerTwoLogoPreview,
                            )
                        }
                        onClear={() => {
                            setField("player_two_logo", null);
                            setPlayerTwoLogoPreview(null);
                        }}
                    />
                </div>

                <Field label="Bet Amount" required>
                    <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0.00"
                        value={form.players_bet_amount}
                        onChange={(event) =>
                            setField("players_bet_amount", event.target.value)
                        }
                        className={inputCls}
                    />
                </Field>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="TikTok Live Link">
                        <input
                            type="url"
                            placeholder="https://tiktok.com/..."
                            value={form.tiktok_link}
                            onChange={(event) =>
                                setField("tiktok_link", event.target.value)
                            }
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Twitch Live Link">
                        <input
                            type="url"
                            placeholder="https://twitch.tv/..."
                            value={form.twitch_link}
                            onChange={(event) =>
                                setField("twitch_link", event.target.value)
                            }
                            className={inputCls}
                        />
                    </Field>
                </div>

                <Field label="Percentage Settings">
                    <div className="flex flex-col gap-3 md:flex-row">
                        {(["winner_percentage", "loser_percentage"] as const).map(
                            (key) => {
                                const label =
                                    key === "winner_percentage"
                                        ? "Winner %"
                                        : "Loser %";
                                const checked = form[key] === 1;

                                return (
                                    <label
                                        key={key}
                                        className={`
                                            flex h-11 flex-1 cursor-pointer items-center gap-2.5 rounded-lg border px-3.5
                                            text-sm font-medium transition-all duration-200
                                            ${checked
                                                ? "border-[#FF2EC8]/60 bg-[#FF2EC8]/8 text-[#FF2EC8]"
                                                : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                                            }
                                        `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(event) =>
                                                setField(key, event.target.checked ? 1 : 0)
                                            }
                                            className="sr-only"
                                        />
                                        <span
                                            className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all duration-200 ${checked
                                                ? "border-[#FF2EC8] bg-[#FF2EC8]"
                                                : "border-white/20 bg-white/5"
                                                }`}
                                        >
                                            {checked ? (
                                                <svg
                                                    width="9"
                                                    height="7"
                                                    viewBox="0 0 9 7"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M1 3L3.5 5.5L8 1"
                                                        stroke="white"
                                                        strokeWidth="1.6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : null}
                                        </span>
                                        {label}
                                    </label>
                                );
                            },
                        )}
                    </div>
                </Field>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Field label="Match Date" required>
                        <input
                            type="date"
                            value={form.match_date}
                            min={minMatchDate}
                            onChange={(event) =>
                                setField("match_date", event.target.value)
                            }
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Match Time" required>
                        <input
                            type="time"
                            value={form.match_time}
                            onChange={(event) =>
                                setField("match_time", event.target.value)
                            }
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Voting Date&Time">
                        <div className="relative">
                            <input
                                type="datetime-local"
                                value={form.voting_time}
                                min={minVotingDateTime}
                                step="60"
                                onChange={(event) =>
                                    setField("voting_time", event.target.value)
                                }
                                required={false}
                                className={inputCls}
                            />

                        </div>
                    </Field>
                </div>

                <Field label="Match Rules">
                    <textarea
                        rows={4}
                        placeholder="Describe the match rules, conditions, or any special instructions..."
                        value={form.rules}
                        onChange={(event) => setField("rules", event.target.value)}
                        className={textareaCls}
                    />
                </Field>

                <div className="border-t border-white/8" />

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                        h-11 w-full rounded-lg text-sm font-semibold tracking-wide transition-all duration-200
                        ${isLoading
                            ? "cursor-not-allowed bg-white/10 text-white/30"
                            : "bg-[#FF2EC8] text-white shadow-[0_0_20px_rgba(255,46,200,0.3)] hover:bg-[#ff48d0] hover:shadow-[0_0_28px_rgba(255,46,200,0.45)] active:scale-[0.98]"
                        }
                    `}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white/80" />
                            Creating Match...
                        </span>
                    ) : (
                        "Create Match"
                    )}
                </button>
            </form>
        </AppDialog>
    );
}
