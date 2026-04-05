/* eslint-disable @next/next/no-img-element */
"use client";

import { ChangeEvent, ReactNode } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

export function Field({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/45">
                {label}
                {required && <span className="ml-1 text-[#FF2EC8]">*</span>}
            </label>
            {children}
        </div>
    );
}

export const inputCls =
    "w-full h-11 px-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/5 transition-all duration-200";

export const selectCls =
    "w-full h-11 px-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/5 transition-all duration-200 appearance-none";

export const textareaCls =
    "w-full px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF2EC8]/60 focus:bg-[#FF2EC8]/5 transition-all duration-200 resize-none leading-relaxed";

export const ChevronDown = () => (
    <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

export interface MatchFormState {
    game_id: string;
    player_one_id: string;
    player_two_id: string;
    players_bet_amount: string;
    match_date: string;
    match_time: string;
    voting_time: string;
    type: string;
    winner_percentage: number;
    loser_percentage: number;
    tiktok_link: string;
    twitch_link: string;
    rules: string;
    player_one_logo: File | null;
    player_two_logo: File | null;
}

export const createEmptyMatchForm = (): MatchFormState => ({
    game_id: "",
    player_one_id: "",
    player_two_id: "",
    players_bet_amount: "",
    match_date: "",
    match_time: "",
    voting_time: "",
    type: "upcoming",
    winner_percentage: 0,
    loser_percentage: 0,
    tiktok_link: "",
    twitch_link: "",
    rules: "",
    player_one_logo: null,
    player_two_logo: null,
});

export const normalizeTimeValue = (value?: string | null) => {
    if (!value) return "";

    return value.slice(0, 5);
};

export const normalizeVotingMinutesValue = (
    value?: string | number | null,
) => {
    if (value === null || typeof value === "undefined") return "";

    const rawValue = String(value).trim();
    if (!rawValue) return "";

    if (/^\d+$/.test(rawValue)) {
        return rawValue;
    }

    const parts = rawValue
        .split(":")
        .map((part) => Number(part))
        .filter((part) => Number.isFinite(part));

    if (parts.length >= 2) {
        const [hours, minutes] = parts;
        return String(hours * 60 + minutes);
    }

    return rawValue;
};

export const getMatchLogoPreview = (value?: string | null) => {
    if (typeof value !== "string") return null;

    const trimmed = value.trim();
    return trimmed || null;
};

export const readImagePreview = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
                return;
            }

            reject(new Error("Could not preview the selected image."));
        };

        reader.onerror = () => {
            reject(new Error("Could not preview the selected image."));
        };

        reader.readAsDataURL(file);
    });

export function LogoUploadField({
    label,
    inputId,
    previewSrc,
    fileName,
    required,
    helperText,
    buttonLabel,
    onFileChange,
    onClear,
}: {
    label: string;
    inputId: string;
    previewSrc: string | null;
    fileName?: string | null;
    required?: boolean;
    helperText?: string;
    buttonLabel?: string;
    onFileChange: (file: File | null) => void;
    onClear?: () => void;
}) {
    return (
        <Field label={label} required={required}>
            <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-3">
                <div className="relative flex min-h-[100px] items-center justify-center overflow-hidden rounded-[16px] border border-dashed border-white/12 bg-[#0F0B11] px-4 py-5">
                    {previewSrc ? (
                        <div className="flex h-full w-full items-center justify-center">
                            <img
                                src={previewSrc}
                                alt={`${label} preview`}
                                className="max-h-[72px] max-w-[72px] rounded-xl border border-white/10 bg-white/5 object-contain p-1.5"
                            />
                        </div>
                    ) : (
                        <div className="px-5 text-center">
                            <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#FF2EC8]">
                                <ImagePlus className="size-4" />
                            </div>
                            <p className="mt-3 text-sm font-medium text-white">
                                Upload {label.toLowerCase()}
                            </p>
                            <p className="mt-2 text-xs leading-5 text-white/45">
                                PNG, JPG, or WEBP looks best here.
                            </p>
                        </div>
                    )}

                    {previewSrc && onClear ? (
                        <button
                            type="button"
                            onClick={onClear}
                            className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition hover:bg-black/75"
                            aria-label={`Remove ${label}`}
                        >
                            <X className="size-4" />
                        </button>
                    ) : null}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <label
                        htmlFor={inputId}
                        className="inline-flex cursor-pointer items-center rounded-full border border-[#FF2EC8]/25 bg-[#FF2EC8]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FF79DE] transition hover:bg-[#FF2EC8]/15"
                    >
                        {buttonLabel ?? (previewSrc ? "Change logo" : "Choose logo")}
                    </label>

                    <div className="max-w-[210px] text-right">
                        <p className="truncate text-xs font-medium text-white/70">
                            {fileName || (previewSrc ? "Current logo ready" : "No file selected")}
                        </p>
                        {helperText ? (
                            <p className="mt-1 text-[11px] text-white/40">{helperText}</p>
                        ) : null}
                    </div>
                </div>

                <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        onFileChange(event.target.files?.[0] ?? null)
                    }
                    className="hidden"
                />
            </div>
        </Field>
    );
}

export function ErrorBanner({ message }: { message: string }) {
    if (!message) return null;

    return (
        <div
            className={cn(
                "flex items-center gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-300",
            )}
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {message}
        </div>
    );
}
