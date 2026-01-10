  export function MiniStat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-[12px] bg-white/5 border border-white/10 py-2">
            <p className="text-white/45 text-[11px]">{label}</p>
            <p className="text-white font-semibold text-[14px]">{value}</p>
        </div>
    );
}
