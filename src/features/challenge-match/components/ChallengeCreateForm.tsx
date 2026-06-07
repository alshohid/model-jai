"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Crown, ImagePlus, X } from "lucide-react";
import {
  challengeAmounts,
  challengeGames,
  challengePlayers,
} from "../data/challengeMatchMockData";
import type { ChallengeCreateFormValues } from "../types";

const initialFormValues: ChallengeCreateFormValues = {
  gameId: "",
  launchAmount: "",
  targetPlayerId: "",
  targetAmount: "",
  showRealName: true,
  memo: "",
};

export default function ChallengeCreateForm() {
  const [values, setValues] = useState<ChallengeCreateFormValues>(initialFormValues);
  const [fileName, setFileName] = useState("No file selected");

  const updateValue = <Key extends keyof ChallengeCreateFormValues>(
    key: Key,
    value: ChallengeCreateFormValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: "url('/images/home/modaljai_hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,247,0.34),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.4),#030104)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] items-center px-4 py-8">
        <form className="relative w-full rounded-[24px] border border-[#ff43ff]/35 bg-[#111017]/92 p-4 shadow-[0_0_40px_rgba(255,67,255,0.32)] backdrop-blur-xl sm:p-5">
          <Link
            href="/challenge-dashboard"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/75 transition hover:bg-white/12 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Link>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full border border-[#ff43ff]/45 bg-[#ff43ff]/15 text-[#ff9dff]">
              <Crown className="h-5 w-5" />
            </div>
            <p className="text-sm font-black uppercase italic tracking-[0.16em] text-white">
              Create a
            </p>
            <h1 className="text-4xl font-black uppercase italic leading-none text-white [text-shadow:0_0_18px_#ff43ff]">
              Challenge Match
            </h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.12em] text-white/75">
                Game <span className="text-[#ff43ff]">*</span>
              </label>
              <select
                value={values.gameId}
                onChange={(event) => updateValue("gameId", event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none focus:border-[#ff43ff]/60"
              >
                <option className="bg-[#111017]" value="">Select a game</option>
                {challengeGames.map((game) => (
                  <option className="bg-[#111017]" key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#c858ff]">
                <span className="h-3 w-3 rounded-full bg-[#b348ff]" />
                Launch a challenge <span className="text-[#ff43ff]">*</span>
              </p>
              <select
                value={values.launchAmount}
                onChange={(event) => updateValue("launchAmount", event.target.value)}
                className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none focus:border-[#ff43ff]/60"
              >
                <option className="bg-[#111017]" value="">Set the price</option>
                {challengeAmounts.map((amount) => (
                  <option className="bg-[#111017]" key={amount} value={amount}>
                    {amount} points
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#c858ff]">
                <span className="h-3 w-3 rounded-full bg-[#b348ff]" />
                Challenge a unique player <span className="text-[#ff43ff]">*</span>
              </p>
              <div className="grid gap-3">
                <select
                  value={values.targetPlayerId}
                  onChange={(event) => updateValue("targetPlayerId", event.target.value)}
                  className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none focus:border-[#ff43ff]/60"
                >
                  <option className="bg-[#111017]" value="">Select player</option>
                  {challengePlayers.map((player) => (
                    <option className="bg-[#111017]" key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
                <select
                  value={values.targetAmount}
                  onChange={(event) => updateValue("targetAmount", event.target.value)}
                  className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none focus:border-[#ff43ff]/60"
                >
                  <option className="bg-[#111017]" value="">Set the price</option>
                  {challengeAmounts.map((amount) => (
                    <option className="bg-[#111017]" key={amount} value={amount}>
                      {amount} points
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.12em] text-white/75">
                Master J@Y Logo <span className="text-[#ff43ff]">*</span>
              </label>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#6d2c7a] bg-black/20 px-5 py-7 text-center transition hover:border-[#ff43ff]/70 hover:bg-[#ff43ff]/5">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "No file selected")}
                />
                <span className="grid h-11 w-11 place-items-center rounded-full border border-[#ff43ff]/35 bg-[#ff43ff]/10 text-[#ff72ff]">
                  <ImagePlus className="h-5 w-5" />
                </span>
                <span className="mt-4 text-sm font-semibold text-white">Upload Master J@Y Logo</span>
                <span className="mt-1 max-w-[190px] text-xs leading-5 text-white/45">
                  PNG, JPG, or WEBP looks best here.
                </span>
                <span className="mt-4 inline-flex rounded-full border border-[#ff43ff]/45 px-5 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-[#ff9cff]">
                  Choose Logo
                </span>
                <span className="mt-2 max-w-full truncate text-xs text-white/45">{fileName}</span>
              </label>
            </div>

            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <span>
                <span className="block text-sm font-semibold text-white">Show real name</span>
                <span className="text-xs text-white/45">Let players see your public real name.</span>
              </span>
              <input
                type="checkbox"
                checked={values.showRealName}
                onChange={(event) => updateValue("showRealName", event.target.checked)}
                className="h-5 w-5 accent-[#ff19d7]"
              />
            </label>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.12em] text-white/75">
                Memo
              </label>
              <textarea
                value={values.memo}
                onChange={(event) => updateValue("memo", event.target.value)}
                rows={3}
                placeholder="Write a short challenge memo..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff43ff]/60"
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-5 flex h-13 w-full items-center justify-between rounded-xl border border-[#ff43ff]/70 bg-[#4b0057] px-4 text-sm font-black uppercase italic tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,67,255,0.7),inset_0_0_14px_rgba(255,255,255,0.18)] transition hover:brightness-110"
          >
            <ChevronLeft className="h-5 w-5 text-[#ff60ff]" />
            Launch Challenge Match
            <ChevronRight className="h-5 w-5 text-[#ff60ff]" />
          </button>
        </form>
      </section>
    </main>
  );
}
