"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

type PromoSplitCardProps = {
    className?: string;
    children: React.ReactNode;
};

function PromoSplitCard({ className, children }: PromoSplitCardProps) {
    return (
        <div
            className={cn(
                "w-full overflow-hidden rounded-2xl",
                "border border-white/10",
                "bg-white/[0.03] backdrop-blur-md",
                "shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
                className
            )}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">{children}</div>
        </div>
    );
}

type ContentProps = {
    className?: string;
    children: React.ReactNode;
};

function Content({ className, children }: ContentProps) {
    return (
        <div className={cn("p-10 sm:p-14 lg:p-16 flex items-center", className)}>
            {children}
        </div>
    );
}

type MediaProps = {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    sizes?: string;
    overlay?: boolean;
};

function Media({
    src,
    alt,
    className,
    priority = false,
    sizes = "(min-width: 1024px) 50vw, 100vw",
    overlay = true,
}: MediaProps) {
    return (
        <div
            className={cn(
                "relative w-full",
                "aspect-[16/10] lg:aspect-auto lg:min-h-[320px]",
                className
            )}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                sizes={sizes}
                priority={priority}
            />
            {overlay && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />
            )}
        </div>
    );
}

// attach as static properties for clean usage
PromoSplitCard.Content = Content;
PromoSplitCard.Media = Media;

export default PromoSplitCard;
