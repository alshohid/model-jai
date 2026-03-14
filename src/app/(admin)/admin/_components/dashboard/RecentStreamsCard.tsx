"use client";

import { cn } from "@/shared/lib/utils/cn";

export type RecentStreamItem = {
    id: number;
    title: string;
    subtitle: string;
    amount: string;
    timeAgo: string;
};

type Props = {
    title?: string;
    items: RecentStreamItem[];
    className?: string;
    isLoading?: boolean;
    maxHeightClassName?: string;
};

export default function RecentStreamsCard({
    title = "Recent Streams",
    items,
    className,
    isLoading,
    maxHeightClassName = "max-h-[520px] md:max-h-[600px]",
}: Props) {
    return (
        <section
            className={cn(
                "w-full rounded-[18px] sm:rounded-[20px]",
                "border border-white/10 bg-white/5 backdrop-blur-xl",
                "p-4 sm:p-5",
                "shadow-[0_22px_70px_rgba(0,0,0,0.40)]",
                className
            )}
        >
            <h3 className="text-white font-semibold text-[18px] sm:text-[20px]">
                {title}
            </h3>

            <div
                className={cn(
                    "mt-4 flex flex-col gap-4 overflow-y-auto pr-1",
                    maxHeightClassName
                )}
            >
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <RecentStreamRowSkeleton key={index} />
                    ))
                ) : items?.length > 0 ? (
                    items.map((it) => <RecentStreamRow key={it.id} item={it} />)
                ) : (
                    <div className="flex items-center justify-center text-white/60 py-10">
                        No recent streams
                    </div>
                )}
            </div>
        </section>
    );
}

function RecentStreamRow({ item }: { item: RecentStreamItem }) {
    return (
        <div
            className={cn(
                "w-full rounded-[16px] sm:rounded-[18px]",
                "border border-white/12 bg-[#FFFFFF14]",
                "px-4 py-3 sm:px-5 sm:py-4",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-white font-semibold text-[16px] sm:text-[18px] leading-tight truncate">
                        #{item.title}
                    </p>
                    <p className="mt-1 text-white/70 text-[13px] sm:text-[14px] truncate">
                        {item.subtitle}
                    </p>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-white font-semibold text-[16px] sm:text-[18px] leading-tight">
                        {item.amount}
                    </p>
                    <p className="mt-1 text-white/60 text-[13px] sm:text-[14px]">
                        {item.timeAgo}
                    </p>
                </div>
            </div>
        </div>
    );
}

function RecentStreamRowSkeleton() {
    return (
        <div
            className={cn(
                "w-full rounded-[16px] sm:rounded-[18px]",
                "border border-white/12 bg-[#FFFFFF14]",
                "px-4 py-3 sm:px-5 sm:py-4",
                "animate-pulse",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="h-5 w-32 rounded-md bg-white/10" />
                    <div className="mt-2 h-4 w-20 rounded-md bg-white/10" />
                </div>

                <div className="text-right shrink-0">
                    <div className="h-5 w-24 rounded-md bg-white/10 ml-auto" />
                    <div className="mt-2 h-4 w-16 rounded-md bg-white/10 ml-auto" />
                </div>
            </div>
        </div>
    );
}