type TotalUserCardProps = {
    isLoading: boolean;
    totalUsers?: number;
};

export default function TotalUserCard({
    isLoading,
    totalUsers,
}: TotalUserCardProps) {
    return (
        <div className="w-full max-w-xs rounded-2xl border border-pink-500/20 bg-gradient-to-br from-[#0f0f14] via-[#16131d] to-[#1f1724] p-6 shadow-[0_10px_30px_rgba(236,72,153,0.15)] transition-all duration-300 ">
            {isLoading ? (
                <p className="text-sm font-medium text-pink-200 animate-pulse">
                    Loading...
                </p>
            ) : (
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-wider text-pink-300/80">
                            Total Users
                        </p>
                        <h2 className="mt-3 text-3xl font-bold text-white">
                            {totalUsers ?? 0}
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Registered users on the platform
                        </p>
                    </div>

                </div>
            )}
        </div>
    );
}