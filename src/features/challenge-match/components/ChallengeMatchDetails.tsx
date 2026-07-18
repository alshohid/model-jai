"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, Sparkles, Trophy } from "lucide-react";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import { useAuth } from "@/redux/features/auth/hooks";
import { cn } from "@/shared/lib/utils/cn";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import type { ChallengeMatchOffer } from "../types";
import { getDisplayName, getGameLogo } from "../utils";
import { useUserAcceptChallengeMutation } from "@/redux/features/challenge/challengeManagement";
import ChallengeAcceptDialog from "./ChallengeAcceptDialog";
import ReferralShareSheet from "@/shared/components/myProfile/ReferralShareSheet";
import { toast } from "sonner";
import ChallengeCenterBadge from "./ChallengeCenterBadge";
import ChallengePortraitCard from "./ChallengePortraitCard";
import ChallengeTitleStrip from "./ChallengeTitleStrip";
import ChallengeSideOfferPanel from "./ChallengeSideOfferPanel";
import ChallengeAcceptPanel from "./ChallengeAcceptPanel";
import ChallengeMemoPanel from "./ChallengeMemoPanel";
import ChallengeRulesPanel from "./ChallengeRulesPanel";

type ChallengeDialogOutcome = "confirm" | "success" | "insufficient" | "error";

type ChallengeMatchDetailsProps = {
  offer: ChallengeMatchOffer;
  refCode?: string;
};

export default function ChallengeMatchDetails({
  offer,
}: ChallengeMatchDetailsProps) {
  const { isAuthenticated, } = useAuth();
  const { data: meData } = useGetMeDataQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [userAcceptChallenge, { isLoading: isAccepting }] = useUserAcceptChallengeMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [outcome, setOutcome] = useState<ChallengeDialogOutcome>("confirm");
  const [errorMessage, setErrorMessage] = useState("");
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [shareSheetTitle, setShareSheetTitle] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [shareSheetImageSrc, setShareSheetImageSrc] = useState("");
  const [shareSheetImageAlt, setShareSheetImageAlt] = useState("");
  const gameLogo = getGameLogo(offer.game);

  const currentChallengeBalance = meData?.data?.total_balance ?? 0;
  const openAcceptDialog = () => {

    setAgreed(false);
    setOutcome("confirm");
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    const canAccept = currentChallengeBalance >= offer.amount;
    if (!canAccept) {
      setOutcome("insufficient");
      return;
    }

    try {
      await userAcceptChallenge({
        id: Number(offer.id),
        terms_accepted: agreed,
      }).unwrap();
      setOutcome("success");
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string }; message?: string };
      const msg =
        apiError?.data?.message ||
        apiError?.message ||
        "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
      setOutcome("error");
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setAgreed(false);
    setOutcome("confirm");
  };
  const handleShareClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();

    if (typeof window === "undefined") {
      toast.error("Share link is not available right now.");
      return;
    }

    const user = meData?.data?.user;
    const userReferralNo = user?.referral_no;

    const nextShareUrl = new URL(
      `/challenge-dashboard/${offer.id}`,
      window.location.origin
    );
    const currentPlatform =
      new URLSearchParams(window.location.search).get("platform") || "tiktok";

    nextShareUrl.searchParams.set("platform", currentPlatform);

    if (userReferralNo) {
      nextShareUrl.searchParams.set("ref", userReferralNo);
    }

    const shareTitle = `${getDisplayName(offer)} challenges you on ${offer.game} — Go to Challenge`;
    const shareImage = getSafeImageSrc(
      offer.challenger.avatar,
      "/images/home/avatar_img.png"
    );

    setShareSheetTitle(shareTitle);
    setShareSheetImageSrc(shareImage);
    setShareSheetImageAlt(getDisplayName(offer));
    setShareUrl(nextShareUrl.toString());
    setShareSheetOpen(true);
  };
  const rightPlayerShareLink = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();

    if (typeof window === "undefined") {
      toast.error("Share link is not available right now.");
      return;
    }

    const user = meData?.data?.user;
    const userReferralNo = user?.referral_no;

    const nextShareUrl = new URL(
      `/challenge-dashboard/${offer.id}`,
      window.location.origin
    );
    const currentPlatform =
      new URLSearchParams(window.location.search).get("platform") || "tiktok";

    nextShareUrl.searchParams.set("platform", currentPlatform);

    if (userReferralNo) {
      nextShareUrl.searchParams.set("ref", userReferralNo);
    }

    const shareTitle = `${getDisplayName(offer)} challenges you on ${offer.game} — Go to Challenge`;
    const shareImage = getSafeImageSrc(
      offer.accepted.avatar,
      "/images/home/avatar_img.png"
    );

    setShareSheetTitle(shareTitle);
    setShareSheetImageSrc(shareImage);
    setShareSheetImageAlt(getDisplayName(offer));
    setShareUrl(nextShareUrl.toString());
    setShareSheetOpen(true);
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
                name: offer.modelName || "Model Boss",
                handle: offer.modelName ? `@${offer.modelName.replace(/\s+/g, "")}` : "@ModelBoss",
                avatar: offer.modelImage || "/images/home/middle.png",
              }}
              label="Model"
              tone="green"
              imageOverride={offer.modelImage || "/images/home/middle.png"}
            />
            <ChallengePortraitCard
              player={offer.accepted}
              label={offer.accepted.name || offer.accepted.handle}
              tone={offer.isAccepted ? "green" : "pink"}
              points={offer.amount}
              accepted={offer.isAccepted}
            />
          </div>

          <ChallengeTitleStrip offer={offer} rightLabel={offer?.accepted?.name || offer?.accepted?.handle} />

          <div className="relative grid grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] gap-1 px-2 pt-3 sm:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] sm:px-4">
            <ChallengeSideOfferPanel offer={offer} gameLogo={gameLogo} handleShareClick={handleShareClick} />
            <ChallengeCenterBadge
              offer={{
                match_date: offer.match_date,
                match_time: offer.match_time,
                status: offer.status,
                kind: offer.kind,
              }}
            />
            <ChallengeAcceptPanel
              offer={offer}
              gameLogo={gameLogo}
              onAccept={openAcceptDialog}
              isAccepted={offer.isAccepted}
              handleShareClick={rightPlayerShareLink}
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

      <ReferralShareSheet
        open={shareSheetOpen}
        onOpenChange={setShareSheetOpen}
        title={shareSheetTitle}
        shareUrl={shareUrl}
        imageSrc={shareSheetImageSrc}
        imageAlt={shareSheetImageAlt}
        onCopy={() => toast.success("Challenge share link copied")}
        onShare={() => toast.success("Challenge share link shared")}
      />

      <ChallengeAcceptDialog
        offer={offer}
        open={dialogOpen}
        balance={currentChallengeBalance}
        outcome={outcome}
        agreed={agreed}
        errorMessage={errorMessage}
        onAgreeChange={setAgreed}
        onConfirm={handleConfirm}
        onClose={handleClose}
        isLoading={isAccepting}
      />
    </main>
  );
}
