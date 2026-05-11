"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import SupportDialog from "@/shared/components/watchLive/SupportDialog";
import { useSupportDialog } from "@/shared/hooks/useSupportDialog";
import type { SupportSide } from "@/shared/components/watchLive/types";
import { PlayerCard } from "../card/PlayerCard";
import { StageProps } from "@/types/liveMatchDetails/LiveMatchStage";
import TwitchPlayer from "./TwitchPlayer";
import { formatViewerCount } from "@/shared/lib/utils/formateViewerCount";

export default function LiveMatchStage({

    isLive,
    mode,
    left,
    right,
    middle,
    bossSide,
    rules,
    onRulesClick,
    onSupportLeft,
    onSupportRight,
    watchingPeopleCount,
    modelPicture,
    gameLogo,
    playerOneLogo,
    playerTwoLogo,
    twitchChannel,
    tiktokLink,
}: StageProps & {
    rules?: string | null;
    onRulesClick?: () => void;
    watchingPeopleCount?: number;
    modelPicture?: string;
    gameLogo?: string;


}) {
    const supportDialog = useSupportDialog();

    const handleSupportConfirm = async (
        side: SupportSide,
        supporterName: string,
        amount: number
    ) => {
        try {
            if (side === "left") {
                await onSupportLeft?.(amount, supporterName);
            } else if (side === "right") {
                await onSupportRight?.(amount, supporterName);
            }
            supportDialog.closeDialog();
        } catch (error) {
            console.error("Support failed:", error);
        }
    };

    const getPlayerName = () => {
        return supportDialog.selectedSide === "left" ? left.name : right.name;
    };

    const showTwitchPlayer =
        (mode === "landscape" || mode === "portrait") && Boolean(twitchChannel);

    return (
        <section className="w-full bg-black text-white">
            <div className="mx-auto w-full pt-2 relative">
                <div className="absolute right-0 top-0 z-30">
                    <div className="rounded-bl-xl border border-white/10 bg-black/70 px-2 py-1 text-[8px] font-bold backdrop-blur sm:rounded-full sm:px-3 sm:text-[11px]">
                        {formatViewerCount(watchingPeopleCount || 0)} watching
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-1 mb-2">

                    {/* ── Left Player + Rules Button ── */}
                    <div className="relative">
                        <PlayerCard
                            image={left.imageSrc}
                            name={left.name}
                            points={left.points}
                            status="lose"
                            bossSide={bossSide === "left"}
                            gameLogo={playerOneLogo ?? gameLogo}
                            onClick={() => supportDialog.openDialog("left")}
                        />


                        {rules && onRulesClick && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRulesClick();
                                }}
                                className="
                                    absolute top-1 left-0 z-20
                                    flex items-center gap-1
                                    pl-1.5 pr-2 py-1 rounded-full
                                    text-[#FF2EC8] text-[8px] md:text-[10px] font-bold uppercase tracking-wider
                                    hover:bg-[#FF2EC8]/15 hover:border-[#FF2EC8]
                                    transition-all duration-200
                                    shadow-[0_0_10px_rgba(255,46,200,0.3)]
                                    cursor-pointer
                                "
                            >

                                <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#FF2EC8] flex items-center justify-center flex-shrink-0 shadow-[0_0_6px_rgba(255,46,200,0.6)]">
                                    <span className="text-white font-black text-[10px] leading-none">!</span>
                                </span>

                            </button>
                        )}
                    </div>

                    {/* ── Middle ── */}
                    <div className="relative aspect-3/4 overflow-hidden">
                        <Image
                            src={modelPicture ?? "/images/home/middle.png"}
                            fill
                            className="object-cover"
                            alt="host"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        {tiktokLink ? (
                            <a
                                href={tiktokLink}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute bottom-2 right-2 z-10 inline-flex size-7 items-center justify-center rounded-full border border-white/12 bg-black/65 shadow-[0_10px_24px_rgba(0,0,0,0.32)] backdrop-blur transition hover:scale-105 hover:bg-black/75 sm:size-9"
                                aria-label="Open TikTok stream"
                            >
                                <Image
                                    src="/images/home/tiktok_1.png"
                                    alt="TikTok"
                                    width={18}
                                    height={18}
                                    className="h-4 w-4 object-contain sm:h-5 sm:w-5"
                                />
                            </a>
                        ) : null}
                        <div className="absolute bottom-2 w-full text-center text-[#80f03f] font-extrabold">
                            {middle.label}
                        </div>
                    </div>

                    <PlayerCard
                        image={right.imageSrc}
                        name={right.name}
                        points={right.points}
                        status="win"
                        gameLogo={playerTwoLogo ?? gameLogo}
                        bossSide={bossSide === "right"}
                        onClick={() => supportDialog.openDialog("right")}
                    />
                </div>

                {isLive && (
                    <div className="px-3 pb-3 pt-1 sm:px-4 sm:pb-4">
                        <div
                            className={cn(
                                "relative mx-auto overflow-hidden rounded-[24px] border border-white/12 bg-[radial-gradient(circle_at_top,_rgba(0,195,255,0.18),_transparent_35%),linear-gradient(180deg,_rgba(12,16,24,0.95)_0%,_rgba(2,6,23,0.98)_100%)] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
                                mode === "portrait"
                                    ? "max-w-[23rem] sm:max-w-[25rem]"
                                    : "max-w-[78rem]"
                            )}
                        >
                            <div className="pointer-events-none absolute inset-x-10 top-0 h-20 rounded-full bg-[#00C3FF]/10 blur-3xl" />

                            <div className="relative flex items-center justify-between gap-3 px-2 pb-2 pt-1 sm:px-3">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-[#FF2EC8]/25 bg-[#FF2EC8]/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white sm:text-xs">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF2EC8] shadow-[0_0_12px_rgba(255,46,200,0.95)] animate-pulse" />
                                        Live
                                    </span>
                                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/70 sm:text-xs">
                                        {mode === "portrait" ? "Vertical Stream" : "HD Stream"}
                                    </span>
                                </div>

                            </div>

                            <div
                                className={cn(
                                    "relative overflow-hidden rounded-[20px] border border-white/8 bg-black ring-1 ring-white/6",
                                    mode === "portrait"
                                        ? "aspect-9/16 max-h-[78vh]"
                                        : "aspect-video max-h-[78vh]"
                                )}
                            >
                                {showTwitchPlayer ? (
                                    <TwitchPlayer channel={twitchChannel} />
                                ) : (
                                    <>
                                        <Image
                                            src="/images/home/demo_pitch.jpg"
                                            alt="match"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/12 bg-black/45 px-4 py-3 backdrop-blur">
                                            <p className="text-sm font-semibold text-white">
                                                Stream connection is getting ready
                                            </p>
                                            <p className="mt-1 text-xs text-white/60">
                                                The broadcast will appear here as soon as Twitch finishes syncing.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <SupportDialog
                open={supportDialog.isOpen}
                onOpenChange={supportDialog.closeDialog}
                playerName={getPlayerName()}
                side={supportDialog.selectedSide}
                defaultSupporterName={getPlayerName()}
                defaultAmount={100}
                onConfirm={handleSupportConfirm}
            />
        </section>
    );
}
