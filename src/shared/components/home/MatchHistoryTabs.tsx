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
                "inline-flex items-center gap-2",
                "bg-[#00C3FF1A] border border-glassBorder backdrop-blur-md",
                "rounded-[12px] p-2",
                className,
            ].join(" ")}
        >
            {tabs.map((t) => {
                const active = value === t.key;
                return (
                    <button
                        key={t.key}
                        onClick={() => onChange(t.key)}
                        className={[
                            "cursor-pointer whitespace-nowrap",
                            "h-[44px] px-4 rounded-[10px] text-sm",
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
    );
}

export type { TabKey };
