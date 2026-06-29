"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useGetAllPublicGamesListQuery } from "@/redux/features/challenge/challengeManagement";
import { cn } from "@/shared/lib/utils/cn";
import useChallengeForm from "../hooks/useChallengeForm";
import useUserSearch from "../hooks/useUserSearch";
import FieldLabel from "./FieldLabel";
import ChallengeCreateConfirmModal from "./ChallengeCreateConfirmModal";

export default function ChallengeCreateForm() {
  const {
    values,
    isSubmitting,
    showConfirmModal,
    sharedFieldClass,
    minDateTime,
    updateValue,
    updateScope,
    handleFormSubmit,
    handleConfirmSubmit,
    closeConfirmModal,
  } = useChallengeForm();

  const {
    userSearch,
    showUserDropdown,
    dropdownRef,
    users,
    isLoading: usersLoading,
    setUserSearch,
    handleUserSearchChange,
    closeDropdown,
  } = useUserSearch();

  const { data: gamesData, isLoading: gamesLoading } =
    useGetAllPublicGamesListQuery({ page: 1, limit: 2000 });

  const games = gamesData?.data ?? [];
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: "url('/images/home/modaljai_hero.jpg')" }}
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] items-start px-4 py-8 sm:items-center">
        <form className="relative w-full rounded-[24px] border border-[#ff43ff]/35 bg-[#111017]/92 p-4 shadow-[0_0_40px_rgba(255,67,255,0.32)] backdrop-blur-xl sm:p-5">
          <Link
            href="/challenge-dashboard"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/75 transition hover:bg-white/12 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Link>
          <div className="text-center">
            <Image
              src="/images/challenge-match.png"
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
                onChange={(e) => updateValue("gameId", e.target.value)}
                className={cn(sharedFieldClass, "h-11")}
              >
                <option className="bg-[#111017]" value="">
                  {gamesLoading ? "Loading games..." : "Select a game"}
                </option>
                {games.map((game) => (
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
                onChange={(e) => updateValue("price", e.target.value)}
                placeholder="Enter challenge price"
                className={cn(sharedFieldClass, "h-11 placeholder:text-white/35")}
              />
            </div>

            {/* Match date & time */}
            <div>
              <FieldLabel required>Match date & time</FieldLabel>
              <input
                type="datetime-local"
                min={minDateTime}
                value={values.matchDateTime}
                onChange={(e) => updateValue("matchDateTime", e.target.value)}
                className={cn(sharedFieldClass, "h-11 [color-scheme:dark]")}
              />
            </div>

            {/* Challenge type */}
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
                    className="h-4 w-4 shrink-0 accent-[#ff19d7]"
                  />
                  <span>Unique player <span className="font-medium text-[#ff19d7]">or user</span></span>
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

            {/* User search (unique only) */}
            {values.scope === "unique" ? (
              <div className="relative" ref={dropdownRef}>
                <FieldLabel required>
                  Challenge a unique player or user
                </FieldLabel>
                <div className="relative">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUserSearch(val);
                      handleUserSearchChange(val);
                    }}
                    onFocus={() => {
                      if (userSearch.length >= 2) setUserSearch(userSearch);
                    }}
                    placeholder="Search player or user..."
                    className={cn(sharedFieldClass, "h-11 placeholder:text-white/35")}
                  />
                  {usersLoading && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
                      Searching...
                    </span>
                  )}
                </div>

                {showUserDropdown && users.length > 0 && (
                  <div className="mt-1 max-h-44 overflow-y-auto rounded-lg border border-white/10 bg-[#1a1724] shadow-lg">
                    {users.map((u) => (
                      <button
                        type="button"
                        key={u.id}
                        className={`w-full px-3 py-2.5 text-left text-sm text-white/85 transition hover:bg-white/10 ${Number(values.targetPlayerId) === u.id
                          ? "bg-[#ff43ff]/15 text-white"
                          : ""
                          }`}
                        onClick={() => {
                          updateValue("targetPlayerId", String(u.id));
                          setUserSearch(u.artist ?? `User #${u.id}`);
                          closeDropdown();
                        }}
                      >
                        <span>{u.artist ?? `User #${u.id}`}</span>
                        <span className="ml-2 text-[10px] uppercase text-white/40">{u.role}</span>
                      </button>
                    ))}
                  </div>
                )}

                {showUserDropdown && users.length === 0 && !usersLoading && (
                  <div className="mt-1 rounded-lg border border-white/10 bg-[#1a1724] px-3 py-2.5 text-sm text-white/45">
                    No users found. Try a different search term.
                  </div>
                )}

                <input type="hidden" value={values.targetPlayerId} readOnly />
              </div>
            ) : null}

            {/* Show real name */}
            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <span>
                <span className="block text-sm font-semibold text-white">
                  Show real name
                </span>
                <span className="text-xs text-white/45">
                  Let players see your public real name.
                </span>
              </span>
              <input
                type="checkbox"
                checked={values.showRealName}
                onChange={(e) => updateValue("showRealName", e.target.checked)}
                className="h-5 w-5 accent-[#ff19d7]"
              />
            </label>

            {/* Memo */}
            <div>
              <FieldLabel>Memo</FieldLabel>
              <textarea
                value={values.memo}
                onChange={(e) => updateValue("memo", e.target.value)}
                rows={3}
                placeholder="Write a short challenge memo..."
                className={cn(sharedFieldClass, "min-h-24 py-3 placeholder:text-white/35")}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleFormSubmit}
            className="mt-5 flex h-13 w-full items-center justify-between rounded-xl border border-[#ff43ff]/70 bg-[#4b0057] px-4 text-sm font-black uppercase italic tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,67,255,0.7),inset_0_0_14px_rgba(255,255,255,0.18)] transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 text-[#ff60ff]" />
            {isSubmitting ? "Submitting..." : "Launch Challenge Match"}
            <ChevronRight className="h-5 w-5 text-[#ff60ff]" />
          </button>
        </form>
      </section>
      <ChallengeCreateConfirmModal
        open={showConfirmModal}
        values={values}
        isSubmitting={isSubmitting}
        games={games}
        users={users}
        onConfirm={handleConfirmSubmit}
        onClose={closeConfirmModal}
      />
    </main>
  );
}

