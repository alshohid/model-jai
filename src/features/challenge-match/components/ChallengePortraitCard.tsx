import Image from "next/image";
import { PhilippinePeso } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import type { ChallengePlayer } from "../types";
import { formatChallengePoints } from "../utils";

type ChallengeTone = "gold" | "green" | "pink";

export default function ChallengePortraitCard({
  player,
  label,
  points,
  tone,
  imageOverride,
  accepted = false,
}: {
  player: ChallengePlayer;
  label: string;
  points?: number;
  tone: ChallengeTone;
  imageOverride?: string;
  accepted?: boolean;
}) {
  const toneClass = {
    gold: "text-[#ffd237] [text-shadow:0_0_12px_rgba(255,210,55,0.45)]",
    green: "text-[#62ff52] [text-shadow:0_0_12px_rgba(98,255,82,0.55)]",
    pink: "text-[#ff4cff] [text-shadow:0_0_12px_rgba(255,76,255,0.55)]",
  }[tone];

  return (
    <div
      className={cn(
        "relative aspect-[3/4] min-w-0 overflow-hidden rounded-t-[10px] border bg-[#08090d]",
        accepted
          ? "border-[#62ff52]/70 shadow-[0_0_18px_rgba(98,255,82,0.35)] ring-1 ring-[#62ff52]/35"
          : "border-white/10",
      )}
    >
      <Image
        src={getSafeImageSrc(imageOverride ?? player.avatar)}
        alt={player.name}
        fill
        sizes="(max-width: 640px) 33vw, 180px"
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/16 to-transparent" />
      {/* {accepted ? (
        <div className="absolute right-1 top-1 inline-flex items-center gap-1 rounded-full border border-[#62ff52]/40 bg-black/70 px-1.5 py-0.5 text-[8px] font-black uppercase text-[#62ff52] shadow-[0_0_12px_rgba(98,255,82,0.45)]">
          <ShieldCheck className="h-3 w-3" />
          Accepted
        </div>
      ) : null} */}
      <div className="absolute inset-x-1 bottom-1 text-center">
        <p className={cn("truncate text-[11px] font-black sm:text-base", toneClass)}>
          {label}
        </p>
        {points ? (
          <p className="mt-0.5 flex items-center justify-center gap-0.5 text-[11px] font-black text-[#ffd237] sm:text-sm">
            {formatChallengePoints(points).replace("pt", "")}
            <PhilippinePeso className="h-3 w-3" />
          </p>
        ) : null}
      </div>
    </div>
  );
}
