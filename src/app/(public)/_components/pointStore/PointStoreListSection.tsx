"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import LiveSectionHeader from "@/app/(auth)/_components/watchLive/LiveSectionHeader";
import PointCard from "@/shared/components/card/PointCard";
import BuyPointsDialog, { PointPack } from "@/shared/components/modal/BuyPointsDialog";
import { useAuth } from "@/shared/providers/auth/useAuth";
import Image from "next/image";

export default function PointStoreListSection() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const packs: PointPack[] = useMemo(
        () => [
            { id: "pack-50", points: 50, price: "50.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-100", points: 100, price: "100.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-250", points: 250, price: "250.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-500", points: 500, price: "500.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-750", points: 750, price: "750.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-1000", points: 1000, price: "1000.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-1500", points: 1500, price: "1500.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-2000", points: 2000, price: "2000.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-5000", points: 5000, price: "5000.00", imageSrc: "/images/home/coin.png" },
        ],
        []
    );

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<PointPack | null>(null);

    const setPackInUrl = (packId?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (packId) params.set("pack", packId);
        else params.delete("pack");

        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname);
    };

    const handleBuy = (pack: PointPack) => {
        if (!isAuthenticated) {
            const redirect = `${pathname}?pack=${encodeURIComponent(pack.id)}`;
            router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
            return;
        }

        setSelected(pack);
        setOpen(true);
        setPackInUrl(pack.id);
    };

    useEffect(() => {
        const packId = searchParams.get("pack");
        if (!packId) return;

        const found = packs.find((p) => p.id === packId);
        if (!found) return;

        if (!isAuthenticated) return;

        setSelected(found);
        setOpen(true);
    }, [searchParams, packs, isAuthenticated]);

    const onOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            setSelected(null);
            setPackInUrl(undefined); // close করলে url clean
        }
    };

    return (
        <div className="relative">
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
                <LiveSectionHeader title="Point Store" className="mb-8 tracking-wide text-[38px] md:text-[40] lg:text-[48px]" />

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
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
                    onPay={(pack) => {
                        console.log("Pay with Stripe clicked:", pack);
                        // later: call /api/stripe/create-checkout-session with pack.id
                    }}
                />

            </div>

        </div>
    );
}
