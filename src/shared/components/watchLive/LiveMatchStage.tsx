"use client";

import * as React from "react";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/shared/lib/utils/cn";
import type { Side } from "@/shared/hooks/useMatchDemoStore";
import { ChevronDown, PhilippinePeso } from "lucide-react";
import MatchGuidelinesDialog from "@/shared/components/match/MatchGuidelinesDialog";
import SupportDialog from "@/shared/components/watchLive/SupportDialog";

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
                ["--tx" as string]: `${xPercent - 50}%`,
            } as React.CSSProperties}
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
    left,
    right,
    middle,
    bossSide,
    tipEnabled = false,
    onSupportLeft,
    onSupportRight,
}: StageProps) {
    const showTipUI = tipEnabled && mode === "tiktok";

    /* ---------------- SUPPORT DIALOG ---------------- */
    const [supportDialogOpen, setSupportDialogOpen] = React.useState(false);
    const [supportDialogSide, setSupportDialogSide] =
        React.useState<"left" | "right">("left");

    const openSupportDialog = (side: "left" | "right") => {
        setSupportDialogSide(side);
        setSupportDialogOpen(true);
    };

    const handleSupportConfirm = (
        side: "left" | "right",
        supporterName: string,
        amount: number
    ) => {
        side === "left"
            ? onSupportLeft?.(amount, supporterName)
            : onSupportRight?.(amount, supporterName);
        triggerFly(side);
    };

    /* ---------------- TIP STATE ---------------- */
    const [tipOpen, setTipOpen] = React.useState<TipSide | null>(null);
    const [tipView, setTipView] = React.useState<TipView>("menu");

    /* ---------------- FLYING MONEY ---------------- */
    const [flying, setFlying] = React.useState<
        Array<{ id: string; side: TipSide }>
    >([]);

    const sideToX = (side: TipSide) =>
        side === "left" ? 16.6 : side === "middle" ? 50 : 83.4;

    const triggerFly = (side: TipSide) => {
        setFlying((p) => [
            ...p,
            { id: `${Date.now()}-${Math.random()}`, side },
        ]);
    };

    /* ========================================================= */
    return (
        <section className="w-full bg-black text-white">
            <div className="mx-auto w-full  pt-2">

                {/* Guidelines */}
                {/* <div className="flex justify-end mb-2">
                    <MatchGuidelinesDialog matchId={matchId} />
                </div> */}

                {/* ================= MOBILE TOP PLAYERS ================= */}
                <div className="grid grid-cols-3 gap-1 mb-2">
                    {/* LEFT */}
                    <PlayerCard
                        image={left.imageSrc}
                        name={left.name}
                        points={left.points}
                        status="lose"
                        onClick={() => openSupportDialog("left")}
                    />

                    {/* MIDDLE */}
                    <div className="relative aspect-[3/4]  overflow-hidden">
                        <Image src={middle.imageSrc} fill className="object-cover" alt="host" />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute bottom-2 w-full text-center text-[#80f03f] font-extrabold">
                            {middle.label}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <PlayerCard
                        image={right.imageSrc}
                        name={right.name}
                        points={right.points}
                        status="win"
                        onClick={() => openSupportDialog("right")}
                    />
                </div>
                {/* ================= LIVE VIDEO ================= */}
                {isLive && <div className={cn(
                    // portrait: tall, landscape: standard video
                    (mode === "tiktok") ? "w-full max-w-[420px] mx-auto aspect-[9/16]" : "w-full aspect-video",
                    "relative rounded-xl overflow-hidden border border-white/10"
                )}>
                    {(mode === "twitch") || (mode === "tiktok") ? (
                        isLive ? (
                            <MuxPlayer
                                playbackId={playbackId}
                                autoPlay
                                muted
                                playsInline
                                streamType="live"
                                className="absolute inset-0 w-full h-full"
                                style={{ objectFit: (mode === "tiktok") ? "contain" : "cover" }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white/60">
                                Live starts soon...
                            </div>
                        )
                    ) : (
                        <Image
                            src="/images/home/demo_pitch.jpg"
                            alt="match"
                            fill
                            className="object-cover"
                        />
                    )}

                    {/* Flying Peso */}
                    {showTipUI && (
                        <div className="absolute inset-0 pointer-events-none z-50">
                            {flying.map((f) => (
                                <FlyingPeso
                                    key={f.id}
                                    id={f.id}
                                    xPercent={sideToX(f.side)}
                                    onDone={(id) =>
                                        setFlying((p) => p.filter((x) => x.id !== id))
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>}
            </div>

            {/* ================= SUPPORT POPUP ================= */}
            <SupportDialog
                open={supportDialogOpen}
                onOpenChange={setSupportDialogOpen}
                playerName={supportDialogSide === "left" ? left.name : right.name}
                side={supportDialogSide}
                defaultSupporterName="Michael Rohan"
                defaultAmount={100}
                onConfirm={handleSupportConfirm}
            />
        </section>
    );
}

/* ================= PLAYER CARD ================= */
function PlayerCard({
    image,
    name,
    points,
    status,
    onClick,
}: {
    image: string;
    name: string;
    points: number;
    status: "win" | "lose";
    onClick: () => void;
}) {
    return (
        <div className="relative aspect-[3/4]  overflow-hidden">
            <Image src={image} fill className="object-cover" alt={name} />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                <div
                    className={cn(
                        "text-xl font-extrabold",
                        status === "win" ? "text-green-400" : "text-red-500"
                    )}
                >
                    {status === "win" ? "O" : "X"}
                </div>

                <button
                    onClick={onClick}
                    className="text-white font-bold text-sm hover:underline"
                >
                    {name}
                </button>

                <div className="text-yellow-400 text-sm flex items-center justify-center gap-1">
                    {points} <PhilippinePeso size={14} />
                </div>
            </div>
        </div>
    );
}

