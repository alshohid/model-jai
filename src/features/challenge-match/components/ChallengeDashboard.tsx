"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Crown, Plus } from "lucide-react";
import {
  challengeMatchOffers,
  currentChallengeBalance,
} from "../data/challengeMatchMockData";
import type { ChallengeMatchOffer } from "../types";
import ChallengeAcceptDialog from "./ChallengeAcceptDialog";
import ChallengeOfferCard from "./ChallengeOfferCard";

export default function ChallengeDashboard() {
  const [selectedOffer, setSelectedOffer] = useState<ChallengeMatchOffer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [outcome, setOutcome] = useState<"confirm" | "success" | "insufficient">("confirm");

  const sortedOffers = useMemo(
    () => [...challengeMatchOffers].sort((a, b) => b.amount - a.amount),
    [],
  );

  const handleAccept = (offer: ChallengeMatchOffer) => {
    setSelectedOffer(offer);
    setAgreed(false);
    setOutcome("confirm");
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedOffer) return;
    setOutcome(currentChallengeBalance >= selectedOffer.amount ? "success" : "insufficient");
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedOffer(null);
    setAgreed(false);
    setOutcome("confirm");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url('/images/home/modaljai_hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.85)),radial-gradient(circle_at_top,rgba(255,0,247,0.25),transparent_38%)]" />

      <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd44d]/35 bg-black/35 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#ffe27a]">
              <Crown className="h-4 w-4" />
              Big Boss Challenge Offers
            </div>
            <h1 className="mt-4 text-4xl font-black italic leading-none text-white [text-shadow:0_0_22px_#ff36ff] sm:text-6xl">
              Big boss challenge offers
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
              Biggest challenge stays on top. Accept a challenge, confirm the terms, and get ready for the match flow.
            </p>
          </div>

          <Link
            href="/challenge-dashboard/create"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#ff43ff]/55 bg-[#28002f]/80 px-5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_0_24px_rgba(255,67,255,0.45)] transition hover:bg-[#3a0045]"
          >
            <Plus className="h-4 w-4" />
            Create Challenge
          </Link>
        </div>

        <div className="mt-6 rounded-[22px] border border-[#ff43ff]/35 bg-black/42 p-3 shadow-[0_0_40px_rgba(255,67,255,0.25)] backdrop-blur-sm sm:p-5">
          <div className="mb-4 rounded-[18px] border border-[#f0c13b]/50 bg-[linear-gradient(90deg,rgba(72,31,5,0.78),rgba(104,22,103,0.72),rgba(72,31,5,0.78))] px-4 py-3 text-center shadow-[0_0_28px_rgba(255,199,56,0.35)]">
            <p className="text-2xl font-black italic text-[#fff061] [text-shadow:0_2px_0_#7b2d00,0_0_16px_rgba(255,255,0,0.65)] sm:text-4xl">
              Big boss challenge offers
            </p>
          </div>

          <div>
            {sortedOffers.map((offer) => (
              <ChallengeOfferCard key={offer.id} offer={offer} onAccept={handleAccept} />
            ))}
          </div>
        </div>
      </section>

      <ChallengeAcceptDialog
        offer={selectedOffer}
        open={dialogOpen}
        balance={currentChallengeBalance}
        outcome={outcome}
        agreed={agreed}
        onAgreeChange={setAgreed}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    </main>
  );
}
