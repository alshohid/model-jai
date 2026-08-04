"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import AppSelect from "@/app/(admin)/admin/_components/reusable/AppSelect";
import {
    Field,
    inputCls,
} from "@/app/(admin)/admin/_components/match/matchFormShared";
import { IGame } from "@/types/game/gameList/gameListTypes";
import { ICreatePopularArtistPayload } from "@/types/match/popularArtistTypes";
import { User } from "@/types/user/usermanagement";

type Mode = "create" | "edit";

type Props = {
    open: boolean;
    mode: Mode;
    games?: IGame[];
    players?: User[];
    initialValues?: ICreatePopularArtistPayload;
    errorMessage?: string;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (payload: ICreatePopularArtistPayload) => Promise<void>;
};

type FormState = {
    gameId: string;
    playerOneId: string;
    playerTwoId: string;
    startTime: string;
    endTime: string;
};

const createInitialState = (
    values?: ICreatePopularArtistPayload,
): FormState => ({
    gameId: values ? String(values.game_id) : "",
    playerOneId: values ? String(values.player_one_id) : "",
    playerTwoId: values ? String(values.player_two_id) : "",
    startTime: values?.start_time ? toDateTimeLocalValue(values.start_time) : "",
    endTime: values?.end_time ? toDateTimeLocalValue(values.end_time) : "",
});

const toDateTimeLocalValue = (value: string) => {
    const normalized = value.trim().replace(" ", "T");
    return normalized.slice(0, 16);
};

const toApiDateTime = (value: string) => {
    const normalized = value.trim().replace("T", " ");
    return normalized.length === 16 ? `${normalized}:00` : normalized;
};

export default function PopularArtistFormDialog({
    open,
    mode,
    games,
    players,
    initialValues,
    errorMessage,
    isSubmitting = false,
    onClose,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<FormState>(() =>
        createInitialState(initialValues),
    );
    const [localError, setLocalError] = useState("");

    const handleChange = (field: keyof FormState, value: string) => {
        setForm((prev) => {
            if (field === "playerOneId") {
                return {
                    ...prev,
                    playerOneId: value,
                    playerTwoId: prev.playerTwoId === value ? "" : prev.playerTwoId,
                };
            }

            if (field === "playerTwoId") {
                return {
                    ...prev,
                    playerTwoId: value,
                    playerOneId: prev.playerOneId === value ? "" : prev.playerOneId,
                };
            }

            return { ...prev, [field]: value };
        });
        if (localError) setLocalError("");
    };

    const playerOneOptions =
        players
            ?.filter((player) => String(player.id) !== form.playerTwoId)
            .map((player) => ({
                label: player.name,
                value: String(player.id),
            })) ?? [];

    const playerTwoOptions =
        players
            ?.filter((player) => String(player.id) !== form.playerOneId)
            .map((player) => ({
                label: player.name,
                value: String(player.id),
            })) ?? [];

    const gameOptions =
        games?.map((game) => ({
            label: game.name,
            value: String(game.id),
        })) ?? [];

    const handleSubmit = async () => {
        if (
            !form.gameId ||
            !form.playerOneId ||
            !form.playerTwoId ||
            !form.startTime ||
            !form.endTime
        ) {
            setLocalError(
                "Game, both players, start time, and end time are required.",
            );
            return;
        }
        if (form.playerOneId === form.playerTwoId) {
            setLocalError("Player one and player two must be different.");
            return;
        }
        if (new Date(form.endTime) <= new Date(form.startTime)) {
            setLocalError("End time must be later than start time.");
            return;
        }
        setLocalError("");

        await onSubmit({
            game_id: Number(form.gameId),
            player_one_id: Number(form.playerOneId),
            player_two_id: Number(form.playerTwoId),
            start_time: toApiDateTime(form.startTime),
            end_time: toApiDateTime(form.endTime),
        });
    };

    const title =
        mode === "create" ? "Create Voting Match" : "Edit Voting Match";

    return (
        <AppDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onClose();
            }}
            title={title}
            className="max-w-[560px]"
        >
            <div className="space-y-5 py-2">
                {(localError || errorMessage) && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {localError || errorMessage}
                    </div>
                )}

                <Field label="Game" required>
                    <AppSelect
                        value={form.gameId}
                        onValueChange={(value) => handleChange("gameId", value)}
                        options={gameOptions}
                        placeholder="Select one"
                    />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Player One" required>
                        <AppSelect
                            value={form.playerOneId}
                            onValueChange={(value) =>
                                handleChange("playerOneId", value)
                            }
                            options={playerOneOptions}
                            placeholder="Select one"
                        />
                    </Field>

                    <Field label="Player Two" required>
                        <AppSelect
                            value={form.playerTwoId}
                            onValueChange={(value) =>
                                handleChange("playerTwoId", value)
                            }
                            options={playerTwoOptions}
                            placeholder="Select one"
                        />
                    </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Start Time" required>
                        <input
                            type="datetime-local"
                            step={60}
                            value={form.startTime}
                            onChange={(event) =>
                                handleChange("startTime", event.target.value)
                            }
                            className={inputCls}
                        />
                    </Field>

                    <Field label="End Time" required>
                        <input
                            type="datetime-local"
                            step={60}
                            value={form.endTime}
                            min={form.startTime || undefined}
                            onChange={(event) =>
                                handleChange("endTime", event.target.value)
                            }
                            className={inputCls}
                        />
                    </Field>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 flex-1 rounded-lg bg-white/10 text-sm font-medium text-white transition hover:bg-white/15"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`h-11 flex-1 rounded-lg text-sm font-medium text-white transition ${
                            isSubmitting
                                ? "cursor-not-allowed bg-white/20"
                                : "cursor-pointer bg-[#FF2EC8] hover:bg-[#ff48d0]"
                        }`}
                    >
                        {isSubmitting
                            ? "Saving..."
                            : mode === "create"
                              ? "Create Vote"
                              : "Save Changes"}
                    </button>
                </div>
            </div>
        </AppDialog>
    );
}
