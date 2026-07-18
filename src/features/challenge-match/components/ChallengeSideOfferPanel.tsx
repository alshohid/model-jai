import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import type { ChallengeMatchOffer } from "../types";
import { formatChallengeCurrency, getDisplayName } from "../utils";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";

export default function ChallengeSideOfferPanel({
  offer,
  gameLogo,
  handleShareClick,
}: {
  offer: ChallengeMatchOffer;
  gameLogo: string;
  handleShareClick: () => void;
}) {
  return (
    <div className="relative min-h-[150px] rounded-[16px] border border-white/16 bg-[#101116]/95 px-2.5 pb-3 pt-4 shadow-[inset_0_0_24px_rgba(255,255,255,0.04)] sm:min-h-[190px] sm:px-4">
      <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full border border-[#66d7ff]/45 bg-[linear-gradient(180deg,#8ce8ff,#1c8ad8)] px-4 py-0.5 text-[10px] font-black uppercase text-white shadow-[0_0_14px_rgba(80,198,255,0.58)]">
        Offer
      </div>

      <div className="mt-7 flex items-center gap-2">
        <Image
          src={gameLogo}
          alt={offer.game}
          width={42}
          height={42}
          className="h-10 w-10 rounded-full object-contain"
        />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-black text-[#ffd237] sm:text-sm">
            {getDisplayName(offer)}
          </p>
          <p className="text-[10px] font-semibold text-white/55">Matched Points</p>
        </div>
      </div>

      <p className="mt-1 text-[16px] font-black text-white sm:text-2xl">
        +{formatChallengeCurrency(offer.amount)}
      </p>
      <StartStreamingButton
        onClick={handleShareClick}
        className={cn("h-[23px] md:h-[30px] text-[8px] md:text-[14px] px-3 rounded-md")}
      >
        Share Referral
      </StartStreamingButton>
    </div>
  );
}
