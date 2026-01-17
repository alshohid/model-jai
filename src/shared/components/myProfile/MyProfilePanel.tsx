"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import FavoriteButton from "@/shared/UI/button/FavoriteButton";
import { StatCard } from "../card/StatCard";
import { MiniStat } from "../card/MiniStat";
import { InfoRow } from "../card/InfoRow";

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
    icon?:any;
};

type Props = {
    profile: ProfileInfo;
    stats: StatItem[];
    onEditProfile?: () => void;
    onSendMoney?: () => void;
    onReferralLink?: () => void;
    onWithdrawRequest?: () => void;
    className?: string;
};

export default function MyProfilePanel({
    profile,
    stats,
    onEditProfile,
    onSendMoney,
    onReferralLink,
    onWithdrawRequest,
    className,
}: Props) {
    return (
        <section
            className={cn(
                "w-full",
                "rounded-[20px] md:rounded-[24px]",
                "border border-white/10 bg-black/30 backdrop-blur-[16px]",
                "p-4 sm:p-6 ",
                "shadow-[0_30px_80px_rgba(0,0,0,0.55)]",
                className
            )}
        >
            {/* Layout: mobile stack, desktop 3 cols */}
            <div className="grid grid-cols-1 lg:grid-cols-[4fr_4fr_4fr] gap-5 lg:gap-8">
                <div>
                    <div className="rounded-[18px]">
                        <h3 className="text-white font-semibold text-[24px] text-center">
                            My Profile
                        </h3>

                        <div className="mt-4 overflow-hidden rounded-[28px]">
                            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4]">
                                <Image
                                    src={profile.avatar}
                                    alt={profile.name}
                                    fill
                                    priority
                                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 420px"
                                    className="object-cover object-[center_top] rounded-lg"
                                />

                                <div className="absolute inset-x-0 bottom-10 p-4">
                                    <div className="rounded-[16px] bg-white/10 border border-white/15 backdrop-blur-[10px]">
                                        <button
                                            type="button"
                                            onClick={onEditProfile}
                                            className="cursor-pointer w-full h-[48px] rounded-[16px] text-white/90 hover:bg-white/10 transition"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[18px] pt-10">
                    <div className="flex justify-between">
                        <div className=" gap-3 sm:gap-4">
                            <InfoRow label="Name" value={profile.name} />
                            <InfoRow label="Email" value={profile.email} />
                            <InfoRow label="Contact" value={profile.contact} />
                            <InfoRow label="Nationality" value={profile.nationality} />
                        </div>
                        <div>
                            <FavoriteButton
                                loveSrc="/images/home/love.png"
                                loveBgSrc="/images/home/love-bg.png"
                                initialLoved={false}
                                onChange={(v) => console.log("loved:", v)}
                            />
                        </div>

                    </div>
                
                    <div className="pt-6 mt-6 rounded-[14px] border border-white/10 bg-white/6 p-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <MiniStat label="Posts" value={profile.posts} />
                            <MiniStat label="Followers" value={profile.followers} />
                            <MiniStat label="Following" value={profile.following} />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 grid-cols-1 gap-5 lg:grid-cols-2 ">
                        <StartStreamingButton onClick={onSendMoney}
                            className="sm:col-span-2 md:w-full mb-3 bg-[#00C3FF] text-[0.7rem] md:text-[1.125rem] ">
                            Send Money
                        </StartStreamingButton>
                        <div className="w-full flex justify-between gap-3">
                            <StartStreamingButton className=" sm:col-span-2 w-full text-[0.7rem] md:text-[1.125rem]" onClick={onReferralLink}>
                                Referral Link
                            </StartStreamingButton>
                            <StartStreamingButton className="bg-black/85  sm:col-span-2  w-full text-[#FFFFFF] text-[0.7rem] md:text-[1.125rem]" onClick={onWithdrawRequest}>
                                Withdraw Request
                            </StartStreamingButton>
                    </div>
                    </div>
                </div>

                {/* RIGHT: Stat cards */}
                <div className="grid grid-cols-1 gap-4">
                    {stats.map((s, idx) => (
                        <StatCard key={idx} label={s.label} value={s.value} icon={s.icon} />
                    ))}
                </div>
            </div>
        </section>
    );
}








