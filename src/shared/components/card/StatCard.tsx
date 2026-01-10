import Image from "next/image";

export function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon?: any;
}) {
    return (
        <div className="flex items-center rounded-[18px] border border-white/30 bg-white/20 backdrop-blur-[12px] p-4">
            <div className="flex items-center gap-4">
                <div
                    className="shrink-0 size-16 rounded-full 
                    flex items-center justify-center text-white/80"
                >
                    {icon ?
                        <Image
                            src={icon}
                            alt="image"
                            width={400}
                            height={400}
                        />

                        : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 1v22M1 12h22"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        )}
                </div>

                <div className="min-w-0">
                    <p className="text-white text-[18px] font-semibold leading-tight">
                        {label}
                    </p>
                    <p className="text-white/85 text-[18px] font-medium mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
}