"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import SupporterGridContainer from "./SupporterGridContainer";


export default function SupporterGridSection({
    matchId,
    isLive,
    leftBoss,
    rightBoss,
    leftImg,
    rightImg
}: {
    matchId: string;
    isLive: boolean;
    leftBoss: { name: string; total: number };
        rightBoss: { name: string; total: number };
        rightImg: string;
        leftImg: string;
}) {
    // ✅ Live হলে grid close (hide / locked)
    if (isLive) {
        return (
            <section className="w-full bg-black">
                <div className="mx-auto w-full px-3 md:px-4 py-6">
                    <div className="grid grid-cols-2 gap-4 items-end">
                        <BossCard name={leftBoss.name} img={leftImg} />
                        <BossCard name={rightBoss.name} img={rightImg} />
                    </div>

                    <h2
                        className={cn(
                            "mt-6 text-center font-black text-[44px] md:text-[60px] tracking-widest",
                            "text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-orange-500 to-yellow-300",
                            "drop-shadow-[0_6px_0_rgba(0,0,0,0.75)]"
                        )}
                    >
                        WHO IS THE BOSS
                    </h2>
                </div>
            </section>
        );
    }

    // Upcoming হলে grid open থাকবে
    return (
        <section className="w-full bg-black">
            <div className="mx-auto w-full px-3 md:px-4 py-6">
                <h3 className="text-white font-black text-[28px] text-center mb-4">Supporter Grid</h3>
                <SupporterGridContainer matchId={matchId} matchStatus="Upcoming" locked={false} selectedSide="left" onSupport={() => {}} />
            </div>
        </section>
    );
}

function BossCard({ name ,img}: { name: string,img:string }) {
    return (
        <div className="relative rounded-xl bg-black/40 border border-white/10 p-3">
            <div className="w-full aspect-4/5 relative rounded-lg overflow-hidden bg-black">
                <Image
                    src={img}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="mt-3 text-white/80 text-[12px] font-semibold">Big Boss Supporter</div>
            <div className="text-white font-black text-[16px]">{name}</div>
        </div>
    );
}
