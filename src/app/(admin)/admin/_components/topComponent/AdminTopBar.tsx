"use client";

import { usePathname, useRouter } from "next/navigation";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { cn } from "@/shared/lib/utils/cn";
import NotificationButton from "../reusable/NotificationButton";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import { useNotifications } from "@/shared/providers/hook/useNotificaton";
import { ChevronDown, LoaderPinwheel, Settings, User } from "lucide-react";
import Image from "next/image";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import AppDropdownMenu, { type AppDropdownItem } from "@/shared/components/dropdown/AppDropdownMenu";

function titleFromPath(pathname: string) {
    if (pathname.startsWith("/admin/dashboard/matches")) return "Match Management";
    if (pathname.startsWith("/admin/dashboard/users")) return "User Management";
    if (pathname.startsWith("/admin/dashboard/withdrawals")) return "Withdraw Management";
    return "Dashboard";
}

export default function AdminTopBar({
    sidebarOpen,
    toggleSidebar,
}: {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}) {
    const router = useRouter()
    const { unreadCount } = useNotifications()
    const pathname = usePathname();
    const title = titleFromPath(pathname);
    const { data, isLoading } = useGetMeDataQuery()
    const avatarSrc = getSafeImageSrc(data?.data?.user?.image, "");
    const profileMenuItems: AppDropdownItem[] = [
        { type: "label", label: "Admin Menu" },
        {
            label: "Settings",
            href: "/admin/dashboard/profile",
            icon: <Settings className="h-4 w-4" />,
        },
    ];

    if (isLoading) {
        return <div>
            <LoaderPinwheel />
        </div>
    }
    return (
        <header
            className={cn(
                "sticky top-0 z-30",
                "bg-[#2A2A2A]/80 backdrop-blur-xl",
                "border-b border-white/10"
            )}
        >
            <div className="px-4 md:px-6 lg:px-7 h-[68px] flex items-center justify-between gap-4">
                {/* left */}
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className={cn(
                            "lg:hidden inline-flex items-center justify-center",
                            "size-10 rounded-xl",
                            "bg-white/5 border border-white/10",
                            "text-white/85"
                        )}
                        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                        aria-controls="admin-sidebar"
                        aria-expanded={sidebarOpen}
                    >
                        <HiOutlineMenuAlt1 size={22} />
                    </button>

                    <h1 className="text-white text-[18px] md:text-[20px] font-semibold truncate">
                        {title}
                    </h1>
                </div>


                <div className="flex items-center gap-3">

                    <NotificationButton
                        onClick={() => router.push("/admin/dashboard/notification")}
                        unreadCount={unreadCount || 0}
                    />


                    <AppDropdownMenu
                        align="end"
                        sideOffset={12}
                        items={profileMenuItems}
                        contentClassName="min-w-[190px]"
                        trigger={
                            <button
                                type="button"
                                className={cn(
                                    "flex items-center gap-3 rounded-[16px] border border-white/10 px-2 py-1.5",
                                    "bg-white/[0.03] transition hover:bg-white/[0.06]",
                                    "focus:outline-none focus:ring-2 focus:ring-white/15"
                                )}
                                aria-label="Open admin profile menu"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-white text-sm font-medium leading-none">{data?.data?.user?.name}</p>
                                    <p className="text-white/45 text-xs mt-1">Agency Manager</p>
                                </div>
                                <div className="flex items-center justify-center size-10 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] shadow-[0_8px_20px_rgba(0,0,0,0.18)] overflow-hidden">
                                    {avatarSrc ? (
                                        <Image
                                            src={avatarSrc}
                                            alt="profile"
                                            width={40}
                                            height={40}
                                            className="rounded-full size-10 object-cover"
                                        />
                                    ) : (
                                        <User size={18} className="text-white/70" />
                                    )}
                                </div>
                                <ChevronDown size={16} className="hidden sm:block text-white/55" />
                            </button>
                        }
                    />
                </div>
            </div>
        </header>
    );
}
