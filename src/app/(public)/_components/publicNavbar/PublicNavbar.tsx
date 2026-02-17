
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import AuthButton from "@/shared/UI/button/AuthButton";
import PointsButton from "@/shared/UI/button/PointsButton";

import { cn } from "@/shared/lib/utils/cn";
import ProfileDropdown from "@/shared/components/dropdown/ProfileDropdown";
import MobileNavSheet from "./MobileNavDrawer";
import NavbarSearch, { NavbarSearchProvider } from "./NavbarSearch";
import { Bell } from "lucide-react";
import { useAuth } from "@/redux/features/auth/hooks";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Live Stream Match", href: "/live-stream" },
    { label: "Store", href: "/point-store" },
];

export default function PublicNavbar() {
    const { isAuthenticated,token, role } = useAuth();
    console.log("use auth == ", {isAuthenticated, token,role} );
    const pathname = usePathname();
    const menuBtnRef = useRef<HTMLButtonElement | null>(null);

    const wrapperClass = (isAuthenticated )
        ? " w-full border-none"
        : "fixed top-[20px] z-[60] w-full";

    const navbarBg = (isAuthenticated)
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
                >  <NavbarSearchProvider> 
                    <div className={cn("flex items-center justify-between", "container")}>
                        <BrandMark />

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
                            <div className="hidden md:block">
                                <NavbarSearch />
                            </div>

                            {isAuthenticated ? (
                                <div className="flex  items-center">
                                    <div className="mr-2">
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
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <PointsButton
                                            points={35000}
                                            icon={"/images/home/point_icon.png" as any}
                                            onClick={() => console.log("open buy points")}
                                            size="compact"
                                            className=" block md:hidden"
                                            
                                        />
                                        <PointsButton
                                            points={35000}
                                            icon={"/images/home/point_icon.png" as any}
                                            onClick={() => console.log("open buy points")}
                                            size="default"
                                            className=" hidden md:block"

                                        />
                                        <ProfileDropdown avatarSrc="/images/home/profile_img.png" />
                                    </div>
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
                    </NavbarSearchProvider>
                </div>
            </div>
        </>
    );
}

