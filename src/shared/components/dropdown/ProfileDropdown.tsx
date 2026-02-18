"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AppDropdownMenu, { AppDropdownItem } from "./AppDropdownMenu";

import { cn } from "@/shared/lib/utils/cn";
import { useAuth } from "@/redux/features/auth/hooks";
import { useLogoutUserMutation } from "@/redux/features/auth/authapi";
import { toast } from "sonner";

export default function ProfileDropdown({
    avatarSrc,
    className,
}: {
    avatarSrc: string;
    className?: string;
}) {
    const router = useRouter();
    const { logOut } = useAuth();
    const [logoutUser, { isLoading: isLogoutLoading }] = useLogoutUserMutation();

    const items: AppDropdownItem[] = [
        { type: "label", label: "My Account" },

        { label: "Profile", href: "/user-profile" },
        { label: "Point Store", href: "/point-store" },
        { label: "Support History", href: "/support-history" },

        { type: "separator" },
        {
            label: "Log out",
            onSelect: async () => {
                try {
                    await logoutUser();
                    logOut();
                    router.replace("/");
                } catch (error) {
                    toast.error("Logout failed");
                }
            },
            className: "text-red-200 focus:text-red-100",
        },
    ];

    return (
        <AppDropdownMenu
            items={items}
            align="end"
            trigger={
                <button
                    type="button"
                    disabled={isLogoutLoading}
                    className={cn(
                        "cursor-pointer  inline-flex items-center justify-center",
                        "rounded-full",
                        "focus:outline-none focus:ring-2 p-2 focus:ring-white/20",
                        className
                    )}
                    aria-label="Open profile menu"
                >
                    <Image
                        src={avatarSrc}
                        alt="profile icon"
                        width={40}
                        height={40}
                        className="size-10 rounded-full min-w-[40px] min-h-[40px]  ring-2 ring-gray-50 outline -outline-offset-1 outline-white/10"
                    />
                </button>
            }
        />
    );
}
