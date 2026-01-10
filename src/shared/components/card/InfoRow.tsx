
export function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <p className="text-white/45 text-[12px]">{label}</p>
            <p className="mt-1 text-white text-[14px] sm:text-[15px] font-medium truncate">
                {value}
            </p>
        </div>
    );
}
