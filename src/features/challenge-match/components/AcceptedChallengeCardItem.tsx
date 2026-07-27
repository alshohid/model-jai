"use client";

import { useState, useEffect, useMemo } from "react";
import ChallengeOfferCard from "./ChallengeOfferCard";
import ChallengeReadyModal from "./ChallengeReadyModal";
import ChallengeSubmitResultModal from "./ChallengeSubmitResultModal";
import type { ChallengeMatchOffer } from "../types";
import type { ApiChallengeItem } from "../utils/apiAdapter";
import { Clock, ShieldAlert, Trophy, Award, CheckCircle2, AlertCircle } from "lucide-react";


interface AcceptedChallengeCardItemProps {
  offer: ChallengeMatchOffer & {
    rawApiItem?: ApiChallengeItem;
  };
  currentUserId: number | null;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function AcceptedChallengeCardItem({
  offer,
  currentUserId,
}: AcceptedChallengeCardItemProps) {
  const [isReadyModalOpen, setIsReadyModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [now, setNow] = useState<number>(() =>
    typeof window !== "undefined" ? Date.now() : 0,
  );


  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const rawItem = offer.rawApiItem;

  const challengerId = rawItem?.challenger?.id ?? offer.challenger.id;
  const acceptorId = rawItem?.acceptor?.id ?? offer.acceptedPlayer?.id ?? offer.target.id;

  const isChallenger = currentUserId !== null && currentUserId === challengerId;
  const isAcceptor = currentUserId !== null && currentUserId === acceptorId;
  const isPlayer = isChallenger || isAcceptor;

  const myReadyAt = isChallenger
    ? rawItem?.challenger_ready_at
    : isAcceptor
      ? rawItem?.acceptor_ready_at
      : null;

  const opponentReadyAt = isChallenger
    ? rawItem?.acceptor_ready_at
    : isAcceptor
      ? rawItem?.challenger_ready_at
      : null;

  const bothPlayersReady = rawItem?.both_players_ready ?? false;
  const startedAt = rawItem?.started_at ?? null;
  const submittedForReviewAt = rawItem?.submitted_for_review_at ?? null;
  const winnerId = rawItem?.winner_id ?? null;
  const isExpired = rawItem?.is_expired ?? false;
  const status = rawItem?.status ?? offer.status ?? "accepted";


  const matchTimeMs = useMemo(() => {
    if (!offer.match_date || !offer.match_time) return 0;
    const dateStr = `${offer.match_date}T${offer.match_time}:00`;
    const parsed = new Date(dateStr).getTime();
    return isNaN(parsed) ? 0 : parsed;
  }, [offer.match_date, offer.match_time]);


  const readyExpiresAt = useMemo(() => {
    if (rawItem?.ready_expires_at) {
      const expiresMs = new Date(rawItem.ready_expires_at).getTime();
      if (!isNaN(expiresMs)) {
        return expiresMs;
      }
    }
    const firstReadyAt = rawItem?.challenger_ready_at || rawItem?.acceptor_ready_at;
    if (firstReadyAt) {
      const firstReadyMs = new Date(firstReadyAt).getTime();
      if (!isNaN(firstReadyMs)) {
        return firstReadyMs + 10 * 60 * 1000;
      }
    }
    return matchTimeMs + 10 * 60 * 1000;
  }, [rawItem, matchTimeMs]);

  const renderActionBar = () => {

    if (status === "completed") {
      if (winnerId !== null && winnerId === currentUserId) {
        return (
          <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-300">
            <span className="flex items-center gap-2 text-xs font-bold">
              <Trophy className="h-4 w-4 text-amber-400 animate-bounce" />
              You won this challenge match!
            </span>
            <span className="rounded-lg bg-amber-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-amber-200">
              VICTORY
            </span>
          </div>
        );
      }
      return (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/70">
          <span className="flex items-center gap-2 text-xs font-medium">
            <Award className="h-4 w-4 text-white/50" />
            You lost. Better luck next time.
          </span>
          <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-white/50">
            COMPLETED
          </span>
        </div>
      );
    }

    if (bothPlayersReady || startedAt !== null) {
      if (submittedForReviewAt || status === "under_review") {
        return (
          <div className="flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-blue-300">
            <span className="flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
              Result submitted — awaiting admin review
            </span>
            <span className="rounded-lg bg-blue-500/20 px-2.5 py-1 text-[10px] font-bold uppercase text-blue-200">
              UNDER REVIEW
            </span>
          </div>
        );
      }

      if (isPlayer) {
        return (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#FF2EC8]/30 bg-[#FF2EC8]/10 p-2 sm:px-3">
            <span className="text-xs font-semibold text-white/90">
              Match Started! Submit your result proof.
            </span>
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-linear-to-r from-[#FF2EC8] to-[#ff43ff] px-3 py-1.5 text-xs font-bold text-white shadow-[0_0_12px_rgba(255,46,200,0.5)] hover:opacity-90 transition cursor-pointer"
            >
              Submit Result
            </button>
          </div>
        );
      }
    }


    if (isExpired && !bothPlayersReady && myReadyAt === null) {
      return (
        <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300">
          <span className="flex items-center gap-2 text-xs font-medium">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            {rawItem?.expiry_message || "This challenge offer has expired."}
          </span>
          <span className="rounded-lg bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-red-300">
            EXPIRED
          </span>
        </div>
      );
    }


    if (isPlayer) {
      if (myReadyAt !== null && opponentReadyAt === null) {
        if (now < readyExpiresAt) {
          const timeLeft = readyExpiresAt - now;
          return (
            <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-300">
              <span className="flex items-center gap-2 text-xs font-medium">
                <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
                Waiting for opponent...
              </span>
              <span className="font-mono text-xs font-bold text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded-md">
                {formatCountdown(timeLeft)}
              </span>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-between rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-green-300">
              <span className="flex items-center gap-2 text-xs font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Opponent did not join. Admin will declare you the winner.
              </span>
            </div>
          );
        }
      }


      if (myReadyAt === null && opponentReadyAt !== null) {
        if (now < readyExpiresAt) {
          const timeLeft = readyExpiresAt - now;
          return (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-[#FF2EC8]/40 bg-[#FF2EC8]/10 p-2 sm:px-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#FF2EC8] animate-bounce" />
                <span className="text-xs font-bold text-white">
                  Your opponent is ready!
                </span>
                <span className="font-mono text-xs font-extrabold text-[#FF9BE9] bg-[#FF2EC8]/20 px-2 py-0.5 rounded-md">
                  {formatCountdown(timeLeft)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsReadyModalOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-linear-to-r from-[#FF2EC8] to-[#ff43ff] px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(255,46,200,0.6)] hover:scale-105 transition cursor-pointer"
              >
                Get Ready
              </button>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300">
              <span className="flex items-center gap-2 text-xs font-medium">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                You missed the match.
              </span>
            </div>
          );
        }
      }

      if (myReadyAt === null && opponentReadyAt === null) {
        if (now < matchTimeMs) {
          const timeToMatch = matchTimeMs - now;
          return (
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/80">
              <span className="flex items-center gap-2 text-xs font-medium">
                <Clock className="h-4 w-4 text-pink-400" />
                Match Scheduled: {offer.match_date} at {offer.match_time}
              </span>
              <span className="font-mono text-xs font-bold text-pink-300 bg-white/10 px-2 py-0.5 rounded-md">
                Starts in {formatCountdown(timeToMatch)}
              </span>
            </div>
          );
        } else if (now >= matchTimeMs && now < readyExpiresAt) {
          const timeLeft = readyExpiresAt - now;
          return (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-[#FF2EC8]/40 bg-[#FF2EC8]/10 p-2 sm:px-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#FF2EC8] animate-spin" />
                <span className="text-xs font-bold text-white">
                  Match Window Active!
                </span>
                <span className="font-mono text-xs font-extrabold text-[#FF9BE9] bg-[#FF2EC8]/20 px-2 py-0.5 rounded-md">
                  {formatCountdown(timeLeft)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsReadyModalOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-linear-to-r from-[#FF2EC8] to-[#ff43ff] px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(255,46,200,0.6)] hover:scale-105 transition cursor-pointer"
              >
                Get Ready
              </button>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300">
              <span className="flex items-center gap-2 text-xs font-medium">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                You missed the match.
              </span>
            </div>
          );
        }
      }
    }
    return (
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white/60">
        <span className="text-xs font-medium">
          Scheduled: {offer.match_date} at {offer.match_time}
        </span>
        <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
          ACCEPTED MATCH
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 rounded-2xl border border-white/10 bg-white/3 p-2.5 transition-all hover:border-white/20">
      <ChallengeOfferCard
        offer={offer}
        acceptVisible={false}
        isShowAcceptedButton={false}
      />

      <div className="w-full md:w-2/3 px-1">{renderActionBar()}</div>

      {isReadyModalOpen && (
        <ChallengeReadyModal
          open={isReadyModalOpen}
          onOpenChange={setIsReadyModalOpen}
          challengeId={offer.id}
        />
      )}

      {isSubmitModalOpen && (
        <ChallengeSubmitResultModal
          open={isSubmitModalOpen}
          onOpenChange={setIsSubmitModalOpen}
          challengeId={offer.id}
        />
      )}
    </div>
  );
}
