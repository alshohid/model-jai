"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

export type MasonryItem = {
    id: string;
    src: string;
    alt: string;
    width: number;  // original width
    height: number; // original height
    href?: string;
};

export default function MasonryGrid({
    items,
    className,
}: {
    items: MasonryItem[];
    className?: string;
}) {
    return (
        <div
            className={cn(
                "columns-1 sm:columns-2 lg:columns-3 xl:columns-4",
                "gap-5",
                className
            )}
        >
            {items.map((it) => (
                <article
                    key={it.id}
                    className="mb-5 break-inside-avoid"
                >
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <Image
                            src={it.src}
                            alt={it.alt}
                            width={it.width}
                            height={it.height}
                            className="w-full h-auto object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                    </div>
                </article>
            ))}
        </div>
    );
}
