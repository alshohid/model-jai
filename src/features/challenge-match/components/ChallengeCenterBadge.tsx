/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

interface ChallengeMatchOffer {
    match_date: string; // Format: "2026-06-25"
    match_time: string; // Format: "23:11"
    status:
    | "pending"
    | "offered"
    | "accepted"
    | "rejected"
    | "declined"
    | "cancelled"
    | "expired"
    | "completed";
    kind?: string;
}

interface ChallengeCenterBadgeProps {
    offer: ChallengeMatchOffer;
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    totalSeconds: number;
}

function ChallengeCenterBadge({ offer }: ChallengeCenterBadgeProps) {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
        totalSeconds: 0,
    });

    const calculateTimeRemaining = () => {
        // Parse match_date (YYYY-MM-DD) and match_time (HH:MM)
        const [year, month, day] = offer.match_date.split("-").map(Number);
        const [matchHours, matchMinutes] = offer.match_time.split(":").map(Number);

        const matchDateTime = new Date(year, month - 1, day, matchHours, matchMinutes, 0);
        const now = new Date();
        const diff = matchDateTime.getTime() - now.getTime();

        if (diff <= 0) {
            setTimeRemaining({
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: true,
                totalSeconds: 0,
            });
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeRemaining({
            days,
            hours,
            minutes,
            seconds,
            isExpired: false,
            totalSeconds,
        });
    };

    useEffect(() => {
        // Only run timer for pending or offered status
        if (offer.status !== "pending" && offer.status !== "offered") {
            setTimeRemaining({
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: true,
                totalSeconds: 0,
            });
            return;
        }

        // Calculate immediately on mount
        calculateTimeRemaining();

        // Set up interval to update every second
        const interval = setInterval(calculateTimeRemaining, 1000);
        return () => clearInterval(interval);
    }, [offer.match_date, offer.match_time, offer.status]);

    // Determine color theme based on status and time remaining
    const getThemeColors = () => {
        // Expired state
        if (timeRemaining.isExpired || offer.status === "expired") {
            return {
                borderColor: "#ff3737",
                glowColor: "rgba(255, 55, 55, 0.45)",
                textColor: "#ff6b6b",
                bgGlow: "rgba(255, 55, 55, 0.1)",
            };
        }

        // Accepted state - green
        if (offer.status === "accepted" || offer.status === "completed") {
            return {
                borderColor: "#24ff7a",
                glowColor: "rgba(36, 255, 122, 0.45)",
                textColor: "#24ff7a",
                bgGlow: "rgba(36, 255, 122, 0.1)",
            };
        }

        // Rejected/Declined/Cancelled states - red/pink
        if (
            offer.status === "rejected" ||
            offer.status === "declined" ||
            offer.status === "cancelled"
        ) {
            return {
                borderColor: "#ff3737",
                glowColor: "rgba(255, 55, 55, 0.45)",
                textColor: "#ff6b6b",
                bgGlow: "rgba(255, 55, 55, 0.1)",
            };
        }

        // Pending/Offered states - pink/gold
        return {
            borderColor: "#ff37dc",
            glowColor: "rgba(255, 55, 220, 0.45)",
            textColor: "#ffd700",
            bgGlow: "rgba(255, 215, 0, 0.1)",
        };
    };

    const theme = getThemeColors();

    // Format time display with leading zeros
    const formatDisplay = () => {
        // Show status-specific messages for non-timer statuses
        if (offer.status === "accepted" || offer.status === "completed") {
            return {
                line1: "Match",
                line2: "Accepted",
                line3: "✓",
            };
        }

        if (offer.status === "rejected") {
            return {
                line1: "Match",
                line2: "Rejected",
                line3: "✗",
            };
        }

        if (offer.status === "declined") {
            return {
                line1: "Match",
                line2: "Declined",
                line3: "✗",
            };
        }

        if (offer.status === "cancelled") {
            return {
                line1: "Match",
                line2: "Cancelled",
                line3: "✗",
            };
        }

        if (offer.status === "expired" || timeRemaining.isExpired) {
            return {
                line1: "Match",
                line2: "Expired",
                line3: "0:00",
            };
        }

        // Timer display for pending/offered status
        if (timeRemaining.days > 0) {
            return {
                line1: `Day ${timeRemaining.days}`,
                line2: `${String(timeRemaining.hours).padStart(2, "0")}:${String(
                    timeRemaining.minutes
                ).padStart(2, "0")}`,
                line3: `${String(timeRemaining.seconds).padStart(2, "0")}s`,
            };
        }

        return {
            line1: `${String(timeRemaining.hours).padStart(2, "0")}h`,
            line2: `${String(timeRemaining.minutes).padStart(2, "0")}:${String(
                timeRemaining.seconds
            ).padStart(2, "0")}`,
            line3: `remaining`,
        };
    };

    const display = formatDisplay();

    return (
        <div className="flex min-w-0 flex-col items-center pt-8 text-center">
            {/* Timer Badge */}
            <div
                className="grid h-12 w-12 place-items-center rounded-full border bg-black sm:h-16 sm:w-16"
                style={{
                    borderColor: theme.borderColor,
                    boxShadow: `0 0 20px ${theme.glowColor}, inset 0 0 20px ${theme.bgGlow}`,
                    transition: "all 0.3s ease-in-out",
                }}
            >
                <div
                    className="text-[8px] font-bold leading-tight sm:text-[10px]"
                    style={{
                        color: theme.textColor,
                        textShadow: `0 0 10px ${theme.glowColor}`,
                        transition: "color 0.3s ease-in-out",
                    }}
                >
                    <span className="block">{display.line1}</span>
                    <span className="block">{display.line2}</span>
                    <span className="block text-[7px] sm:text-[9px]">{display.line3}</span>
                </div>
            </div>

            {/* VS Text */}
            <p
                className="mt-1 text-xs font-black uppercase italic"
                style={{
                    color: theme.textColor,
                    textShadow: `0 0 8px ${theme.glowColor}`,
                    transition: "all 0.3s ease-in-out",
                }}
            >
                {offer.status === "accepted" || offer.status === "completed"
                    ? "✓"
                    : offer.status === "rejected" ||
                        offer.status === "declined" ||
                        offer.status === "cancelled"
                        ? "✗"
                        : offer.status === "expired" || timeRemaining.isExpired
                            ? "ENDED"
                            : "VS"}
            </p>

            {/* Status Badge */}
            <div
                className="mt-2 inline-block rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-wider sm:text-[9px]"
                style={{
                    backgroundColor: `${theme.glowColor}20`,
                    color: theme.textColor,
                    border: `1px solid ${theme.borderColor}`,
                    transition: "all 0.3s ease-in-out",
                }}
            >
                {offer.status}
            </div>

            {/* Kind Text */}
            {offer.kind && (
                <p className="mt-2 [writing-mode:vertical-rl] text-[10px] font-semibold capitalize text-white/70">
                    {offer.kind}
                </p>
            )}
        </div>
    );
}

export default ChallengeCenterBadge;