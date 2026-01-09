"use client";

import Image from "next/image";
import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";

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
    icon?: React.ReactNode;
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
                "p-4 sm:p-6 lg:p-8",
                "shadow-[0_30px_80px_rgba(0,0,0,0.55)]",
                className
            )}
        >
            {/* Layout: mobile stack, desktop 3 cols */}
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr_360px] gap-5 lg:gap-8">
                {/* LEFT: Profile card */}
                <div className="rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-[12px] p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-[18px]">My Profile</h3>

                        <button
                            type="button"
                            className="cursor-pointer inline-flex items-center justify-center size-9 rounded-[10px]
                         bg-white/8 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition"
                            aria-label="Favorite"
                        >
                            {/* heart */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 21s-7-4.35-9.33-8.22C.44 9.22 2.16 5.75 6 5.3c1.9-.22 3.37.7 4 1.62.63-.92 2.1-1.84 4-1.62 3.84.45 5.56 3.92 3.33 7.48C19 16.65 12 21 12 21z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-[16px] bg-white/5 border border-white/10">
                        <div className="relative w-full aspect-[4/3]">
                            <Image
                                src={profile.avatar}
                                alt={profile.name}
                                fill
                                priority
                                sizes="(max-width: 1024px) 92vw, 360px"
                                className="object-cover"
                            />
                        </div>

                        <div className="p-4">
                            <button
                                type="button"
                                onClick={onEditProfile}
                                className="cursor-pointer w-full h-[44px] rounded-[12px]
                           bg-white/10 border border-white/15 text-white/85
                           hover:bg-white/12 transition"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* MIDDLE: Info + mini stats + actions */}
                <div className="rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-[12px] p-4 sm:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <InfoRow label="Name" value={profile.name} />
                        <InfoRow label="Email" value={profile.email} />
                        <InfoRow label="Contact" value={profile.contact} />
                        <InfoRow label="Nationality" value={profile.nationality} />
                    </div>

                    {/* mini stats bar */}
                    <div className="mt-4 rounded-[14px] border border-white/10 bg-white/6 p-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <MiniStat label="Posts" value={profile.posts} />
                            <MiniStat label="Followers" value={profile.followers} />
                            <MiniStat label="Following" value={profile.following} />
                        </div>
                    </div>

                    {/* actions */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ActionButton
                            variant="blue"
                            onClick={onSendMoney}
                            className="sm:col-span-2"
                        >
                            Send Money
                        </ActionButton>

                        <ActionButton variant="pink" onClick={onReferralLink}>
                            Referral Link
                        </ActionButton>

                        <ActionButton variant="dark" onClick={onWithdrawRequest}>
                            Withdraw Request
                        </ActionButton>
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

/* ---------- small reusable pieces ---------- */

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <p className="text-white/45 text-[12px]">{label}</p>
            <p className="mt-1 text-white text-[14px] sm:text-[15px] font-medium truncate">
                {value}
            </p>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-[12px] bg-white/5 border border-white/10 py-2">
            <p className="text-white/45 text-[11px]">{label}</p>
            <p className="text-white font-semibold text-[14px]">{value}</p>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-[12px] p-4">
            <div className="flex items-center gap-4">
                <div
                    className="shrink-0 size-12 rounded-full border border-pink-200/40 bg-white/5
                     flex items-center justify-center text-white/80"
                >
                    {icon ?? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 1v22M1 12h22"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </div>

                <div className="min-w-0">
                    <p className="text-white text-[18px] font-semibold leading-tight">
                        {label}
                    </p>
                    <p className="text-white/85 text-[18px] font-medium mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
}

function ActionButton({
    children,
    variant,
    onClick,
    className,
}: {
    children: React.ReactNode;
    variant: "blue" | "pink" | "dark";
    onClick?: () => void;
    className?: string;
}) {
    const styles =
        variant === "blue"
            ? "bg-[#14A5FF] hover:opacity-95 text-white"
            : variant === "pink"
                ? "bg-[#FF2EC8] hover:opacity-95 text-white"
                : "bg-white/6 hover:bg-white/10 text-white/85 border border-white/12";

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "cursor-pointer h-[46px] rounded-[12px] px-4",
                "transition active:scale-[0.99]",
                "flex items-center justify-center font-semibold text-[14px]",
                styles,
                className
            )}
        >
            {children}
        </button>
    );
}
