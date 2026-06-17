export function InfoRow({
    label,
    value,
    isVisible,
    onToggleVisibility,
}: {
    label: string;
    value: string;
    isVisible?: boolean;
    onToggleVisibility?: () => void;
}) {
    return (
        <div className="min-w-0 flex items-center gap-2">
            <div className="flex-1 min-w-0">
                <p className="text-white/45 text-[12px]">{label}</p>
                <p className="mt-1 text-white text-[14px] sm:text-[15px] font-medium truncate">
                    {value}
                </p>
            </div>
            {onToggleVisibility && (
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="shrink-0 p-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition"
                    title={isVisible ? "Visible to others" : "Hidden from others"}
                >
                    {isVisible ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
}