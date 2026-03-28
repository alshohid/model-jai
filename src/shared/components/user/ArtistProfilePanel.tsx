/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { StatCard } from "../card/StatCard";
import { MiniStat } from "../card/MiniStat";
import { InfoRow } from "../card/InfoRow";
import BigBossIndicator from "./BigBossIndicator";
import { UserPlus, UserCheck, CheckCircle2, Send } from "lucide-react";

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
};

type StatItem = {
    label: string;
    value: string;
    icon?: any;
};

type Props = {
    artist: ArtistInfo;
    stats: StatItem[];
    onFollow?: () => void;
    onSendTip?: () => void;
    className?: string;
    isLoading?: boolean;
};

export default function ArtistProfilePanel({
    artist,
    stats,
    onFollow,
    onSendTip,
    className,
    isLoading,
}: Props) {
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
                            <Image
                                src={artist.avatar}
                                alt={artist.name}
                                fill
                                priority
                                className="object-cover object-top"
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
                </div>

                {/* RIGHT CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                    {/* INFO + ACTIONS */}
                    <div>
                        <div className="flex justify-between items-start gap-4 mb-4">
                            <div className="space-y-2 py-3 md:py-8">
                                <div className="flex items-center gap-2">
                                    <InfoRow label="Name" value={artist.name} />
                                    {artist.isBigBoss && (
                                        <BigBossIndicator isBigBoss={true} size="sm" />
                                    )}
                                    {artist.isVerified && (
                                        <CheckCircle2 className="size-4 text-[#00C3FF]" />
                                    )}
                                </div>
                                <InfoRow label="Username" value={`@${artist.username}`} />
                                <InfoRow label="Email" value={artist.email} />
                                {artist.contact && (
                                    <InfoRow label="Contact" value={artist.contact} />
                                )}
                                {artist.nationality && (
                                    <InfoRow label="Nationality" value={artist.nationality} />
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        {artist.bio && (
                            <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-white/80 text-sm leading-relaxed">{artist.bio}</p>
                            </div>
                        )}

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

                            {/* <StartStreamingButton
                                onClick={onSendTip}
                                className="w-full bg-[#00C3FF] hover:bg-[#00C3FF]/90"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Send className="size-5" />
                                    <span>Send Tip Points</span>
                                </div>
                            </StartStreamingButton> */}
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
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
