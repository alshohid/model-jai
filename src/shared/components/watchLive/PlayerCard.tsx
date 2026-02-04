/**
 * PlayerCard Component
 * Displays player information with image, name, points, and status
 * Following Single Responsibility Principle - only displays player card
 */

"use client";

import Image from "next/image";
import { PhilippinePeso } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

interface PlayerCardProps {
    image: string;
    name: string;
    points: number;
    status: "win" | "lose";
    bossSide: boolean;
    onClick: () => void;
    topRightBadge?: React.ReactNode;
}

export default function PlayerCard({
    image,
    name,
    points,
    status,
    onClick,
    bossSide,
    topRightBadge,
}: PlayerCardProps) {
    const statusImage = status === "win" 
        ? "/images/home/available_slot.png"
        : "/images/home/taken_slot.png";

    return (
        <div
            className={cn(
                "relative aspect-[3/4] overflow-hidden",
                bossSide && "border border-amber-400"
            )}
        >
            <Image src={image} fill className="object-cover" alt={name} />
            <div className="absolute inset-0 bg-black/40" />

            {topRightBadge && (
                <div className="absolute top-2 right-2 z-20">
                    {topRightBadge}
                </div>
            )}

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                <div
                    className={cn(
                        "text-xl font-extrabold",
                        status === "win" ? "text-green-400" : "text-red-500"
                    )}
                >
                    <Image
                        src={statusImage}
                        alt="status"
                        width={200}
                        height={200}
                        className="w-[30px] h-[30px] md:w-[200px] md:h-[200px]"
                    />
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
