"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import { challengeGames, challengePlayers } from "../data/challengeMatchMockData";
import type { ChallengeCreateFormValues, ChallengeCreateScope } from "../types";
import { cn } from "@/shared/lib/utils/cn";

const initialFormValues: ChallengeCreateFormValues = {
  gameId: "",
  price: "",
  matchDateTime: "",
  scope: "unique",
  targetPlayerId: "",
  showRealName: true,
  memo: "",
  rules: "",
};

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-xs font-black uppercase tracking-[0.12em] text-white/75">
      {children} {required ? <span className="text-[#ff43ff]">*</span> : null}
    </label>
  );
}

export default function ChallengeCreateForm() {
  const [values, setValues] = useState<ChallengeCreateFormValues>(initialFormValues);
  const [fileName, setFileName] = useState("No file selected");

  const updateValue = <Key extends keyof ChallengeCreateFormValues>(
    key: Key,
    value: ChallengeCreateFormValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateScope = (scope: ChallengeCreateScope) => {
    setValues((current) => ({
      ...current,
      scope,
      targetPlayerId: scope === "global" ? "" : current.targetPlayerId,
    }));
  };

  const sharedFieldClass =
    "mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition focus:border-[#ff43ff]/60";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: "url('/images/home/modaljai_hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,247,0.34),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.4),#030104)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] items-start px-4 py-8 sm:items-center">
        <form className="relative w-full rounded-[24px] border border-[#ff43ff]/35 bg-[#111017]/92 p-4 shadow-[0_0_40px_rgba(255,67,255,0.32)] backdrop-blur-xl sm:p-5">
          <Link
            href="/challenge-dashboard"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/75 transition hover:bg-white/12 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Link>

          <div className="mb-6 text-center">
            <Image
              src="/images/created.png"
              alt="Create a challenge"
              width={500}
              height={500}
              className="mx-auto mb-2 h-full w-full object-contain"
            />
          </div>

          <div className="space-y-4">
            <div>
              <FieldLabel required>Game</FieldLabel>
              <select
                value={values.gameId}
                onChange={(event) => updateValue("gameId", event.target.value)}
                className={cn(sharedFieldClass, "h-11")}
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
              <FieldLabel required>Price</FieldLabel>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={values.price}
                onChange={(event) => updateValue("price", event.target.value)}
                placeholder="Enter challenge price"
                className={cn(sharedFieldClass, "h-11 placeholder:text-white/35")}
              />
            </div>

            <div>
              <FieldLabel required>Match date & time</FieldLabel>
              <input
                type="datetime-local"
                value={values.matchDateTime}
                onChange={(event) => updateValue("matchDateTime", event.target.value)}
                className={cn(sharedFieldClass, "h-11 [color-scheme:dark]")}
              />
            </div>

            <fieldset className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <legend className="px-1 text-xs font-black uppercase tracking-[0.12em] text-[#c858ff]">
                Challenge type
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/18 px-3 py-3 text-sm font-semibold text-white/80 transition hover:border-[#ff43ff]/45">
                  <input
                    type="radio"
                    name="challengeScope"
                    value="unique"
                    checked={values.scope === "unique"}
                    onChange={() => updateScope("unique")}
                    className="h-4 w-4 accent-[#ff19d7]"
                  />
                  Unique player
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/18 px-3 py-3 text-sm font-semibold text-white/80 transition hover:border-[#ff43ff]/45">
                  <input
                    type="radio"
                    name="challengeScope"
                    value="global"
                    checked={values.scope === "global"}
                    onChange={() => updateScope("global")}
                    className="h-4 w-4 accent-[#ff19d7]"
                  />
                  Global
                </label>
              </div>
            </fieldset>

            {values.scope === "unique" ? (
              <div>
                <FieldLabel required>Challenge a unique player</FieldLabel>
                <select
                  value={values.targetPlayerId}
                  onChange={(event) => updateValue("targetPlayerId", event.target.value)}
                  className={cn(sharedFieldClass, "h-11")}
                >
                  <option className="bg-[#111017]" value="">Select player</option>
                  {challengePlayers.map((player) => (
                    <option className="bg-[#111017]" key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <FieldLabel required>Master J@Y Logo</FieldLabel>
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
              <FieldLabel>Memo</FieldLabel>
              <textarea
                value={values.memo}
                onChange={(event) => updateValue("memo", event.target.value)}
                rows={3}
                placeholder="Write a short challenge memo..."
                className={cn(sharedFieldClass, "min-h-24 py-3 placeholder:text-white/35")}
              />
            </div>

            <div>
              <FieldLabel required>Rules</FieldLabel>
              <textarea
                value={values.rules}
                onChange={(event) => updateValue("rules", event.target.value)}
                rows={4}
                placeholder="Write the rules for this challenge..."
                className={cn(sharedFieldClass, "min-h-28 py-3 placeholder:text-white/35")}
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
