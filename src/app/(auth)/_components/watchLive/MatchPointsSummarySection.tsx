"use client";

import MatchPointsCard from "@/shared/components/card/MatchPointsCard";
import { cn } from "@/shared/lib/utils/cn";
import Image from "next/image";
import { ChevronDown, PhilippinePeso } from "lucide-react";
import * as React from "react";
import SupportDialog from "@/shared/components/watchLive/SupportDialog";

type SideInfo = {
    playerName: string;
    teamLogoSrc: string;
    points: number;
};

type TipSide = "left" | "middle" | "right";
type TipView = "menu" | "custom";

function FlyingPeso({
    id,
    xPercent,
    ty,
    rot,
    dur,
    onDone,
}: {
    id: string;
    xPercent: number;
    ty?: number;
    rot?: number;
    dur?: number;
    onDone: (id: string) => void;
}) {
    React.useEffect(() => {
        const t = setTimeout(() => onDone(id), 900);
        return () => clearTimeout(t);
    }, [id, onDone]);

    return (
        <div
            className="fixed bottom-1/2 left-1/2 pointer-events-none z-[9999]"
            style={{
                transform: "translateX(-50%)",
                animation: "pesoFly var(--dur) ease-out forwards",
                ["--tx" as string]: `${xPercent - 50}%`,
                ["--ty" as string]: `${ty ?? -400}px`,
                ["--rot" as string]: `${rot ?? 0}deg`,
                ["--dur" as string]: `${dur ?? 900}ms`,
            } as React.CSSProperties}
        >
            <div className="h-10 w-10 rounded-full bg-yellow-400/80 border-2 border-yellow-300 flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-black">₱</span>
            </div>

            <style jsx>{`
                @keyframes pesoFly {
                    0% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0) scale(1) rotate(0deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(calc(-50% + var(--tx))) translateY(var(--ty)) scale(0.5) rotate(var(--rot));
                    }
                }
            `}</style>
        </div>
    );
}

// type TipSide = "left" | "middle" | "right";

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
    tipEnabled?: boolean;
    onSupportLeft?: (amount: number, supporterName?: string) => void;
    onSupportRight?: (amount: number, supporterName?: string) => void;
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
    triggerFly,
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
    triggerFly: (side: TipSide) => void;
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
        <div data-tip-popover className={cn("absolute z-[9999] top-full mt-2", pos)} onClick={(e) => e.stopPropagation()}>
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
                    <div className="p-1 md:p-3 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                console.log("Peso tip clicked - multiple coins");
                                // Trigger 5 coins at once
                                for (let i = 0; i < 5; i++) {
                                    setTimeout(() => triggerFly(side), i * 100);
                                }
                                // onClose();
                            }}
                            className={cn(
                                "h-7 px-3 rounded-full",
                                "bg-white/10 hover:bg-white/15 transition",
                                "text-white text-sm font-semibold whitespace-nowrap"
                            )}
                        >
                            ₱
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
                            "w-[84vw] max-w-[350px] sm:max-w-[420px]",
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
    tipEnabled,
    left,
    right,
    matchId,
    className,
    layout = "tiktok",
    leftImage = "/images/home/player_left.jpg",
    rightImage = "/images/home/player_right.jpg",
    middleImage = "/images/home/host.jpg",
    middleLabel = "HOST",
    onSupportLeft,
    onSupportRight,
}: Props) {
    const [tipOpen, setTipOpen] = React.useState<TipSide | null>(null);
    const [tipView, setTipView] = React.useState<TipView>("menu");
    const [supportDialogOpen, setSupportDialogOpen] = React.useState(false);
    const [supportDialogSide, setSupportDialogSide] =
        React.useState<"left" | "right">("left");
        const [flying, setFlying] = React.useState<
            Array<{
                id: string;
                side: TipSide;
                txJitter?: number; // percent
                ty?: number; // px (negative)
                rot?: number; // deg
                dur?: number; // ms
            }>
        >([]);
    
        const sideToX = (side: TipSide) =>
            side === "left" ? 16.6 : side === "middle" ? 50 : 83.4;
    
        const triggerFly = (side: TipSide) => {
            // randomize jitter, vertical distance, rotation and duration
            const txJitter = Math.round((Math.random() * 16 - 8) * 10) / 10; // -8 .. 8 percent
            const ty = -(300 + Math.round(Math.random() * 200)); // -300 .. -500 px
            const rot = Math.round(Math.random() * 40 - 20); // -20 .. 20 deg
            const dur = 700 + Math.round(Math.random() * 600); // 700 .. 1300 ms

            setFlying((p) => [
                ...p,
                {
                    id: `${Date.now()}-${Math.random()}`,
                    side,
                    txJitter,
                    ty,
                    rot,
                    dur,
                },
            ]);
        };

        // Prevent outside clicks from closing the TipPopover while it's open.
        // We use a capture-phase mousedown listener to stop other handlers
        // from reacting to outside clicks. Allow clicks that are on the
        // caret button for the currently open side or inside the popover.
        React.useEffect(() => {
            function handleDocMouseDown(e: MouseEvent) {
                if (!tipOpen) return;
                const target = e.target as Element | null;
                if (!target) return;
                // allow clicks inside the popover
                if (target.closest('[data-tip-popover]')) return;
                // allow clicks on the caret button that toggles this popover
                if (target.closest(`[data-tip-caret="${tipOpen}"]`)) return;
                // otherwise block other handlers from closing popovers
                e.stopImmediatePropagation();
            }

            document.addEventListener("mousedown", handleDocMouseDown, true);
            return () => document.removeEventListener("mousedown", handleDocMouseDown, true);
        }, [tipOpen]);
    

    const openSupportDialog = (side: "left" | "right") => {
        setSupportDialogSide(side);
        setSupportDialogOpen(true);
    };
    const handleSupportConfirm = (
        side: "left" | "right" | "middle",
        supporterName: string,
        amount: number
    ) => {
        side === "left"
            ? onSupportLeft?.(amount, supporterName)
            : onSupportRight?.(amount, supporterName);
        // Trigger 5 coins sequentially
        for (let i = 0; i < 5; i++) {
            setTimeout(() => triggerFly(side as TipSide), i * 100);
        }
    };

    const openSide = (side: TipSide) => {
        setTipView("menu");
        setTipOpen((prev) => (prev === side ? null : side));
    };

    return (
        <section className={cn(" text-white relative", className)}>
            {/* Flying Coins Container */}
            <div className="fixed inset-0 pointer-events-none z-[9999]">
                {flying.map((f) => (
                    <FlyingPeso
                        key={f.id}
                        id={f.id}
                        xPercent={sideToX(f.side) + (f.txJitter ?? 0)}
                        ty={f.ty}
                        rot={f.rot}
                        dur={f.dur}
                        onDone={(id) =>
                            setFlying((p) => p.filter((x) => x.id !== id))
                        }
                    />
                ))}
            </div>
            {/* ================= TOP PLAYERS WITH TIP CARETS ================= */}
            {tipEnabled && <div className="px-2 md:px-4 md:py-4">
                <div className="flex justify-between">
                    {/* LEFT PLAYER */}
                    <div className="relative">
                        {/* TIP CARET */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-[20]">
                            <button
                                data-tip-caret="left"
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
                                triggerFly={triggerFly}
                                onClose={() => {
                                    setTipOpen(null);
                                    setTipView("menu");
                                }}
                                onPesto={() => {
                                    console.log("Pesto tip left");
                                    triggerFly("left");
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
                    <div className="relative">
                        {/* TIP CARET */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-[20]">
                            <button
                                data-tip-caret="middle"
                                type="button"
                                onClick={() => openSide("middle")}
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
                                open={tipOpen === "middle"}
                                side="middle"
                                view={tipView}
                                align="center"
                                triggerFly={triggerFly}
                                onClose={() => {
                                    setTipOpen(null);
                                    setTipView("menu");
                                }}
                                onPesto={() => {
                                    console.log("Pesto tip middle");
                                    triggerFly("middle");
                                    setTipOpen(null);
                                }}
                                onOpenCustom={() => setTipView("custom")}
                                onBackToMenu={() => setTipView("menu")}
                                onSendCustom={(name, amount) => {
                                    console.log("Custom tip middle:", name, amount);
                                    setTipOpen(null);
                                    setTipView("menu");
                                }}
                            />
                        </div>
                    </div>
                    {/* RIGHT PLAYER */}
                    <div className="relative">

                        {/* TIP CARET */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-[20]">
                            <button
                                data-tip-caret="right"
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
                                triggerFly={triggerFly}
                                onClose={() => {
                                    setTipOpen(null);
                                    setTipView("menu");
                                }}
                                onPesto={() => {
                                    console.log("Pesto tip right");
                                    triggerFly("right");
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
            </div> }

            {/* ================= MATCH POINTS CARDS ================= */}
            <div >
                <div
                    className={cn(
                        "mx-auto",
                        " md:w-full"
                    )}
                >
                    <div className="grid grid-cols-[1fr_auto_1fr] py-6  gap-2 md:gap-4">
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
                            onClick={() => openSupportDialog("left")}
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
                            onClick={() => openSupportDialog("right")}
                        />
                    </div>
                </div>
                
                <SupportDialog
                    open={supportDialogOpen}
                    onOpenChange={setSupportDialogOpen}
                    playerName={supportDialogSide === "left" ? left.playerName : right.playerName}
                    side={supportDialogSide}
                    defaultSupporterName="Michael Rohan"
                    defaultAmount={100}
                    onConfirm={handleSupportConfirm}
                />
            </div>
        </section>
    );
}
