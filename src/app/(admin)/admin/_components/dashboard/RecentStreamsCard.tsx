"use client";


import { cn } from "@/shared/lib/utils/cn";

export type RecentStreamItem = {
    id: string;
    title: string;     // "Match Name"
    subtitle: string;  // "Bundle"
    amount: string;    // "$4500.99"
    timeAgo: string;   // "12 Min Ago"
};

type Props = {
    title?: string;
    items: RecentStreamItem[];
    className?: string;

    // optional: control height & scroll behavior
    maxHeightClassName?: string; // e.g. "max-h-[520px]"
};

export default function RecentStreamsCard({
    title = "Recent Streams",
    items,
    className,
    maxHeightClassName = "max-h-[520px] md:max-h-[600px]",
}: Props) {
    return (
        <section
            className={cn(
                "w-full",
                "rounded-[18px] sm:rounded-[20px]",
                "border border-white/10 bg-white/5 backdrop-blur-xl",
                "p-4 sm:p-5",
                "shadow-[0_22px_70px_rgba(0,0,0,0.40)]",
                className
            )}
        >
            <h3 className="text-white font-semibold text-[18px] sm:text-[20px]">
                {title}
            </h3>

            {/* list */}
            <div
                className={cn(
                    "mt-4 flex flex-col gap-4",
                    "overflow-y-auto pr-1",
                    maxHeightClassName
                )}
            >
                {items.map((it) => (
                    <RecentStreamRow key={it.id} item={it} />
                ))}
            </div>
        </section>
    );
}

function RecentStreamRow({ item }: { item: RecentStreamItem }) {
    return (
        <div
            className={cn(
                "w-full",
                "rounded-[16px] sm:rounded-[18px]",
                "border border-white/12",
                "bg-[#FFFFFF14]", // close to screenshot's inner gray
                "px-4 py-3 sm:px-5 sm:py-4",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                {/* left */}
                <div className="min-w-0">
                    <p className="text-white font-semibold text-[16px] sm:text-[18px] leading-tight truncate">
                        {item.title}
                    </p>
                    <p className="mt-1 text-white/70 text-[13px] sm:text-[14px] truncate">
                        {item.subtitle}
                    </p>
                </div>

                {/* right */}
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
