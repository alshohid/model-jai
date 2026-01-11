"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";
import Image from "next/image";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    hasUnread?: boolean;
    unreadCount?: number; // optional
};

export default function NotificationButton({
    className,
    hasUnread,
    unreadCount,
    type = "button",
    ...props
}: Props) {
    const showBadge = typeof unreadCount === "number" ? unreadCount > 0 : !!hasUnread;

    return (
        <button
            type={type}
            className={cn(
                "cursor-pointer relative inline-flex items-center justify-center",
                "size-8 rounded-[12px]",
                "bg-white/10 border border-white/12",
                "text-white/85 hover:bg-white/12 transition",
                "focus-visible:outline-none ",
                className
            )}
            aria-label="Notifications"
            {...props}
        >
            <Image
                src={'/images/home/notify_2.png'}
                alt="notify_image"
                width={200}
                height={200}
                className="w-full"

            
            />
            {showBadge ? (
                <span
                    className={cn(
                        "absolute -top-1 -right-1",
                        "min-w-4 h-4 px-1 rounded-full",
                        "bg-[#FF2EC8] text-white text-[10px] leading-none",
                        "flex items-center justify-center",
                        "border border-black/40"
                    )}
                >
                    {typeof unreadCount === "number" ? Math.min(unreadCount, 99) : ""}
                </span>
            ) : null}
        </button>
    );
}
