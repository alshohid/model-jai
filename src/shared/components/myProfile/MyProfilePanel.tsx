/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { StatCard } from "../card/StatCard";
import { MiniStat } from "../card/MiniStat";
import { InfoRow } from "../card/InfoRow";
import BigBossIndicator from "@/shared/components/user/BigBossIndicator";
import PaymentMethodLogo from "@/shared/components/payment/PaymentMethodLogo";
import { PaymentMethodConfig } from "@/shared/constants/paymentMethods";
import { PaymentMethodId } from "@/types/user/point";

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
    paymentMethods: Array<{
        method: PaymentMethodConfig;
        connected: boolean;
        identifier: string | null;
        isLoading?: boolean;
    }>;
    selectedPaymentMethod?: PaymentMethodId | null;
    walletActionMethod?: PaymentMethodId | null;
    walletActionMode?: "connect" | "disconnect" | null;
    onEditProfile?: () => void;
    onSendMoney?: () => void;
    onReferralLink?: () => void;
    onWithdrawRequest?: () => void;
    onSelectPaymentMethod?: (paymentMethod: PaymentMethodId) => void;
    onConnectPaymentMethod?: (paymentMethod: PaymentMethodId) => void;
    onDisconnectPaymentMethod?: (paymentMethod: PaymentMethodId) => void;
    className?: string;
};

export default function MyProfilePanel({
    profile,
    stats,
    isBigBoss = false,
    paymentMethods,
    selectedPaymentMethod,
    walletActionMethod,
    walletActionMode,
    onEditProfile,
    onSendMoney,
    onReferralLink,
    onWithdrawRequest,
    onSelectPaymentMethod,
    onConnectPaymentMethod,
    onDisconnectPaymentMethod,
    className,
}: Props) {
    const game = profile.favoriteGame;
    const connectedPaymentMethods = paymentMethods.filter((item) => item.connected);
    const hasConnectedPaymentMethod = connectedPaymentMethods.length > 0;

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

                                <StartStreamingButton
                                    onClick={onWithdrawRequest}
                                    disabled={!hasConnectedPaymentMethod}
                                    className="bg-black/80"
                                >
                                    {hasConnectedPaymentMethod
                                        ? "Withdraw Request"
                                        : "Connect Wallet First"}
                                </StartStreamingButton>
                            </div>
                        </div>

                        <div className="mt-6 rounded-[18px] border border-white/10 bg-white/5 p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                                        Withdrawal Accounts
                                    </p>
                                    <h4 className="mt-2 text-lg font-semibold text-white">
                                        Connect your payout methods
                                    </h4>
                                    <p className="mt-1 text-sm leading-6 text-white/55">
                                        Choose any connected wallet when you request a withdrawal.
                                    </p>
                                </div>

                                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-white/65">
                                    {connectedPaymentMethods.length}/{paymentMethods.length} connected
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                {paymentMethods.map((item) => {
                                    const isSelected =
                                        item.connected &&
                                        selectedPaymentMethod === item.method.id;
                                    const isBusy = walletActionMethod === item.method.id;

                                    return (
                                        <div
                                            key={item.method.id}
                                            className={cn(
                                                "rounded-[18px] border p-3 transition",
                                                item.connected
                                                    ? "border-[#00C3FF]/18 bg-[#00C3FF]/6"
                                                    : "border-white/10 bg-black/20",
                                                isSelected && "border-[#00C3FF]/40 bg-[#00C3FF]/10"
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <PaymentMethodLogo
                                                    method={item.method}
                                                    className="size-12 rounded-[16px]"
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="text-sm font-semibold text-white">
                                                            {item.method.name}
                                                        </p>
                                                        <span
                                                            className={cn(
                                                                "rounded-full px-2.5 py-1 text-wrap text-[10px] font-semibold uppercase tracking-[0.18em]",
                                                                item.connected
                                                                    ? "bg-[#00C3FF]/14 text-[#9FE8FF]"
                                                                    : "bg-white/8 text-white/45"
                                                            )}
                                                        >
                                                            {item.connected ? "Connected" : "Not Connected"}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 max-w-full break-words whitespace-normal text-xs leading-5 text-white/55">
                                                        {item.connected
                                                            ? item.identifier || `${item.method.name} account connected`
                                                            : item.method.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {item.connected ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onSelectPaymentMethod?.(item.method.id)
                                                            }
                                                            className={cn(
                                                                "rounded-full border px-3 py-2 text-wrap text-xs font-medium transition",
                                                                isSelected
                                                                    ? "border-[#00C3FF]/40 bg-[#00C3FF]/14 text-[#C8F4FF]"
                                                                    : "border-white/12 bg-white/6 text-white/70 hover:text-white"
                                                            )}
                                                        >
                                                            {isSelected ? "Selected for Withdraw" : "Use for Withdraw"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onDisconnectPaymentMethod?.(item.method.id)
                                                            }
                                                            disabled={isBusy}
                                                            className="rounded-full border border-white/12 bg-black/30 px-3 py-2 text-wrap text-xs font-medium text-white/65 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {isBusy && walletActionMode === "disconnect"
                                                                ? "Disconnecting..."
                                                                : "Disconnect"}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onConnectPaymentMethod?.(item.method.id)
                                                        }
                                                        disabled={isBusy || item.isLoading}
                                                        className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-wrap text-xs font-medium text-white transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isBusy && walletActionMode === "connect"
                                                            ? "Connecting..."
                                                            : item.method.id === "stripe"
                                                                ? "Connect Stripe"
                                                                : `Connect ${item.method.name}`}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
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
