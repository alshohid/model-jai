export function LiveBadge() {
    return (
        <>
            <div className="inline-flex items-center gap-4 rounded-lg bg-[#E85B5B] px-4 py-2 md:px-4 md:py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <span className="text-white text-lg font-medium">Live</span>
                <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="live-ping absolute inset-0 rounded-full bg-white/60" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-white border border-black/10" />
                </span>
            </div>
        </>
    );
}