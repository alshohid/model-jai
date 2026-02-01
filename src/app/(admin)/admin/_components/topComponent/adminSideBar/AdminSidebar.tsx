"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdClose } from "react-icons/md";
import { cn } from "@/shared/lib/utils/cn";
import DashboardIcon from "../../dashboardIcons/DashboardIcon";
import UserManagementMenuIcon from "../../dashboardIcons/UserManagementMenuIcon";
import MatchManagementMenuIcon from "../../dashboardIcons/MatchManagementMenuIcon";
import { WalletIcon } from "lucide-react";
import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";

const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },
    { label: "Match Management", href: "/admin/dashboard/matches", icon: MatchManagementMenuIcon },
    { label: "User Management", href: "/admin/dashboard/users", icon: UserManagementMenuIcon },
    { label: "Withdraw Management", href: "/admin/dashboard/withdrawals", icon: WalletIcon },
];

export default function AdminSidebar({
    sidebarOpen,
    toggleSidebar,
}: {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}) {
    const pathname = usePathname();

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
                            aria-label="Close sidebar"
                        >
                            <MdClose size={22} />
                        </button>
                    </div>

                    {/* menu */}
                    <nav className="mt-6 flex-1">
                        {/* <p className="text-white/40 text-sm font-semibold mb-3">Menu</p> */}

                        <div className="space-y-2">
                            {menuItems.map((item) => {
                                const isActive =
                                    item.href === "/admin/dashboard"
                                        ? pathname === "/admin/dashboard"
                                        : pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center gap-3",
                                            "px-4 py-3 rounded-[14px]",
                                            "border border-white/10",
                                            "transition",
                                            isActive
                                                ? "bg-[#7A2D66]/70 border-[#FF2EC8]/30 shadow-[0_12px_30px_rgba(255,46,200,0.18)]"
                                                : "bg-white/[0.03] hover:bg-white/[0.06]"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "inline-flex items-center justify-center size-9 rounded-[12px]",
                                                isActive ? "bg-white/10" : "bg-white/5 group-hover:bg-white/8",
                                                "border border-white/10"
                                            )}
                                        >
                                            <item.icon />
                                        </span>

                                        <span className={cn("text-[14px] font-medium", isActive ? "text-white" : "text-white/75")}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* footer area */}
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-white/40 text-xs">© {new Date().getFullYear()} Model Boss Admin</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
