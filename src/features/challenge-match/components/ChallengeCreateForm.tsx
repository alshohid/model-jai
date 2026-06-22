"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import { useGetAllPublicGamesListQuery, useGetUsersForSelectQuery, useCreateChallengeMutation } from "@/redux/features/challenge/challengeManagement";
import type { ChallengeCreateFormValues, ChallengeCreateScope } from "../types";
import { cn } from "@/shared/lib/utils/cn";
import { toast } from "sonner";
import { useDebounce } from "@/app/(admin)/admin/hook/useDebounce";

const initialFormValues: ChallengeCreateFormValues = {
  gameId: "",
  price: "",
  matchDateTime: "",
  scope: "unique",
  targetPlayerId: "",
  showRealName: true,
  memo: "",
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
  const [, setFileName] = useState("No file selected");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const debouncedUserSearch = useDebounce(userSearch, 400);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data: gamesData, isLoading: gamesLoading } = useGetAllPublicGamesListQuery({ page: 1, limit: 2000 });
  const [createChallenge, { isLoading: isSubmitting }] = useCreateChallengeMutation();
  const { data: usersData, isFetching: usersLoading } = useGetUsersForSelectQuery(
    { search: debouncedUserSearch },
    { skip: debouncedUserSearch.length < 2 },
  );

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

  // Debounced user search
  const handleUserSearchChange = useCallback((value: string) => {
    setUserSearch(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      if (value.length >= 2) {
        setShowUserDropdown(true);
      } else {
        setShowUserDropdown(false);
      }
    }, 400);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const sharedFieldClass =
    "mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition focus:border-[#ff43ff]/60";

  // Get today's date in local format for min attribute
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const minDateTime = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}T${pad(today.getHours())}:${pad(today.getMinutes())}`;

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0] ?? null;
  //   if (file) {
  //     setFileName(file.name);
  //     setLogoFile(file);
  //   } else {
  //     setFileName("No file selected");
  //     setLogoFile(null);
  //   }
  // };

  const handleSubmit = async () => {
    // Validation
    if (!values.gameId) {
      toast.error("Please select a game");
      return;
    }
    if (!values.price || Number(values.price) < 1) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!values.matchDateTime) {
      toast.error("Please select match date & time");
      return;
    }
    if (values.scope === "unique" && !values.targetPlayerId) {
      toast.error("Please select a player or user to challenge");
      return;
    }

    try {
      const [dateOnly, timeOnly] = values.matchDateTime.split("T");

      const result = await createChallenge({
        game_id: Number(values.gameId),
        amount: Number(values.price),
        match_date: dateOnly,
        match_time: timeOnly,
        mode: values.scope,
        target_player_id: values.scope === "unique" ? Number(values.targetPlayerId) : null,
        show_real_name: values.showRealName,
        memo: values.memo,
        logo: logoFile,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Challenge created successfully!");
        // Reset form
        setValues(initialFormValues);
        setFileName("No file selected");
        setLogoFile(null);
        setUserSearch("");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage = err?.data?.message || err?.message || "Failed to create challenge. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Derive games & users from API data
  const games = gamesData?.data ?? [];
  const users = usersData?.data ?? [];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: "url('/images/home/modaljai_hero.jpg')" }}
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] items-start px-4 py-8 sm:items-center">
        <form
          className="relative w-full rounded-[24px] border border-[#ff43ff]/35 bg-[#111017]/92 p-4 shadow-[0_0_40px_rgba(255,67,255,0.32)] backdrop-blur-xl sm:p-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Link
            href="/challenge-dashboard"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/75 transition hover:bg-white/12 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Link>

          <div className=" text-center">
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
                onChange={(event) => updateValue("gameId", event.target.value)}
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
                onChange={(event) => updateValue("price", event.target.value)}
                placeholder="Enter challenge price"
                className={cn(sharedFieldClass, "h-11 placeholder:text-white/35")}
              />
            </div>

            <div>
              <FieldLabel required>Match date & time</FieldLabel>
              <input
                type="datetime-local"
                min={minDateTime}
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

            {values.scope === "unique" ? (
              <div className="relative" ref={dropdownRef}>
                <FieldLabel required>Challenge a unique player or user</FieldLabel>
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
                      if (userSearch.length >= 2) setShowUserDropdown(true);
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
                          setShowUserDropdown(false);
                        }}
                      >
                        <span>{u.artist ?? `User #${u.id}`}</span>
                        <span className="ml-2 text-[10px] uppercase text-white/40">
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {showUserDropdown && users.length === 0 && !usersLoading && (
                  <div className="mt-1 rounded-lg border border-white/10 bg-[#1a1724] px-3 py-2.5 text-sm text-white/45">
                    No users found. Try a different search term.
                  </div>
                )}

                {/* Hidden select to store the selected value for the form */}
                <input type="hidden" value={values.targetPlayerId} readOnly />
              </div>
            ) : null}

            {/* <div>
              <FieldLabel required>Master J@Y Logo</FieldLabel>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#6d2c7a] bg-black/20 px-5 py-7 text-center transition hover:border-[#ff43ff]/70 hover:bg-[#ff43ff]/5">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={handleFileChange}
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
            </div> */}

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
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 flex h-13 w-full items-center justify-between rounded-xl border border-[#ff43ff]/70 bg-[#4b0057] px-4 text-sm font-black uppercase italic tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,67,255,0.7),inset_0_0_14px_rgba(255,255,255,0.18)] transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 text-[#ff60ff]" />
            {isSubmitting ? "Submitting..." : "Launch Challenge Match"}
            <ChevronRight className="h-5 w-5 text-[#ff60ff]" />
          </button>
        </form>
      </section>
    </main>
  );
}