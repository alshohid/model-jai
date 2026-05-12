import { cn } from "@/shared/lib/utils/cn";
import Image from "next/image";
import { useMemo } from "react";

export function ThumbRail({
    thumbs,
    activeIndex,
    onThumbClick,
}: {
    thumbs: string[];
    activeIndex: number;
    onThumbClick: (i: number) => void;
}) {
    const visible = useMemo(() => {
        if (!thumbs.length) {
            return [];
        }

        const visibleCount = Math.min(4, thumbs.length);

        return Array.from({ length: visibleCount }, (_, offset) => {
            const index = (activeIndex + offset) % thumbs.length;
            return {
                src: thumbs[index],
                index,
            };
        });
    }, [activeIndex, thumbs]);

    return (
        <div className="flex items-center gap-3">
            {visible.map(({ src, index }) => (
                <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => onThumbClick(index)}
                    className={cn(
                        "pointer-events-auto cursor-pointer relative overflow-hidden",
                        "w-[70px] h-[42px] sm:w-[92px] sm:h-[54px] lg:w-[122px] lg:h-[64px]",
                        "rounded-2xl bg-black/25 backdrop-blur shadow-[0_12px_35px_rgba(0,0,0,0.35)] transition",
                        index === activeIndex ? "border-2 border-white" : "border border-white/40 opacity-80"
                    )}
                >
                    <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                </button>
            ))}
        </div>
    );
}
