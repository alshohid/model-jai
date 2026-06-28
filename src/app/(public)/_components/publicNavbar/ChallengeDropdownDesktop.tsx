"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/shared/lib/utils/cn";
import { ChevronDown, Crown } from "lucide-react";

interface ChallengeDropdownDesktopProps {
    pathname: string;
    isChallenger?: boolean;
}

export default function ChallengeDropdownDesktop({
    pathname,
    isChallenger,
}: ChallengeDropdownDesktopProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                onMouseEnter={() => setOpen(true)}
                className={cn(
                    "cursor-pointer flex items-center gap-1.5 rounded-md px-3 py-1.5 transition text-[1rem] lg:text-[1.125rem]",
                    pathname.startsWith("/challenge-dashboard")
                        ? "bg-navActive text-white"
                        : "text-[#070707] hover:bg-black/5"
                )}
            >
                <Crown className="size-4" />
                <span>Challenges</span>
                <ChevronDown
                    className={cn(
                        "size-3.5 transition-transform",
                        open && "rotate-180"
                    )}
                />
            </button>

            {open && (
                <div
                    onMouseLeave={() => setOpen(false)}
                    className={cn(
                        "absolute left-0 top-full mt-2 w-56 rounded-xl border border-[#d43cff]/35 bg-[#2a1030] shadow-[0_0_20px_rgba(212,60,255,0.28)]",
                        "z-50 overflow-hidden"
                    )}
                >
                    <Link
                        href="/challenge-dashboard"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "block px-4 py-3 text-sm font-medium text-[#f2a6ff] transition hover:bg-white/8 hover:text-white",
                            pathname.startsWith("/challenge-dashboard") &&
                            pathname !== "/challenge-dashboard/create" &&
                            "bg-white/10 text-white"
                        )}
                    >
                        View challenge dashboard
                    </Link>

                    {isChallenger && (
                        <Link
                            href="/challenge-dashboard/create"
                            onClick={() => setOpen(false)}
                            className={cn(
                                "block border-t border-white/10 px-4 py-3 text-sm font-medium text-[#f2a6ff] transition hover:bg-white/8 hover:text-white",
                                pathname === "/challenge-dashboard/create" &&
                                "bg-white/10 text-white"
                            )}
                        >
                            Create a challenge
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}