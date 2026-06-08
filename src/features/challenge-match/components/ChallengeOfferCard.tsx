"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import type { ChallengeMatchOffer } from "../types";
import { formatChallengePoints } from "../utils";
import ChallengeAcceptButton from "./ChallengeAcceptButton";

type ChallengeOfferCardProps = {
  offer: ChallengeMatchOffer;
  compact?: boolean;
  onAccept?: (offer: ChallengeMatchOffer) => void;
};

export default function ChallengeOfferCard({
  offer,
  onAccept,
}: ChallengeOfferCardProps) {
  const challengerName = offer.showRealName
    ? offer.challenger.name
    : offer.challenger.handle.replace("@", "");

  return (
    <article className="grid w-full min-w-0 grid-cols-[54px_minmax(0,1fr)_48px] items-center gap-1.5 overflow-hidden border-b border-white/18 px-1 py-1.5 text-white last:border-b-0 sm:grid-cols-[76px_minmax(0,1fr)_68px] sm:gap-3 sm:px-2 sm:py-2">
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

      <div className="min-w-0 overflow-hidden pr-1">
        <div className="flex min-w-0 items-baseline gap-1 overflow-hidden leading-none">
          <Link
            href={`/artist/${offer.challenger.id}`}
            className="min-w-0 max-w-[48%] truncate text-[15px] font-black leading-none text-[#ffd237] [text-shadow:0_1px_0_#6c2b00,0_0_8px_rgba(255,210,55,0.28)] hover:text-white sm:max-w-[55%] sm:text-[21px]"
          >
            {challengerName}
          </Link>
          <span className="shrink-0 text-[10px] font-black text-white/90 sm:text-sm">vs</span>
          <Link
            href={`/artist/${offer.target.id}`}
            className="min-w-0 flex-1 truncate text-[11px] font-black text-[#ff3348] hover:text-white sm:text-sm"
          >
            {offer.target.handle}
          </Link>
        </div>

        <p className="mt-0.5 w-full truncate text-[13px] font-black leading-none text-[#ff57ff] [text-shadow:0_1px_0_#55006b,0_0_10px_rgba(255,87,255,0.65)] sm:text-[19px]">
          <span className="text-green-400">{formatChallengePoints(offer.amount)}</span> offers in {offer.game}
        </p>

        <div className="mt-1 flex min-w-0 items-center gap-1.5 overflow-hidden">
          <p className="min-w-0 truncate text-[11px] font-semibold leading-4 text-[#d936ff] [text-shadow:0_0_9px_rgba(217,54,255,0.58)] sm:text-sm">
            {offer.memo}
          </p>
          <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-[3px] border border-[#ffc878] bg-[linear-gradient(180deg,#4d9bff_0%,#5578d8_34%,#ff9b35_35%,#ff9b35_100%)] text-white shadow-[0_0_8px_rgba(255,150,55,0.55)] sm:h-6 sm:w-6">
            <FileText className="h-3.5 w-3.5 text-[#ffe6a6] sm:h-4 sm:w-4" />
          </span>
        </div>
      </div>

      <ChallengeAcceptButton
        onClick={() => onAccept?.(offer)}
        className="h-12 w-12 flex-shrink-0 border-[3px] text-[10px] sm:h-[68px] sm:w-[68px] sm:border-[5px] sm:text-sm"
      />
    </article>
  );
}
