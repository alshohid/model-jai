"use client";

import { usePathname } from "next/navigation";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { cn } from "@/shared/lib/utils/cn";
import NotificationButton from "../reusable/NotificationButton";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";

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
    const pathname = usePathname();
    const title = titleFromPath(pathname);
    const { data, isLoading } = useGetMeDataQuery()
    console.log(data, "data");

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
                        aria-label="Open sidebar"
                    >
                        {!sidebarOpen && <HiOutlineMenuAlt1 size={22} />}
                    </button>

                    <h1 className="text-white text-[18px] md:text-[20px] font-semibold truncate">
                        {title}
                    </h1>
                </div>


                <div className="flex items-center gap-3">
                    <NotificationButton
                        onClick={() => console.log("clicked notification button ")}
                        hasUnread
                        unreadCount={3}
                    />

                    {/* profile block (placeholder styling like screenshot) */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-white text-sm font-medium leading-none">{data?.data?.user?.name}</p>
                            <p className="text-white/45 text-xs mt-1">Agency Manager</p>
                        </div>

                        <button
                            type="button"
                            className={cn(
                                "size-10 rounded-full",
                                "bg-white/10 border border-white/10",
                                "text-white/80"
                            )}
                            aria-label="Profile"
                            onClick={() => console.log("profile menu")}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
