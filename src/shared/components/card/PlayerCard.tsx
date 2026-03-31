/* eslint-disable @typescript-eslint/no-explicit-any */
import { PhilippinePeso } from "lucide-react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

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
    return (
        <div className={`relative aspect-3/4 overflow-hidden ${bossSide ? "border border-amber-400" : ""}`}>
            <Image src={image} fill className="object-cover" alt={name} />
            <div className="absolute inset-0 bg-black/40" />
            {topRightBadge ? (
                <div className="absolute top-2 right-2 z-20">
                    {topRightBadge}
                </div>
            ) : null}

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                <div
                    className={cn(
                        "text-xl font-extrabold",
                        status === "win" ? "text-green-400" : "text-red-500"
                    )}
                >
                    {status === "win" ? <Image
                        src={gameLogo || '/images/home/available_slot.png'}
                        alt="images"
                        width={200}
                        height={200}
                        className="w-7.5 h-7.5 md:w-50 md:h-50"
                    /> : <Image
                        src={gameLogo || '/images/home/taken_slot.png'}
                        alt="images"
                        width={200}
                        height={200}
                        className="w-7.5 h-7.5 md:w-50 md:h-50"
                    />}
                </div>

                <button
                    onClick={onClick}
                    className="text-red-700 font-extrabold text-md md:text-2xl hover:underline"
                >
                    {name}
                </button>

                <div className="text-yellow-400 text-sm md:text-lg flex items-center justify-center gap-1">
                    {points} <PhilippinePeso size={14} />
                </div>
            </div>
        </div>
    );
}