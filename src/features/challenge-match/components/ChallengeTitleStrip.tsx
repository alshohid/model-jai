import type { ChallengeMatchOffer } from "../types";
import { getDisplayName } from "../utils";

export default function ChallengeTitleStrip({
  offer,
  rightLabel,
}: {
  offer: ChallengeMatchOffer;
  rightLabel: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] items-center border-y border-[#2f233b] bg-black/55 px-1 py-1.5">
      <p className="truncate text-[12px] font-semibold uppercase text-[#dbb851] sm:text-base">
        {getDisplayName(offer)}
      </p>
      <p className="text-center text-2xl font-black uppercase italic text-[#ff36ff] [text-shadow:0_0_14px_rgba(255,54,255,0.7)]">
        VS
      </p>
      <p className="truncate text-right text-[12px] font-semibold uppercase text-[#d6a854] sm:text-base">
        {rightLabel}
      </p>
    </div>
  );
}
