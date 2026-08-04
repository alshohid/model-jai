"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils/cn";
import DashboardIcon from "../../dashboardIcons/DashboardIcon";
import UserManagementMenuIcon from "../../dashboardIcons/UserManagementMenuIcon";
import MatchManagementMenuIcon from "../../dashboardIcons/MatchManagementMenuIcon";
import { LogOutIcon, WalletIcon, ChevronDown, CatIcon, Gamepad, GalleryVerticalIcon, NewspaperIcon, User, Key, TrophyIcon, FileText, ScrollText } from "lucide-react";
import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import { useLogoutUserMutation } from "@/redux/features/auth/authapi";
import { adminLogOut } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/store";

const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },

    {
        label: "Game",
        icon: MatchManagementMenuIcon,
        children: [
            { label: "Category", href: "/admin/dashboard/game-category", icon: <CatIcon /> },
            { label: "Game List", href: "/admin/dashboard/games", icon: <Gamepad /> },
        ],
    },

    { label: "Match Management", href: "/admin/dashboard/matches", icon: MatchManagementMenuIcon },
    { label: "User Management", href: "/admin/dashboard/users", icon: UserManagementMenuIcon },
    { label: "Challenge Management", href: "/admin/dashboard/challenge", icon: TrophyIcon },
    { label: "Withdraw Management", href: "/admin/dashboard/withdrawals", icon: WalletIcon },
    { label: "Match Voting Management", href: "/admin/dashboard/popular-artist", icon: User },

    {
        label: "Settings",
        icon: MatchManagementMenuIcon,
        children: [
            { label: "Gallery", href: "/admin/dashboard/gallery", icon: <GalleryVerticalIcon /> },
            { label: "News", href: "/admin/dashboard/news", icon: <NewspaperIcon /> },
            { label: "Promotional settings", href: "/admin/dashboard/promotional-settings", icon: <NewspaperIcon /> },
            { label: "All Transactions", href: "/admin/dashboard/all-transactions", icon: <WalletIcon /> },
            { label: "Account Settings", href: "/admin/dashboard/profile", icon: <User /> },
            { label: "Privacy Policy", href: "/admin/dashboard/privacy-policy", icon: <FileText /> },
            { label: "Terms & Conditions", href: "/admin/dashboard/terms-and-conditions", icon: <ScrollText /> },
        ],
    },
];

export default function AdminSidebar({
    sidebarOpen,
    closeSidebar,
}: {
    sidebarOpen: boolean;
    closeSidebar: () => void;
}) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const [logoutAdmin, { isLoading: isLogoutLoading }] = useLogoutUserMutation();

    const isPathActive = useCallback((href?: string) => {
        if (!href) return false;
        if (href === "/admin/dashboard") {
            return pathname === href;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    }, [pathname]);

    useEffect(() => {
        const activeMenu = menuItems.find((item) =>
            item.children?.some((child) => isPathActive(child.href))
        );

        setOpenMenu(activeMenu?.label ?? null);
    }, [isPathActive]);

    useEffect(() => {
        if (!sidebarOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeSidebar();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [closeSidebar, sidebarOpen]);

    const handleMobileNavigation = () => {
        if (window.innerWidth < 1024) {
            closeSidebar();
        }
    };

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside
                id="admin-sidebar"
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-dvh max-h-dvh flex-col overflow-hidden",
                    "w-[min(86vw,300px)] sm:w-[300px] xl:w-[350px]",
                    "lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "transition-transform duration-300 ease-in-out",
                    "border-r border-white/10",
                    "bg-gradient-to-b from-[#2B2B2C] to-[#171717]",
                    "shadow-[10px_0_50px_rgba(0,0,0,0.55)]",
                )}
            >
                <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-5 md:px-6 md:py-6">

                    {/* header */}
                    <div className="flex shrink-0 items-center justify-between">
                        <div>
                            <BrandMark width={130} height={90} />
                            <div className="mt-2 h-[2px] w-full bg-gradient-to-r from-[#FF2EC8]/70 to-transparent" />
                        </div>

                        <button
                            type="button"
                            onClick={closeSidebar}
                            className="lg:hidden inline-flex items-center justify-center size-10 rounded-xl bg-white/5 border border-white/10 text-white/80"
                            aria-label="Close sidebar"
                        >
                            <MdClose size={22} />
                        </button>
                    </div>

                    {/* menu */}
                    <nav
                        data-lenis-prevent
                        data-lenis-prevent-wheel
                        className={cn(
                            "mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y",
                            "[-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable]",
                            "pr-2 [scrollbar-width:thin] [scrollbar-color:#FF2EC8_rgba(255,255,255,0.08)]",
                            "[&::-webkit-scrollbar]:w-1.5",
                            "[&::-webkit-scrollbar-track]:my-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/10",
                            "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#FF2EC8]",
                            "[&::-webkit-scrollbar-thumb]:hover:bg-[#ff4fd4]",
                        )}
                    >
                        <div className="space-y-2 pb-4 pr-2">

                            {menuItems.map((item) => {

                                const isActive = isPathActive(item.href);

                                // submenu
                                if (item.children) {

                                    const isOpen = openMenu === item.label;

                                    const parentActive = item.children.some((child) =>
                                        isPathActive(child.href)
                                    );

                                    return (
                                        <div key={item.label}>

                                            {/* Parent */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenMenu(isOpen ? null : item.label)
                                                }
                                                className={cn(
                                                    "w-full flex items-center justify-between",
                                                    "px-4 py-3 rounded-[14px] border border-white/10",
                                                    "transition",
                                                    parentActive
                                                        ? "bg-[#7A2D66]/70 border-[#FF2EC8]/30"
                                                        : "bg-white/[0.03] hover:bg-white/[0.06]"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="inline-flex items-center justify-center size-9 rounded-[12px] bg-white/5 border border-white/10">
                                                        <item.icon />
                                                    </span>

                                                    <span className="text-[14px] font-medium text-white/75">
                                                        {item.label}
                                                    </span>
                                                </div>

                                                <ChevronDown
                                                    size={18}
                                                    className={cn(
                                                        "text-white/60 transition-transform duration-300",
                                                        isOpen && "rotate-180"
                                                    )}
                                                />
                                            </button>

                                            {/* Submenu */}
                                            <div
                                                className={cn(
                                                    "overflow-hidden transition-all duration-300",
                                                    isOpen ? "max-h-[560px] mt-2" : "max-h-0"
                                                )}
                                            >
                                                <div className="ml-8 space-y-2">
                                                    {item.children.map((child) => {

                                                        const active = isPathActive(child.href);

                                                        return (
                                                            <Link
                                                                key={child.href}
                                                                href={child.href}
                                                                onClick={handleMobileNavigation}
                                                                className={cn(
                                                                    "group flex items-center gap-3",
                                                                    "px-3 py-2.5 rounded-[10px]",
                                                                    "border border-white/10",
                                                                    "transition-all duration-200",
                                                                    active
                                                                        ? "bg-[#FF2EC8]/10 text-[#FF2EC8] border-[#FF2EC8]/30"
                                                                        : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                                                                )}
                                                            >
                                                                {/* icon */}
                                                                <span
                                                                    className={cn(
                                                                        "flex items-center justify-center",
                                                                        "size-7 rounded-md",
                                                                        "border border-white/10",
                                                                        active
                                                                            ? "bg-[#FF2EC8]/20 text-[#FF2EC8]"
                                                                            : "bg-white/[0.03] group-hover:bg-white/[0.08]"
                                                                    )}
                                                                >
                                                                    {child.icon}
                                                                </span>

                                                                {/* label */}
                                                                <span className="text-[13px] font-medium">
                                                                    {child.label}
                                                                </span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href!}
                                        onClick={handleMobileNavigation}
                                        className={cn(
                                            "group flex items-center gap-3",
                                            "px-4 py-3 rounded-[14px]",
                                            "border border-white/10 transition",
                                            isActive
                                                ? "bg-[#7A2D66]/70 border-[#FF2EC8]/30 shadow-[0_12px_30px_rgba(255,46,200,0.18)]"
                                                : "bg-white/[0.03] hover:bg-white/[0.06]"
                                        )}
                                    >
                                        <span className="inline-flex items-center justify-center size-9 rounded-[12px] bg-white/5 border border-white/10">
                                            <item.icon />
                                        </span>

                                        <span className="text-[14px] font-medium text-white/75">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}

                        </div>
                    </nav>

                    {/* logout */}
                    <div className="mt-4 shrink-0 border-t border-white/10 pt-4">
                        <div className="w-full flex justify-end px-3 py-2">
                            <div className={cn(
                                "flex items-center gap-1.5 rounded-[12px] border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5 transition",
                                isLogoutLoading && "opacity-50 cursor-not-allowed"
                            )}>
                                <button
                                    disabled={isLogoutLoading}
                                    onClick={async () => {
                                        try {
                                            await logoutAdmin();

                                        } catch {
                                        } finally {
                                            dispatch(adminLogOut())
                                            router.replace("/admin");
                                        }
                                    }}
                                    className="px-2 py-1 text-sm text-white/75"
                                >
                                    {isLogoutLoading ? "Logging out..." : "Logout"}
                                </button>

                                <LogOutIcon size={18} />
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-white/40 text-xs">
                                &copy; {new Date().getFullYear()} Model Boss Admin
                            </p>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
}
