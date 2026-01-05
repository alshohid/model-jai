import Link from "next/link";
import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";

type Variant = "login" | "signup";

type Props = {
    href: string;
    children: React.ReactNode;
    variant: Variant;
    className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export default function AuthButton({
    href,
    children,
    variant,
    className,
    ...props
}: Props) {
    const base = cn(
        "inline-flex items-center justify-center whitespace-nowrap select-none cursor-pointer",
        "h-[48px] px-[24px] py-[12px]",
        "text-[14px] leading-[24px] font-medium text-white",
        "rounded-[8px]",
        "transition-transform transition-shadow duration-150 ease-out"
    );

    const shadowDefault =
        "shadow-[4px_4px_0_0_rgba(0,0,0,1),inset_0_0_0_2px_rgba(0,0,0,1)]";

    const pressed =
        "active:translate-x-[2px] active:translate-y-[2px] " +
        "active:shadow-[2px_2px_0_0_rgba(0,0,0,1),inset_0_0_0_2px_rgba(0,0,0,1)]";

    const styles =
        variant === "login"
            ? "bg-glass hover:bg-white/15"
            : "bg-signup hover:opacity-95";
    return (
        <Link
            href={href}
            {...props}
            className={cn(base, shadowDefault, pressed, styles, className)}
        >
            {children}
        </Link>
    );
}
