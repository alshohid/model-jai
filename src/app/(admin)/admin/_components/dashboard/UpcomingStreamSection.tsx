"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import PrimaryCtaButton from "../reusable/PrimaryCtaButton";

export type UpcomingPlayer = {
    id: string;
    label: string; // "Player 1"
    name: string;  // "Camellio William"
    avatar: string;
};

type Props = {
    title?: string;

    players: UpcomingPlayer[];

    onConfirmWinner?: () => void;
    onUpdateLiveLink?: () => void;

    onViewPlayer?: (id: string) => void;
    onEditPlayer?: (id: string) => void;
    onDeletePlayer?: (id: string) => void;

    className?: string;
};

export default function UpcomingStreamSection({
    title = "Upcoming Stream",
    players,
    onConfirmWinner,
    onUpdateLiveLink,
    onViewPlayer,
    onEditPlayer,
    onDeletePlayer,
    className,
}: Props) {
    return (
        <section
            className={cn(
                "w-full",
                "rounded-[18px] sm:rounded-[20px]",
                "border border-white/10 bg-white/5 backdrop-blur-xl",
                "p-4 sm:p-6",
                "shadow-[0_22px_70px_rgba(0,0,0,0.40)]",
                className
            )}
        >
            {/* header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-white font-semibold text-[18px] sm:text-[20px]">
                    {title}
                </h3>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <OutlineCtaButton
                        onClick={onConfirmWinner}
                        className="w-full sm:w-auto  "
                    >
                        Confirm Winner
                    </OutlineCtaButton>

                    <PrimaryCtaButton
                        onClick={onUpdateLiveLink}
                        className={cn("h-10 rounded-[14px]", "w-full sm:w-auto", "px-6 sm:px-8")}
                    >
                        Update Live Link
                    </PrimaryCtaButton>
                </div>
            </div>

            {/* list */}
            <div className="mt-5 flex flex-col gap-4">
                {players.map((p) => (
                    <PlayerRow
                        key={p.id}
                        player={p}
                        onView={() => onViewPlayer?.(p.id)}
                        onEdit={() => onEditPlayer?.(p.id)}
                        onDelete={() => onDeletePlayer?.(p.id)}
                    />
                ))}
            </div>
        </section>
    );
}

/* ---------------------------- Row ---------------------------- */

function PlayerRow({
    player,
    onView,
    onEdit,
    onDelete,
}: {
    player: UpcomingPlayer;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}) {
    return (
        <div
            className={cn(
                "w-full",
                "rounded-[18px] sm:rounded-[20px]",
                "border border-white/20",
                "bg-[#FFFFFF14]",
                "px-4 py-4 sm:px-5 sm:py-5"
            )}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* left */}
                <div className="flex items-center gap-4 min-w-0">
                    <div className="relative size-12 sm:size-14 rounded-full overflow-hidden border border-white/20 shrink-0">
                        <Image
                            src={player.avatar}
                            alt={player.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="text-white font-semibold text-[18px] sm:text-[20px] leading-tight">
                            {player.label}
                        </p>
                        <p className="mt-1 text-white/75 text-[14px] sm:text-[16px] truncate">
                            {player.name}
                        </p>
                    </div>
                </div>

                {/* right actions */}
                <div className="flex items-center gap-2 sm:gap-3 justify-start sm:justify-end">
                    <IconActionButton aria-label="View" onClick={onView}>
                        <EyeIcon />
                    </IconActionButton>

                    <IconActionButton aria-label="Edit" onClick={onEdit}>
                        <EditIcon />
                    </IconActionButton>

                    <IconActionButton aria-label="Delete" onClick={onDelete}>
                        <TrashIcon />
                    </IconActionButton>
                </div>
            </div>
        </div>
    );
}

/* ------------------------- Reusable Buttons ------------------------- */

function OutlineCtaButton({
    className,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
    return (
        <button
            type="button"
            className={cn(
                "cursor-pointer inline-flex items-center justify-center select-none",
                // ✅ height increased
                "h-[48px] sm:h-[52px]",
                // ✅ padding tuned
                "px-5 sm:px-7",
                // ✅ closer to your UI
                "rounded-[16px] sm:rounded-[18px]",
                "border border-white/35",
                "bg-transparent",
                "text-[#FF2EC8] font-medium",
                // ✅ typography match
                "text-[16px] sm:text-[18px] leading-[132%]",
                "[font-family:Inter_Tight,Inter,system-ui,sans-serif]",
                "shadow-[0_16px_40px_rgba(0,0,0,0.25)]",
                "transition-all duration-200",
                "hover:bg-white/5 active:scale-[0.99]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2EC8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

function IconActionButton({
    className,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
    return (
        <button
            type="button"
            className={cn(
                "cursor-pointer inline-flex items-center justify-center",
                "size-9 sm:size-10",
                "rounded-[10px] sm:rounded-[12px]",
                "bg-white/10 border border-white/15",
                "text-white/85",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
                "transition-all duration-200",
                "hover:bg-white/12 hover:text-white active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

/* ----------------------------- Icons ----------------------------- */

function EyeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12z"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                stroke="currentColor"
                strokeWidth="2"
            />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M12 20h9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M3 6h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M8 6V4h8v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M19 6l-1 14H6L5 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M10 11v6M14 11v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}
