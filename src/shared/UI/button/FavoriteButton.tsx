"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

type Props = {
    loveSrc: string;      // e.g. "/images/home/love.png"
    loveBgSrc: string;    // e.g. "/images/home/lovebg.png"
    initialLoved?: boolean;
    onChange?: (loved: boolean) => void;
    className?: string;
};

export default function FavoriteButton({
    loveSrc,
    loveBgSrc,
    initialLoved = false,
    onChange,
    className,
}: Props) {
    const [loved, setLoved] = React.useState(initialLoved);

    const toggle = () => {
        setLoved((prev) => {
            const next = !prev;
            onChange?.(next);
            return next;
        });
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={loved}
            aria-label={loved ? "Remove from favorites" : "Add to favorites"}
            className={cn(
                "relative cursor-pointer inline-flex items-center justify-center",
                "size-9 md:size-10 rounded-[12px]",
                "bg-white/10 border border-white/12",
                "hover:bg-white/12 transition",
                "overflow-hidden",
                className
            )}
        >
            {/* BG (only when loved) */}
            <span
                className={cn(
                    "absolute inset-0",
                    "transition-opacity duration-200",
                    loved ? "opacity-100" : "opacity-0"
                )}
            >
                <Image
                    src={loveBgSrc}
                    alt=""
                    fill
                    className="object-cover"
                    priority={false}
                />
            </span>

            {/* Heart icon */}
            <span className="relative z-[1] inline-flex items-center justify-center">
                <Image
                    src={loveSrc}
                    alt=""
                    width={18}
                    height={18}
                    className={cn(
                        "h-[18px] w-[18px] transition",
                        !loved && "brightness-0 invert"
                    )}
                />
            </span>
        </button>
    );
}
