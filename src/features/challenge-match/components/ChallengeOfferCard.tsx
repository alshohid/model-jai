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
  compact = false,
  onAccept,
}: ChallengeOfferCardProps) {
  return (
    <article className="relative flex items-center gap-3 border-b border-white/18 py-2.5 pr-1 text-white last:border-b-0 sm:gap-4">
      <div className="w-[62px] flex-shrink-0 text-center sm:w-[76px]">
        <p className="mb-0.5 rounded-sm bg-[#6b35a8]/80 px-1 text-[11px] font-black text-white sm:text-xs">
          Rank #{offer.rank}
        </p>
        <Link
          href={`/artist/${offer.challenger.id}`}
          className="relative mx-auto block h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.45)] sm:h-16 sm:w-16"
        >
          <Image
            src={getSafeImageSrc(offer.challenger.avatar)}
            alt={offer.challenger.name}
            fill
            sizes="64px"
            className="object-cover"
            unoptimized
          />
        </Link>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
          <Link
            href={`/artist/${offer.challenger.id}`}
            className="w-full truncate text-md font-black text-[#ffd237] [text-shadow:0_1px_0_#5a1c00] hover:text-white"
          >
            {offer.showRealName ? offer.challenger.name : offer.challenger.handle.replace("@", "")}
          </Link>
          <span className="text-sm font-bold text-white/85">vs</span>
          <Link
            href={`/artist/${offer.target.id}`}
            className="truncate text-sm font-bold text-[#ff4e59] hover:text-white sm:text-base"
          >
            {offer.target.handle}
          </Link>
        </div>

        <p className="mt-[-2px] text-md md:text-lg font-black leading-none text-[#9c2f9c] ">
          {formatChallengePoints(offer.amount)} offers in {offer.game}
        </p>

        <div className="mt-1 flex min-w-0 items-start gap-2">
          {!compact ? <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ffb13b]" /> : null}
          <p className="line-clamp-2 text-xs leading-4 text-white/86 sm:text-sm">
            {offer.memo}
          </p>
        </div>
      </div>

      <ChallengeAcceptButton
        onClick={() => onAccept?.(offer)}
        className="h-[58px] w-[58px] flex-shrink-0 text-xs sm:h-[70px] sm:w-[70px] sm:text-sm"
      />
    </article>
  );
}
