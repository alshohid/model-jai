/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState } from "react";

const statIconBlurDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="16" fill="#1a1f25"/></svg>`
)}`;

function StatIconImage({ src, alt }: { src: string; alt: string }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="relative size-16 overflow-hidden rounded-full">
            <div
                aria-hidden="true"
                className={`absolute inset-0 transition-opacity duration-300 ${isLoaded ? "opacity-0" : "opacity-100"}`}
            >
                <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),rgba(255,255,255,0.05)_42%,rgba(255,255,255,0)_72%)]" />
            </div>

            <Image
                src={src}
                alt={alt}
                width={64}
                height={64}
                sizes="64px"
                placeholder="blur"
                blurDataURL={statIconBlurDataUrl}
                className={`h-16 w-16 rounded-full object-cover transition duration-500 ease-out ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => setIsLoaded(true)}
            />
        </div>
    );
}

export function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon?: any;
}) {
    return (
        <div className="flex items-center rounded-[18px] border border-white/30 bg-white/20 backdrop-blur-[12px] p-4">
            <div className="flex items-center gap-4">
                <div
                    className="shrink-0 size-16 rounded-full 
                    flex items-center justify-center text-white/80"
                >
                    {icon ?
                        <StatIconImage key={`${label}-${icon}`} src={icon} alt={label} />

                        : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 1v22M1 12h22"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        )}
                </div>

                <div className="min-w-0">
                    <p className="text-white text-[18px] text-wrap font-semibold leading-tight">
                        {label}
                    </p>
                    <p className="text-white/85 text-[18px] font-medium mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
}
