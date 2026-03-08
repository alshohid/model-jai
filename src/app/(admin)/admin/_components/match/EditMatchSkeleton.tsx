export function EditMatchSkeleton() {
    return (
        <div className="space-y-4 py-4 animate-pulse">

            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="h-3 w-24 bg-white/20 rounded"></div>
                    <div className="h-11 w-full bg-white/10 rounded-lg"></div>
                </div>
            ))}

            <div className="h-10 w-full bg-white/10 rounded-md"></div>

        </div>
    );
}