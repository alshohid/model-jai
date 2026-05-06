/* eslint-disable @typescript-eslint/no-explicit-any */
import { PhilippinePeso } from "lucide-react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

export function PlayerCard({
    image,
    name,
    points,
    status,
    onClick,
    bossSide,
    topRightBadge,
    gameLogo


}: {
    image: string;
    name: string;
    points: number;
    bossSide: any;
    status: "win" | "lose";
    onClick: () => void;
    topRightBadge?: React.ReactNode
    gameLogo?: string
}) {
    const playerImageSrc = getSafeImageSrc(image, "/images/home/avatar_1.png");
    const statusLogoSrc = getSafeImageSrc(
        gameLogo,
        status === "win" ? "/images/home/available_slot.png" : "/images/home/taken_slot.png"
    );

    return (
        <div className={`relative aspect-3/4 overflow-hidden ${bossSide ? "border border-amber-400" : ""}`}>
            <Image src={playerImageSrc} fill className="object-cover" alt={name} />
            <div className="absolute inset-0 bg-black/40" />
            {topRightBadge ? (
                <div className="absolute top-2 right-2 z-20">
                    {topRightBadge}
                </div>
            ) : null}

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <div
                    className={cn(
                        "text-xl font-extrabold",
                        status === "win" ? "text-green-400" : "text-red-500"
                    )}
                    onClick={onClick}
                >
                    {status === "win" ? <Image
                        src={statusLogoSrc}
                        alt="images"
                        width={100}
                        height={100}
                        className="w-7.5 h-7.5 md:w-50 md:h-50"
                    /> : <Image
                        src={statusLogoSrc}
                        alt="images"
                        width={100}
                        height={100}
                        className="w-7.5 h-7.5 md:w-50 md:h-50"
                    />}
                </div>

                <div className="text-yellow-400 text-sm md:text-lg flex items-center justify-center gap-1">
                    {points} <PhilippinePeso size={14} />
                </div>
            </div>
        </div>
    );
}
