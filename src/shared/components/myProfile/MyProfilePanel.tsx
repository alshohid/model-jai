/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { StatCard } from "../card/StatCard";
import { MiniStat } from "../card/MiniStat";
import { InfoRow } from "../card/InfoRow";
import BigBossIndicator from "@/shared/components/user/BigBossIndicator";
import { useConnectStripeMutation, useGetStripeStatusQuery } from "@/redux/features/pointstore/buypoint";
import { toast } from "sonner";

type ProfileInfo = {
    name: string;
    email: string;
    contact: string;
    nationality: string;
    avatar: string;
    posts: string | number;
    followers: string | number;
    following: string | number;
    favoriteGame?: {
        name?: string;
        image?: string;
    } | null;
};

type StatItem = {
    label: string;
    value: string;
    icon?: any;
};

type Props = {
    profile: ProfileInfo;
    stats: StatItem[];
    isBigBoss?: boolean;
    onEditProfile?: () => void;
    onSendMoney?: () => void;
    onReferralLink?: () => void;
    onWithdrawRequest?: () => void;
    className?: string;
};

export default function MyProfilePanel({
    profile,
    stats,
    isBigBoss = false,
    onEditProfile,
    onSendMoney,
    onReferralLink,
    onWithdrawRequest,
    className,
}: Props) {
    const { data: stripeStatus, isLoading: isStripeStatusLoading } = useGetStripeStatusQuery();
    const [connectStripe, { isLoading: isConnectStripeLoading }] = useConnectStripeMutation();

    const stripConnectHandler = async () => {
        try {
            const res = await connectStripe();
            if (res.data?.data?.url) {
                window.location.href = res.data.data.url;
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to connect stripe");
        }
    };

    const game = profile.favoriteGame;

    return (
        <section
            className={cn(
                "w-full rounded-[20px] md:rounded-[24px]",
                "border border-white/10 bg-black/30 backdrop-blur-[16px]",
                "p-4 sm:p-6",
                "shadow-[0_30px_80px_rgba(0,0,0,0.55)]",
                className
            )}
        >
            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 lg:gap-10">
                {/* LEFT: Profile image */}
                <div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <h3 className="text-white font-semibold text-[22px] text-center">
                            My Profile
                        </h3>
                        <BigBossIndicator isBigBoss={isBigBoss} size="md" />
                    </div>

                    <div className="overflow-hidden rounded-[24px]">
                        <div className="relative w-full aspect-[4/5]">
                            <Image
                                src={profile?.avatar}
                                alt={profile?.name}
                                fill
                                priority
                                className="object-cover object-top"
                                unoptimized
                            />
                            <div className="absolute inset-x-0 bottom-4 px-4">
                                <button
                                    onClick={onEditProfile}
                                    className="w-full h-[46px] rounded-[14px]
                                    bg-white/10 border border-white/15
                                    text-white hover:bg-white/15 transition"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                    {/* INFO + ACTIONS */}
                    <div>
                        <div className="flex justify-between items-start gap-4">
                            {/* Info rows */}
                            <div className="space-y-2 py-3 md:py-8">
                                <div className="flex items-center gap-2">
                                    <InfoRow label="Name" value={profile.name} />
                                    <BigBossIndicator isBigBoss={isBigBoss} size="sm" />
                                </div>
                                <InfoRow label="Email" value={profile.email} />
                                {profile?.contact && <InfoRow label="Contact" value={profile.contact} />}
                                {profile?.nationality && <InfoRow label="Nationality" value={profile.nationality} />}
                            </div>

                            {/* ── Favourite Game Card (replaces FavoriteButton) ── */}
                            {game?.name ? (
                                <div className="flex-shrink-0 flex flex-col items-center gap-1.5 py-3 md:py-8">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                                        Fav Game
                                    </p>
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#FF2EC8]/30 shadow-[0_0_12px_rgba(255,46,200,0.2)]">
                                        {game.image ? (
                                            <Image
                                                src={game.image}
                                                alt={game.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            /* Fallback — first letter of game name */
                                            <div className="w-full h-full bg-[#FF2EC8]/10 flex items-center justify-center">
                                                <span className="text-[#FF2EC8] font-black text-xl">
                                                    {game.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-white/70 font-medium text-center max-w-[72px] truncate">
                                        {game.name}
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {/* MINI STATS */}
                        <div className="mt-6 rounded-[14px] border border-white/10 bg-white/5 p-3">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <MiniStat label="Posts" value={profile.posts} />
                                <MiniStat label="Followers" value={profile.followers} />
                                <MiniStat label="Following" value={profile.following} />
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="mt-6 space-y-3">
                            <StartStreamingButton
                                onClick={onSendMoney}
                                className="w-full bg-[#00C3FF]"
                            >
                                Send Points
                            </StartStreamingButton>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <StartStreamingButton onClick={onReferralLink}>
                                    Referral Link
                                </StartStreamingButton>

                                {stripeStatus?.connected ? (
                                    <StartStreamingButton
                                        onClick={onWithdrawRequest}
                                        className="bg-black/80"
                                    >
                                        Withdraw Request
                                    </StartStreamingButton>
                                ) : (
                                    <StartStreamingButton
                                        onClick={stripConnectHandler}
                                        disabled={isConnectStripeLoading || isStripeStatusLoading}
                                        className="bg-black/80"
                                    >
                                        {isConnectStripeLoading || isStripeStatusLoading
                                            ? "Loading..."
                                            : "Connect Stripe Wallet"}
                                    </StartStreamingButton>
                                )}
                            </div>
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