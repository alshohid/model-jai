import React, { useEffect, useId, useState } from "react";

type TipShortcutToggleProps = {
    storageKey?: string;
    defaultOn?: boolean;
    onChange?: (isOn: boolean) => void;
};

const TipShortcutToggle: React.FC<TipShortcutToggleProps> = ({
    storageKey = "tip_shortcut_enabled",
    defaultOn = false,
    onChange,
}) => {
    const id = React.useId();
    const [isOn, setIsOn] = React.useState(defaultOn);
    const [hydrated, setHydrated] = React.useState(false);

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
        } catch (e) {
            console.log("[Tip Shortcut] localStorage read error:", e);
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
            } catch (e) {
                console.log("[Tip Shortcut] localStorage write error:", e);
            }
            console.log("[Tip Shortcut] changed:", next ? "ON" : "OFF");
            onChange?.(next);
            return next;
        });
    };

    if (!hydrated) {
        return (
            <div className="h-[72px] rounded-full bg-white/5 border border-white/10 animate-pulse" />
        );
    }

    return (
        <div className="w-full max-w-xl">
            <div
                className={[
                    "flex items-center justify-between gap-4",
                    "rounded-full px-3 py-4",
                    "bg-[#0c0f14] text-white",
                    "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                    "border border-white/10",
                ].join(" ")}
            >
                {/* Left text */}
                <div className="min-w-0">
                    <h3 className=" text-xs md:text-base font-semibold leading-tight">
                        Tip shortcut
                    </h3>
                    <p
                        className={[
                            "text-xs md:text-sm leading-tight",
                            isOn ? "text-lime-300" : "text-white/70",
                        ].join(" ")}
                    >
                        The Tip shortcut is {isOn ? "on" : "off"} now
                    </p>
                </div>

                {/* Right switch */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={handleToggle}
                        className={[
                            "relative inline-flex items-center",
                            "h-9 w-[66px] rounded-full",
                            "transition-colors duration-200",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/70",
                            isOn ? "bg-lime-500/90" : "bg-white/20",
                        ].join(" ")}
                        aria-pressed={isOn}
                        aria-controls={id}
                        aria-label="Toggle tip shortcut"
                    >
                        {/* knob */}
                        <span
                            className={[
                                "absolute top-1/2 -translate-y-1/2",
                                "h-6 w-6 rounded-full bg-white",
                                "shadow-[0_8px_18px_rgba(0,0,0,0.35)]",
                                "transition-transform duration-200",
                                isOn ? "translate-x-[40px]" : "translate-x-[6px]",
                            ].join(" ")}
                        />
                        {/* hidden checkbox for semantics (optional) */}
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
