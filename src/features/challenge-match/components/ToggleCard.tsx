"use client";

import { cn } from "@/lib/utils";

type ToggleCardProps = {
    title: string;
    description: string;
    checked: boolean;
    loading?: boolean;
    disabled?: boolean;
    onToggle: () => void;
};

export default function ToggleCard({
    title,
    description,
    checked,
    loading = false,
    disabled = false,
    onToggle,
}: ToggleCardProps) {
    return (
        <div className="flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
            <div className="space-y-0.5">
                <p className="text-[13px] font-semibold leading-none text-white">
                    {title}
                </p>
                <p className="text-[11px] leading-none text-white/40">
                    {description}
                </p>
            </div>

            <button
                type="button"
                disabled={disabled || loading}
                onClick={onToggle}
                className={cn(
                    "relative h-6 w-12 flex-shrink-0 rounded-full transition-all duration-300",
                    "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                    checked
                        ? "bg-[#22CAAD] shadow-[0_0_12px_rgba(34,202,173,0.4)]"
                        : "bg-white/15"
                )}
                aria-label={title}
            >
                <span
                    className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300",
                        checked ? "left-6" : "left-0.5"
                    )}
                />

                {loading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    </span>
                )}
            </button>
        </div>
    );
}