"use client";

import Image from "next/image";
import { AlertTriangle, Check, X } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import type { ChallengeMatchOffer } from "../types";
import { formatChallengeCurrency } from "../utils";

type ChallengeAcceptDialogProps = {
  offer: ChallengeMatchOffer | null;
  open: boolean;
  balance: number;
  outcome: "confirm" | "success" | "insufficient" | "error";
  agreed: boolean;
  onAgreeChange: (value: boolean) => void;
  onConfirm: () => void;
  onClose: () => void;
  errorMessage?: string;
};

function DialogShell({
  children,
  tone = "purple",
}: {
  children: React.ReactNode;
  tone?: "purple" | "green" | "red";
}) {
  const toneClass = {
    purple: "border-[#d63cff] shadow-[0_0_35px_rgba(214,60,255,0.35)]",
    green: "border-[#42ff35] shadow-[0_0_35px_rgba(66,255,53,0.3)]",
    red: "border-[#ff354f] shadow-[0_0_35px_rgba(255,53,79,0.3)]",
  }[tone];

  return (
    <div
      className={cn(
        "relative w-[min(92vw,380px)] rounded-[22px] border bg-[#0c0b12]/95 p-5 text-white backdrop-blur-xl",
        toneClass,
      )}
    >
      {children}
    </div>
  );
}

function StatLine({
  label,
  value,
  danger = false,
  success = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
  success?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-3 last:border-b-0">
      <span className="text-sm text-white/68">{label}</span>
      <span
        className={cn(
          "text-sm font-bold text-white",
          danger && "text-[#ff4058]",
          success && "text-[#54ff48]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function ChallengeAcceptDialog({
  offer,
  open,
  balance,
  outcome,
  agreed,
  errorMessage,
  onAgreeChange,
  onConfirm,
  onClose,
}: ChallengeAcceptDialogProps) {
  if (!open || !offer) return null;

  const needed = Math.max(0, offer.amount - balance);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      {outcome === "confirm" ? (
        <DialogShell>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/70 transition hover:bg-white/12 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="text-center">
            <p className="text-xl font-black uppercase italic tracking-wide text-white [text-shadow:0_0_16px_#ff4cff]">
              Confirm Challenge
            </p>
            <div className="mx-auto mt-5 h-[74px] w-[74px] overflow-hidden rounded-full border-2 border-[#f3d15a]">
              <Image
                src={getSafeImageSrc(offer.target.avatar)}
                alt={offer.target.name}
                width={74}
                height={74}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
            <p className="mt-2 text-xs text-white/55">You are challenging</p>
            <h3 className="text-sm font-bold text-[#9dff65]">{offer.target.name}</h3>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4">
            <StatLine label="Challenge Amount" value={formatChallengeCurrency(offer.amount)} />
            <StatLine label="Time (Duration)" value={`${offer.durationHours} Hours`} />
          </div>

          <label className="mt-4 flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => onAgreeChange(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#ff19d7]"
            />
            <span>
              <span className="block text-sm font-semibold text-white">Terms & Conditions</span>
              <span className="mt-1 block text-xs leading-5 text-white/58">
                I agree to the terms and conditions of this challenge.
              </span>
            </span>
          </label>

          <button
            type="button"
            disabled={!agreed}
            onClick={onConfirm}
            className="mt-5 h-12 w-full rounded-xl bg-[linear-gradient(180deg,#ff31ff,#b500e7)] text-sm font-black uppercase text-white shadow-[0_0_22px_rgba(245,35,255,0.55)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm Challenge
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 h-10 w-full text-sm font-semibold uppercase text-white/55 hover:text-white"
          >
            Cancel
          </button>
        </DialogShell>
      ) : outcome === "success" ? (
        <DialogShell tone="green">
          <div className="text-center">
            <p className="text-xl font-black uppercase italic text-[#55ff47] [text-shadow:0_0_16px_rgba(85,255,71,0.8)]">
              Challenge Accepted!
            </p>
            <div className="mx-auto mt-4 grid h-20 w-20 place-items-center rounded-full border-4 border-[#37ff27] text-[#37ff27] shadow-[0_0_24px_rgba(55,255,39,0.55)]">
              <Check className="h-10 w-10" />
            </div>
            <p className="mt-5 text-sm text-white/62">You have successfully challenged</p>
            <h3 className="text-lg font-black text-[#52ff45]">{offer.target.name}</h3>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4">
            <StatLine label="Amount Deducted" value={formatChallengeCurrency(offer.amount)} success />
            <StatLine label="Time (Duration)" value={`${offer.durationHours} Hours`} />
            <StatLine label="Remaining Balance" value={formatChallengeCurrency(balance - offer.amount)} success />
          </div>

          <p className="mx-auto mt-5 max-w-[240px] text-center text-sm leading-5 text-white/52">
            The amount has been deducted from your balance.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 h-12 w-full rounded-xl bg-[linear-gradient(180deg,#22df2f,#07930f)] text-sm font-black uppercase text-white shadow-[0_0_22px_rgba(43,255,55,0.42)] transition hover:brightness-110"
          >
            Got It
          </button>
        </DialogShell>
      ) : outcome === "insufficient" ? (
        <DialogShell tone="red">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/70 transition hover:bg-white/12 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="text-center">
            <p className="text-xl font-black uppercase italic text-[#ff4058] [text-shadow:0_0_16px_rgba(255,64,88,0.65)]">
              Insufficient Balance
            </p>
            <div className="mx-auto mt-5 grid h-20 w-20 place-items-center text-[#ff4058]">
              <AlertTriangle className="h-16 w-16 drop-shadow-[0_0_18px_rgba(255,64,88,0.7)]" />
            </div>
            <p className="mx-auto mt-2 max-w-[260px] text-sm leading-5 text-white/58">
              You don&apos;t have enough balance to accept this challenge.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4">
            <StatLine label="Challenge Amount" value={formatChallengeCurrency(offer.amount)} />
            <StatLine label="Your Balance" value={formatChallengeCurrency(balance)} danger />
            <StatLine label="Needed" value={formatChallengeCurrency(needed)} danger />
          </div>

          <p className="mx-auto mt-5 max-w-[240px] text-center text-sm leading-5 text-white/55">
            Please add more balance to accept this challenge.
          </p>
          <button
            type="button"
            className="mt-5 h-12 w-full rounded-xl bg-[linear-gradient(180deg,#ff275a,#b80b35)] text-sm font-black uppercase text-white shadow-[0_0_22px_rgba(255,39,90,0.42)] transition hover:brightness-110"
          >
            Add Balance
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 h-10 w-full text-sm font-semibold uppercase text-white/55 hover:text-white"
          >
            Cancel
          </button>
        </DialogShell>
      ) : (
        <DialogShell tone="red">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/70 transition hover:bg-white/12 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="text-center">
            <p className="text-xl font-black uppercase italic text-[#ff4058] [text-shadow:0_0_16px_rgba(255,64,88,0.65)]">
              Something Went Wrong
            </p>
            <div className="mx-auto mt-5 grid h-20 w-20 place-items-center text-[#ff4058]">
              <AlertTriangle className="h-16 w-16 drop-shadow-[0_0_18px_rgba(255,64,88,0.7)]" />
            </div>
            <p className="mx-auto mt-2 max-w-[260px] text-sm leading-5 text-white/58">
              {errorMessage || "An unexpected error occurred while accepting the challenge. Please try again."}
            </p>
          </div>

          <p className="mx-auto mt-5 max-w-[240px] text-center text-sm leading-5 text-white/55">
            Please try again later or contact support if the issue persists.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 h-12 w-full rounded-xl bg-[linear-gradient(180deg,#ff275a,#b80b35)] text-sm font-black uppercase text-white shadow-[0_0_22px_rgba(255,39,90,0.42)] transition hover:brightness-110"
          >
            Close
          </button>
        </DialogShell>
      )}
    </div>
  );
}
