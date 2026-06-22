"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils/cn";
import AuthButton from "@/shared/UI/button/AuthButton";
import ProfileDropdown from "@/shared/components/dropdown/ProfileDropdown";
import PointsMenuButton from "./PointsMenuButton";


import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { LuAlignRight } from "react-icons/lu";
import { ChevronDown, Crown } from "lucide-react";
import TipShortcutToggle from "@/shared/components/TipShortcutToggle";
import NavbarSearch from "./NavbarSearch";
import { useAuth } from "@/redux/features/auth/hooks";
import Skeleton from "@/shared/UI/Skeleton";

type NavItem = { label: string; href: string };

export default function MobileNavSheet({
    navItems,
    points = 0,
    avatarSrc,
    tone = "dark",
    isMeDataLoading,
    isChallenger,
}: {
    navItems: NavItem[];
    points?: number;
    avatarSrc?: string;
    tone?: "dark" | "light";
    isMeDataLoading?: boolean;
    isChallenger?: boolean;
}) {
    const pathname = usePathname();
    const { isAuthenticated, role } = useAuth();
    const [challengeMenuOpen, setChallengeMenuOpen] = React.useState(false);


    const triggerStyles =
        tone === "light"
            ? "bg-black/5 border border-black/10 text-[#070707] hover:bg-black/10"
            : "bg-white/10 border border-white/12 text-white hover:bg-white/12";

    return (
        <Sheet>
            <div className="relative">
                {isAuthenticated && (role === "user" || role === "artist") && (
                    <div className="py-2 ml-2 flex md:hidden ">
                        <NavbarSearch />
                    </div>
                )}
                <SheetTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "md:hidden cursor-pointer inline-flex items-center justify-center shrink-0",
                            "h-8 w-8 sm:h-9 sm:w-9 rounded-[10px] p-1.5",
                            triggerStyles,
                            "transition"
                        )}
                        aria-label="Open menu"
                    >
                        <LuAlignRight className="text-xl sm:text-[26px] leading-none" />
                    </button>
                </SheetTrigger>
            </div>
            <SheetContent
                side="right"
                className={cn(
                    "p-0 border-0",
                    "w-[86vw] max-w-[360px]",
                    "bg-[#160F16]/92 backdrop-blur-xl",
                    "text-white z-[70]",
                    "max-h-dvh overflow-hidden",
                    "shadow-[0_22px_70px_rgba(0,0,0,0.55)]"
                )}
            >
                <div className="flex h-full min-h-0 flex-col">
                    <SheetHeader className="px-5 pt-5 pb-4 border-b border-white/10">
                        <div className="flex items-center justify-between gap-3">
                            <SheetTitle className="text-white text-[18px] font-semibold">
                                Menu
                            </SheetTitle>

                            <SheetClose asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "cursor-pointer inline-flex items-center justify-center",
                                        "h-10 w-10 rounded-[12px]",
                                        "bg-white/10 border border-white/12",
                                        "text-white/80 hover:text-white hover:bg-white/12 transition"
                                    )}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </SheetClose>
                        </div>
                    </SheetHeader>

                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">

                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <SheetClose asChild key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "cursor-pointer rounded-[12px] px-4 py-3",
                                                "border border-white/10 bg-white/5 transition",
                                                active
                                                    ? "bg-white/12 text-white"
                                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </SheetClose>
                                );
                            })}
                        </nav>

                        {isAuthenticated && (role === "user" || role === "artist") && (
                            <SheetClose asChild>
                                <Link
                                    href="/support-history"
                                    className={cn(
                                        "mt-4 block w-full rounded-[12px] px-4 py-3 text-left",
                                        "border border-white/10 bg-white/5  transition",
                                        "text-white font-medium hover:bg-white/40"
                                    )}
                                >
                                    Support History
                                </Link>
                            </SheetClose>
                        )}
                        {isAuthenticated && (role === "user" || role === "artist") && (
                            <div className="mt-4 overflow-hidden rounded-[12px] border border-[#d43cff]/45 bg-[#2a1030]/70 shadow-[0_0_20px_rgba(212,60,255,0.28)]">
                                <button
                                    type="button"
                                    onClick={() => setChallengeMenuOpen((open) => !open)}
                                    aria-expanded={challengeMenuOpen}
                                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[#ff8cff] transition hover:bg-white/8 hover:text-white"
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        <Crown className="h-5 w-5 flex-shrink-0" />
                                        <span className="truncate text-sm font-black uppercase tracking-[0.04em]">
                                            Big boss challenge offers
                                        </span>
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 flex-shrink-0 transition-transform",
                                            challengeMenuOpen && "rotate-180"
                                        )}
                                    />
                                </button>
                                {challengeMenuOpen ? (
                                    <div className="grid border-t border-[#d43cff]/35 bg-black/12">
                                        <SheetClose asChild>
                                            <Link
                                                href="/challenge-dashboard"
                                                className={cn(
                                                    "px-4 py-3 text-sm font-medium text-[#f2a6ff] transition hover:bg-white/8 hover:text-white",
                                                    pathname.startsWith("/challenge-dashboard") &&
                                                    pathname !== "/challenge-dashboard/create" &&
                                                    "bg-white/10 text-white"
                                                )}
                                            >
                                                View challenge dashboard
                                            </Link>
                                        </SheetClose>
                                        {isChallenger && <SheetClose asChild>
                                            <Link
                                                href="/challenge-dashboard/create"
                                                className={cn(
                                                    "border-t border-white/10 px-4 py-3 text-sm font-medium text-[#f2a6ff] transition hover:bg-white/8 hover:text-white",
                                                    pathname === "/challenge-dashboard/create" &&
                                                    "bg-white/10 text-white"
                                                )}
                                            >
                                                Create a challenge
                                            </Link>
                                        </SheetClose>}
                                    </div>
                                ) : null}
                            </div>
                        )}
                        {isAuthenticated && (role === "user" || role === "artist") && (
                            <SheetClose asChild>
                                <Link
                                    href="/transactions"
                                    className={cn(
                                        "mt-4 block w-full rounded-[12px] px-4 py-3 text-left",
                                        "border border-white/10 bg-white/5  transition",
                                        "text-white font-medium hover:bg-white/40"
                                    )}
                                >
                                    Transactions
                                </Link>
                            </SheetClose>
                        )}
                        {isAuthenticated && (role === "user" || role === "artist") && (
                            <div className="mt-5">
                                <TipShortcutToggle
                                    storageKey="tip_shortcut_enabled"
                                    defaultOn={false}
                                />
                            </div>
                        )}



                        <div className="mt-6">
                            {isAuthenticated && (role === "user" || role === "artist") ? (

                                <div className="flex  items-center justify-between gap-3">
                                    {isMeDataLoading ? <Skeleton className="w-[100px] h-[40px]" /> : <PointsMenuButton
                                        points={Number(points) || 0}
                                    />}
                                    {avatarSrc ? <ProfileDropdown avatarSrc={avatarSrc} /> : null}
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    <SheetClose asChild>
                                        <div>
                                            <AuthButton href="/login" variant="login" className="w-full justify-center">
                                                Log In
                                            </AuthButton>
                                        </div>
                                    </SheetClose>

                                    <SheetClose asChild>
                                        <div>
                                            <AuthButton href="/register" variant="signup" className="w-full justify-center">
                                                Sign Up
                                            </AuthButton>
                                        </div>
                                    </SheetClose>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-5 pb-5 pt-4 border-t border-white/10">
                        <p className="text-xs text-white/45">
                            © {new Date().getFullYear()} Model Boss
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
