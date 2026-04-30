import React from "react";
import { cn } from "@/shared/lib/utils/cn";

type TipShortcutToggleProps = {
    storageKey?: string;
    defaultOn?: boolean;
    onChange?: (isOn: boolean) => void;
    variant?: "default" | "dropdown";
};

const TipShortcutToggle: React.FC<TipShortcutToggleProps> = ({
    storageKey = "tip_shortcut_enabled",
    defaultOn = false,
    onChange,
    variant = "default",
}) => {
    const id = React.useId();
    const [isOn, setIsOn] = React.useState(defaultOn);
    const [hydrated, setHydrated] = React.useState(false);
    const isDropdownVariant = variant === "dropdown";

    // ✅ Load from localStorage on mount
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw !== null) {
                setIsOn(raw === "true");
            } else {
                // if not set, keep defaultOn and persist it
                localStorage.setItem(storageKey, String(defaultOn));
            }
        } catch {
        } finally {
            setHydrated(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]);

    const handleToggle = () => {
        setIsOn((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(storageKey, String(next));
                window.dispatchEvent(
                    new CustomEvent("tip-shortcut-change", {
                        detail: { storageKey, value: next },
                    })
                );
            } catch {
            }
            onChange?.(next);
            return next;
        });
    };

    if (!hydrated) {
        return (
            <div
                className={cn(
                    "animate-pulse border border-white/10 bg-white/5",
                    isDropdownVariant
                        ? "h-[78px] rounded-[18px]"
                        : "h-[72px] rounded-full",
                )}
            />
        );
    }

    return (
        <div className={cn("w-full", !isDropdownVariant && "max-w-xl")}>
            <div
                className={cn(
                    "flex items-center justify-between gap-4 border text-white",
                    isDropdownVariant
                        ? [
                            "rounded-[18px] px-3 py-3",
                            "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
                            "border-white/8",
                            "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
                        ]
                        : [
                            "rounded-full px-3 py-4",
                            "bg-[#0c0f14]",
                            "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                            "border-white/10",
                        ],
                )}
            >
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3
                            className={cn(
                                "font-semibold leading-tight",
                                isDropdownVariant ? "text-sm" : "text-xs md:text-base",
                            )}
                        >
                            Tip shortcut
                        </h3>
                        {isDropdownVariant ? (
                            <span
                                className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
                                    isOn
                                        ? "bg-lime-400/15 text-lime-300"
                                        : "bg-white/8 text-white/55",
                                )}
                            >
                                {isOn ? "On" : "Off"}
                            </span>
                        ) : null}
                    </div>
                    <p
                        className={cn(
                            "leading-tight",
                            isDropdownVariant
                                ? "mt-1 pr-2 text-[11px] text-white/58"
                                : [
                                    "text-xs md:text-sm",
                                    isOn ? "text-lime-300" : "text-white/70",
                                ],
                        )}
                    >
                        {isDropdownVariant
                            ? "Turn quick tipping on or off for live match actions."
                            : `The Tip shortcut is ${isOn ? "on" : "off"} now`}
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={handleToggle}
                        className={cn(
                            "relative inline-flex items-center rounded-full transition-colors duration-200",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/70",
                            isDropdownVariant ? "h-8 w-[58px]" : "h-9 w-[66px]",
                            isOn ? "bg-lime-500/90" : "bg-white/20",
                        )}
                        aria-pressed={isOn}
                        aria-controls={id}
                        aria-label="Toggle tip shortcut"
                    >
                        <span
                            className={cn(
                                "absolute top-1/2 rounded-full bg-white shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition-transform duration-200",
                                "-translate-y-1/2",
                                isDropdownVariant ? "h-5 w-5" : "h-6 w-6",
                                isDropdownVariant
                                    ? isOn
                                        ? "translate-x-[32px]"
                                        : "translate-x-[5px]"
                                    : isOn
                                        ? "translate-x-[40px]"
                                        : "translate-x-[6px]",
                            )}
                        />
                        <input
                            id={id}
                            type="checkbox"
                            checked={isOn}
                            onChange={handleToggle}
                            className="sr-only"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TipShortcutToggle;
