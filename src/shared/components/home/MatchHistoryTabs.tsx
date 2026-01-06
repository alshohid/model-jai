"use client";

type TabKey = "all" | "past" | "upcoming";

type Props = {
    value: TabKey;
    onChange: (v: TabKey) => void;
    className?: string;
};

const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All Matches" },
    { key: "past", label: "Past Matches" },
    { key: "upcoming", label: "Upcoming Matches" },
];

export default function MatchHistoryTabs({ value, onChange, className = "" }: Props) {
    return (
        <div
            className={[
                // ✅ mobile: full width, desktop: fit-content
                "w-full lg:w-fit lg:max-w-none",
                // ✅ figma-ish pill container
                "bg-[#00C3FF1A] border border-glassBorder backdrop-blur-md",
                "rounded-[12px] p-2",
                // ✅ mobile: allow scroll, desktop: no scroll
                "overflow-x-auto lg:overflow-visible",
                "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                className,
            ].join(" ")}
        >
            <div
                className={[
                    // ✅ mobile: width grows, desktop: just fit
                    "flex items-center gap-2",
                    "w-max lg:w-fit",
                ].join(" ")}
            >
                {tabs.map((t) => {
                    const active = value === t.key;

                    return (
                        <button
                            key={t.key}
                            onClick={() => onChange(t.key)}
                            className={[
                                "cursor-pointer select-none whitespace-nowrap",
                                // ✅ match pill feel
                                "h-[44px] px-4 rounded-[10px]",
                                "text-xs md:text-sm",
                                "transition",
                                active
                                    ? "bg-navActive text-white"
                                    : "text-white/80 hover:text-white hover:bg-white/10",
                            ].join(" ")}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export type { TabKey };
