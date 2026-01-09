"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AppDropdownMenu, { AppDropdownItem } from "./AppDropdownMenu";
import { useAuth } from "@/shared/providers/auth/useAuth";
import { cn } from "@/shared/lib/utils/cn";

export default function ProfileDropdown({
    avatarSrc,
    className,
}: {
    avatarSrc: string;
    className?: string;
}) {
    const router = useRouter();
    const { logout } = useAuth(); // তোমার useAuth এ logout না থাকলে add করো

    const items: AppDropdownItem[] = [
        { type: "label", label: "My Account" },

        { label: "Profile", href: "/profile" },
        { label: "Point Store", href: "/point-store" },

        { type: "separator" },
        {
            label: "Log out",
            onSelect: () => {
                logout?.();
                router.replace("/");

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
                    className={cn(
                        "cursor-pointer inline-flex items-center justify-center",
                        "rounded-full",
                        "focus:outline-none focus:ring-2 focus:ring-white/20",
                        className
                    )}
                    aria-label="Open profile menu"
                >
                    <Image
                        src={avatarSrc}
                        alt="profile icon"
                        width={40}
                        height={40}
                        className="size-10 rounded-full ring-2 ring-gray-50 outline -outline-offset-1 outline-white/10"
                    />
                </button>
            }
        />
    );
}
