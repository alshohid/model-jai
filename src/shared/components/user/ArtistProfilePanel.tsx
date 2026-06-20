/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { StatCard } from "../card/StatCard";
import { MiniStat } from "../card/MiniStat";
import { InfoRow } from "../card/InfoRow";
import BigBossIndicator from "./BigBossIndicator";
import { UserPlus, UserCheck, CheckCircle2, X } from "lucide-react";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import { FaCircleChevronDown } from "react-icons/fa6";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ChallengeOfferCard from "@/features/challenge-match/components/ChallengeOfferCard";
import { ChallengeMatchOffer } from "@/features/challenge-match/types";
import { useRouter } from "next/navigation";
import { MatchScoreCard } from "./components/match-score/MatchScoreCard";

type ArtistInfo = {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    isBigBoss?: boolean;
    isVerified?: boolean;
    posts: string | number;
    followers: string | number;
    following: string | number;
    isFollowing?: boolean;
    bio?: string;
    contact?: string;
    nationality?: string;
    show_name: boolean;
    show_email: boolean;
    show_total_earning: boolean;
    show_total_referral_earning: boolean;
    show_total_tip_received: boolean;
    show_total_withdraw: boolean;

};

type StatItem = {
    label: string;
    value: string;
    icon?: any;
    isVisible: boolean;
};

type Props = {
    artist: ArtistInfo;
    stats: StatItem[];
    onFollow?: () => void;
    onSendTip?: () => void;
    className?: string;
    isLoading?: boolean;
    offers: ChallengeMatchOffer[];
};

const avatarFallbackSrc = "/images/home/avatar_img.png";
const artistPanelBlurDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50"><rect width="40" height="50" fill="#171b21"/></svg>`
)}`;

function ArtistAvatarImage({ src, alt }: { src: string; alt: string }) {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-[#171b21]">
            <div
                aria-hidden="true"
                className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    isLoaded ? "opacity-0" : "opacity-100"
                )}
            >
                <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),rgba(255,255,255,0.05)_42%,rgba(255,255,255,0)_72%)]" />
            </div>

            <Image
                src={currentSrc}
                alt={alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 360px"
                placeholder="blur"
                blurDataURL={artistPanelBlurDataUrl}
                className={cn(
                    "object-cover object-top transition duration-500 ease-out",
                    isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
                )}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    if (currentSrc !== avatarFallbackSrc) {
                        setCurrentSrc(avatarFallbackSrc);
                        return;
                    }

                    setIsLoaded(true);
                }}
            />
        </div>
    );
}

export default function ArtistProfilePanel({
    artist,
    stats,
    onFollow,
    className,
    isLoading,
    offers,
}: Props) {
    const avatarSrc = getSafeImageSrc(artist.avatar, avatarFallbackSrc);
    const [sheetOpen, setSheetOpen] = useState(false);
    const router = useRouter();


    return (
        <section
            className={cn(
                "w-full rounded-[20px] md:rounded-[24px]",
                "border border-white/10 bg-black/30 backdrop-blur-lg",
                "p-4 sm:p-6",
                "shadow-[0_30px_80px_rgba(0,0,0,0.55)]",
                className
            )}
        >
            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 lg:gap-10">
                {/* LEFT: Profile image */}
                <div>
                    <h3 className="text-white font-semibold text-[22px] text-center mb-4">
                        Artist Profile
                    </h3>

                    <div className="overflow-hidden rounded-[24px]">
                        <div className="relative w-full aspect-4/5">
                            <ArtistAvatarImage
                                key={avatarSrc}
                                src={avatarSrc}
                                alt={artist.name}
                            />

                            {/* Big Boss Badge */}
                            {artist.isBigBoss && (
                                <div className="absolute top-4 left-4">
                                    <BigBossIndicator isBigBoss={true} size="lg" showLabel />
                                </div>
                            )}

                            {/* Verified Badge */}
                            {artist.isVerified && (
                                <div className="absolute top-4 right-4 bg-[#00C3FF] rounded-full p-2">
                                    <CheckCircle2 className="size-5 text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full">
                        {offers?.slice(0, 1).map((offer) => (
                            <ChallengeOfferCard
                                key={offer.id}
                                offer={offer}
                                compact
                                onAccept={() => router.push(`/challenge-dashboard/${offer.id}`)}
                            />
                        ))}
                        {offers && offers.length > 3 && (
                            <div className="w-full flex items-center justify-center mt-2">
                                <button
                                    type="button"
                                    onClick={() => setSheetOpen(true)}
                                    className="cursor-pointer"
                                    aria-label="Show all challenges"
                                >
                                    <FaCircleChevronDown className="text-[30px] text-[#743040] transition hover:text-[#a0455a]" />
                                </button>
                            </div>
                        )}
                    </div>
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetContent
                            side="bottom"
                            className="z-[110] border-t rounded-t-4xl border-white/10 bg-[#0f0a0f]/95 text-white backdrop-blur-2xl p-0 max-h-[80vh] flex flex-col [&>button.absolute]:hidden"
                        >
                            <SheetHeader className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-white/10 ">
                                <div className="flex items-center justify-between">
                                    <SheetTitle className="text-white text-[17px] font-semibold">
                                        <h4 className="text-center ">Ariana&apos;s <span className="text-pink-500"> Offers</span></h4>
                                    </SheetTitle>
                                    <SheetClose asChild>
                                        <button
                                            type="button"
                                            className="rounded-full border border-white/15 bg-white/8 p-1.5 text-white/60 hover:text-white transition"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </SheetClose>
                                </div>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto px-2 py-2">
                                {offers?.map((offer) => (
                                    <ChallengeOfferCard
                                        key={offer.id}
                                        offer={offer}
                                        compact
                                        onAccept={() => {
                                            router.push(`/challenge-dashboard/${offer.id}`);
                                            setSheetOpen(false);
                                        }}
                                    />
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* RIGHT CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                    {/* INFO + ACTIONS */}
                    <div>
                        <div className="flex justify-between items-start gap-4 mb-4">
                            <div className="space-y-2 py-3 md:py-8">
                                {artist.show_name && <div className="flex items-center gap-2">
                                    <InfoRow label="Name" value={artist.name} />
                                    {artist.isBigBoss && (
                                        <BigBossIndicator isBigBoss={true} size="sm" />
                                    )}
                                    {artist.isVerified && (
                                        <CheckCircle2 className="size-4 text-[#00C3FF]" />
                                    )}
                                </div>}

                                <InfoRow label="Artist Name" value={`@${artist.username}`} />
                                {artist.show_email && <InfoRow label="Email" value={artist.email} />}
                            </div>
                        </div>

                        {/* Bio */}
                        {artist.bio && (
                            <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-white/80 text-sm leading-relaxed">{artist.bio}</p>
                            </div>
                        )}
                        <div className="w-full flex items-center justify-center">
                            <MatchScoreCard
                                title="On 21 Match"
                                left={{
                                    score: 10,
                                    color: "green",
                                }}
                                right={{
                                    score: 11,
                                    color: "red",
                                }}
                            />

                        </div>
                        {/* MINI STATS */}
                        <div className="mt-6 rounded-[14px] border border-white/10 bg-white/5 p-3">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <MiniStat label="Posts" value={artist.posts} />
                                <MiniStat label="Followers" value={artist.followers} />
                                <MiniStat label="Following" value={artist.following} />
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="mt-6 space-y-3">
                            <StartStreamingButton
                                onClick={onFollow}
                                isLoading={isLoading}
                                className={cn(
                                    "w-full",
                                    artist.isFollowing
                                        ? "bg-[#00C3FF] hover:bg-[#00C3FF]/90"
                                        : "bg-[#FF2EC8] hover:bg-[#FF2EC8]/90"
                                )}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {artist.isFollowing ? (
                                        <>
                                            <UserCheck className="size-5" />
                                            <span>Following</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="size-5" />
                                            <span>Follow</span>
                                        </>
                                    )}
                                </div>
                            </StartStreamingButton>
                        </div>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        {stats.map((s, idx) => (
                            <StatCard
                                key={idx}
                                label={s.label}
                                value={s.value}
                                icon={s.icon}
                                isVisible={s.isVisible}

                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
