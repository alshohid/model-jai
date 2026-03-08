export function InfoSkeleton() {
    return (
        <div className="flex flex-col bg-white/5 p-3 rounded-md space-y-2 animate-pulse">
            <div className="h-3 w-24 bg-white/20 rounded"></div>
            <div className="h-4 w-full bg-white/10 rounded"></div>
        </div>
    );
}