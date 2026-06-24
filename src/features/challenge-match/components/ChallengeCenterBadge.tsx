/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

interface ChallengeMatchOffer {
    match_date: string;
    match_time: string;
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
        const [year, month, day] = offer.match_date.split("-").map(Number);
        const [matchHours, matchMinutes] = offer.match_time.split(":").map(Number);

        const matchDateTime = new Date(
            year,
            month - 1,
            day,
            matchHours,
            matchMinutes,
            0
        );

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
        const timerStatuses = ["pending", "offered"];

        if (!timerStatuses.includes(offer.status)) {
            setTimeRemaining({
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: false,
                totalSeconds: 0,
            });

            return;
        }

        calculateTimeRemaining();

        const interval = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(interval);
    }, [offer.match_date, offer.match_time, offer.status]);

    const getThemeColors = () => {
        switch (offer.status) {
            case "accepted":
            case "completed":
                return {
                    borderColor: "#24ff7a",
                    glowColor: "rgba(36,255,122,0.45)",
                    textColor: "#24ff7a",
                    bgGlow: "rgba(36,255,122,0.12)",
                };

            case "rejected":
            case "declined":
            case "cancelled":
            case "expired":
                return {
                    borderColor: "#ff3737",
                    glowColor: "rgba(255,55,55,0.45)",
                    textColor: "#ff6b6b",
                    bgGlow: "rgba(255,55,55,0.12)",
                };

            default:
                if (timeRemaining.isExpired) {
                    return {
                        borderColor: "#ff3737",
                        glowColor: "rgba(255,55,55,0.45)",
                        textColor: "#ff6b6b",
                        bgGlow: "rgba(255,55,55,0.12)",
                    };
                }

                return {
                    borderColor: "#ff37dc",
                    glowColor: "rgba(255,55,220,0.45)",
                    textColor: "#ffd700",
                    bgGlow: "rgba(255,215,0,0.12)",
                };
        }
    };

    const theme = getThemeColors();

    const formatDisplay = () => {
        switch (offer.status) {
            case "accepted":
            case "completed":
                return {
                    line1: "MATCH",
                    line2: "ACCEPTED",
                    line3: "✓",
                };

            case "rejected":
                return {
                    line1: "MATCH",
                    line2: "REJECTED",
                    line3: "✗",
                };

            case "declined":
                return {
                    line1: "MATCH",
                    line2: "DECLINED",
                    line3: "✗",
                };

            case "cancelled":
                return {
                    line1: "MATCH",
                    line2: "CANCELLED",
                    line3: "✗",
                };

            case "expired":
                return {
                    line1: "MATCH",
                    line2: "EXPIRED",
                    line3: "0:00",
                };
        }

        if (timeRemaining.isExpired) {
            return {
                line1: "MATCH",
                line2: "EXPIRED",
                line3: "0:00",
            };
        }

        if (timeRemaining.days > 0) {
            return {
                line1: `${timeRemaining.days}D`,
                line2: `${String(timeRemaining.hours).padStart(2, "0")}H`,
                line3: `${String(timeRemaining.minutes).padStart(2, "0")}M`,
            };
        }

        return {
            line1: `${String(timeRemaining.hours).padStart(2, "0")}H`,
            line2: `${String(timeRemaining.minutes).padStart(2, "0")}M`,
            line3: `${String(timeRemaining.seconds).padStart(2, "0")}S`,
        };
    };

    const display = formatDisplay();

    return (
        <div className="flex min-w-0 flex-col items-center pt-8 text-center">
            <div
                className="grid h-12 w-12 place-items-center rounded-full border bg-black sm:h-16 sm:w-16"
                style={{
                    borderColor: theme.borderColor,
                    boxShadow: `
                        0 0 20px ${theme.glowColor},
                        inset 0 0 15px ${theme.bgGlow}
                    `,
                }}
            >
                <div
                    className="text-[8px] font-bold leading-tight sm:text-[10px]"
                    style={{
                        color: theme.textColor,
                        textShadow: `0 0 10px ${theme.glowColor}`,
                    }}
                >
                    <span className="block">{display.line1}</span>
                    <span className="block">{display.line2}</span>
                    <span className="block text-[7px] sm:text-[9px]">
                        {display.line3}
                    </span>
                </div>
            </div>

            <p
                className="mt-1 text-xs font-black uppercase italic"
                style={{
                    color: theme.textColor,
                    textShadow: `0 0 8px ${theme.glowColor}`,
                }}
            >
                {offer.status === "accepted" ||
                    offer.status === "completed"
                    ? "✓"
                    : ["rejected", "declined", "cancelled"].includes(
                        offer.status
                    )
                        ? "✗"
                        : offer.status === "expired" ||
                            timeRemaining.isExpired
                            ? "ENDED"
                            : "VS"}
            </p>

            <div
                className="mt-2 inline-block rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-wider sm:text-[9px]"
                style={{
                    backgroundColor: `${theme.glowColor}20`,
                    color: theme.textColor,
                    border: `1px solid ${theme.borderColor}`,
                }}
            >
                {offer.status}
            </div>

            {offer.kind && (
                <p className="mt-2 [writing-mode:vertical-rl] text-[10px] font-semibold capitalize text-white/70">
                    {offer.kind}
                </p>
            )}
        </div>
    );
}

export default ChallengeCenterBadge;