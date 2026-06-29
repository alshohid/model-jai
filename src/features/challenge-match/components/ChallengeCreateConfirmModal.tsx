"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ChallengeCreateFormValues } from "../types";
import type { GameOption, UserForSelect } from "@/types/challenge/challengeTypes";

interface ChallengeCreateConfirmModalProps {
  open: boolean;
  values: ChallengeCreateFormValues;
  isSubmitting: boolean;
  games: GameOption[];
  users: UserForSelect[];
  onConfirm: () => void;
  onClose: () => void;
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-2 last:border-b-0">
      <span className="text-sm text-white/68">{label}</span>
      <span className="text-sm font-bold text-white">{children}</span>
    </div>
  );
}

export default function ChallengeCreateConfirmModal({
  open,
  values,
  isSubmitting,
  games,
  users,
  onConfirm,
  onClose,
}: ChallengeCreateConfirmModalProps) {
  if (!open) return null;

  const selectedGame = games.find((g) => String(g.id) === values.gameId);
  const selectedUser = users.find(
    (u) => String(u.id) === values.targetPlayerId,
  );

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-[min(92vw,400px)] rounded-[22px] border border-[#d63cff] bg-[#0c0b12]/95 p-5 text-white shadow-[0_0_35px_rgba(214,60,255,0.35)] backdrop-blur-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/70 transition hover:bg-white/12 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <p className="text-center text-xl font-black uppercase italic tracking-wide text-white [text-shadow:0_0_16px_#ff4cff]">
          Confirm Challenge
        </p>

        {/* Summary */}
        <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <SummaryRow label="Game">
            {selectedGame?.name ?? "—"}
          </SummaryRow>

          <SummaryRow label="Price">
            {Number(values.price).toLocaleString()} Points
          </SummaryRow>

          <SummaryRow label="Date & Time">
            {values.matchDateTime
              ? new Date(values.matchDateTime).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "—"}
          </SummaryRow>

          <SummaryRow label="Challenge Type">
            <span className="uppercase">
              {values.scope === "global" ? "Global" : "Unique"}
            </span>
          </SummaryRow>

          {values.scope === "unique" && (
            <SummaryRow label="Target Player">
              {selectedUser?.artist ?? `User #${values.targetPlayerId}`}
            </SummaryRow>
          )}

          <SummaryRow label="Show Real Name">
            {values.showRealName ? "Yes" : "No"}
          </SummaryRow>

          {values.memo && (
            <div className="flex flex-col gap-1 border-b border-white/10 py-2 last:border-b-0">
              <span className="text-sm text-white/68">Memo</span>
              <span className="text-sm font-bold text-white/90">
                {values.memo}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onConfirm}
          className="mt-5 flex h-13 w-full items-center justify-between rounded-xl border border-[#ff43ff]/70 bg-[#4b0057] px-4 text-sm font-black uppercase italic tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,67,255,0.7),inset_0_0_14px_rgba(255,255,255,0.18)] transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5 text-[#ff60ff]" />
          {isSubmitting ? "Submitting..." : "Confirm & Launch"}
          <ChevronRight className="h-5 w-5 text-[#ff60ff]" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 h-10 w-full text-sm font-semibold uppercase text-white/55 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
