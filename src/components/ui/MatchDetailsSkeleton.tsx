export function MatchDetailsSkeleton() {
    return (
        <div className="w-full">
            <div className="w-full animate-pulse">
                {/* top stage */}
                <div className="w-full bg-black pt-2">
                    <div className="grid grid-cols-3 gap-1 mb-2">
                        <div className="aspect-3/4 bg-white/10 rounded-md" />
                        <div className="aspect-3/4 bg-white/10 rounded-md" />
                        <div className="aspect-3/4 bg-white/10 rounded-md" />
                    </div>

                    <div className="w-full aspect-video rounded-xl border border-white/10 bg-white/10" />
                </div>

                <div className="container">
                    {/* match points summary */}
                    <div className="grid grid-cols-[1fr_auto_1fr] py-6 gap-2 md:gap-4">
                        <div className="h-32 rounded-2xl bg-white/10" />
                        <div className="flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/10" />
                        </div>
                        <div className="h-32 rounded-2xl bg-white/10" />
                    </div>

                    {/* supporter boss cards */}
                    <div className="py-6">
                        <div className="grid grid-cols-[1fr_auto_1fr] md:grid-cols-[1fr_100px_1fr] gap-4 items-center">
                            <div className="h-56 rounded-2xl bg-white/10" />
                            <div className="flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white/10" />
                            </div>
                            <div className="h-56 rounded-2xl bg-white/10" />
                        </div>

                        <div className="mx-auto mt-6 h-10 w-72 rounded-xl bg-white/10" />
                    </div>

                    {/* ranking section */}
                    <div className="py-10 space-y-6">
                        <div className="mx-auto h-40 w-full max-w-md rounded-2xl bg-white/10" />
                        <div className="h-72 w-full rounded-2xl bg-white/10" />
                    </div>
                </div>
            </div>
        </div>
    );
}