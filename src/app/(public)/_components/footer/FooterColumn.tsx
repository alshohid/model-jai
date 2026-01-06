"use client";

import { cn } from "@/shared/lib/utils/cn";

type Props = {
    title?: string;
    children: React.ReactNode;
    className?: string;
};

export default function FooterColumn({ title, children, className }: Props) {
    return (
        <div className={cn("w-full", className)}>
            {title ? <h4 className="text-white text-lg font-semibold">{title}</h4> : null}
            <div className={cn(title ? "mt-4" : "", "flex flex-col gap-2")}>{children}</div>
        </div>
    );
}
