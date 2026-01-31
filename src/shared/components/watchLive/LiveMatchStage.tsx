"use client";

import * as React from "react";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/shared/lib/utils/cn";
import type { Side } from "@/shared/hooks/useMatchDemoStore";
import { ChevronDown, PhilippinePeso } from "lucide-react";
import MatchGuidelinesDialog from "@/shared/components/match/MatchGuidelinesDialog";

type TipSide = "left" | "middle" | "right";
type TipView = "menu" | "custom";

type StageProps = {
    matchId: string;
    playbackId: string;
    isLive: boolean;
    tipEnabled?: boolean;

    mode?: "tiktok" | "twitch"; // tiktok=3 panel, twitch=mux
    supportClosed: boolean;

    left: { name: string; points: number; imageSrc: string };
    right: { name: string; points: number; imageSrc: string };
    middle: { label: string; imageSrc: string };
    bossSide: Side | null;

    onSupportLeft?: () => void;
    onSupportRight?: () => void;
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
        // open হলে reset (optional)
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
        <div className={cn("absolute z-50 top-full mt-2", pos)}>


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
                                "w-[84vw] max-w-[360px] sm:max-w-[420px]",
                                "p-3 sm:p-4",
                                "space-y-2 sm:space-y-3"
                            )}
                        >
                            <div className="text-[1rem] text-start text-white">
                            <h2> Send Tip </h2>
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

function FlyingPeso({
    id,
    xPercent,
    onDone,
}: {
    id: string;
    xPercent: number; // target X in %
    onDone: (id: string) => void;
}) {
    React.useEffect(() => {
        const t = setTimeout(() => onDone(id), 900);
        return () => clearTimeout(t);
    }, [id, onDone]);

    return (
        <div
            className="absolute bottom-6 pointer-events-none"
            style={{
                left: "50%",
                transform: "translateX(-50%)",
                animation: "pesoFly 0.9s ease-out forwards",
                // @ts-ignore
                ["--tx" as any]: `${xPercent - 50}%`,
            }}
        >
            <div className="h-10 w-10 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center">
                <span className="text-white text-lg font-black">₱</span>
            </div>

            <style jsx>{`
        @keyframes pesoFly {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(0) scale(0.9);
          }
          15% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(calc(-50% + var(--tx))) translateY(-260px)
              scale(1.15);
          }
        }
      `}</style>
        </div>
    );
}

export default function LiveMatchStage({
    matchId,
    playbackId,
    isLive,
    mode,
    supportClosed,
    left,
    right,
    middle,
    bossSide,
    onSupportLeft,
    onSupportRight,
    tipEnabled = false,
}: StageProps) {
    const playerId = `mux-${matchId}`;

    const showTipUI = tipEnabled && mode === "tiktok";

    // popover state
    const [tipOpen, setTipOpen] = React.useState<TipSide | null>(null);
    const [tipView, setTipView] = React.useState<TipView>("menu");

    // outside click close (no backdrop/blur)
    const stageRef = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!tipOpen) return;
            const el = stageRef.current;
            if (!el) return;
            if (!el.contains(e.target as Node)) {
                setTipOpen(null);
                setTipView("menu");
            }
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [tipOpen]);

    // flying tips
    const [flying, setFlying] = React.useState<Array<{ id: string; side: TipSide }>>(
        []
    );

    const sideToX = (side: TipSide) => {
        if (side === "left") return 16.6; // left panel center
        if (side === "middle") return 50; // middle
        return 83.4; // right
    };

    const triggerFly = (side: TipSide) => {
        const id = `${Date.now()}-${Math.random()}`;
        setFlying((p) => [...p, { id, side }]);
    };

    const sendPesto = (side: TipSide) => {
        console.log("[Pesto Tip] send:", side);
        triggerFly(side);
    };

    const sendCustom = (side: TipSide, name: string, amount: number) => {
        console.log("[Custom Tip] send:", { side, name, amount });
        triggerFly(side);
    };

    const openSide = (side: TipSide) => {
        setTipView("menu");
        setTipOpen((prev) => (prev === side ? null : side));
    };

    return (
        <section className="w-full bg-black text-white">
            <div className={cn("mx-auto w-full px-3 md:px-4 pt-2")}>
                {/* Guidelines Icon */}
                <div className="flex justify-end mb-2">
                    <MatchGuidelinesDialog matchId={matchId} />
                </div>

                {/* Stage */}
                <div
                    ref={stageRef}
                    className="relative w-full aspect-video bg-black overflow-visible rounded-md border border-white/10"
                >
                    {/* Content */}
                    {mode === "twitch" ? (
                        isLive ? (
                            <MuxPlayer
                                playbackId={playbackId}
                                autoPlay
                                muted
                                playsInline
                                streamType="live"
                                className="absolute inset-0 w-full h-full"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white/70">
                                Live starts soon...
                            </div>
                        )
                    ) : (
                        <div className="absolute inset-0 grid grid-cols-3">
                            {/* LEFT */}
                            <div
                                className={cn(
                                    "relative",
                                    bossSide === "left" ? "border border-bold border-yellow-300" : ""
                                )}
                            >
                                <Image src={left.imageSrc} alt={left.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                                {/* bottom info + caret */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center z-30">
                                    <div>
                                        <Image
                                            src={"/images/home/taken_slot.png"}
                                            alt="available"
                                            width={70}
                                            height={70}
                                        />
                                    </div>

                                    <div className="text-[#B7FF4A] font-extrabold text-xl flex items-center justify-center">
                                        <span className="text-2xl">{left.points} </span>
                                        <span className="text-white">
                                            <PhilippinePeso size={20} />
                                        </span>
                                    </div>

                                    <div className="text-[#DD2E03] font-extrabold text-2xl">
                                        {left.name}
                                    </div>

                                    {showTipUI && (
                                        <div className="relative mt-1 flex justify-center">
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
                                                onPesto={() => sendPesto("left")}
                                                onOpenCustom={() => setTipView("custom")}
                                                onBackToMenu={() => setTipView("menu")}
                                                onSendCustom={(name, amount) => sendCustom("left", name, amount)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* MIDDLE */}
                            <div className="relative">
                                <Image src={middle.imageSrc} alt="model" fill className="object-cover" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-30">
                                    <div
                                        className="text-[#80f03f] font-extrabold text-2xl"
                                        style={{ textShadow: "0 2px 8px rgba(255, 193, 7, 0.5)" }}
                                    >
                                        {middle.label}
                                    </div>

                                    {showTipUI && (
                                        <div className="relative mt-2 flex justify-center">
                                            <button
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
                                                onClose={() => {
                                                    setTipOpen(null);
                                                    setTipView("menu");
                                                }}
                                                onPesto={() => sendPesto("middle")}
                                                onOpenCustom={() => setTipView("custom")}
                                                onBackToMenu={() => setTipView("menu")}
                                                onSendCustom={(name, amount) =>
                                                    sendCustom("middle", name, amount)
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div
                                className={cn(
                                    "relative",
                                    bossSide === "right" ? "border border-bold border-yellow-300" : ""
                                )}
                            >
                                <Image src={right.imageSrc} alt={right.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center z-30">
                                    <div>
                                        <Image
                                            src={"/images/home/available_slot.png"}
                                            alt="available"
                                            width={70}
                                            height={70}
                                        />
                                    </div>

                                    <div className="text-[#B7FF4A] font-extrabold text-xl flex items-center justify-center">
                                        <span className="text-2xl">{right.points} </span>
                                        <span className="text-white">
                                            <PhilippinePeso size={20} />
                                        </span>
                                    </div>

                                    <div className="text-[#DD2E03] font-extrabold text-2xl">
                                        {right.name}
                                    </div>

                                    {showTipUI && (
                                        <div className="relative mt-1 flex justify-center">
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
                                                onPesto={() => sendPesto("right")}
                                                onOpenCustom={() => setTipView("custom")}
                                                onBackToMenu={() => setTipView("menu")}
                                                onSendCustom={(name, amount) =>
                                                    sendCustom("right", name, amount)
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Flying ₱ overlay */}
                    {showTipUI && (
                        <div className="absolute inset-0 z-50 pointer-events-none">
                            {flying.map((t) => (
                                <FlyingPeso
                                    key={t.id}
                                    id={t.id}
                                    xPercent={sideToX(t.side)}
                                    onDone={(id) => setFlying((p) => p.filter((x) => x.id !== id))}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
