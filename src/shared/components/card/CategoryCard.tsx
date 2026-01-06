import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

type Props = {
    title: string;
    imageSrc: string;
    className?: string;
    onClick?: () => void;
};

export default function CategoryCard({ title, imageSrc, className, onClick }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "cursor-pointer select-none",
                "relative overflow-hidden",
                "w-[306px] h-[306px] rounded-[6px]",
                // Figma inner shadows
                "shadow-[inset_6px_6px_22px_rgba(255,255,255,0.40),inset_-6px_-6px_22px_rgba(255,255,255,0.44)]",
                "bg-black",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
                className
            )}
        >
            {/* Image */}
            <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover"
                sizes="306px"
                priority={false}
            />
            <Image
                src="/images/home/cat_overlay.png"
                alt=""
                fill
                className="object-cover opacity-35 pointer-events-none select-none"
                sizes="306px"
            />
            <div className="absolute inset-x-0 bottom-6 flex justify-center px-4">
                <div
                    className={cn(
                        "min-w-[170px] max-w-[240px]",
                        "px-6 py-3",
                        "rounded-[6px]",
                        "bg-white/25 backdrop-blur-md",
                        "border border-white/25",
                        "shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                    )}
                >
                    <p className="text-white text-sm sm:text-base font-semibold tracking-widest text-center uppercase">
                        {title}
                    </p>
                </div>
            </div>
        </button>
    );
}
