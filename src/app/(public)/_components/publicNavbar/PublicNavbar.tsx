"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import AuthButton from "@/shared/UI/button/AuthButton";
import PointsButton from "@/shared/UI/button/PointsButton";
import { useAuth } from "@/shared/providers/auth/useAuth";
import { cn } from "@/shared/lib/utils/cn";
import ProfileDropdown from "@/shared/components/dropdown/ProfileDropdown";
import MobileNavSheet from "./MobileNavDrawer";
import { Bell } from "lucide-react";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Live Stream Match", href: "/live-stream" },
    { label: "Store", href: "/point-store" },
];

export default function PublicNavbar() {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const menuBtnRef = useRef<HTMLButtonElement | null>(null);

    const wrapperClass = isAuthenticated
        ? " w-full border-none"
        : "fixed top-[20px] z-[60] w-full";

    const navbarBg = isAuthenticated
        ? "bg-[#FFEAFA] "
        : "bg-glass backdrop-blur-md navbar-border-ring ";

    return (
        <>
            <div className={wrapperClass}>
                <div
                    className={cn(
                        "flex items-center h-[80px] ",
                        navbarBg
                    )}
                >
                    {/* <Image
                        src="/images/home/navfootbaloverlay.png"
                        alt="overlay"
                        fill
                        priority
                        className="h-5 w-5 opacity-100 pointer-events-none select-none"
                        sizes="100vw"
                    /> */}

                    <div className={cn("flex items-center justify-between", "container")}>
                            <BrandMark  />
                        
                        <nav className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "cursor-pointer rounded-md px-3 py-1.5 transition text-[1rem] md:text-[1.125rem]",
                                            active ? "bg-navActive text-white" : "text-[#070707]"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/notifications"
                                    className={cn(
                                        "relative inline-flex items-center justify-center",
                                        "size-10 rounded-lg",
                                        "bg-white/10 hover:bg-white/15 border border-white/20",
                                        "text-white transition-all",
                                        pathname === "/notifications" && "bg-[#FF2EC8]/20 border-[#FF2EC8]/30"
                                    )}
                                >
                                    <Bell className="size-5" />
                                    {/* Unread badge */}
                                    <span className="absolute -top-1 -right-1 size-3 bg-[#FF2EC8] rounded-full border-2 border-black" />
                                </Link>
                                <PointsButton
                                    points={35000}
                                    icon={"/images/home/point_icon.png" }
                                    onClick={() => console.log("open buy points")}

                                />
                                <ProfileDropdown avatarSrc="/images/home/profile_img.png" />

                            </div>
                        ) : (
                            <div className="flex items-center gap-2 overflow-visible">
                                <div className="hidden sm:flex items-center gap-2">
                                    <AuthButton href="/login" variant="login">
                                        Log In
                                    </AuthButton>
                                    <AuthButton href="/register" variant="signup">
                                        Sign Up
                                    </AuthButton>
                                </div>
                            </div>
                        )}
                        <MobileNavSheet
                            navItems={navItems}
                            points={35000}
                            avatarSrc="/images/home/profile_img.png"
                            tone={isAuthenticated ? "light" : "dark"}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

