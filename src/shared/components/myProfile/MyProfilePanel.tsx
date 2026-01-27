"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import FavoriteButton from "@/shared/UI/button/FavoriteButton";
import { StatCard } from "../card/StatCard";
import { MiniStat } from "../card/MiniStat";
import { InfoRow } from "../card/InfoRow";
import BigBossIndicator from "@/shared/components/user/BigBossIndicator";

type ProfileInfo = {
    name: string;
    email: string;
    contact: string;
    nationality: string;
    avatar: string;
    posts: string | number;
    followers: string | number;
    following: string | number;
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
                                src={profile.avatar}
                                alt={profile.name}
                                fill
                                priority
                                className="object-cover object-top"
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
                            <div className="space-y-2 py-3 md:py-8">
                                <div className="flex items-center gap-2">
                                    <InfoRow label="Name" value={profile.name} />
                                    <BigBossIndicator isBigBoss={isBigBoss} size="sm" />
                                </div>
                                <InfoRow label="Email" value={profile.email} />
                                <InfoRow label="Contact" value={profile.contact} />
                                <InfoRow label="Nationality" value={profile.nationality} />
                            </div>

                            <FavoriteButton
                                loveSrc="/images/home/love.png"
                                loveBgSrc="/images/home/love-bg.png"
                                initialLoved={false}
                            />
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
                                Send Money
                            </StartStreamingButton>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <StartStreamingButton onClick={onReferralLink}>
                                    Referral Link
                                </StartStreamingButton>

                                <StartStreamingButton
                                    onClick={onWithdrawRequest}
                                    className="bg-black/80"
                                >
                                    Withdraw Request
                                </StartStreamingButton>
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
