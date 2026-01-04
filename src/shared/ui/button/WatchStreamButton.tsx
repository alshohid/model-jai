import Link from "next/link";
import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";

type Props = {
    href: string;
    label?: string;
    className?: string;
    icon?: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export default function WatchStreamButton({
    href,
    label = "Watch stream",
    icon,
    className,
    ...props
}: Props) {
    return (
        <Link
            href={href}
            {...props}
            className={cn(
                "cursor-pointer inline-flex items-center justify-center gap-3",
                "w-full h-[48px] rounded-[12px]",
                "bg-white/5 border border-white/12",
                "text-white/80 hover:text-white transition",
                "shadow-[inset_0_0_0_2px_rgba(209,91,156,0.25),0_0_0_1px_rgba(255,255,255,0.06)]",

                className
            )}
        >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                {icon ?? "▶"}
            </span>
            <span className="text-sm">{label}</span>
        </Link>
    );
}
