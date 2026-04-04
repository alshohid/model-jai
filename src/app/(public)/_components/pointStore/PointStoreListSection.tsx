"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Coins, Sparkles } from "lucide-react";

import LiveSectionHeader from "@/app/(auth)/_components/watchLive/LiveSectionHeader";
import PointCard from "@/shared/components/card/PointCard";
import BuyPointsDialog, {
    getCheckoutTotal,
    PointPack,
} from "@/shared/components/modal/BuyPointsDialog";

import Image from "next/image";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/redux/features/auth/hooks";
import { useBuyPointMutation } from "@/redux/features/pointstore/buypoint";
import { cn } from "@/shared/lib/utils/cn";
import { toast } from "sonner";

const POINT_IMAGE_SRC = "/images/home/coin.png";
const CUSTOM_PACK_ID = "custom-pack";
const DEFAULT_CUSTOM_POINTS = 300;
const CUSTOM_SUGGESTIONS = [75, 150, 300, 750, 1500];

const formatPoints = (value: number) => new Intl.NumberFormat("en-US").format(value);

const parsePositiveInteger = (value: string | null | undefined) => {
    if (!value) return null;

    const numericValue = Number(value);
    if (!Number.isInteger(numericValue) || numericValue <= 0) {
        return null;
    }

    return numericValue;
};

const buildCustomPack = (points: number): PointPack => ({
    id: CUSTOM_PACK_ID,
    title: `${formatPoints(points)} Custom Points`,
    description: "Choose your exact point amount and continue with the same secure Stripe checkout flow.",
    badge: "Flexible Amount",
    points,
    price: points.toFixed(2),
    imageSrc: POINT_IMAGE_SRC,
});

export default function PointStoreListSection() {
    const { isAuthenticated, role } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [buyPoint, { isLoading }] = useBuyPointMutation();
    const canPurchase = isAuthenticated && (role === "user" || role === "artist");

    const packs: PointPack[] = useMemo(
        () => [
            {
                id: "pack-50",
                points: 50,
                price: "50.00",
                title: "Starter Pack",
                badge: "Quick Buy",
                imageSrc: POINT_IMAGE_SRC,
            },
            {
                id: "pack-100",
                points: 100,
                price: "100.00",
                title: "Boost Pack",
                badge: "Quick Buy",
                imageSrc: POINT_IMAGE_SRC,
            },
            {
                id: "pack-250",
                points: 250,
                price: "250.00",
                title: "Momentum Pack",
                badge: "Quick Buy",
                imageSrc: POINT_IMAGE_SRC,
            },
            {
                id: "pack-500",
                points: 500,
                price: "500.00",
                title: "Power Pack",
                badge: "Quick Buy",
                imageSrc: POINT_IMAGE_SRC,
            },
            {
                id: "pack-750",
                points: 750,
                price: "750.00",
                title: "Premium Pack",
                badge: "Quick Buy",
                imageSrc: POINT_IMAGE_SRC,
            },
            {
                id: "pack-1000",
                points: 1000,
                price: "1000.00",
                title: "Elite Pack",
                badge: "Quick Buy",
                imageSrc: POINT_IMAGE_SRC,
            },
            {
                id: "pack-1500",
                points: 1500,
                price: "1500.00",
                title: "Creator Pack",
                badge: "Quick Buy",
                imageSrc: POINT_IMAGE_SRC,
            },
            {
                id: "pack-2000",
                points: 2000,
                price: "2000.00",
                title: "Champion Pack",
                badge: "Quick Buy",
                imageSrc: POINT_IMAGE_SRC,
            },
            {
                id: "pack-5000",
                points: 5000,
                price: "5000.00",
                title: "Legend Pack",
                badge: "Quick Buy",
                imageSrc: POINT_IMAGE_SRC,
            },
        ],
        []
    );

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<PointPack | null>(null);
    const [customAmount, setCustomAmount] = useState(
        () => String(parsePositiveInteger(searchParams.get("amount")) ?? DEFAULT_CUSTOM_POINTS)
    );
    const customPoints = useMemo(() => parsePositiveInteger(customAmount), [customAmount]);

    const setPurchaseInUrl = ({ packId, amount }: { packId?: string; amount?: number }) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("pack");
        params.delete("amount");

        if (packId) {
            params.set("pack", packId);
        }

        if (amount) {
            params.set("amount", String(amount));
        }

        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    const openPurchase = (pack: PointPack) => {
        const routeState =
            pack.id === CUSTOM_PACK_ID
                ? { amount: pack.points }
                : { packId: pack.id };

        if (!canPurchase) {
            const redirectParams = new URLSearchParams();
            if (routeState.packId) redirectParams.set("pack", routeState.packId);
            if (routeState.amount) redirectParams.set("amount", String(routeState.amount));
            const redirect = redirectParams.toString()
                ? `${pathname}?${redirectParams.toString()}`
                : pathname;
            router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
            return;
        }

        setSelected(pack);
        setOpen(true);
        setPurchaseInUrl(routeState);
    };

    const handleBuy = (pack: PointPack) => {
        openPurchase(pack);
    };

    const handleCustomBuy = () => {
        if (!customPoints) {
            toast.error("Please enter a valid custom point amount");
            return;
        }

        openPurchase(buildCustomPack(customPoints));
    };

    const handleStripePayment = async (pack: PointPack, totalAmount?: number) => {
        const subtotal = Number(pack.price);
        const amount = totalAmount ?? getCheckoutTotal(subtotal);

        if (!Number.isFinite(amount) || amount <= 0) {
            toast.error("Invalid checkout amount");
            return;
        }

        try {
            const result = await buyPoint({ amount }).unwrap();
            const checkoutUrl = result?.data?.url;
            if (!checkoutUrl) {
                console.log("Stripe URL missing", result);
                toast.error("Stripe URL missing");
                return;
            }
            window.location.href = checkoutUrl;
        } catch (error) {
            console.log("Stripe payment error:", error);
            toast.error(getErrorMessage(error, "Stripe payment error"));
        }
    };

    useEffect(() => {
        const amountParam = searchParams.get("amount");
        const parsedAmount = parsePositiveInteger(amountParam);

        if (!canPurchase) return;

        if (parsedAmount) {
            startTransition(() => {
                setSelected(buildCustomPack(parsedAmount));
                setOpen(true);
            });
            return;
        }

        const packId = searchParams.get("pack");
        if (!packId) return;

        const found = packs.find((p) => p.id === packId);
        if (!found) return;

        startTransition(() => {
            setSelected(found);
            setOpen(true);
        });
    }, [searchParams, packs, canPurchase]);

    const onOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            setSelected(null);
            setPurchaseInUrl({});
        }
    };

    return (
        <div className="relative py-8 md:py-10 lg:py-12">
            <div className="pointer-events-none absolute -left-[400px] -top-[400px] -z-10">
                <Image
                    src="/images/home/live_left_ellipse.png"
                    width={1200}
                    height={1200}
                    alt="ellipse"
                    className="h-[1200px] w- [1200px]"
                />
            </div>
            <div className=" pointer-events-none absolute right-0 bottom-0 -z-10 translate-y-1/2">
                <Image
                    src="/images/home/bottom_right.png"
                    width={702}
                    height={702}
                    alt="elips"
                    className="w-[1700px] h-[1400px]"
                />
            </div>

            <div className="container py-17 md:py-15 lg:py-20">
                <LiveSectionHeader title="Point Store" className="mb-8 tracking-wide text-[38px] md:text-[40px] lg:text-[48px]" />

                <div className="relative mb-10 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(18,11,20,0.96),rgba(26,18,30,0.86))] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:p-6 lg:p-8">
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(0,195,255,0.2),transparent_55%)]" />
                    <div className="pointer-events-none absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-[#FF4D8D]/14 blur-3xl" />

                    <div className="relative grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-8">
                        <div className="order-2 hidden lg:block">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-[#9FE8FF]">
                                <Sparkles className="size-3.5" />
                                Point Store
                            </div>

                            <h2 className="mt-4 max-w-xl text-[34px] font-semibold leading-tight text-white">
                                Buy preset bundles or choose your own amount.
                            </h2>

                            <p className="mt-4 max-w-lg text-base leading-7 text-white/65">
                                Use the custom checkout for an exact point amount, or pick a ready-made bundle and continue with secure Stripe payment.
                            </p>
                        </div>

                        <div className="order-1 relative rounded-[24px] border border-white/10 bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-5 lg:order-2 lg:rounded-[26px] lg:p-6">
                            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                                        Custom Checkout
                                    </p>
                                    <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                                        Choose your points
                                    </h3>
                                    <p className="mt-2 hidden text-sm leading-6 text-white/55 sm:block">
                                        Enter an amount and continue with Stripe checkout.
                                    </p>
                                </div>

                                <div className="rounded-full border border-[#00C3FF]/20 bg-[#00C3FF]/10 px-3 py-1 text-xs font-medium text-[#9FE8FF] sm:text-sm">
                                    {formatPoints(customPoints ?? 0)} pts
                                </div>
                            </div>

                            <label
                                htmlFor="custom-point-amount"
                                className="mt-5 block text-sm font-medium text-white/70 sm:mt-6"
                            >
                                Point amount
                            </label>

                            <div className="mt-3 flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/6 px-3 py-3 sm:px-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-white/8 sm:size-11">
                                    <Coins className="size-4 text-[#FFD36A] sm:size-5" />
                                </div>

                                <input
                                    id="custom-point-amount"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={customAmount}
                                    onChange={(event) =>
                                        setCustomAmount(event.target.value.replace(/[^\d]/g, ""))
                                    }
                                    placeholder="Enter amount"
                                    className="w-full bg-transparent text-xl font-semibold text-white outline-none placeholder:text-white/25 sm:text-2xl"
                                />

                                <span className="hidden text-sm uppercase tracking-[0.24em] text-white/45 sm:block">
                                    points
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                {CUSTOM_SUGGESTIONS.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => setCustomAmount(String(amount))}
                                        className={cn(
                                            "rounded-full border px-4 py-2 text-sm transition",
                                            customPoints === amount
                                                ? "border-[#00C3FF]/40 bg-[#00C3FF]/14 text-[#C8F4FF]"
                                                : "border-white/10 bg-white/6 text-white/65 hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {formatPoints(amount)} pts
                                    </button>
                                ))}
                            </div>

                            <div className="mt-5 rounded-[20px] border border-white/10 bg-white/5 p-4">
                                <div className="flex items-center justify-between text-sm text-white/65">
                                    <span>Selected amount</span>
                                    <span>{customPoints ? `${formatPoints(customPoints)} pts` : "--"}</span>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-sm text-white/65">
                                    <span>Checkout charge</span>
                                    <span>{customPoints ? `$${customPoints.toFixed(2)}` : "--"}</span>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-sm text-white/65">
                                    <span>Payment provider</span>
                                    <span>Stripe</span>
                                </div>
                            </div>

                            {customAmount && !customPoints ? (
                                <p className="mt-3 text-sm text-[#FFB3C8]">
                                    Enter a whole number greater than 0.
                                </p>
                            ) : (
                                <p className="mt-3 hidden text-sm text-white/45 sm:block">
                                    The checkout amount follows the same pricing used for the preset bundles.
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleCustomBuy}
                                disabled={!customPoints || isLoading}
                                className={cn(
                                    "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[16px] px-5 py-4 text-base font-medium text-white transition",
                                    "bg-[linear-gradient(135deg,#00C3FF,#FF4D8D)] shadow-[0_18px_40px_rgba(0,195,255,0.22)]",
                                    "hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                                )}
                            >
                                <span>
                                    {isLoading && selected?.id === CUSTOM_PACK_ID
                                        ? "Processing..."
                                        : "Buy Custom Points"}
                                </span>
                                {!isLoading && <ArrowRight className="size-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="hidden text-xs uppercase tracking-[0.28em] text-white/35 sm:block">
                            Ready Packages
                        </p>
                        <h3 className="text-xl font-semibold text-white sm:mt-2 sm:text-2xl">
                            Fixed point bundles
                        </h3>
                    </div>

                    <p className="hidden max-w-xl text-sm leading-6 text-white/55 lg:block">
                        Pick a bundle for the fastest checkout experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 place-items-center sm:grid-cols-2 xl:grid-cols-3">
                    {packs.map((p) => (
                        <PointCard
                            key={p.id}
                            points={p.points}
                            price={p.price}
                            imageSrc={p.imageSrc}
                            onBuy={() => handleBuy(p)}
                        />
                    ))}
                </div>

                <BuyPointsDialog
                    open={open}
                    onOpenChange={onOpenChange}
                    pack={selected}
                    isLoading={isLoading}
                    onPay={(pack) => handleStripePayment(pack)}
                />
            </div>
        </div>
    );
}
