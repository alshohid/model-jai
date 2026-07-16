"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import type { ChallengeMatchOffer } from "../types";
import { formatChallengePoints } from "../utils";
import ChallengeAcceptButton from "./ChallengeAcceptButton";
import AppDialog from "@/shared/components/modal/AppDialog";
import { MessageSquare, Trophy, Flame, PhilippinePeso } from "lucide-react";
import ChallengeAcceptedButton from "./ChallengeAcceptedButton";

type ChallengeOfferCardProps = {
  offer: ChallengeMatchOffer;
  compact?: boolean;
  onAccept?: (offer: ChallengeMatchOffer) => void;
  acceptVisible?: boolean;
  isShowAcceptedButton?: boolean;
};

export default function ChallengeOfferCard({
  offer,
  onAccept,
  acceptVisible = true,
  isShowAcceptedButton = false,

}: ChallengeOfferCardProps) {
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const challengerName = offer.showRealName
    ? offer.challenger.name
    : offer.challenger.handle.replace("@", "");

  return (
    <article className="grid w-full min-w-0 grid-cols-[54px_minmax(0,1fr)_48px] items-center gap-1.5 border-b border-white/18 px-1 py-1.5 text-white last:border-b-0 sm:grid-cols-[76px_minmax(0,1fr)_68px] sm:gap-3 sm:px-2 sm:py-2">
      <Link
        href={`/artist/${offer.challenger.id}`}
        className="relative h-[54px] w-[54px] min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff43ff]/60 sm:h-[68px] sm:w-[76px]"
        aria-label={`View ${offer.challenger.name} profile`}
      >
        <span className="absolute left-0 top-[-5px] z-10 rounded-r-sm bg-[#6b35a8]/95 px-1 py-0.5 text-[9px] font-black leading-none text-white shadow-[0_1px_5px_rgba(0,0,0,0.45)] sm:px-1.5 sm:text-xs">
          Rank #{offer.rank}
        </span>
        <span className="absolute bottom-0 left-0 block h-[47px] w-[47px] overflow-hidden rounded-full border-2 border-white bg-black shadow-[0_0_12px_rgba(255,255,255,0.5)] sm:left-1 sm:h-[62px] sm:w-[62px]">
          <Image
            src={getSafeImageSrc(offer.challenger.avatar)}
            alt={offer.challenger.name}
            fill
            sizes="(max-width: 640px) 47px, 62px"
            className="object-cover"
            unoptimized
          />
        </span>
      </Link>

      <div className="min-w-0 pr-1">
        <div className="flex min-w-0 items-baseline gap-1 overflow-hidden leading-none">
          <Link
            href={`/artist/${offer.challenger.id}`}
            className="min-w-0 max-w-[48%] truncate text-[15px] font-black leading-none text-[#ffd237] [text-shadow:0_1px_0_#6c2b00,0_0_8px_rgba(255,210,55,0.28)] hover:text-white sm:max-w-[55%] sm:text-[21px]"
          >
            {challengerName}
          </Link>
          <span className="shrink-0 text-[10px] font-black text-white/90 sm:text-sm">vs</span>
          {offer.target.id !== 0 ? (
            <Link
              href={`/artist/${offer.target.id!}`}
              className="min-w-0 flex-1 truncate text-[11px] font-black text-[#ff3348] hover:text-white sm:text-sm"
            >
              {offer.target.handle}
            </Link>
          ) : (
            <p className="min-w-0 flex-1 truncate text-[11px] font-black text-[#ff3348] hover:text-white sm:text-sm">
              {offer?.accepted?.name ? offer?.accepted?.name : offer.target.handle}
            </p>
          )}
        </div>

        <p className="mt-0.5 w-full truncate text-[13px] font-black leading-none text-[#c50dc5] sm:text-[19px]">
          <span className="text-green-400 [paint-order:stroke_fill] [-webkit-text-stroke:3px_#111]">{formatChallengePoints(offer.amount)}</span> offers in <span className="px-1 font-extrabold uppercase tracking-normal [paint-order:stroke_fill] [-webkit-text-stroke:3px_#fff]
    ">{offer.game}</span>
        </p>

        <div className="mt-1 flex min-w-0 items-center gap-1.5">
          <p className="min-w-0 truncate text-[11px] font-light leading-4 text-white sm:text-sm">
            {offer.memo}
          </p>
          <button
            type="button"
            onClick={() => setIsMemoOpen(true)}
            aria-label={`View memo: ${offer.memo}`}
            className="group/memo h-10 w-10 flex-shrink-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#ffe6a6]/80 cursor-pointer hover:scale-105 transition-transform"
          >
            <Image src="/images/memo.PNG" alt="memo" width={400} height={400} className="w-full h-full object-contain" />
          </button>
        </div>
      </div>
      {isShowAcceptedButton ? (
        <ChallengeAcceptedButton
          visible={true}
        />
      )
        :
        <ChallengeAcceptButton
          onClick={() => onAccept?.(offer)}
          visible={acceptVisible}
        />
      }


      <AppDialog
        open={isMemoOpen}
        onOpenChange={setIsMemoOpen}
        title="Challenge Details"
      >
        <div className="flex flex-col gap-5 py-2">
          {/* Matchup Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/1 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,46,200,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="flex items-center justify-between gap-4 relative z-10">
              {/* Challenger */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="relative h-16 w-16 rounded-full border-2 border-[#ffd237] shadow-[0_0_15px_rgba(255,210,55,0.3)] overflow-hidden bg-black">
                  <Image
                    src={getSafeImageSrc(offer.challenger.avatar)}
                    alt={offer.challenger.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="mt-2 text-sm font-bold text-[#ffd237] truncate w-full text-center">
                  {challengerName}
                </span>
                <span className="text-[10px] text-white/50 truncate w-full text-center">
                  {offer.challenger.handle}
                </span>
              </div>

              {/* VS Divider */}
              <div className="flex flex-col items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-[#FF2EC8] to-[#ff43ff] text-xs font-black text-white shadow-[0_0_15px_rgba(255,46,200,0.5)]">
                  VS
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/40">
                  Rank #{offer.rank}
                </span>
              </div>

              {/* Target */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="relative h-16 w-16 rounded-full border-2 border-[#ff3348] shadow-[0_0_15px_rgba(255,51,72,0.3)] overflow-hidden bg-black">
                  <Image
                    src={getSafeImageSrc(offer.target.avatar)}
                    alt={offer.target.name || offer.target.handle}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="mt-2 text-sm font-bold text-white truncate w-full text-center">
                  {offer.target.name || offer.target.handle.replace("@", "")}
                </span>
                <span className="text-[10px] text-white/50 truncate w-full text-center">
                  {offer.target.handle}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/2 p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <Trophy className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-white/45">Offer Amount</p>
                <p className="truncate text-sm font-black text-green-400 flex items-center">
                  {formatChallengePoints(offer.amount)} <span className="ml-1"><PhilippinePeso className="w-5 h-5" /></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/2 p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF2EC8]/10 text-[#FF9BE9]">
                <Flame className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-white/45">Game Category</p>
                <p className="truncate text-sm font-black text-white">
                  {offer.game}
                </p>
              </div>
            </div>
          </div>

          {/* Memo block */}
          <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/3 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-white/5 pointer-events-none">
              <MessageSquare className="h-16 w-16" />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
              <MessageSquare className="h-4 w-4 text-[#FF9BE9]" />
              <span>Challenger&apos;s Message</span>
            </div>

            <div className="text-white text-sm leading-relaxed whitespace-pre-wrap wrap-break-word font-light pt-1">
              {offer.memo}
            </div>
          </div>
        </div>
      </AppDialog>
    </article>
  );
}
