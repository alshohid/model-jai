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
    isVisible,
    onToggleVisibility,
}: {
    label: string;
    value: string;
    icon?: any;
    isVisible?: boolean;
    onToggleVisibility?: () => void;
}) {
    return (
        <div className="flex items-center rounded-[18px] border border-white/30 bg-white/20 backdrop-blur-[12px] p-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
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

            {onToggleVisibility && (
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="shrink-0 ml-2 p-2 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition"
                    title={isVisible ? "Visible to others" : "Hidden from others"}
                >
                    {isVisible ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
}