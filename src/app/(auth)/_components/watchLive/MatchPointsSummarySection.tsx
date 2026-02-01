"use client";

import MatchPointsCard from "@/shared/components/card/MatchPointsCard";
import { cn } from "@/shared/lib/utils/cn";
import Image from "next/image";
import { ChevronDown, PhilippinePeso } from "lucide-react";
import * as React from "react";

type SideInfo = {
    playerName: string;
    teamLogoSrc: string;
    points: number;
};

type TipSide = "left" | "middle" | "right";
type TipView = "menu" | "custom";

type Props = {
    layout: "tiktok" | "twitch";
    isLive: boolean;
    supportOpen?: boolean;
    left: SideInfo;
    right: SideInfo;
    matchId?: string;
    className?: string;
    leftImage?: string;
    rightImage?: string;
    middleImage?: string;
    middleLabel?: string;
};

function TipPopover({
    open,
    side,
    view,
    align = "center",
    onClose,
    onPesto,
    onOpenCustom,
    onBackToMenu,
    onSendCustom,
}: {
    open: boolean;
    side: TipSide;
    view: TipView;
    align?: "left" | "center" | "right";
    onClose: () => void;
    onPesto: () => void;
    onOpenCustom: () => void;
    onBackToMenu: () => void;
    onSendCustom: (name: string, amount: number) => void;
}) {
    const [name, setName] = React.useState("Michael Rohan");
    const [amount, setAmount] = React.useState<number>(100);

    React.useEffect(() => {
        if (!open) return;
        setName("Michael Rohan");
        setAmount(100);
    }, [open, side]);

    if (!open) return null;

    const pos =
        align === "left"
            ? "left-2"
            : align === "right"
                ? "right-2"
                : "left-1/2 -translate-x-1/2";

    return (
        <div className={cn("absolute z-500 top-full mt-2", pos)}>
            <div
                className={cn(
                    "rounded-2xl",
                    "bg-black/75 backdrop-blur-md",
                    "border border-white/12",
                    "shadow-[0_14px_35px_rgba(0,0,0,0.55)]",
                    "overflow-hidden"
                )}
            >
                {view === "menu" ? (
                    <div className="p-3 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                onPesto();
                                onClose();
                            }}
                            className={cn(
                                "h-9 px-4 rounded-full",
                                "bg-white/10 hover:bg-white/15 transition",
                                "text-white text-sm font-semibold whitespace-nowrap"
                            )}
                        >
                            ₱ Pesto
                        </button>

                        <button
                            type="button"
                            onClick={onOpenCustom}
                            className={cn(
                                "h-9 px-4 rounded-full",
                                "bg-white/10 hover:bg-white/15 transition",
                                "text-white text-sm font-semibold whitespace-nowrap"
                            )}
                        >
                            Custom tip
                        </button>
                    </div>
                ) : (
                    <div
                        className={cn(
                            "w-[84vw] max-w-[360px] sm:max-w-[420px]",
                            "p-3 sm:p-4",
                            "space-y-2 sm:space-y-3"
                        )}
                    >
                        <div className="text-[1rem] text-start text-white">
                            <h2>Send Tip</h2>
                        </div>

                        <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-2 sm:py-2.5 flex items-center gap-2">
                            <span className="text-white/60 text-sm shrink-0">👤</span>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={cn(
                                    "min-w-0 w-full bg-transparent outline-none",
                                    "text-xs sm:text-sm text-white placeholder:text-white/40"
                                )}
                                placeholder="Sender name"
                            />
                        </div>

                        <div className="rounded-xl bg-white/8 border border-white/10 px-3 py-2 sm:py-2.5 flex items-center gap-2">
                            <span className="text-white/70 text-sm shrink-0">₱</span>
                            <input
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value || 0))}
                                inputMode="numeric"
                                className={cn(
                                    "min-w-0 w-full bg-transparent outline-none",
                                    "text-xs sm:text-sm text-white placeholder:text-white/40"
                                )}
                                placeholder="100"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    onSendCustom(name, amount);
                                    onClose();
                                }}
                                className={cn(
                                    "h-10 sm:h-9 w-full",
                                    "rounded-xl font-semibold text-sm",
                                    "bg-fuchsia-500/95 hover:bg-fuchsia-500 transition",
                                    "shadow-[0_10px_22px_rgba(236,72,153,0.35)]"
                                )}
                            >
                                Send
                            </button>
                            <button
                                type="button"
                                onClick={onBackToMenu}
                                className={cn(
                                    "h-10 sm:h-9 w-full sm:w-auto",
                                    "px-3 rounded-xl",
                                    "bg-white/10 hover:bg-white/15 transition",
                                    "text-white/90 text-sm font-semibold"
                                )}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MatchPointsSummarySection({
    isLive,
    supportOpen = false,
    left,
    right,
    matchId,
    className,
    layout = "tiktok",
    leftImage = "/images/home/player_left.jpg",
    rightImage = "/images/home/player_right.jpg",
    middleImage = "/images/home/host.jpg",
    middleLabel = "HOST",
}: Props) {
    const [tipOpen, setTipOpen] = React.useState<TipSide | null>(null);
    const [tipView, setTipView] = React.useState<TipView>("menu");

    const openSide = (side: TipSide) => {
        setTipView("menu");
        setTipOpen((prev) => (prev === side ? null : side));
    };

    return (
        <section className={cn("bg-black text-white", className)}>
            {/* ================= TOP PLAYERS WITH TIP CARETS ================= */}
            <div className="px-2 md:px-4 py-4">
                <div className="flex justify-between">
                    {/* LEFT PLAYER */}
                    <div className="relative">
                        {/* TIP CARET */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 relative">
                            <button
                                type="button"
                                onClick={() => openSide("left")}
                                className={cn(
                                    "h-7 w-10 rounded-full",
                                    "bg-black/55 border border-white/10 backdrop-blur-md",
                                    "flex items-center justify-center",
                                    "hover:bg-black/65 transition"
                                )}
                                aria-label="Tip menu"
                            >
                                <ChevronDown className="h-5 w-5 text-white/90" />
                            </button>

                            <TipPopover
                                open={tipOpen === "left"}
                                side="left"
                                view={tipView}
                                align="left"
                                onClose={() => {
                                    setTipOpen(null);
                                    setTipView("menu");
                                }}
                                onPesto={() => {
                                    console.log("Pesto tip left");
                                    setTipOpen(null);
                                }}
                                onOpenCustom={() => setTipView("custom")}
                                onBackToMenu={() => setTipView("menu")}
                                onSendCustom={(name, amount) => {
                                    console.log("Custom tip left:", name, amount);
                                    setTipOpen(null);
                                    setTipView("menu");
                                }}
                            />
                        </div>
                    </div>
                    {/* RIGHT PLAYER */}
                    <div className="relative">
                        
                        {/* TIP CARET */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 relative">
                            <button
                                type="button"
                                onClick={() => openSide("right")}
                                className={cn(
                                    "h-7 w-10 rounded-full",
                                    "bg-black/55 border border-white/10 backdrop-blur-md",
                                    "flex items-center justify-center",
                                    "hover:bg-black/65 transition"
                                )}
                                aria-label="Tip menu"
                            >
                                <ChevronDown className="h-5 w-5 text-white/90" />
                            </button>

                            <TipPopover
                                open={tipOpen === "right"}
                                side="right"
                                view={tipView}
                                align="right"
                                onClose={() => {
                                    setTipOpen(null);
                                    setTipView("menu");
                                }}
                                onPesto={() => {
                                    console.log("Pesto tip right");
                                    setTipOpen(null);
                                }}
                                onOpenCustom={() => setTipView("custom")}
                                onBackToMenu={() => setTipView("menu")}
                                onSendCustom={(name, amount) => {
                                    console.log("Custom tip right:", name, amount);
                                    setTipOpen(null);
                                    setTipView("menu");
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= MATCH POINTS CARDS ================= */}
            <div >
                <div
                    className={cn(
                        "mx-auto",
                        " md:w-full"
                    )}
                >
                    <div className="grid grid-cols-[1fr_auto_1fr]  gap-2 md:gap-4">
                        <MatchPointsCard
                            playerName={left.playerName}
                            teamLogoSrc={left.teamLogoSrc}
                            title="Matched Points"
                            points={left.points}
                            compact
                            positive={true}
                            shareTitle={`Support ${left.playerName}`}
                            matchId={matchId}
                            playerRef="left"
                        />

                        {/* VS */}
                        <div className="flex flex-col items-center justify-center p-0 md:px-2">
                            <div className="text-[14px] sm:text-[22px] font-extrabold">VS</div>
                            <div className="text-[10px] sm:text-[14px] text-white/80">
                                {isLive ? "Live Now" : "Upcoming"}
                            </div>
                            <div className="text-[9px] sm:text-[13px] text-white/60">
                                {isLive ? (supportOpen ? "Support Open" : "Support Closed") : ""}
                            </div>
                        </div>

                        <MatchPointsCard
                            playerName={right.playerName}
                            teamLogoSrc={right.teamLogoSrc}
                            title="Unmatched Points"
                            points={right.points}
                            compact
                            positive={false}
                            shareTitle={`Support ${right.playerName}`}
                            matchId={matchId}
                            playerRef="right"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
