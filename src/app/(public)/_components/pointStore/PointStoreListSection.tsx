"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import LiveSectionHeader from "@/app/(auth)/_components/watchLive/LiveSectionHeader";
import PointCard from "@/shared/components/card/PointCard";
import BuyPointsDialog, { PointPack } from "@/shared/components/modal/BuyPointsDialog";
import { useAuth } from "@/shared/providers/auth/useAuth";

export default function PointStoreListSection() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const packs: PointPack[] = useMemo(
        () => [
            { id: "pack-50", points: 50, price: "17.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-100", points: 100, price: "29.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-250", points: 250, price: "59.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-500", points: 500, price: "99.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-750", points: 750, price: "149.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-1000", points: 1000, price: "179.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-1500", points: 1500, price: "249.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-2000", points: 2000, price: "319.00", imageSrc: "/images/home/coin.png" },
            { id: "pack-5000", points: 5000, price: "699.00", imageSrc: "/images/home/coin.png" },
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
            // redirect back with selected pack so we can auto-open modal after login
            const redirect = `${pathname}?pack=${encodeURIComponent(pack.id)}`;
            router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
            return;
        }

        setSelected(pack);
        setOpen(true);
        setPackInUrl(pack.id);
    };

    // ✅ auto-open modal after redirect back (login success)
    useEffect(() => {
        const packId = searchParams.get("pack");
        if (!packId) return;

        const found = packs.find((p) => p.id === packId);
        if (!found) return;

        if (!isAuthenticated) return; // logged out অবস্থায় modal খুলবে না

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
        <div className="container">
            <LiveSectionHeader title="Point Store" className="mb-8 tracking-wide text-[48px]" />

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
    );
}
