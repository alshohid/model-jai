"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import AuthButton from "@/shared/UI/button/AuthButton";
import PointsButton from "@/shared/UI/button/PointsButton";
import { useAuth } from "@/shared/providers/auth/useAuth";
import { cn } from "@/shared/lib/utils/cn";
import ProfileDropdown from "@/shared/components/dropdown/ProfileDropdown";
import MobileNavSheet from "./MobileNavDrawer";
import NavbarSearch, { NavbarSearchProvider } from "./NavbarSearch";
import { Bell } from "lucide-react";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Live Stream Match", href: "/live-stream" },
    { label: "Store", href: "/point-store" },
];

export default function PublicNavbar() {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();

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
                        "flex items-center h-14 sm:h-16 md:h-[80px] ",
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

                    <div className={cn(
                        "flex items-center md:container justify-between gap-1 sm:gap-2 md:gap-4",
                        "w-full max-w-[100vw] px-1.5 sm:px-3 md:px-4 min-w-0"
                    )}>
                            <NavbarSearchProvider>
                        {/* Logo: smaller on mobile, full size on desktop */}
                        <div className="shrink-0 flex items-center w-[78px] sm:w-[90px] md:w-auto md:min-w-0">
                            <div className="block md:hidden w-full">
                                <BrandMark width={78} height={54} />
                            </div>
                            <div className="hidden md:block">
                                <BrandMark width={130} height={90} />
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-1 lg:gap-2 shrink-0">
                            {navItems.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "cursor-pointer rounded-md px-2 py-1.5 lg:px-3 transition text-sm lg:text-[1rem] xl:text-[1.125rem] whitespace-nowrap",
                                            active ? "bg-navActive text-white" : "text-[#070707]"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {isAuthenticated && (
                            <NavbarSearch />
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
                                <Link
                                    href="/notifications"
                                    className={cn(
                                        "relative inline-flex items-center justify-center shrink-0",
                                        "size-7 sm:size-8 md:size-10 rounded-lg",
                                        "bg-[#FF2EC8]/20 border-[#FF2EC8]/30",
                                        "text-white transition-all",
                                        pathname === "/notifications" && "bg-[#FF2EC8]/20 border-[#FF2EC8]/30"
                                    )}
                                >
                                    <Bell className="size-3.5 sm:size-4 md:size-5" />
                                    <span className="absolute -top-0.5 -right-0.5 size-2.5 sm:size-3 bg-[#FF2EC8] rounded-full border-2 border-[#FFEAFA]" />
                                </Link>
                                <PointsButton
                                    points={35000}
                                    icon={"/images/home/point_icon.png"}
                                    onClick={() => console.log("open buy points")}
                                    size="compact"
                                    className="md:hidden"
                                />
                                <PointsButton
                                    points={35000}
                                    icon={"/images/home/point_icon.png"}
                                    onClick={() => console.log("open buy points")}
                                    className="hidden md:inline-flex"
                                />
                                <ProfileDropdown
                                    avatarSrc="/images/home/profile_img.png"
                                    className="[&_img]:size-8 [&_img]:min-w-8 [&_img]:min-h-8 sm:[&_img]:size-9 md:[&_img]:size-10 md:[&_img]:min-w-10 md:[&_img]:min-h-10"
                                />

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
                        <div className="shrink-0 md:hidden">
                            <MobileNavSheet
                                navItems={navItems}
                                points={35000}
                                avatarSrc="/images/home/profile_img.png"
                                tone={isAuthenticated ? "light" : "dark"}
                            />
                        </div>
                            </NavbarSearchProvider>
                    </div>
                </div>
            </div>
        </>
    );
}

