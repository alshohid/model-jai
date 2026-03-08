"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import { cn } from "@/shared/lib/utils/cn";
import DashboardIcon from "../../dashboardIcons/DashboardIcon";
import UserManagementMenuIcon from "../../dashboardIcons/UserManagementMenuIcon";
import MatchManagementMenuIcon from "../../dashboardIcons/MatchManagementMenuIcon";
import { LogOutIcon, WalletIcon, ChevronDown, CatIcon, Gamepad, GalleryVerticalIcon, NewspaperIcon } from "lucide-react";
import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import { useLogoutUserMutation } from "@/redux/features/auth/authapi";

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
    { label: "Withdraw Management", href: "/admin/dashboard/withdrawals", icon: WalletIcon },

    {
        label: "Settings",
        icon: MatchManagementMenuIcon,
        children: [
            { label: "Gallery", href: "/admin/dashboard/gallery", icon: <GalleryVerticalIcon /> },
            { label: "News", href: "/admin/dashboard/news", icon: <NewspaperIcon /> },
        ],
    },
];

export default function AdminSidebar({
    sidebarOpen,
    toggleSidebar,
}: {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const [logoutAdmin, { isLoading: isLogoutLoading }] = useLogoutUserMutation();

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen",
                    "w-[300px] xl:w-[350px]",
                    "lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "transition-transform duration-300 ease-in-out",
                    "border-r border-white/10",
                    "bg-gradient-to-b from-[#2B2B2C] to-[#171717]",
                    "shadow-[10px_0_50px_rgba(0,0,0,0.55)]"
                )}
            >
                <div className="h-full flex flex-col px-4 md:px-6 py-6">

                    {/* header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <BrandMark width={130} height={90} />
                            <div className="mt-2 h-[2px] w-full bg-gradient-to-r from-[#FF2EC8]/70 to-transparent" />
                        </div>

                        <button
                            type="button"
                            onClick={toggleSidebar}
                            className="lg:hidden inline-flex items-center justify-center size-10 rounded-xl bg-white/5 border border-white/10 text-white/80"
                        >
                            <MdClose size={22} />
                        </button>
                    </div>

                    {/* menu */}
                    <nav className="mt-6 flex-1">
                        <div className="space-y-2">

                            {menuItems.map((item) => {

                                const isActive = item.href
                                    ? pathname.startsWith(item.href)
                                    : false;

                                // submenu
                                if (item.children) {

                                    const isOpen = openMenu === item.label;

                                    const parentActive = item.children.some((child) =>
                                        pathname.startsWith(child.href)
                                    );

                                    return (
                                        <div key={item.label}>

                                            {/* Parent */}
                                            <button
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
                                                    isOpen ? "max-h-60 mt-2" : "max-h-0"
                                                )}
                                            >
                                                <div className="ml-8 space-y-2">
                                                    {item.children.map((child) => {

                                                        const active = pathname.startsWith(child.href);

                                                        return (
                                                            <Link
                                                                key={child.href}
                                                                href={child.href}
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
                    <div className="w-full flex justify-end px-4 py-2">
                        <div className={cn(
                            "flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 transition rounded-[14px]",
                            isLogoutLoading && "opacity-50 cursor-not-allowed"
                        )}>
                            <button
                                disabled={isLogoutLoading}
                                onClick={async () => {
                                    try {
                                        await logoutAdmin();
                                        router.replace("/admin");
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}
                                className="text-white/75 px-3 py-2"
                            >
                                {isLogoutLoading ? "Logging out..." : "Logout"}
                            </button>

                            <LogOutIcon size={22} />
                        </div>
                    </div>

                    {/* footer */}
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-white/40 text-xs">
                            © {new Date().getFullYear()} Model Boss Admin
                        </p>
                    </div>

                </div>
            </aside>
        </>
    );
}