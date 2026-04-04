"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
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

const selectCls =
  "w-full rounded-lg border border-gray-600 px-3.5 py-3 text-sm text-gray-400 placeholder:text-white focus:outline-none focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/5 transition";

const inputCls =
  "w-full rounded-lg border border-gray-600 px-3.5 py-3 text-sm text-gray-200 placeholder:text-white/35 focus:outline-none focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/5 transition";

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
        {label}
        {required && <span className="ml-1 text-[#FF2EC8]">*</span>}
      </label>
      {children}
    </div>
  );
};



const createInitialState = (
  values?: ICreatePopularArtistPayload
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
    createInitialState(initialValues)
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
  };

  const playerOneOptions = players?.filter(
    (player) => String(player.id) !== form.playerTwoId
  );
  const playerTwoOptions = players?.filter(
    (player) => String(player.id) !== form.playerOneId
  );

  const handleSubmit = async () => {
    if (
      !form.gameId ||
      !form.playerOneId ||
      !form.playerTwoId ||
      !form.startTime ||
      !form.endTime
    ) {
      setLocalError("Game, both players, start time, and end time are required.");
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
    mode === "create" ? "Create New Voting Match" : "Edit Voting Match";

  return (
    <AppDialog open={open} onOpenChange={onClose} title={title}>
      <div className="space-y-4">
        {(localError || errorMessage) && (
          <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {localError || errorMessage}
          </div>
        )}

        <Field label="Game" required>
          <div className="relative">
            <select
              value={form.gameId}
              onChange={(event) => handleChange("gameId", event.target.value)}
              className={selectCls}
            >
              <option value="">Select a game</option>
              {games?.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
            {/* <ChevronDown /> */}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Player One" required>
            <div className="relative">
              <select
                value={form.playerOneId}
                onChange={(event) => handleChange("playerOneId", event.target.value)}
                className={selectCls}
              >
                <option value="">Player one</option>
                {playerOneOptions?.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
              {/* <ChevronDown /> */}
            </div>
          </Field>

          <Field label="Player Two" required>
            <div className="relative">
              <select
                value={form.playerTwoId}
                onChange={(event) => handleChange("playerTwoId", event.target.value)}
                className={selectCls}
              >
                <option value="">Player two</option>
                {playerTwoOptions?.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
              {/* <ChevronDown /> */}
            </div>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start Time" required>
            <input
              type="datetime-local"
              step={60}
              value={form.startTime}
              onChange={(event) => handleChange("startTime", event.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="End Time" required>
            <input
              type="datetime-local"
              step={60}
              value={form.endTime}
              min={form.startTime || undefined}
              onChange={(event) => handleChange("endTime", event.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-gradient-to-r from-[#FF2EC8] to-[#5A33FF] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mode === "create" ? "Create Vote" : "Save Changes"}
          </button>
        </div>
      </div>
    </AppDialog>
  );
}
