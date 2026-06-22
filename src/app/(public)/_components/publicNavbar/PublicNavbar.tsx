"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import AuthButton from "@/shared/UI/button/AuthButton";
import { cn } from "@/shared/lib/utils/cn";
import ProfileDropdown from "@/shared/components/dropdown/ProfileDropdown";
import MobileNavSheet from "./MobileNavDrawer";
import PointsMenuButton from "./PointsMenuButton";
import NavbarSearch, { NavbarSearchProvider } from "./NavbarSearch";
import { Bell } from "lucide-react";
import ChallengeDropdownDesktop from "./ChallengeDropdownDesktop";
import { useAuth } from "@/redux/features/auth/hooks";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import Skeleton from "@/shared/UI/Skeleton";
import { useNotifications } from "@/shared/providers/hook/useNotificaton";


const navItems = [
    { label: "Home", href: "/" },
    { label: "Live Stream Match", href: "/live-stream" },
    { label: "Store", href: "/point-store" },

];

export default function PublicNavbar() {
    const pathname = usePathname();
    const { unreadCount } = useNotifications();
    const { isAuthenticated, role } = useAuth();

    const { data: meData, isLoading: isMeDataLoading, isFetching: isMeDataFetching } = useGetMeDataQuery()


    const userProfileData = meData?.data;
    const wrapperClass = (isAuthenticated && (role === "user" || role === "artist"))
        ? " w-full border-none"
        : "fixed top-[20px] z-[60] w-full";

    const navbarBg = (isAuthenticated && (role === "user" || role === "artist"))
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

                                {isAuthenticated && (role === "user" || role === "artist") && (
                                    <ChallengeDropdownDesktop
                                        pathname={pathname}
                                        isChallenger={userProfileData?.user?.is_challenger}
                                    />
                                )}
                            </nav>


                            {isAuthenticated && (role === "user" || role === "artist") ? (
                                <div className="flex items-center gap-2 md:gap-4">
                                    <div className="hidden md:block">
                                        <NavbarSearch />
                                    </div>
                                    <div className="mr-2">
                                        <Link
                                            href="/notifications"
                                            className={cn(
                                                "relative inline-flex items-center justify-center shrink-0",
                                                "size-7 sm:size-8 md:size-10 rounded-lg",
                                                "bg-[#FF2EC8]/20 border border-[#FF2EC8]/30",
                                                "text-white transition-all hover:bg-[#FF2EC8]/30",
                                                pathname === "/notifications" && "bg-[#FF2EC8]/30 border-[#FF2EC8]/50"
                                            )}
                                        >
                                            <Bell className="size-3.5 sm:size-4 md:size-5" />

                                            {unreadCount > 0 && (
                                                <span className={cn(
                                                    "absolute -top-1.5 -right-1.5",
                                                    "min-w-[18px] h-[18px] px-1",
                                                    "bg-red-500 text-white",
                                                    "text-[10px] font-bold leading-none",
                                                    "rounded-full border-2 border-[#FFEAFA]",
                                                    "flex items-center justify-center"
                                                )}>
                                                    {unreadCount > 99 ? "99+" : unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {isMeDataLoading || isMeDataFetching ? (
                                            <div className="block md:hidden">
                                                <Skeleton className="h-8 w-20 rounded-md bg-black/10" />
                                            </div>
                                        ) : (
                                            <PointsMenuButton
                                                points={Number(userProfileData?.total_balance || 0)}
                                                size="compact"
                                                className="block md:hidden"
                                            />
                                        )}
                                        {isMeDataFetching || isMeDataLoading ? <div className="hidden md:block">
                                            <Skeleton />
                                        </div> : <PointsMenuButton
                                            points={Number(userProfileData?.total_balance || 0)}
                                            size="default"
                                            className="hidden md:block"
                                        />}

                                        {isMeDataLoading || isMeDataFetching ? <div className="animate-pulse size-10 rounded-full bg-black/10" /> : <ProfileDropdown avatarSrc={getSafeImageSrc(userProfileData?.user?.image) ?? "/images/home/profile_img.png"} />}
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
                                isMeDataLoading={isMeDataFetching || isMeDataLoading}
                                points={Number(userProfileData?.total_balance) ?? 0}
                                avatarSrc={getSafeImageSrc(userProfileData?.user?.image) ?? "/images/home/profile_img.png"}
                                tone={isAuthenticated ? "light" : "dark"}
                                isChallenger={userProfileData?.user?.is_challenger}
                            />
                        </div>
                    </NavbarSearchProvider>
                </div>
            </div>
        </>
    );
}