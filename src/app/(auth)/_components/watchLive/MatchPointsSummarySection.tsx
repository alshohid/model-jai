/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { cn } from "@/shared/lib/utils/cn";
import MatchPointsCard from "@/shared/components/card/MatchPointsCard";
import VotingRankTable from "@/shared/components/rankPointTable/VotingRankTable";
import SupportDialog from "@/shared/components/watchLive/SupportDialog";
import FlyingPeso from "@/shared/components/watchLive/FlyingPeso";
import TipPopover from "@/shared/components/watchLive/TipPopover";
import { useTipSystem } from "@/shared/hooks/useTipSystem";
import { useSupportDialog } from "@/shared/hooks/useSupportDialog";
import type {
    SupportSide,
} from "@/shared/components/watchLive/types";
import { MatchPointsSummarySectionProps } from "@/types/liveMatchDetails/MatchPointSummerySectionProps";
import { getSideXPosition } from "@/lib/helper/getSideXPosition";
import { TipCaretButton } from "@/shared/UI/button/TipCaretButton";
import { useSendTipMutation } from "@/redux/features/support/supportManagement";
import { toast } from "sonner";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useGoVoteForPlayerMutation } from "@/redux/features/match/matchManagement";
import { getErrorMessage } from "@/lib/utils";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import { getVotingEndTime } from "@/shared/lib/utils/votingTime";
import ReferralShareSheet from "@/shared/components/myProfile/ReferralShareSheet";
import { Clock3, PhilippinePeso, Sparkles } from "lucide-react";
import { useMatchVoting } from "@/shared/providers/hook/useMatchVoting";

type VoteSide = "left" | "right";
const VOTE_PRICE_USD = 0.5;

function formatCountdown(remainingMs: number) {
    const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatVoteUsd(amount: number) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: amount % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 2,
    }).format(amount);
}

function CompletedVotingCard({
    playerName,
    imageSrc,
    accentClassName,
    onClick,
    onShareClick,
    disabled = false,
    voteCount = 0,
}: {
    playerName: string;
    imageSrc: string;
    accentClassName: string;
    onClick: () => void;
    onShareClick: () => void;
    disabled?: boolean;
    voteCount?: number;
}) {
    return (
        <div
            className={cn(
                "w-full min-w-0 overflow-hidden rounded-[18px] border border-white/10 bg-[#17181F] p-1.5 text-left shadow-[0_14px_36px_rgba(0,0,0,0.34)] sm:rounded-[28px] sm:p-4",
                disabled ? "opacity-75" : ""
            )}
        >
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={cn(
                    "group relative block w-full rounded-[16px] text-left transition-transform duration-300 sm:rounded-[26px]",
                    disabled
                        ? "cursor-not-allowed"
                        : "active:scale-[0.98] hover:-translate-y-1"
                )}
            >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))]" />
                <div className="absolute inset-[2px] rounded-[16px] border border-white/6 sm:rounded-[26px]" />

                <div className="relative flex min-h-[168px] flex-col justify-between px-1 py-1 sm:min-h-[276px]">
                    <div className="mx-auto mb-2 size-10 overflow-hidden rounded-full border-2 border-white/12 shadow-[0_10px_24px_rgba(0,0,0,0.35)] sm:mb-4 sm:size-16">
                        <img
                            src={imageSrc}
                            alt={playerName}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <p className="text-center text-[8px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-[12px] sm:tracking-[0.28em]">
                        Vote
                    </p>
                    <h3
                        className={cn(
                            "mx-auto mt-1.5 max-w-[8ch] break-words text-center text-[0.8rem] font-semibold leading-[0.95] sm:mt-2 sm:text-[1rem] md:text-[2rem]",
                            "drop-shadow-[0_0_14px_rgba(217,70,239,0.45)]",
                            accentClassName
                        )}
                    >
                        {playerName}
                    </h3>

                    <div className="mt-2 text-center">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-[10px] sm:tracking-[0.24em]">
                            Current Votes
                        </p>
                        <p className="mt-1 text-base font-bold text-white sm:text-2xl">
                            {voteCount}
                        </p>
                    </div>

                    <div className="mt-3 rounded-[14px] border border-white/8 bg-[#090B11] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:mt-5 sm:rounded-[24px] sm:px-4 sm:py-3">
                        <div className="flex items-center justify-between gap-1.5">
                            <div
                                className={cn(
                                    "size-3 rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.35)] sm:size-11",
                                    "bg-[radial-gradient(circle_at_30%_30%,#d946ef,#7e22ce_72%)]"
                                )}
                            />
                            <div className="flex min-w-0 items-center justify-end gap-1.5 text-white">
                                <span className="text-right text-[7px] font-semibold uppercase tracking-[0.08em] text-white/48 sm:text-[11px] sm:tracking-[0.24em]">
                                    Vote Now
                                </span>
                                <PhilippinePeso size={12} className="shrink-0 text-white/92 sm:size-7" />
                            </div>
                        </div>
                    </div>
                </div>
            </button>

            <button
                type="button"
                onClick={onShareClick}
                className="mt-2.5 flex h-8 w-full items-center justify-center rounded-[14px] bg-navActive px-2 text-[11px] font-semibold leading-tight text-white shadow-[3px_3px_0_0_rgba(255,255,255,1),inset_0_0_0_2px_rgba(255,255,255,1)] transition hover:opacity-95 sm:mt-3 sm:h-10 sm:rounded-[16px] sm:px-3 sm:text-xs sm:shadow-[4px_4px_0_0_rgba(255,255,255,1),inset_0_0_0_2px_rgba(255,255,255,1)]"
            >
                Share Referral
            </button>
        </div>
    );
}


export default function MatchPointsSummarySection({
    isLive,
    tipEnabled,
    left,
    right,
    matchId,
    className,
    onSupportLeft,
    onSupportRight,
    userReferralNo,
    leftPlayerImageSrc,
    rightPlayerImageSrc,
    matchData,
}: MatchPointsSummarySectionProps) {
    const searchParams = useSearchParams();
    const tipSystem = useTipSystem();
    const supportDialog = useSupportDialog();
    const [sendTip, { isLoading: isTipSending }] = useSendTipMutation();
    const [currentTime, setCurrentTime] = useState(() => new Date());
    const [voteModalOpen, setVoteModalOpen] = useState(false);
    const [shareSheetOpen, setShareSheetOpen] = useState(false);
    const [shareSheetTitle, setShareSheetTitle] = useState("");
    const [shareUrl, setShareUrl] = useState("");
    const [selectedVoteSide, setSelectedVoteSide] = useState<VoteSide>("left");
    const [voteCount, setVoteCount] = useState("1");
    const { votingSession } = useMatchVoting(matchId);
    const defaultVoteLeftImage = getSafeImageSrc(
        matchData?.player_one_logo || leftPlayerImageSrc,
        "/images/home/avatar_img.png",
    );
    const defaultVoteRightImage = getSafeImageSrc(
        matchData?.player_two_logo || rightPlayerImageSrc,
        "/images/home/avatar_img.png",
    );
    const effectiveVoteStartTime =
        votingSession?.voteStartTime ?? matchData?.vote_start_time ?? null;
    const effectiveVotingTime =
        votingSession?.votingTime ?? matchData?.voting_time ?? null;
    const [goVoteForPlayer, { isLoading: isVoteSubmitting }] =
        useGoVoteForPlayerMutation();

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => window.clearInterval(timer);
    }, []);

    const votingEndTime = useMemo(
        () => getVotingEndTime(effectiveVoteStartTime, effectiveVotingTime),
        [effectiveVoteStartTime, effectiveVotingTime],
    );
    const remainingVotingMs = votingEndTime
        ? Math.max(0, votingEndTime.getTime() - currentTime.getTime())
        : 0;
    const isVotingStarted = Boolean(effectiveVoteStartTime && votingEndTime);
    const isVotingOpen = Boolean(votingEndTime && remainingVotingMs > 0);
    const isVotingFinished = Boolean(votingEndTime && remainingVotingMs <= 0);
    const shouldShowVotingPanel = isVotingStarted;
    const isVoteModalVisible = voteModalOpen && isVotingOpen;
    const routeMatchId = useMemo(() => {
        const parsedMatchId = Number(matchId);

        return Number.isInteger(parsedMatchId) && parsedMatchId > 0
            ? parsedMatchId
            : null;
    }, [matchId]);
    const voteTargetMatchId = routeMatchId ?? votingSession?.matchForVotingId ?? null;
    const leftPlayerVotes = Number(
        votingSession?.playerOneVotes ?? matchData?.player_one_votes ?? 0,
    );
    const rightPlayerVotes = Number(
        votingSession?.playerTwoVotes ?? matchData?.player_two_votes ?? 0,
    );
    const hasSideVoteCounts =
        votingSession?.playerOneVotes != null ||
        votingSession?.playerTwoVotes != null ||
        matchData?.player_one_votes != null ||
        matchData?.player_two_votes != null;
    const totalVotes = hasSideVoteCounts
        ? leftPlayerVotes + rightPlayerVotes
        : Number(votingSession?.totalVotes ?? 0);
    const topVoters = votingSession?.topVoters ?? matchData?.top_voters ?? [];
    const votingWindowMinutes = Number(effectiveVotingTime ?? 0);
    const votingWindowLabel =
        votingWindowMinutes > 0 ? `${votingWindowMinutes} Min Window` : "Voting Session";
    const leftVoteImage = getSafeImageSrc(
        votingSession?.playerOneImage || defaultVoteLeftImage,
        "/images/home/avatar_img.png",
    );
    const rightVoteImage = getSafeImageSrc(
        votingSession?.playerTwoImage || defaultVoteRightImage,
        "/images/home/avatar_img.png",
    );
    const middleTipName = "Model";
    const currentPlatform = searchParams.get("platform") || "tiktok";

    const handleVoteShare = (playerName: string) => {
        if (typeof window === "undefined" || !routeMatchId) {
            toast.error("Match link is not available right now.");
            return;
        }

        const nextShareUrl =
            `${window.location.origin}/live-stream/match/${routeMatchId}?platform=${encodeURIComponent(currentPlatform)}`;

        setShareSheetTitle(`Vote for ${playerName}`);
        setShareUrl(nextShareUrl);
        setShareSheetOpen(true);
    };

    const handleSupportConfirm = async (
        side: "left" | "right" | "middle",
        supporterName: string,
        amount: number
    ) => {
        try {
            if (side === "left") {
                await onSupportLeft?.(amount, supporterName);
            } else if (side === "right") {
                await onSupportRight?.(amount, supporterName);
            }

            for (let i = 0; i < 5; i++) {
                setTimeout(() => tipSystem.triggerFlyingCoin(side as SupportSide), i * 100);
            }

            supportDialog.closeDialog();
        } catch (error) {
            console.error("Support failed:", error);
        }
    };

    const getPlayerName = () => {
        return supportDialog.selectedSide === "left" ? left.playerName : right.playerName;
    };

    const handleCardClick = (side: "left" | "right") => {
        supportDialog.openDialog(side);
    };

    const handleVoteCardClick = (side: VoteSide) => {
        if (!isVotingOpen) {
            toast.error(
                isVotingFinished
                    ? "Voting has already finished for this match."
                    : "Voting is not available for this match yet.",
            );
            return;
        }

        if (!voteTargetMatchId) {
            toast.error("Voting match id not found.");
            return;
        }

        setSelectedVoteSide(side);
        setVoteCount("1");
        setVoteModalOpen(true);
    };

    const getReceiverId = (side: "left" | "right" | "middle") => {
        if (side === "left") return left.playerId;
        if (side === "right") return right.playerId;
        return null;
    };

    const handleSendTip = async (
        side: "left" | "right" | "middle",
        amount: number,
        options?: { closeOnSuccess?: boolean }
    ) => {
        try {
            const receiverId = side === "middle" ? 1 : getReceiverId(side);

            if (!receiverId) {
                toast.error("Tip receiver not found.");
                return;
            }

            await sendTip({
                receiver_id: String(receiverId),
                tip_amount: amount,
            }).unwrap();

            for (let i = 0; i < 5; i++) {
                setTimeout(() => tipSystem.triggerFlyingCoin(side as SupportSide), i * 100);
            }

            toast.success("Tip sent successfully.");
            if (options?.closeOnSuccess ?? true) {
                tipSystem.closeTip();
            }
        } catch (error: any) {
            console.error("Tip send failed:", error);
            toast.error(error?.data?.message || "Failed to send tip.");
        }
    };

    const selectedVotePlayer = selectedVoteSide === "left"
        ? {
            id: left.playerId,
            name: left.playerName,
            image: leftVoteImage,
        }
        : {
            id: right.playerId,
            name: right.playerName,
            image: rightVoteImage,
        };
    const parsedVoteCount = Number(voteCount);
    const hasValidVoteCount =
        Number.isInteger(parsedVoteCount) && parsedVoteCount > 0;
    const totalVoteCost = hasValidVoteCount
        ? parsedVoteCount * VOTE_PRICE_USD
        : 0;

    const handleVoteSubmit = async () => {
        if (!isVotingOpen) {
            toast.error("Voting window is closed for this match.");
            return;
        }

        if (!voteTargetMatchId) {
            toast.error("Voting match not found.");
            return;
        }

        if (!Number.isInteger(parsedVoteCount) || parsedVoteCount <= 0) {
            toast.error("Enter a valid vote count.");
            return;
        }

        try {
            const response = await goVoteForPlayer({
                matchForVotingId: voteTargetMatchId,
                playerId: selectedVotePlayer.id,
                voteCount: parsedVoteCount,
            }).unwrap();
            toast.success(response.message || "Vote submitted successfully");
            setVoteModalOpen(false);
            setVoteCount("1");
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to submit vote"));
        }
    };

    return (
        <section className={cn("text-white relative", className)}>

            <div className="fixed inset-0 pointer-events-none z-[9999]">
                {tipSystem.flyingCoins.map((coin) => (
                    <FlyingPeso
                        key={coin.id}
                        id={coin.id}
                        xPercent={getSideXPosition(coin.side) + (coin.txJitter ?? 0)}
                        ty={coin.ty}
                        rot={coin.rot}
                        dur={coin.dur}
                        onDone={tipSystem.removeFlyingCoin}
                    />
                ))}
            </div>


            {tipEnabled && (
                <div className="px-2 md:px-4 md:py-4">
                    <div className="flex justify-between">
                        {/* Left Tip Caret */}
                        <TipCaretButton
                            side="left"
                            isOpen={tipSystem.tipOpen === "left"}
                            onClick={() => tipSystem.openTip("left")}
                        >
                            <TipPopover
                                isLoading={isTipSending}
                                open={tipSystem.tipOpen === "left"}
                                side="left"
                                view={tipSystem.tipView}
                                align="left"
                                defaultSenderName={left.playerName}
                                onClose={tipSystem.closeTip}
                                onPesto={() =>
                                    handleSendTip("left", 1, { closeOnSuccess: false })
                                }
                                onOpenCustom={tipSystem.switchToCustomView}
                                onBackToMenu={tipSystem.switchToMenuView}
                                onSendCustom={async (name, amount) => {
                                    await handleSendTip("left", amount);
                                }}
                            />
                        </TipCaretButton>

                        <TipCaretButton
                            side="middle"
                            isOpen={tipSystem.tipOpen === "middle"}
                            onClick={() => tipSystem.openTip("middle")}
                        >
                            <TipPopover
                                isLoading={isTipSending}
                                open={tipSystem.tipOpen === "middle"}
                                side="middle"
                                view={tipSystem.tipView}
                                align="center"
                                defaultSenderName={middleTipName}
                                onClose={tipSystem.closeTip}
                                onPesto={() =>
                                    handleSendTip("middle", 1, { closeOnSuccess: false })
                                }
                                onOpenCustom={tipSystem.switchToCustomView}
                                onBackToMenu={tipSystem.switchToMenuView}
                                onSendCustom={async (name, amount) => {
                                    await handleSendTip("middle", amount);
                                }}
                            />
                        </TipCaretButton>

                        {/* Right Tip Caret */}
                        <TipCaretButton
                            side="right"
                            isOpen={tipSystem.tipOpen === "right"}
                            onClick={() => tipSystem.openTip("right")}
                        >
                            <TipPopover
                                isLoading={isTipSending}
                                open={tipSystem.tipOpen === "right"}
                                side="right"
                                view={tipSystem.tipView}
                                align="right"
                                defaultSenderName={right.playerName}
                                onClose={tipSystem.closeTip}
                                onPesto={() =>
                                    handleSendTip("right", 1, { closeOnSuccess: false })
                                }
                                onOpenCustom={tipSystem.switchToCustomView}
                                onBackToMenu={tipSystem.switchToMenuView}
                                onSendCustom={async (name, amount) => {
                                    await handleSendTip("right", amount);
                                }}
                            />
                        </TipCaretButton>
                    </div>
                </div>
            )}

            <div>
                <div className={cn("mx-auto", "md:w-full")}>
                    {shouldShowVotingPanel ? (
                        <div className="px-1 py-6 sm:px-0">
                            <div className="grid grid-cols-[minmax(0,1fr)_68px_minmax(0,1fr)] items-start gap-1.5 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
                                <CompletedVotingCard
                                    playerName={left.playerName}
                                    imageSrc={leftVoteImage}
                                    accentClassName="text-[#F472FF]"
                                    onClick={() => handleVoteCardClick("left")}
                                    onShareClick={() => handleVoteShare(left.playerName)}
                                    disabled={!isVotingOpen}
                                    voteCount={leftPlayerVotes}
                                />

                                <div className="flex flex-col items-center justify-start px-0 pt-7 sm:justify-center sm:px-1 sm:pt-0">
                                    <div className="relative flex size-[68px] items-center justify-center rounded-full bg-[#090B12] shadow-[0_0_0_2px_rgba(34,238,223,0.92),0_0_0_5px_rgba(217,70,239,0.92),0_0_18px_rgba(34,238,223,0.16)] sm:size-[108px] sm:shadow-[0_0_0_2px_rgba(34,238,223,0.92),0_0_0_6px_rgba(217,70,239,0.92),0_0_26px_rgba(34,238,223,0.18)]">
                                        <div className="absolute inset-[3px] rounded-full bg-[#0C0F16] ring-2 ring-[#0E1822] sm:inset-[4px]" />
                                        <div className="absolute inset-[7px] rounded-full border border-[#D946EF]/75 shadow-[inset_0_0_14px_rgba(217,70,239,0.16)] sm:inset-[8px]" />
                                        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(217,70,239,0.18),transparent_40%),radial-gradient(circle_at_bottom,rgba(34,238,223,0.16),transparent_45%)]" />
                                        <div className="relative text-center">
                                            <p className="text-[5px] font-bold uppercase tracking-[0.08em] text-[#5DF6EC] sm:text-[11px] sm:tracking-[0.24em]">
                                                {isVotingOpen ? "Time Left" : "Session Closed"}
                                            </p>
                                            <p className="mt-0.5 font-mono text-[10px] font-extrabold leading-none text-[#F472FF] sm:mt-1 sm:text-[24px]">
                                                {isVotingOpen ? formatCountdown(remainingVotingMs) : "00:00"}
                                            </p>
                                            <p className="mt-0.5 font-mono text-[6px] font-bold leading-none text-[#5DF6EC] sm:mt-1 sm:text-[15px]">
                                                {votingWindowLabel}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-1.5 flex items-center gap-1 text-white/90 sm:mt-3">
                                        <span className="-rotate-12 text-[18px] font-black leading-none sm:text-[42px]">
                                            VS
                                        </span>
                                    </div>
                                    <p className="mt-1 text-center text-[7px] font-semibold uppercase tracking-[0.1em] text-white/45 sm:text-[10px] sm:tracking-[0.24em]">
                                        {isVotingOpen ? "Voting Open" : "Voting Finished"}
                                    </p>
                                </div>

                                <CompletedVotingCard
                                    playerName={right.playerName}
                                    imageSrc={rightVoteImage}
                                    accentClassName="text-[#F472FF]"
                                    onClick={() => handleVoteCardClick("right")}
                                    onShareClick={() => handleVoteShare(right.playerName)}
                                    disabled={!isVotingOpen}
                                    voteCount={rightPlayerVotes}
                                />
                            </div>

                            <div className="mt-4 hidden md:block rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6FF9EA]">
                                            Match Voting Pool
                                        </p>
                                        <p className="mt-1 text-sm leading-6 text-white/62">
                                            {isVotingOpen
                                                ? "Premium player voting is now live. Cast your votes to support the standout performance."
                                                : "The voting session has ended. The final vote total is shown below."}
                                        </p>
                                    </div>
                                    <div className="flex items-end justify-between gap-3 sm:block sm:text-right">
                                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                                            Total Votes
                                        </p>
                                        <p className="mt-1 text-xl font-semibold text-white">
                                            {totalVotes}
                                        </p>
                                    </div>
                                </div>
                            </div>


                            <div className="mt-6 space-y-3">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="hidden md:block">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6FF9EA]">
                                            Big Boss Voter Table
                                        </p>
                                        <p className="mt-1 text-sm text-white/58">
                                            Realtime top voters and their vote breakdown for this live match.
                                        </p>
                                    </div>
                                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/38">
                                        Live Ranking
                                    </p>
                                </div>
                                <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                                    <div className="w-full aspect-[4/5] relative rounded-lg overflow-hidden bg-black">
                                        <Image src={topVoters[0]?.user?.image ?? ""} alt={topVoters[0]?.user?.name ?? ""} fill className="object-cover" />
                                    </div>

                                    <div className="mt-3 text-white/80 text-[0.5rem] md:text-[12px] font-semibold">
                                        Big Boss Voter
                                    </div>
                                    <div className="text-white font-black text-[0.7rem] md:text-[1rem]">
                                        {topVoters[0]?.user?.name}
                                    </div>

                                </div>

                                <VotingRankTable data={topVoters} />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-[1fr_auto_1fr] py-6 gap-2 md:gap-4">
                            <MatchPointsCard
                                playerName={left.playerName}
                                teamLogoSrc={left.teamLogoSrc}
                                title="Matched Points"
                                points={left.points}
                                compact
                                positive={true}
                                shareTitle={`Support ${left.playerName}`}
                                matchId={matchId}
                                matchSide="left"
                                playerRef={userReferralNo}
                                onClick={() => handleCardClick("left")}
                            />

                            {/* VS */}
                            <div className="flex flex-col items-center justify-center p-0 md:px-2">
                                <div className="rotate-45 out translate-x-1 flex flex-col items-center origin-center">
                                    <div className="text-[14px] sm:text-[22px] font-extrabold">VS</div>
                                    <div className="text-[10px] sm:text-[14px] text-white/80">
                                        {isLive ? "Live Now" : "Upcoming"}
                                    </div>
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
                                matchSide="right"
                                playerRef={userReferralNo}
                                onClick={() => handleCardClick("right")}
                            />
                        </div>
                    )}
                </div>

                {!shouldShowVotingPanel && (
                    <SupportDialog
                        open={supportDialog.isOpen}
                        onOpenChange={supportDialog.closeDialog}
                        playerName={getPlayerName()}
                        side={supportDialog.selectedSide}
                        defaultSupporterName={getPlayerName()}
                        defaultAmount={100}
                        onConfirm={handleSupportConfirm}
                    />
                )}
            </div>

            <AppDialog
                open={isVoteModalVisible}
                onOpenChange={setVoteModalOpen}
                title="Premium Vote"
                className="max-w-[420px]"
            >
                <div className="space-y-4">
                    <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
                        <div className="flex items-center gap-3">
                            <div className="size-16 overflow-hidden rounded-2xl border border-white/10">
                                <img
                                    src={selectedVotePlayer.image}
                                    alt={selectedVotePlayer.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6FF9EA]">
                                    Vote Target
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-white">
                                    {selectedVotePlayer.name}
                                </h3>
                                <p className="mt-1 flex items-center gap-2 text-sm text-white/55">
                                    <Clock3 size={15} className="text-[#F472FF]" />
                                    {isVotingOpen ? "Live voting session is active" : "Voting session is closed"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                            Vote Count
                        </label>
                        <div className="mt-3 flex items-center gap-3 rounded-[18px] border border-white/10 bg-[#0B0E14] px-4 py-3">
                            <Sparkles size={18} className="text-[#F472FF]" />
                            <input
                                type="number"
                                min={1}
                                step={1}
                                value={voteCount}
                                onChange={(event) => setVoteCount(event.target.value)}
                                className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-white/20"
                                placeholder="Enter vote count"
                            />
                            <PhilippinePeso size={20} className="text-white/70" />
                        </div>
                        <div className="mt-3 rounded-[18px] border border-[#6FF9EA]/18 bg-[linear-gradient(135deg,rgba(111,249,234,0.08),rgba(244,114,255,0.08))] px-4 py-3">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6FF9EA]">
                                        Vote Rate
                                    </p>
                                    <p className="mt-1 text-sm text-white/70">
                                        1 vote = $0.5
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                        Live Total
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                                        {hasValidVoteCount
                                            ? `${parsedVoteCount} ${parsedVoteCount === 1 ? "vote" : "votes"} = $${formatVoteUsd(totalVoteCost)}`
                                            : "Enter a valid vote count"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setVoteModalOpen(false)}
                            className="h-12 flex-1 rounded-[18px] border border-white/10 bg-white/5 text-sm font-semibold text-white/72 transition hover:bg-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={isVoteSubmitting || !voteTargetMatchId || !isVotingOpen}
                            onClick={handleVoteSubmit}
                            className="h-12 flex-1 rounded-[18px] bg-[linear-gradient(135deg,#F472FF_0%,#6FF9EA_100%)] px-4 text-sm font-semibold text-[#0A0C12] shadow-[0_18px_40px_rgba(111,249,234,0.2)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isVoteSubmitting ? "Submitting..." : "Submit Vote"}
                        </button>
                    </div>
                </div>
            </AppDialog>

            <ReferralShareSheet
                open={shareSheetOpen}
                onOpenChange={setShareSheetOpen}
                title={shareSheetTitle}
                shareUrl={shareUrl}
                onCopy={() => toast.success("Match share link copied")}
                onShare={() => toast.success("Match share link shared")}
            />
        </section>
    );
}
