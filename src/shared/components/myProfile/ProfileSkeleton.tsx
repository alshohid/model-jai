const ProfileSkeleton = () => {
    return (
        <div className="w-full rounded-[24px] border border-white/10 bg-black/30 backdrop-blur-[16px] p-6 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">

                {/* LEFT IMAGE */}
                <div className="space-y-4">
                    <div className="h-6 w-32 bg-white/10 rounded mx-auto" />
                    <div className="aspect-[4/5] bg-white/10 rounded-[24px]" />
                </div>

                {/* RIGHT CONTENT */}
                <div className="space-y-6">

                    {/* INFO ROWS */}
                    <div className="space-y-3">
                        <div className="h-4 w-48 bg-white/10 rounded" />
                        <div className="h-4 w-60 bg-white/10 rounded" />
                        <div className="h-4 w-40 bg-white/10 rounded" />
                        <div className="h-4 w-44 bg-white/10 rounded" />
                    </div>

                    {/* MINI STATS */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="h-14 bg-white/10 rounded" />
                        <div className="h-14 bg-white/10 rounded" />
                        <div className="h-14 bg-white/10 rounded" />
                    </div>

                    {/* BUTTONS */}
                    <div className="space-y-3">
                        <div className="h-12 bg-white/10 rounded" />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-12 bg-white/10 rounded" />
                            <div className="h-12 bg-white/10 rounded" />
                        </div>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        <div className="h-24 bg-white/10 rounded" />
                        <div className="h-24 bg-white/10 rounded" />
                        <div className="h-24 bg-white/10 rounded" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;
