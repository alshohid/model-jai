"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { cn } from "@/shared/lib/utils/cn";
import NotificationButton from "../reusable/NotificationButton";
import { useGetMeDataQuery, useLogoutUserMutation } from "@/redux/features/auth/authapi";
import { useNotifications } from "@/shared/providers/hook/useNotificaton";
import { ArrowDownLeft, ChevronDown, Key, LoaderPinwheel, LogOutIcon, Settings, TrendingUp, User } from "lucide-react";
import Image from "next/image";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import AppDropdownMenu, { type AppDropdownItem } from "@/shared/components/dropdown/AppDropdownMenu";
import { useGetAdminTransactionQuery } from "@/redux/features/support/supportManagement";
import { adminLogOut } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/store";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
});

function formatCurrency(value?: string | number | null) {
    const numericValue = Number(value ?? 0);
    return currencyFormatter.format(Number.isFinite(numericValue) ? numericValue : 0);
}

function TransactionHeaderStat({
    label,
    value,
    icon,
    tone,
    isLoading,
}: {
    label: string;
    value: string;
    icon: ReactNode;
    tone: "pink" | "cyan";
    isLoading?: boolean;
}) {
    const toneClasses =
        tone === "pink"
            ? {
                shell: "border-[#FF78DB]/18 bg-[linear-gradient(135deg,rgba(255,46,200,0.12),rgba(255,255,255,0.03))]",
                badge: "text-[#FFB3EE]",
                icon: "text-[#FF8AE1]",
                glow: "shadow-[0_10px_28px_rgba(255,46,200,0.12)]",
            }
            : {
                shell: "border-[#6FEFFF]/18 bg-[linear-gradient(135deg,rgba(53,216,255,0.11),rgba(255,255,255,0.03))]",
                badge: "text-[#AEFAFF]",
                icon: "text-[#7DF2FF]",
                glow: "shadow-[0_10px_28px_rgba(53,216,255,0.12)]",
            };
    const router = useRouter()

    return (
        <div
            onClick={() => {
                router.push("/admin/dashboard/all-transactions")
            }}
            className={cn(
                "min-w-[148px] rounded-full border px-3 py-2.5 backdrop-blur-xl cursor-pointer",
                "transition-colors duration-200 hover:bg-white/[0.05]",
                toneClasses.shell,
                toneClasses.glow
            )}
        >
            <div className="flex items-center gap-2.5">
                <div className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20",
                    toneClasses.icon
                )}>
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className={cn(
                        "text-[10px] font-semibold uppercase tracking-[0.2em]",
                        toneClasses.badge
                    )}>
                        {label}
                    </p>
                    {isLoading ? (
                        <div className="mt-1.5 h-5 w-20 animate-pulse rounded-full bg-white/10" />
                    ) : (
                        <p className="mt-1 truncate text-sm font-semibold text-white sm:text-[15px]">
                            {value}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function titleFromPath(pathname: string) {
    if (pathname.startsWith("/admin/dashboard/matches")) return "Match Management";
    if (pathname.startsWith("/admin/dashboard/users")) return "User Management";
    if (pathname.startsWith("/admin/dashboard/withdrawals")) return "Withdraw Management";
    if (pathname.startsWith("/admin/dashboard/all-transactions")) return "All Transactions";
    return "Dashboard";
}

export default function AdminTopBar({
    sidebarOpen,
    toggleSidebar,
}: {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}) {
    const dispatch = useAppDispatch();
    const router = useRouter()
    const { unreadCount } = useNotifications()
    const pathname = usePathname();
    const title = titleFromPath(pathname);
    const { data, isLoading } = useGetMeDataQuery()
    const [logoutAdmin, { isLoading: isLogoutLoading }] = useLogoutUserMutation();
    const avatarSrc = getSafeImageSrc(data?.data?.user?.image, "");
    const {
        totalRecharge,
        totalEarning,
        isTransactionSummaryLoading,
    } = useGetAdminTransactionQuery(
        { page: 1, limit: 1 },
        {
            selectFromResult: ({ data: transactionData, isLoading, isFetching }) => ({
                totalRecharge: formatCurrency(transactionData?.total_recharge),
                totalEarning: formatCurrency(transactionData?.total_earning),
                isTransactionSummaryLoading: isLoading || isFetching,
            }),
        }
    );

    const handleAdminLogout = async () => {
        try {
            await logoutAdmin();
        } catch {
        } finally {
            dispatch(adminLogOut());
            router.replace("/admin");
        }
    };

    const profileMenuItems: AppDropdownItem[] = [
        { type: "label", label: "Admin Menu" },
        {
            label: "Settings",
            href: "/admin/dashboard/profile",
            icon: <Settings className="h-4 w-4" />,
        },
        {
            label: "Credential Settings",
            href: "/admin/dashboard/credential-settings",
            icon: <Key className="h-4 w-4" />,
        },
        { type: "separator" },
        {
            label: "Logout",
            onSelect: handleAdminLogout,
            icon: <LogOutIcon className="h-4 w-4" />,
            className: "text-red-200 focus:text-red-100",
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
            <div className="px-4 py-3 md:px-6 lg:px-7">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
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

                        <div className="min-w-0">
                            <h1 className="truncate text-[18px] font-semibold text-white md:text-[20px]">
                                {title}
                            </h1>
                        </div>
                    </div>

                    <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 px-4 lg:flex">
                        <TransactionHeaderStat
                            label="Recharge"
                            value={totalRecharge}
                            icon={<ArrowDownLeft size={16} />}
                            tone="pink"
                            isLoading={isTransactionSummaryLoading}
                        />
                        <TransactionHeaderStat
                            label="Earning"
                            value={totalEarning}
                            icon={<TrendingUp size={16} />}
                            tone="cyan"
                            isLoading={isTransactionSummaryLoading}
                        />
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
                            isLogoutLoading={isLogoutLoading}
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
                <div className="mt-3 flex flex-wrap gap-2 lg:hidden">
                    <TransactionHeaderStat
                        label="Recharge"
                        value={totalRecharge}
                        icon={<ArrowDownLeft size={18} />}
                        tone="pink"
                        isLoading={isTransactionSummaryLoading}
                    />
                    <TransactionHeaderStat
                        label="Earning"
                        value={totalEarning}
                        icon={<TrendingUp size={18} />}
                        tone="cyan"
                        isLoading={isTransactionSummaryLoading}
                    />
                </div>
            </div>
        </header>
    );
}
