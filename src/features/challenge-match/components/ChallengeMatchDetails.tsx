"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Clock3,
  FileText,
  PhilippinePeso,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import { useAuth } from "@/redux/features/auth/hooks";
import { cn } from "@/shared/lib/utils/cn";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import type { ChallengeMatchOffer, ChallengePlayer } from "../types";
import { currentChallengeBalance } from "../data/challengeMatchMockData";
import { formatChallengeCurrency, formatChallengePoints } from "../utils";
import ChallengeAcceptButton from "./ChallengeAcceptButton";
import ChallengeAcceptDialog from "./ChallengeAcceptDialog";

type ChallengeDialogOutcome = "confirm" | "success" | "insufficient";
type ChallengeTone = "gold" | "green" | "pink";

type ChallengeMatchDetailsProps = {
  offer: ChallengeMatchOffer;
};

const gameLogoByName: Record<string, string> = {
  FC26: "/images/home/fc26.png",
  "Mortal Combat": "/images/home/mortal.png",
  "FIFA 23": "/images/home/game_3.png",
  "Street Fighter 6": "/images/home/game_14.png",
};

const challengeRules = [
  "Accepting the offer reserves the challenge amount from your balance.",
  "The challenge remains active for the selected duration.",
  "Players must follow the match rules before the challenge can continue.",
];

const anonymousChallengePlayer: ChallengePlayer = {
  id: 0,
  name: "Waiting Challenger",
  handle: "??????",
  avatar: "/images/home/avatar_img.png",
};

function getDisplayName(offer: ChallengeMatchOffer) {
  return offer.showRealName
    ? offer.challenger.name
    : offer.challenger.handle.replace("@", "");
}

function getGameLogo(game: string) {
  return gameLogoByName[game] ?? "/images/home/main_logo.png";
}

function ChallengePortraitCard({
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

function ChallengeTitleStrip({
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

function ChallengeSideOfferPanel({
  offer,
  gameLogo,
}: {
  offer: ChallengeMatchOffer;
  gameLogo: string;
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

      <button
        type="button"
        className="mt-4 h-8 w-full rounded-lg border border-[#ff7eea]/55 bg-[linear-gradient(180deg,#ff7bec,#ff4abd)] text-[10px] font-black text-white shadow-[0_0_18px_rgba(255,74,189,0.35)] transition hover:brightness-110"
      >
        Share Referral
      </button>
    </div>
  );
}

function ChallengeCenterBadge({ offer }: { offer: ChallengeMatchOffer }) {
  return (
    <div className="flex min-w-0 flex-col items-center pt-8 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-[#ff37dc] bg-black shadow-[0_0_20px_rgba(255,55,220,0.45)] sm:h-16 sm:w-16">
        <div className="text-[8px] font-bold leading-tight text-[#24ff7a] sm:text-[10px]">
          <span className="block">Sat 28</span>
          <span className="block">10:18</span>
          <span className="block">13:17</span>
        </div>
      </div>
      <p className="mt-1 text-xs font-black uppercase italic text-white">VS</p>
      <p className="mt-1 [writing-mode:vertical-rl] text-[10px] font-semibold capitalize text-white/70">
        {offer.kind}
      </p>
    </div>
  );
}

function ChallengeAcceptPanel({
  offer,
  gameLogo,
  onAccept,
}: {
  offer: ChallengeMatchOffer;
  gameLogo: string;
  onAccept: () => void;
}) {
  return (
    <div className="relative min-h-[150px] rounded-[16px] border border-white/16 bg-[#101116]/95 px-2.5 pb-3 pt-4 shadow-[inset_0_0_24px_rgba(255,255,255,0.04)] sm:min-h-[190px] sm:px-4">
      <button
        type="button"
        onClick={onAccept}
        className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#66d7ff]/45 bg-[linear-gradient(180deg,#8ce8ff,#1c8ad8)] px-4 py-0.5 text-[10px] font-black uppercase text-white shadow-[0_0_14px_rgba(80,198,255,0.58)] transition hover:brightness-110"
      >
        Click Here
      </button>

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
            {offer.target.name}
          </p>
          <p className="text-[10px] font-semibold text-white/55">
            Challenge Receiver
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <ChallengeAcceptButton
          onClick={onAccept}
          className="h-20 w-20 border-[6px] text-base sm:h-24 sm:w-24 sm:text-lg"
        />
      </div>
    </div>
  );
}

function ChallengeMemoPanel({ memo }: { memo: string }) {
  return (
    <section className="mt-5 flex items-start gap-3">
      <div className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-lg border-2 border-[#ffe29a] bg-[linear-gradient(180deg,#5fa0ff,#ff8a33)] text-white shadow-[0_0_14px_rgba(255,136,51,0.38)]">
        <FileText className="h-8 w-8" />
      </div>
      <p className="min-w-0 text-[17px] font-bold leading-6 text-[#d329ff] [text-shadow:0_0_14px_rgba(211,41,255,0.38)] sm:text-xl">
        {memo}
      </p>
    </section>
  );
}

function ChallengeRulesPanel() {
  return (
    <section className="mt-7 rounded-[16px] border border-[#ff2ec8]/18 bg-black/35 p-4">
      <h2 className="flex items-center gap-2 text-2xl font-black text-[#e748ff]">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ff2ec8] text-white shadow-[0_0_14px_rgba(255,46,200,0.65)]">
          <AlertCircle className="h-5 w-5" />
        </span>
        Rules
      </h2>
      <div className="mt-4 space-y-3">
        {challengeRules.map((rule) => (
          <p
            key={rule}
            className="flex items-start gap-2 text-sm leading-5 text-white/68"
          >
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#60ff4d]" />
            <span>{rule}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

export default function ChallengeMatchDetails({
  offer,
}: ChallengeMatchDetailsProps) {
  const { isAuthenticated } = useAuth();
  const { data: meData } = useGetMeDataQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [outcome, setOutcome] = useState<ChallengeDialogOutcome>("confirm");
  const [acceptedPlayer, setAcceptedPlayer] = useState<ChallengePlayer | null>(null);
  const gameLogo = getGameLogo(offer.game);
  const rightPlayer = acceptedPlayer ?? anonymousChallengePlayer;
  const rightLabel = acceptedPlayer?.handle ?? anonymousChallengePlayer.handle;

  const openAcceptDialog = () => {
    setAgreed(false);
    setOutcome("confirm");
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    const canAccept = currentChallengeBalance >= offer.amount;

    if (canAccept) {
      const user = meData?.data?.user;
      const artistName = user?.artist_name?.trim();
      const displayName = artistName || user?.name || "Accepted Player";

      setAcceptedPlayer({
        id: user?.id ?? 0,
        name: displayName,
        handle: artistName ? `@${artistName}` : `@${displayName.replace(/\s+/g, "")}`,
        avatar: getSafeImageSrc(user?.image, "/images/home/avatar_img.png"),
        game: user?.game?.name ?? offer.game,
      });
    }

    setOutcome(canAccept ? "success" : "insufficient");
  };

  const handleClose = () => {
    setDialogOpen(false);
    setAgreed(false);
    setOutcome("confirm");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090a0f] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/images/home/modaljai_hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.32),rgba(5,5,10,0.96)),radial-gradient(circle_at_top,rgba(255,46,200,0.2),transparent_36%)]" />

      <section
        className={cn(
          "relative z-10 mx-auto w-full max-w-[520px] px-3 pb-8",
          isAuthenticated ? "pt-4 sm:pt-6" : "pt-[112px] sm:pt-[124px]",
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <Link
            href="/challenge-dashboard"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/12 bg-black/45 px-3 text-xs font-black uppercase tracking-[0.08em] text-white/75 transition hover:border-[#ff43ff]/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Offers
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd237]/25 bg-black/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffd237]">
            <Trophy className="h-4 w-4" />
            Rank #{offer.rank}
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-white/12 bg-[#0d0e14]/96 shadow-[0_0_32px_rgba(255,46,200,0.22)]">
          <div className="grid grid-cols-3 gap-1 bg-black/70 p-1">
            <ChallengePortraitCard
              player={offer.challenger}
              label={getDisplayName(offer)}
              points={offer.amount}
              tone="gold"
            />
            <ChallengePortraitCard
              player={{
                id: 0,
                name: "Model Boss",
                handle: "@ModelBoss",
                avatar: "/images/home/middle.png",
              }}
              label="Model"
              tone="green"
              imageOverride="/images/home/middle.png"
            />
            <ChallengePortraitCard
              player={rightPlayer}
              label={rightLabel}
              tone={acceptedPlayer ? "green" : "pink"}
              points={acceptedPlayer ? offer.amount : undefined}
              accepted={Boolean(acceptedPlayer)}
              imageOverride={acceptedPlayer ? undefined : "/images/home/avatar_img.png"}
            />
          </div>

          <ChallengeTitleStrip offer={offer} rightLabel={rightLabel} />

          <div className="relative grid grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] gap-1 px-2 pt-3 sm:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] sm:px-4">
            <ChallengeSideOfferPanel offer={offer} gameLogo={gameLogo} />
            <ChallengeCenterBadge offer={offer} />
            <ChallengeAcceptPanel
              offer={offer}
              gameLogo={gameLogo}
              onAccept={openAcceptDialog}
            />
          </div>

          <div className="px-3 pb-5 sm:px-5">
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/42">
                  <Clock3 className="h-3.5 w-3.5" />
                  Duration
                </p>
                <p className="mt-1 text-sm font-black text-white">
                  {offer.durationHours} Hours
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/42">
                  <Sparkles className="h-3.5 w-3.5" />
                  Status
                </p>
                <p className="mt-1 text-sm font-black capitalize text-[#66ff57]">
                  {offer.status}
                </p>
              </div>
            </div>

            <ChallengeMemoPanel memo={offer.memo} />
            <ChallengeRulesPanel />
          </div>
        </div>
      </section>

      <ChallengeAcceptDialog
        offer={offer}
        open={dialogOpen}
        balance={currentChallengeBalance}
        outcome={outcome}
        agreed={agreed}
        onAgreeChange={setAgreed}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    </main>
  );
}
