import Image from "next/image";

export function Avatars({ items }: { items: string[] }) {
    return (
        <div className="flex items-center -space-x-2">
            {items.slice(0, 2).map((src, i) => (
                <span
                    key={i}
                    className="relative w-7 h-7 rounded-full overflow-hidden border border-white/25 bg-white/10"
                >
                    <Image src={src} alt="" fill className="object-cover" sizes="28px" />
                </span>
            ))}
        </div>
    );
}
